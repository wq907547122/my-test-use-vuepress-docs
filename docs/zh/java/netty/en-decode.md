# Netty编解码
[[toc]]
参考：[文章](https://blog.csdn.net/yzh54ak/article/details/52199033)
## 了解主流的编解码
### 1.Protobuf
全称 Google Protocol Buffers(google协议缓冲区)它将数据结构以.proto文件进行描述,通过代码生成工具可以生成对应数据结构的POJO对象和Protobuf相关的方法和属性。
:::tip 特点
- 1)结构化数据 (XML, JSON等)
- 2)高效的编解码
- 3)语言无关平台无关，扩展性好
- 4)官方支持Java，c++，Python三种语言
:::
Protobuf使用二进制编码，在空间和性能上具有更大的优势。

### 2.Thrift

### 3.JBoss Marshalling JBoss Marshalling
是一个Java对象的序列化API包，修正了JDK自带的序列化包的很多问题，但又保持跟java.io.Serializable接口的兼容；
同时增加了一些可调的参数和附加的特性，并且这些参数和特性可通过工厂类进行配置

### 4.其他的编解码  MessagePack、kryo、hession和Json

## Netty编解码框架
### 1.Netty为什么要提供编解码框架？？
作为一个高性能的异步、NIO通信框架，编解码框架是Netty的重要组成部分。
<br/>
尽管站在微内核的角度看，编解码框架并不是Netty微内核的组成部分，但是通过ChannelHandler定制扩展出的编解码框架却是不可或缺的。
- 1) 从网络读取的inbound消息，需要经过解码,将二进制的数据报转换成应用层协议消息或者业务消息,
才能够被上层的应用逻辑识别和处理
- 2)用户发送到网络的outbound业务消息，需要经过编码转换成二进制字节数组（对于Netty就是ByteBuf）才能够发送到网络对端
- 3)编码和解码功能是NIO框架的有机组成部分，无论是由业务定制扩展实现，还是NIO框架内置编解码能力，该功能是必不可少的
<br/>
<br/>
为了降低用户的开发难度，Netty对常用的功能和API做了装饰，以屏蔽底层的实现细节,
编解码功能的定制，对于熟悉Netty底层实现的开发者而言，直接基于ChannelHandler扩展开发，难度并不是很大
是对于大多数初学者或者不愿意去了解底层实现细节的用户，需要提供给他们更简单的类库和API，而不是ChannelHandler
Netty在这方面做得非常出色，针对编解码功能，它既提供了通用的编解码框架供用户扩展,
又提供了常用的编解码类库供用户直接使用。在保证定制扩展性的基础之上，尽量降低用户的开发工作量和开发门槛，提升开发效率。
<br/>
Netty预置的编解码功能列表如下：base64、Protobuf、JBoss Marshalling、spdy等。

### 2.常用的解码器
#### 2.1 LineBasedFrameDecoder解码器
LineBasedFrameDecoder是回车换行解码器，如果用户发送的消息以回车换行符作为消息结束的标识，
则可以直接使用Netty的LineBasedFrameDecoder对消息进行解码，
只需要在初始化Netty服务端或者客户端时将LineBasedFrameDecoder正确的添加到ChannelPipeline中即可，不需要自己重新实现一套换行解码器。
```
LineBasedFrameDecoder的工作原理是它依次遍历ByteBuf中的可读字节，判断看是否有“\n”或者“\r\n”，
    如果有，就以此位置为结束位置，从可读索引到结束位置区间的字节就组成了一行。它是以换行符为结束标志的解码器，
    支持携带结束符或者不携带结束符两种解码方式，同时支持配置单行的最大长度。
    如果连续读取到最大长度后仍然没有发现换行符，就会抛出异常，同时忽略掉之前读到的异常码流。
    防止由于数据报没有携带换行符导致接收到ByteBuf无限制积压，引起系统内存溢出。
    
    的使用效果如下：

    解码之前：
    +------------------------------------------------------------------+
                            接收到的数据报
    “This is a netty example for using the nio framework.\r\n When you“
    +------------------------------------------------------------------+
    解码之后的ChannelHandler接收到的Object如下：
    +------------------------------------------------------------------+
                            解码之后的文本消息
    “This is a netty example for using the nio framework.“
    +------------------------------------------------------------------+

    通常情况下，LineBasedFrameDecoder会和StringDecoder配合使用，组合成按行切换的文本解码器，对于文本类协议的解析，
    文本换行解码器非常实用，例如对HTTP消息头的解析、FTP协议消息的解析等。
    下面我们简单给出文本换行解码器的使用示例：
```
```java
@Override
protected void initChannel(SocketChannel arg0) throws Exception {
    // 初始化Channel的时候，首先将LineBasedFrameDecoder添加到ChannelPipeline中，
    // 然后再依次添加字符串解码器StringDecoder，业务Handler。
   arg0.pipeline().addLast(new LineBasedFrameDecoder(1024));
   arg0.pipeline().addLast(new StringDecoder());
   arg0.pipeline().addLast(new UserServerHandler());
}
```

#### 2.2 DelimiterBasedFrameDecoder解码器
```yaml
DelimiterBasedFrameDecoder是分隔符解码器，用户可以指定消息结束的分隔符，它可以自动完成以分隔符作为码流结束标识的消息的解码。
	回车换行解码器实际上是一种特殊的DelimiterBasedFrameDecoder解码器。
	
	分隔符解码器在实际工作中也有很广泛的应用，笔者所从事的电信行业，
	很多简单的文本私有协议，都是以特殊的分隔符作为消息结束的标识，特别是对于那些使用长连接的基于文本的私有协议。
	
	分隔符的指定：与大家的习惯不同，分隔符并非以char或者string作为构造参数，而是ByteBuf，
	下面我们就结合实际例子给出它的用法。
	假如消息以“$_”作为分隔符，服务端或者客户端初始化ChannelPipeline的代码实例如下：
	
	@Override
	public void initChannel(SocketChannel ch)
		throws Exception {
		// 首先将“$_”转换成ByteBuf对象，作为参数构造DelimiterBasedFrameDecoder，将其添加到ChannelPipeline中，
		// 然后依次添加字符串解码器（通常用于文本解码）和用户Handler，请注意解码器和Handler的添加顺序，如果顺序颠倒，会导致消息解码失败。

		// Delim iterBasedFrameDecoder原理分析：解码时，判断当前已经读取的ByteBuf中是否包含分隔符ByteBuf，
		// 如果包含，则截取对应的ByteBuf返回
		// 该算法与Java String中的搜索算法类似，对于原字符串使用两个指针来进行搜索，如果搜索成功，则返回索引位置，否则返回-1。
		ByteBuf delimiter = Unpooled.copiedBuffer("$_"
			.getBytes());
	   ch.pipeline().addLast(
			new DelimiterBasedFrameDecoder(1024,
				delimiter));
	   ch.pipeline().addLast(new StringDecoder());
	   ch.pipeline().addLast(new UserServerHandler());
	}
```

#### 2.3 FixedLengthFrameDecoder解码器
FixedLengthFrameDecoder是固定长度解码器，它能够按照指定的长度对消息进行自动解码，开发者不需要考虑TCP的粘包/拆包等问题，非常实用。
```yaml
	
	对于定长消息，如果消息实际长度小于定长，则往往会进行补位操作，它在一定程度上导致了空间和资源的浪费。
	但是它的优点也是非常明显的，编解码比较简单，因此在实际项目中仍然有一定的应用场景。
	
	利用FixedLengthFrameDecoder解码器，无论一次接收到多少数据报，它都会按照构造函数中设置的固定长度进行解码，
	如果是半包消息，FixedLengthFrameDecoder会缓存半包消息并等待下个包到达后进行拼包，直到读取到一个完整的包。
	
	假如单条消息的长度是20字节，使用FixedLengthFrameDecoder解码器的效果如下：
	解码前：
	+------------------------------------------------------------------+
							接收到的数据报
	“HELLO NETTY FOR USER DEVELOPER“
	+------------------------------------------------------------------+
	解码后：
	+------------------------------------------------------------------+
							解码后的数据报
	“HELLO NETTY FOR USER“
	+------------------------------------------------------------------+
```

#### 2.4 LengthFieldBasedFrameDecoder解码器
```yaml
了解TCP通信机制的读者应该都知道TCP底层的粘包和拆包，当我们在接收消息的时候，
	显示不能认为读取到的报文就是个整包消息，特别是对于采用非阻塞I/O和长连接通信的程序。
	
	如何区分一个整包消息，通常有如下4种做法：
	1) 固定长度，例如每120个字节代表一个整包消息，不足的前面补位。
	解码器在处理这类定常消息的时候比较简单，每次读到指定长度的字节后再进行解码；
	2) 通过回车换行符区分消息，例如HTTP协议。这类区分消息的方式多用于文本协议；
	3) 通过特定的分隔符区分整包消息；
	4) 通过在协议头/消息头中设置长度字段来标识整包消息。
	
	前三种解码器之前的章节已经做了详细介绍，下面让我们来一起学习最后一种通用解码器-LengthFieldBasedFrameDecoder
	大多数的协议（私有或者公有），协议头中会携带长度字段，用于标识消息体或者整包消息的长度，
	例如SMPP、HTTP协议等。由于基于长度解码需求的通用性，以及为了降低用户的协议开发难度，
	Netty提供了LengthFieldBasedFrameDecoder，自动屏蔽TCP底层的拆包和粘包问题，只需要传入正确的参数，即可轻松解决“读半包“问题。
	
	下面我们看看如何通过参数组合的不同来实现不同的“半包”读取策略。第一种常用的方式是消息的第一个字段是长度字段，后面是消息体，
	消息头中只包含一个长度字段。它的消息结构定义如图所示：
```

### 3. ObjectEncoder编码器
ObjectEncoder是Java序列化编码器，它负责将实现Serializable接口的对象序列化为byte []，然后写入到ByteBuf中用于消息的跨网络传输。
<br/>
下面我们一起分析下它的实现：
```yaml
首先，我们发现它继承自MessageToByteEncoder，它的作用就是将对象编码成ByteBuf：
	如果要使用Java序列化，对象必须实现Serializable接口，因此，它的泛型类型为Serializable。

	MessageToByteEncoder的子类只需要实现encode(ChannelHandlerContext ctx, I msg, ByteBuf out)方法即可，
	下面我们重点关注encode方法的实现：
```
	




