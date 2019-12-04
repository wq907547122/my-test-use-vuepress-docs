# Spring Cloud使用Websocket并且支持鉴权
[参考文章](https://www.jianshu.com/p/b13b992ee341)
## 1.Websocket权限的拦截器
MyHandlerShakeInterceptor.java的代码
```java
package com.test.nacos.websocket.handler.test.interceptor;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.HashMap;
import java.util.Map;

/**
 * @auth wq on 2019/11/22 14:06
 **/
@Slf4j
@Component
public class MyHandlerShakeInterceptor implements HandshakeInterceptor {
    /**
     * token的key值
     */
    public static final String TOKEN_KEY = "token";
    /**
     * 建立连接之前需要先对token鉴权
     * @param serverHttpRequest
     * @param serverHttpResponse
     * @param webSocketHandler
     * @param map
     * @return
     * @throws Exception
     */
    @Override
    public boolean beforeHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse,
                                   WebSocketHandler webSocketHandler, Map<String, Object> map) throws Exception {
        log.info("begin beforeHandshake, url: " + serverHttpRequest.getURI());
        Map<String, String> paramterMap = parseParameterMap(serverHttpRequest.getURI().getQuery());
        log.info("params = {}", paramterMap);
        // 判断是否存在对应的token信息
        String token = paramterMap.get(TOKEN_KEY);
        if (StringUtils.isBlank(token)) {
            log.error("无用户鉴权信息");
            return false;
        }
        // 存放token信息
        map.putAll(paramterMap);
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse,
                               WebSocketHandler webSocketHandler, @Nullable Exception e) {
        log.info("**********afterHandshake************");
    }
    // 获取参数
    private Map<String, String> parseParameterMap(String queryString) {
        Map<String, String> parameterMap = new HashMap<>();
        if (StringUtils.isBlank(queryString)){
            return parameterMap;
        }
        String[] parameters = queryString.split("&");
        for (String parameter : parameters) {
            String[] paramPair = parameter.split("=");
            if (paramPair.length == 2) {
                parameterMap.put(paramPair[0], paramPair[1]);
            }
        }
        return parameterMap;
    }
}

```

## 2.Websocket的消息处理
MyWebSocketHandler.java
```java
package com.test.nacos.websocket.handler.test.handler;

import com.test.nacos.commons.utils.JsonUtils;
import com.test.nacos.websocket.handler.test.dto.MyMessage;
import com.test.nacos.websocket.handler.test.dto.MyRequestMessage;
import com.test.nacos.websocket.handler.test.interceptor.MyHandlerShakeInterceptor;
import com.test.nacos.websocket.handler.test.utils.SpringContextUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.PingMessage;
import org.springframework.web.socket.PongMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.bouncycastle.asn1.x500.style.RFC4519Style.uid;

/**
 * @auth wq on 2019/11/22 14:23
 **/
@Slf4j
@Component
public class MyWebSocketHandler implements WebSocketHandler {
    @Autowired
    private SpringContextUtil springContextUtil;

    public static final Map<String, WebSocketSession> userSocketSessionMap = new ConcurrentHashMap<>();
    // 定时任务来处理，避免处理消息排队过久的情况, 单目前是线程处理，后面看是否需要作为多线程处理
    protected ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();

    public static Map<String, WebSocketSession> getUserSocketSessionMap() {
        return userSocketSessionMap;
    }

    /**
     * 建立连接后
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
        String token = (String)webSocketSession.getAttributes().get(MyHandlerShakeInterceptor.TOKEN_KEY);
        log.info("user token: "+ token + " established websocket session.");
        if (userSocketSessionMap.get(token) == null) {
            userSocketSessionMap.put(token, webSocketSession);
        }
        // 建立连接后推送未读消息,如果消息需要查询可以使用springContextUtil获取到对应的接口来做查询的事情
        MyMessage<String> message = new MyMessage<>();
        message.setCode(MyMessage.MyTestCode.SUCCESS);
        message.setData("连接成功,请查收");
        webSocketSession.sendMessage(objectToTextMessage(message));
    }

    /**
     * 接收到客户端发送过来的消息
     * @param webSocketSession
     * @param webSocketMessage
     * @throws Exception
     */
    @Override
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {
        // 如果是ping帧， 回复 pong帧
        String token = (String) webSocketSession.getAttributes().get(MyHandlerShakeInterceptor.TOKEN_KEY);
        if (webSocketMessage instanceof PingMessage) {
            log.info("user :" + token + " is keep alive");
            ByteBuffer byteBuffer = ByteBuffer.wrap("OK".getBytes());
            webSocketSession.sendMessage(new PongMessage(byteBuffer));
        } else {
            String clientMessage = webSocketMessage.getPayload().toString();
            if (webSocketMessage.getPayload().toString().length() == 0) {
                return;
            } else {
                MyRequestMessage bizMessage = JsonUtils.jsonToPojo(clientMessage, MyRequestMessage.class);

                log.info("receive client data:" + clientMessage + ", message type:" + bizMessage.getInfo());
                webSocketSession.sendMessage(objectToTextMessage(bizMessage));
            }
        }
    }

    /**
     * 消息传输错误的处理
     * @param webSocketSession
     * @param throwable
     * @throws Exception
     */
    @Override
    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
        String token = (String) webSocketSession.getAttributes().get(MyHandlerShakeInterceptor.TOKEN_KEY);
        if (webSocketSession.isOpen()) {
            webSocketSession.close();
        }
        Iterator<Map.Entry<String, WebSocketSession>> it = userSocketSessionMap.entrySet().iterator();
        // 移除Socket会话
        while (it.hasNext()) {
            Map.Entry<String, WebSocketSession> entry = it.next();
            if (entry.getValue().getId().equals(webSocketSession.getId())) {
                userSocketSessionMap.remove(entry.getKey());
                log.info("user token: " + token + " has close websocket!");
                break;
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {
        log.info("=======afterConnectionClosed=====");
        if (webSocketSession.getAttributes() != null) {
            Object key = webSocketSession.getAttributes().get(MyHandlerShakeInterceptor.TOKEN_KEY);
            userSocketSessionMap.remove(key);
        }
        log.info("Client: {} disconnected with server, path = {}.", webSocketSession.getRemoteAddress().getHostName(), webSocketSession.getUri().getPath());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    /**
     * 将对象转换为可以发送的信息
     * @param obj
     * @return
     */
    private TextMessage objectToTextMessage(Object obj) {
        if (obj == null) {
            return new TextMessage("");
        }
        if (obj instanceof Map) {
            return new TextMessage(JsonUtils.mapToJson((Map)obj));
        }
        return new TextMessage(JsonUtils.toJson(obj));
    }

    /**
     * 给所有在线用户发送消息
     *
     * @param message
     * @throws IOException
     */
    public void broadCast(final TextMessage message) throws IOException {
        Iterator<Map.Entry<String, WebSocketSession>> it = userSocketSessionMap.entrySet().iterator();
        // 多线程群发
        while (it.hasNext()) {
            final Map.Entry<String, WebSocketSession> entry = it.next();
            if (entry.getValue().isOpen()) {
                // entry.getValue().sendMessage(message);
                singleThreadExecutor.execute(new Runnable() {
                    public void run() {
                        try {
                            if (entry.getValue().isOpen()) {
                                entry.getValue().sendMessage(message);
                            }
                        } catch (IOException e) {
                            log.error("出现异常", e);
                        }
                    }
                });
            }
        }
    }
    /**
     * 给某个用户发送消息
     *
     * @param token
     * @param message
     * @throws IOException
     */
    public void sendMessageToUser(String token, MyMessage message) throws IOException {
        WebSocketSession session = userSocketSessionMap.get(token);
        // String hostName = MixUtils.getServerInfo().getHostName();
        if (session != null && session.isOpen()) {
            log.info("Found user :" + token + " websocket session, , message:" + message.toString());
            session.sendMessage(objectToTextMessage(message));
        } else {
            log.info("Not found user :" + token + ", message:" + message.toString());
        }
    }
}

```

## 3.启用websocket的配置
WebSocketConfig
```java
package com.test.nacos.websocket.handler.test.config;

import com.test.nacos.websocket.handler.test.handler.MyWebSocketHandler;
import com.test.nacos.websocket.handler.test.interceptor.MyHandlerShakeInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * @auth wq on 2019/11/22 14:21
 **/
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebMvcConfigurer,WebSocketConfigurer {
    @Autowired
    MyWebSocketHandler myWebSocketHandler;
    @Autowired
    private MyHandlerShakeInterceptor myHandlerShakeInterceptor;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
        webSocketHandlerRegistry.addHandler(myWebSocketHandler, "/mywescket/test01").
                addInterceptors(myHandlerShakeInterceptor).setAllowedOrigins("*");
        webSocketHandlerRegistry.addHandler(myWebSocketHandler, "/mywescket/test01/sockjs").
                addInterceptors(myHandlerShakeInterceptor).setAllowedOrigins("*").withSockJS();
    }
}

```
## 4.发送的消息的载体
可以自定义自己处理你想要的那种消息类型，比如我的消息类型为随意定义的返回数据MyMessage.java
```java
package com.test.nacos.websocket.handler.test.dto;

import lombok.Data;

/**
 * 推送的消息
 * @auth wq on 2019/11/22 14:32
 **/
@Data
public class MyMessage<T> {
    private int code;
    private T data;
    private String message;
    private String error;

    /**
     * 返回码
     */
    public static class MyTestCode {
        public final static Integer SUCCESS = 20000;
        public static final Integer FAILED = 20001;

    }
}

```

## 5.接收客户端消息的载体定义
可以自己根据自己的业务随意定义，比如我自己随便定义的一个请求的消息信息MyRequestMessage.java
```java
package com.test.nacos.websocket.handler.test.dto;

import lombok.Data;

/**
 * @auth wq on 2019/11/22 14:49
 **/
@Data
public class MyRequestMessage {
    private String info;
}

```
## 6.涉及到的掐其他类
SpringContextUtil.java 
```java
package com.test.nacos.websocket.handler.test.utils;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * 获取spring容器，以访问容器中定义的其他bean
 * 主要是在任意的普通的bean中调用这个方法,但是这个最好要确定在spring容器初始化完成之后使用
 * 否则会出现空指针的问题
 * @auth wq on 2019/11/22 14:23
 **/
@Component
public class SpringContextUtil implements ApplicationContextAware {
    private static ApplicationContext applicationContext;

    /**
     * 实现ApplicationContextAware接口的回调方法，设置上下文环境
     * @param applicationContext
     * @throws BeansException
     */
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextUtil.applicationContext = applicationContext;
    }

    /**
     * 获取对象 这里重写了bean方法，起主要作用
     *
     * @param name
     * @return Object 一个以所给名字注册的bean的实例
     * @throws BeansException
     */
    public static Object getBean(String name) throws BeansException {
        return applicationContext.getBean(name);
    }

    public static <T> T getBean(Class<T> clazz) {
        return applicationContext.getBean(clazz);
    }
}

```

## 6.启动类
NacosWebsocketHandlerTestApplication.java
```java
package com.test.nacos.websocket.handler.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @auth wq on 2019/11/22 14:04
 **/
@SpringBootApplication
@EnableDiscoveryClient // 服务注册与发现
@EnableScheduling // 开启支持定时任务
public class NacosWebsocketHandlerTestApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosWebsocketHandlerTestApplication.class, args);
    }
}

```
## 7.配置信息
```yaml
server:
  port: 8500
spring:
  application:
    name: test-nacos-websocket-handler-test
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848


```

## 8.Spring cloud gateway转发Websocket
只需要在配置文件里面添加对应的转发路由即可
```yaml{42-45}
spring:
  application:
    name: test-nacos-gateway
  main:
    allow-bean-definition-overriding: true
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    sentinel:
      transport:
        port: 8722
        dashboard: 127.0.0.1:8858
    gateway:
      discovery:
        locator:
          enabled: true
      routes:
        - id: NACOS-FEIGN-CONSUMER
          uri: lb://nacos-consumer-feign
          predicates:
            - Path=/api/v1/test/**
            - Method=GET,POST
          filters:
            - StripPrefix=1
         # 搜索引擎的配置
        - id: TEST-NACOS-ELASTICSEARCH-PROVIDER
          uri: lb://test-nacos-elasticsearch-provider
          predicates:
            - Path=/api/v1/search/**
            - Method=GET,POST
          filters:
            - StripPrefix=1
        - id: NACOS-WEBSOCKET-PROVIDER
          uri: lb:ws://test-nacos-websocket-provider
          predicates:
            - Path=/test-nacos-websocket-provider/mytestwebsocket/**
        - id: NACOS-WEBSOCKET-TEST
          uri: lb:ws://test-nacos-websocket-test
          predicates:
            - Path=/test-nacos-websocket-test/websocket/**
        - id: NACOS-WEBSOCKET-HANDLER-TEST
          uri: lb:ws://test-nacos-websocket-handler-test
          predicates:
            - Path=/test-nacos-websocket-handler-test/mywescket/**
server:
  port: 8001

feign:
  sentinel:
    enabled: true

management:
  endpoints:
    web:
      exposure:
        include: "*"

# 配置日志级别，方便调试
logging:
  level:
    org.springframework.cloud.gateway: info
```

## 9.前端测试的代码
这个测试代码是由Spring Cloud Gateway网关转发
<br/>
注意连接后面给定的token，这个就是需要根据你自己的token来确定当前的登录用户，来转发了，这样就有权限了
```html{19}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
4545
</body>
<script>
    var socket;
    if(typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    }else{
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");
//        socket = new WebSocket("ws://localhost:8333/websocket/${cid}".replace("http","ws"));
        socket = new WebSocket("ws://localhost:8001/test-nacos-websocket-handler-test/mywescket/test01?token=3545457");
        //打开事件
        socket.onopen = function() {
            console.log("Socket 已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function(msg) {
            console.log(msg.data);
			let data = JSON.parse(msg.data)
			console.log(data)
            //发现消息进入    开始处理前端触发逻辑
        };
        //关闭事件
        socket.onclose = function() {
            console.log("Socket已关闭");
        };
        //发生了错误事件
        socket.onerror = function() {
            alert("Socket发生了错误");
            //此时可以尝试刷新页面
        }
		setTimeout(function(){
			let msg = {
				info: 'mytestinfo'
			}
			socket.send(JSON.stringify(msg))
		}, 5000)
        //离开页面时，关闭socket
        //jquery1.8中已经被废弃，3.0中已经移除
        // $(window).unload(function(){
        //     socket.close();
        //});
    }
</script>
</html>
```

