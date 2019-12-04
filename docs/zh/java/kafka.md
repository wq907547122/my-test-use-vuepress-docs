# 关于kafka的一些内容
- [kafka中文文档地址](http://kafka.apachecn.org/)

- [英文文档地址](http://kafka.apache.org/)`英文版本的版本是更新的版本`

- 以下描述了一些 ApacheKafka ®的流行用例。有关这些领域的概述，请参阅 [此博客中的文章](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)。

- 下面是在windows上启动和测试单节点的信息
## 1启动zookeeper
bin\windows\zookeeper-server-start.bat config\zookeeper.properties

## 2启动kafka
bin\windows\kafka-server-start.bat config\server.properties

## 3建立主题
bin\windows\kafka-topics.bat --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test

### 列出主题

bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092

## 4发送一些消息
bin\windows\kafka-console-producer.bat --broker-list localhost:9092 --topic test

## 5.获取消息
bin\windows\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic test --from-beginning

