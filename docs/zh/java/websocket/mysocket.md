# spring cloud 使用Websocket的步骤
## 对应的配置pom.xml

```pom
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.test</groupId>
        <artifactId>test-dependencies</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../test-dependencies/pom.xml</relativePath>
    </parent>

    <artifactId>test-nacos-websocket-test</artifactId>
    <packaging>jar</packaging>

    <name>test-nacos-websocket-test</name>

    <dependencies>
        <!-- Spring Boot Begin -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!-- <dependency>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-starter-data-redis</artifactId>
         </dependency>-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- Spring Boot End -->



        <!-- Spring Cloud Begin -->
       <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
        <!--<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        </dependency>-->
        <!-- Spring Cloud End -->

        <!-- redis 使用lettuce使用pool需要使用pool2的依赖 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
        </dependency>

        <dependency>
            <groupId>com.test</groupId>
            <artifactId>test-nacos-commons</artifactId>
            <version>${project.parent.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.test.nacos.websocket.test.NacosWebsocketTestApplication</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```
## 配置信息
```yaml
server:
  port: 8333
spring:
  application:
    name: test-nacos-websocket-test
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
```

### 支持websocket的java配置
```java
package com.test.nacos.websocket.test.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * 开启websocket的支持
 * @auth wq on 2019/11/22 9:35
 **/
@Configuration
public class WebSocketConfig {

    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}

```
### websocket的连接信息
```java
package com.test.nacos.websocket.test.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * 因为WebSocket是类似客户端服务端的形式(采用ws协议)，
 * 那么这里的WebSocketServer其实就相当于一个ws协议的Controller
 * 直接@ServerEndpoint("/websocket")@Component启用即可，
 * 然后在里面实现@OnOpen,@onClose,@onMessage等方法
 * @auth wq on 2019/11/22 9:37
 **/
@Slf4j
@ServerEndpoint("/websocket/{sid}")
@Component
public class WebSocketServer {
    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;
    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<WebSocketServer>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    //接收sid
    private String sid="";
    /**
     * 连接建立成功调用的方法*/
    @OnOpen
    public void onOpen(Session session,@PathParam("sid") String sid) {
        this.session = session;
        webSocketSet.add(this);     //加入set中
        addOnlineCount();           //在线数加1
        log.info("有新窗口开始监听:"+sid+",当前在线人数为" + getOnlineCount());
        this.sid=sid;
        try {
            sendMessage("连接成功");
        } catch (IOException e) {
            log.error("websocket IO异常");
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  //从set中删除
        subOnlineCount();           //在线数减1
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("收到来自窗口"+sid+"的信息:"+message);
        //群发消息
        for (WebSocketServer item : webSocketSet) {
            try {
                item.sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }
    /**
     * 实现服务器主动推送
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    public void testSendAll() {
        String message = UUID.randomUUID().toString();
        for(WebSocketServer s : webSocketSet) {
            try {
                s.sendMessage(message);
            } catch (IOException e) {
                log.error("", e);
            }
        }
    }

    /**
     * 群发自定义消息
     * */
    public static void sendInfo(String message,@PathParam("sid") String sid) throws IOException {
        log.info("推送消息到窗口"+sid+"，推送内容:"+message);
        for (WebSocketServer item : webSocketSet) {
            try {
                //这里可以设定只推送给这个sid的，为null则全部推送
                if(sid==null) {
                    item.sendMessage(message);
                }else if(item.sid.equals(sid)){
                    item.sendMessage(message);
                }
            } catch (IOException e) {
                continue;
            }
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocketServer.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocketServer.onlineCount--;
    }
}

```

### 定时发送给所有的客户端信息TaskJob
定时主动发送给客户端的定时任务
```java
package com.test.nacos.websocket.test.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @auth wq on 2019/11/22 10:44
 **/
@Slf4j
@Component
@EnableScheduling
public class TaskJob {
    @Autowired
    private WebSocketServer webSocketServer;

    @Scheduled(cron = "10/15 * * * * ?")
    public void exeJob() {
        // 主动推送给客户端的信息
        webSocketServer.testSendAll();
        log.info("定时发送结束");
    }
}

```

### 启动类NacosWebsocketTestApplication
```java
package com.test.nacos.websocket.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * @auth wq on 2019/11/22 9:31
 **/
@SpringBootApplication
@EnableDiscoveryClient
public class NacosWebsocketTestApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosWebsocketTestApplication.class, args);
    }
}

```
### 测试
#### 在本地创建一个html
```html
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
        socket = new WebSocket("ws://localhost:8333/websocket/" + Math.random() * 100);
        //打开事件
        socket.onopen = function() {
            console.log("Socket 已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function(msg) {
            console.log(msg.data);
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
        //离开页面时，关闭socket
        //jquery1.8中已经被废弃，3.0中已经移除
        // $(window).unload(function(){
        //     socket.close();
        //});
    }
</script>
</html>
```
#### 在浏览器执行当前的文件
测试如下,可以在浏览器多开几个窗口查看如下图的信息
![](/images/websocket/1.png)

### 使用Spring cloud gateway 网关转发websocket

#### 在网关服务的配置文件中添加如下
需要的配置如下黑色背景的
```yaml{34-37}
spring:
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
### 修改测试的html文件，只需要修改为网关的地址和对应的服务的serviceId即可
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
        socket = new WebSocket("ws://localhost:8001/test-nacos-websocket-test/websocket/" + Math.random() * 100);
        //打开事件
        socket.onopen = function() {
            console.log("Socket 已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function(msg) {
            console.log(msg.data);
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
        //离开页面时，关闭socket
        //jquery1.8中已经被废弃，3.0中已经移除
        // $(window).unload(function(){
        //     socket.close();
        //});
    }
</script>
</html>
```

### 测试
测试步骤和没有网关的测试方式一致


