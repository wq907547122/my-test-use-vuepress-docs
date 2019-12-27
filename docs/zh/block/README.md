# 区块链
以太坊智能合约
:::tip 说明
以太坊智能合约EVM环境
- [Ubuntu搭建环境EVM](https://blog.csdn.net/bylaven/article/details/80386862)
- 开发语言: Solidity,[中文文档](https://solidity-cn.readthedocs.io/zh/develop/)
:::

[[toc]]

## 基于Ethereum的智能合约开发环境搭建与测试 (一)
### 前言
以比特币为代表的数字货币的兴起引发了众多各界人士的关注和热情, 同时也引发了人类对比特币的底层技术– 区块链 技术的深切思考, 和它能为人类带来的可预见的价值的推测展望. 无论是数字货币投资, 还是区块链应用项目的开发落地, 都吸引着大批投资者们来热情参与, 生怕自己没有顺带被这股劲风带起来. 
<br/>
说到区块链应用, 不得不提的就是基于以太坊而兴起的智能合约, 以太坊提供了一个便捷有源的框架, 便于任何人可以写几句代码就发布自己的智能合约. 
<br/>
本人主要讲如何搭建基于Ethereum的智能合约开发环境搭建并通过写一个demo进行测试.
<br/>
### 环境搭建
由于测试环境的不可控性, 也为了一旦发生危及操作系统本身的错误可以重新清零再来, 建议安装ubuntu VirtualBox虚拟机进行搭建及测试. 至于如何安装ubuntu 的 VirtualBox 虚拟机, 大家可以参考其他博文.
<br/>
在ubuntu系统(虚拟机)下, 终端输入以下命令, 安装ethereum环境
```sh
sudo apt-get install software-properties-common 
sudo add-apt-repository -y ppa:ethereum/ethereum 
sudo apt-get update 
sudo apt-get install ethereum
```
ethereum 安装好后. 我们接下来需要创建一个旷工节点.
- 1) 创建一个目录,可自己随便命名, 我们暂且命名为eth 
- 2) 在创建好的eth目录下新建一个文件, 名为 genesis.json 
- 3) 在genesis.json文件中写入以下值
```json
{
    "config":{
        "chainId":89120348581,    
        "homesteadBlock":0,
        "eip155Block":0,
        "eip158Block":0
    },
    "difficulty":"0",
    "gasLimit":"2100000",
    "alloc":{
    }
}

```
或者
```json
{
    "config": {
        "chainId": 15,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
    "coinbase" : "0x0000000000000000000000000000000000000000",
    "difficulty" : "0x40000",
    "extraData" : "",
    "gasLimit" : "0xffffffff",
    "nonce" : "0x0000000000000042",
    "mixhash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp" : "0x00",
    "alloc": { }
}
```
:::tip 说明
其中 difficulty 值为挖矿难度系数. 在这里设成0, 以便我们在测试中能更好计算出区块. gasLimit 用来限制每次代码执行可用的最大gas数量
:::
- 4) 运行以下指令:
```sh
geth --datadir eth-data init genesis.json

或者
geth --datadir ./data/00 init genesis.json
```
![](/images/blockChain/8.png)
<br/>
上面第4个步骤指令的目的是为了初始化我们这个矿机节点. 其中 eth-data 表示了我们区块信息, 账户私钥等信息的存放路径.
<br/>
以上初始化好我们矿机的节点后, 我们需要运行以下命令来配置矿机信息并跑起来
```sh
geth --datadir ./eth-data --networkid 89120348581 --rpc --rpcapi "db, eth, net, web3,debug, admin, personal, miner" --rpcaddr "192.168.0.37" --rpccorsdomain "*"
```

在上面这句命令中

- ./eth-data 就是我们之前初始化旷工节点时用的路径
- networkid 初始化旷工节点时的chainId
- rpc 启动rpc通信，可以进行智能合约的部署和调试
- rpcapi 设置允许连接的rpc的客户端
- rpcaddr 节点本机的动态地址, 可以通过ip -a 查看到
下图是运行上句指令后的结果: 
<br/>
![](/images/blockChain/1.png)
<br/>
完成以上步骤后就基本已经完成了Ethereum智能合约开发环境的搭建.下面我们就可以进行账户的创建, 生成公钥和私钥, 挖矿和交易操作了, 并在这些基础上, 发布并测试我们的智能合约了. 是不是很激动. 让我们继续.

### Ethereum客户端操作
关于geth的一些操作指令, 在网上都是可以查到的, 我们在这里只讲我们要用到的 
<br/>
<b>1) 启动交互式JavaScript环境,连接到刚才我们启动的旷工节点</b><br/>
```sh
geth attach http://192.168.0.37:8545
```
<b>2) 创建账户, 创建账户的同时, 需要输入密码来管理生成的私钥. </b><br/>
创建成功后, 会返回一段公钥地址: 如: 0x3616caaf9fffb01348ac0ec4c735208d40067066
<br/>
```sh
personal.newAccount();
```
<b>3) 查看我们账户信息</b><br/>
```sh
personal.listWallets   //查看账户信息, 如果有多个账户, 也会被列出来
```
<b>4)查看账户余额</b><br/>
```sh
eth.getBalance('0x3616caaf9fffb01348ac0ec4c735208d40067066');
```
新建的账户Balance都为0. 我们需要挖矿来获取Balance. 那么, 如何挖矿呢, 执行以下指令就行
```sh
miner.start()
检查是否在挖矿：
eth.hashrate
请执行eth.hashrate检查，如果返回值大于零，则表明正在挖掘，否则，则不是。
```
这个时候我们转到启动旷工节点的那个控制台, 就可以挖矿信息被吐出. 
<br/>
![](/images/blockChain/2.png)
<br/>
挖到新的区块后, 我们再次通过 eth.getBalance() 就会发现Balance已经变了 
<br/>
有了Balance, 我们就可以进行交易了. 但是, 交易需要另外一个账户, 所以可以用之前的命令 personal.newAccount() 创建新的账户. 如何进行交易呢.
<br/>
```sh
eth.sendTransaction({from:eth.coinbase,to:"0x8378bb8fbde1fd0e8b69ea8312243d34072419e2",value:100000000});
```
eth.sendTransaction()的参数是一个json, from表示交易的sender, 它的值应该是sender的公钥地址, 命令中的eth.coinbase表示的是一个节点有多个账户时,使用默认的账户. to是交易的receiver, 后面接的是receiver的公钥地址. 
<br/>
命令执行后, 查看receiver的账户余额, 并不会马上到账, 这时候我们需要旷工进行再次挖矿, 将交易信息打包成区块后, 再次进行查看, 就会发现receiver的账户余额发生变化了.
### 智能合约测试

#### 创建智能合约
Ethereum上的智能合约是用Solidity语言写的, 官方推荐我们在 http://remix.ethereum.org 上进行智能合约的编写和发布. 我们可以在这上面添加我们自己的智能合约并发布.我们先看下界面上是什么样子. 
<br/>
![](/images/blockChain/3.png)
<br/>
在这里我添加了一个自己的智能合约, 合约执行的内容是返回一个内容为”contract exec !”的字串. 界面右上角的Start to compile 可以检查是否能够编译通过.
<br/>
发布智能合约
<br/>
发布智能合约我们需要再Remix上完三步. 
<br/>
1) 选择合约执行环境, 由于我们目前是测试, 选择Web3 provide. 并将节点地址改为为我们之前创建旷工节点的地址. 
<br/>
2) 选择合约执行账户 
<br/>
3) 在Ethereum客户端(geth console处)将选择的账户状态职位unLocked
```sh
personal.unlockAccount('0x2ddfea634c917d3cadd18c7b1aef20d13bfc26bc');
```
4) 点击deploy发布. 发布成功后, 会在右下交生成合约对应的地址. 这个地址我们后面试会用到的
<br/>
![](/images/blockChain/4.png)
<br/>

#### 执行职能合约
之前我们已经把智能合约发布成功, 现在我们需要在Ethereum客户端执行职能合约. 首先我们需要合约的abi. 这个abi表示了合约的内容和类型信息. abi在remix界面的Details中获得 
<br/>
![](/images/blockChain/5.png)
<br/>
同时, 需要获得此合约对应地址, 这个在上问已经提到过.
<br/>
拿到abi和合约地址后, 我们就可以在Ethereum客户端执行智能合约了. 
<br/>
如图: 
<br/>
![](/images/blockChain/6.png)
<br/>

看到最后的contract exec !, 就表示合约执行成功了. 那么, 也就表示, 基本的环境已经搭好.

## 解决挖矿返回null的问题
最近技术群中的朋友经常问到这样的问题，环境搭建已经搭建好，geth节点也成功启动，可为什么当执行miner.start()方法时却没有挖矿，返回null。
### 1.是否设置miner地址
启动节点挖矿之前，需要查看当前节点中是否已经存在账号，可执行以下命令，查看当前节点下面是否有账号存在。
```sh
personal.listAccounts

显示账号信息:
["0xc040cbd8a189d36f580fa83c2ffe3a26fb3e6a7e", "0xe0d1de6c934049fe4847b64becff5885bdb83fa4"]
```
当确认账户已经存在时，可以设置Etherbase。先查看以下coinbase账户：
```sh
eth.coinbase

返回信息
"0xc040cbd8a189d36f580fa83c2ffe3a26fb3e6a7e"
```
通过上面的命令，可以看到coinbase的账户地址，也就是上面查看地址查到第一个地址。
<br/>
执行设置miner地址：
```sh
miner.setEtherbase(eth.coinbase)
```
也可以执行执行以下命令进行设置：
```sh
miner.setEtherbase(eth.accounts[0])
```

### 2.出现此问题的原因在于geth版本更新之后，–dev模式下新增了一个参数项：
```sh
--dev               Ephemeral proof-of-authority network with a pre-funded developer account, mining enabled
--dev.period value  Block period to use in developer mode (0 = mine only if transaction pending) (default: 0)
```
我们先看一下上面的两个参数，–dev是我们常用的参数，之前版本中我们只用使用–dev然后执行miner.start()就可以挖矿，但是在后面的版本中，当我们会发现只有发送交易了才会挖一个块。
<br/>
引起此问题的原因就是新增了–dev.period value配置项。此配置默认值为0，也就是说只有有pending中的交易才会挖矿。
<br/>
明白了这个参数的含义之后，解决问题就很简答了，之前的–dev参数依旧使用，然后再在后面添加–dev.period 1，注意，参数值为1，不是默认的0。
<br/>
再重新启动节点，然后执行挖矿，先不管返回是否是null，执行之后，无论查看日志或执行eth.blockNumber都会发现块在不停的增高。
### 3.第三种解决方案
感觉我的不能算解决 miner.start() 放回 null 的问题，不过让 account[0] 拥有了一定 ether ，方便后面测试用，挖不挖矿无所谓啦， 
<br/>
首先解锁 accounts[0] 和 accounts[1] 
```sh
personal.unlockAccount(eth.accounts[0])

personal.unlockAccount(eth.accounts[1])
```
发起一笔 5ether 的交易
<br/>
```sh
amount = web3.toWei(5,'ether')

eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[1],value:amount})
```
这时候会显示失败
```yaml
Error: insufficient funds for gas * price + value
at web3.js:3143:20
at web3.js:6347:15
at web3.js:5081:36
at <anonymous>:1:1
```
没事，继续发起一笔 0ether 的交易
```yaml
amount = web3.toWei(0,'ether')

eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[1],value:amount})
```
然后就成功了，成功了，成功了，前一笔交易居然成功了。
<br/>
截图奉上
<br/>
![](/images/blockChain/7.png)
<br/>





