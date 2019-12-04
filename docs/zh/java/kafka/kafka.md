# Kafka的文档

## 持久化
### 不要害怕文件系统！
Kafka 对消息的存储和缓存严重依赖于文件系统。人们对于“磁盘速度慢”的普遍印象，使得人们对于持久化的架构能够提供强有力的性能产生怀疑。事实上，磁盘的速度比人们预期的要慢的多，也快得多，这取决于人们使用磁盘的方式。而且设计合理的磁盘结构通常可以和网络一样快。
<br/>
关于磁盘性能的关键事实是，磁盘的吞吐量和过去十年里磁盘的寻址延迟不同。因此，使用6个7200rpm、SATA接口、RAID-5的磁盘阵列在[JBOD](http://en.wikipedia.org/wiki/Non-RAID_drive_architectures)配置下的顺序写入的性能约为600MB/秒，但随机写入的性能仅约为100k/秒，相差6000倍以上。因为线性的读取和写入是磁盘使用模式中最有规律的，并且由操作系统进行了大量的优化。现代操作系统提供了read-ahead和write-behind技术，read-ahead是以大的data block为单位预先读取数据，而write-behind是将多个小型的逻辑写合并成一次大型的物理磁盘写入。关于该问题的进一步讨论可以参考[ACM Queue article](http://queue.acm.org/detail.cfm?id=1563874)，他们发现实际上[顺序磁盘访问在某些情况下比随机内存访问还要快](http://deliveryimages.acm.org/10.1145/1570000/1563874/jacobs3.jpg)！
<br/>
为了弥补这种性能差异，现代操作系统在越来越注重使用内存对磁盘进行cache。现代操作系统主动将所有空闲内存用作disk caching，代价是在内存回收时性能会有所降低。所有对磁盘的读写操作都会通过这个统一的cache。如果不使用直接I/O，该功能不能轻易关闭。因此即使进程维护了in-process cache，该数据也可能会被复制到操作系统的pagecache 中，事实上所有内容都被存储了两份。
<br/>
此外，Kafka 建立在JVM 之上，任何了解Java 内存使用的人都知道两点：
<br/>
- 1.对象的内存开销非常高，通常是所存储的数据的两倍(甚至更多)。
- 2.随着堆中数据的增加，Java 的垃圾回收变得越来越复杂和缓慢。
<br/>
受这些因素影响，相比于维护in-memory cache 或者其他结构，使用文件系统和pagecache 显得更有优势--我们可以通过自动访问所有空闲内存将可用缓存的容量至少翻倍，并且通过存储紧凑的字节结构而不是独立的对象，有望将缓存容量再翻一番。这样使得32GB的机器缓存容量可以达到28-30GB,并且不会产生额外的GC 负担。此外，即使服务重新启动，缓存依旧可用，而in-process cache 则需要在内存中重建(重建一个10GB的缓存可能需要10分钟)，否则进程就要从cold cache 的状态开始(这意味着进程最初的性能表现十分糟糕)。这同时也极大的简化了代码，因为所有保持cache 和文件系统之间一致性的逻辑现在都被放到了OS 中，这样做比一次性的进程内缓存更准确、更高效。如果你的磁盘使用更倾向于顺序读取，那么read-ahead 可以有效的使用每次从磁盘中读取到的有用数据预先填充cache。
<br/>
这里给出了一个非常简单的设计：相比于维护尽可能多的in-memory cache，并且在空间不足的时候匆忙将数据flush 到文件系统，我们把这个过程倒过来。所有数据一开始就被写入到文件系统的持久化日志中，而不用在cache 空间不足的时候flush 到磁盘。实际上，这表明数据被转移到了内核的pagecache 中。
<br/>
这种pagecache-centric的设计风格出现在一篇关于[Varnish](http://varnish-cache.org/wiki/ArchitectNotes)设计的文章中。

### 常量时间就足够了
消息系统使用的持久化数据结构通常是和BTree 相关联的消费者队列或者其他用于存储消息源数据的通用随机访问数据结构。BTree 是最通用的数据结构，可以在消息系统能够支持各种事务性和非事务性语义。虽然BTree 的操作复杂度是O(log N)，但成本也相当高。通常我们认为O(log N) 基本等同于常数时间，但这条在磁盘操作中不成立。磁盘寻址是每10ms一跳，并且每个磁盘同时只能执行一次寻址，因此并行性受到了限制。因此即使是少量的磁盘寻址也会很高的开销。由于存储系统将非常快的cache操作和非常慢的物理磁盘操作混合在一起，当数据随着fixed cache 增加时，可以看到树的性能通常是非线性的——比如数据翻倍时性能下降不只两倍。
<br/>
所以直观来看，持久化队列可以建立在简单的读取和向文件后追加两种操作之上，这和日志解决方案相同。这种架构的优点在于所有的操作复杂度都是O(1)，而且读操作不会阻塞写操作，读操作之间也不会互相影响。这有着明显的性能优势，由于性能和数据大小完全分离开来——服务器现在可以充分利用大量廉价、低转速的1+TB SATA硬盘。虽然这些硬盘的寻址性能很差，但他们在大规模读写方面的性能是可以接受的，而且价格是原来的三分之一、容量是原来的三倍。
<br/>
在不产生任何性能损失的情况下能够访问几乎无限的硬盘空间，这意味着我们可以提供一些其它消息系统不常见的特性。例如：在Kafka 中，我们可以让消息保留相对较长的一段时间(比如一周)，而不是试图在被消费后立即删除。正如我们后面将要提到的，这给消费者带来了很大的灵活性。
<br/>

### Efficiency(效率)

我们在性能上已经做了很大的努力。我们主要的使用场景是处理WEB活动数据，这个数据量非常大，因为每个页面都有可能大量的写入。此外我们假设每个发布message 至少被一个consumer (通常很多个consumer) 消费， 因此我们尽可能的去降低消费的代价。
<br/>
我们还发现，从构建和运行许多相似系统的经验上来看，性能是多租户运营的关键。如果下游的基础设施服务很轻易被应用层冲击形成瓶颈，那么一些小的改变也会造成问题。通过非常快的(缓存)技术，我们能确保应用层冲击基础设施之前，将负载稳定下来。当尝试去运行支持集中式集群上成百上千个应用程序的集中式服务时，这一点很重要，因为应用层使用方式几乎每天都会发生变化。
<br/>
我们在上一节讨论了磁盘性能。一旦消除了磁盘访问模式不佳的情况，该类系统性能低下的主要原因就剩下了两个：大量的小型I/O 操作，以及过多的字节拷贝。
<br/>
小型的I/O 操作发生在客户端和服务端之间以及服务端自身的持久化操作中。
<br/>
为了避免这种情况，我们的协议是建立在一个“消息块” 的抽象基础上，合理将消息分组。这使得网络请求将多个消息打包成一组，而不是每次发送一条消息，从而使整组消息分担网络中往返的开销。Consumer 每次获取多个大型有序的消息块，并由服务端依次将消息块一次加载到它的日志中。
<br/>
这个简单的优化对速度有着数量级的提升。批处理允许更大的网络数据包，更大的顺序读写磁盘操作，连续的内存块等等，所有这些都使KafKa 将随机流消息顺序写入到磁盘， 再由consumers 进行消费。
<br/>
另一个低效率的操作是字节拷贝，在消息量少时，这不是什么问题。但是在高负载的情况下，影响就不容忽视。为了避免这种情况，我们使用producer ，broker 和consumer 都共享的标准化的二进制消息格式，这样数据块不用修改就能在他们之间传递。
<br/>
broker维护的消息日志本身就是一个文件目录，每个文件都由一系列以相同格式写入到磁盘的消息集合组成，这种写入格式被producer和consumer共用。保持这种通用格式可以对一些很重要的操作进行优化:持久化日志块的网络传输。现代的unix操作系统提供了一个高度优化的编码方式，用于将数据从pagecache转移到socket网络连接中；在Linux中系统调用[sendfile](http://man7.org/linux/man-pages/man2/sendfile.2.html)做到这一点。
<br/>
为了理解sendfile 的意义，了解数据从文件到套接字的常见数据传输路径就非常重要：
- 1.操作系统从磁盘读取数据到内核空间的pagecache
- 2.应用程序读取内核空间的数据到用户空间的缓冲区
- 3.应用程序将数据(用户空间的缓冲区)写回内核空间到套接字缓冲区(内核空间)
- 4.操作系统将数据从套接字缓冲区(内核空间)复制到通过网络发送的NIC(Network Interface Controller，网络接口控制器) 缓冲区
<br/>
这显然是低效的，有四次copy 操作和两次系统调用。使用sendfile 方法，可以允许操作系统将数据从pagecache 直接发送到网络，这样避免重新复制数据。所以这种优化方式，只需要最后一步的copy操作，将数据复制到NIC 缓冲区。
<br/>
我们期望一个普遍的应用场景，一个topic 被多消费者消费。使用上面提交的zero-copy（零拷贝）优化，数据在使用时只会被复制到pagecache 中一次，节省了每次拷贝到用户空间内存中，再从用户空间进行读取的消耗。这使得消息能够以接近网络连接速度的上限进行消费。
<br/>
pagecache 和sendfile 的组合使用意味着，在一个kafka集群中，大多数consumer 消费时，您将看不到磁盘上的读取活动，因为数据将完全由缓存提供。
<br/>
JAVA中更多有关sendfile方法和zero-copy （零拷贝）相关的资料，可以参考这里的 [文章](https://developer.ibm.com/articles/j-zerocopy/)。
该File.transferTo()方法将数据从文件通道传输到给定的可写字节通道。在内部，它取决于底层操作系统对零复制的支持；在UNIX和各种Linux版本中，此调用被路由到sendfile()系统调用，如清单3所示，该系统调用将数据从一个文件描述符传输到另一个文件描述符
<br/>

