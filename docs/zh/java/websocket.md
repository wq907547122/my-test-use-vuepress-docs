# Spring cloud Gateway使用websockwet
<s>[参考文章](https://blog.csdn.net/weixin_41047704/article/details/93483160)</s>
[参考文档](https://blog.csdn.net/moshowgame/article/details/80275084)
[使用netty](https://zhengkai.blog.csdn.net/article/details/91552993)


## 1. 在spring boot/cloud项目pom.xml中添加websocket的依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```
## 2. 添加java的Websocket配置
```java{23-25,30}
package com.test.nacos.websocket.provider.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * @auth wq on 2019/10/18 15:34
 **/
@Configuration
// @EnableWebSocketMessageBroker 注解开启使用STOMP协议来传输基于代理的message broker,
// 这时控制器支持使用@MessageMapping,就像@RequesMapping
@EnableWebSocketMessageBroker
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    // 添加这个Endpoint，这样在网页中就可以通过websocket连接上服务,
    // 也就是我们配置websocket的服务地址,并且可以指定是否使用socketjs
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 就是处理消息的前缀
        registry.addEndpoint("/mytestwebsocket")     // 开启/mytestwebsocket端点
                .setAllowedOrigins("*")             // 允许跨域访问
                .withSockJS()                      // 使用sockJS
                // 解决当断连重连的时候出现的错误，使用硬编码 Incompatibile SockJS! Main site uses: "1.4.0", the iframe: "1.0.0"
                // 具体的版本需要与前端保持一致
                .setClientLibraryUrl( "https://cdn.jsdelivr.net/npm/sockjs-client@1.4.0/dist/sockjs.min.js" );
    }
    // 配置消息代理，哪种路径的消息会进行代理处理
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 这里配置的广播式的消息处理
        // topic：广播
        // queue:点对点
        registry.enableSimpleBroker("/totest1", "/toall");
    }
}
```

## 在spring-cloud-gateway的yml配置文件的routes下面添加黑色背景颜色
我又说明`测试红色`
```yaml{17-20}
spring:
  application:
    name: test-nacos-gateway
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
        - id: NACOS-WEBSOCKET-PROVIDER
          uri: lb:ws//test-nacos-websocket-provider # 修改为你自己的项目名称
          predicates:
            - Path=/test-nacos-websocket-provider/mytestwebsocket/**
```
并且添加对websocket的请求的处理
```java
package com.test.nacos.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;

import static org.springframework.cloud.gateway.support.ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR;

/**
 * SockJS客户端开始时会发送一个GET类型的"/info"请求从服务器去获取基本信息，
 * 这个请求之后SockJS必须决定使用哪种传输，可能是WebSocket，
 * 如果不是的话，在大部分浏览器中会使用HTTP Streaming或者HTTP长轮询。
 * 那么我们应该怎么去处理这个/info请求呢？那么我们可以在网关中配置一个拦截器，当拦截到/info请求时就对它进行处理。
 * @auth wq on 2019/11/21 13:57
 **/
@Component
public class WebsocketHandler implements GlobalFilter, Ordered {
    // 对应的请求的websocket的url地址
    private final static String DEFAULT_FILTER_PATH = "/test-nacos-websocket-provider/mytestwebsocket/info";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String upgrade = exchange.getRequest().getHeaders().getUpgrade();

        URI requestUrl = exchange.getRequiredAttribute(GATEWAY_REQUEST_URL_ATTR);

        String scheme = requestUrl.getScheme();

        if (!"ws".equals(scheme) && !"wss".equals(scheme)) {
            return chain.filter(exchange);
        } else if (DEFAULT_FILTER_PATH.equals(requestUrl.getPath())) {
            String wsScheme = convertWsToHttp(scheme);
            URI wsRequestUrl = UriComponentsBuilder.fromUri(requestUrl).scheme(wsScheme).build().toUri();
            exchange.getAttributes().put(GATEWAY_REQUEST_URL_ATTR, wsRequestUrl);
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 2;
    }

    static String convertWsToHttp(String scheme) {
        scheme = scheme.toLowerCase();
        return "ws".equals(scheme) ? "http" : "wss".equals(scheme) ? "https" : scheme;
    }
}

```
