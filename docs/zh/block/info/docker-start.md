# 使用docker启动以太坊的区块链
## 概述
以太坊是由 Vitarik Buterin (人称 V 神)，提供的去中心化的平台，可以通过脚本语言创建开发应用。它的想法是从比特币获得的，以太坊是继比特币之后的第二大加密数字货币。以太坊技术的核心是 EVM（以太坊虚拟机），它类似于 Java 虚拟机，而且用一种完全去中心化的节点网络

## 创建私有链
我们使用官方提供的 Docker 镜像创建以太坊私有链来学习开发基于以太坊的 DApp 应用程序，[官方镜像地址](https://hub.docker.com/r/ethereum/client-go)
## 下载镜像
docker pull ethereum/client-go
## 启动容器
```yaml
version: '3.1'
services:
  ethereum:
    restart: always
    image: ethereum/client-go
    container_name: ethereum-node
    ports:
      - 8545:8545
      - 30303:30303
    volumes:
      - ./root:/root
```
```shell
docker-compose up -d
```
## 配置创世区块
- 交互式进入容器
```shell
docker exec -it ethereum-node /bin/sh
cd /root
```
- 创建一个名为 lueth 的目录，用于存放私有链
```shell
mkdir lueth
cd lueth
# 创建创世区块存放数据的目录
mkdir data0
```
- 创建一个名为 genesis.json 的配置文件
```json
{
  "config": {
    "chainId": 1024,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0
  },
  "alloc": {},
  "coinbase": "0x0000000000000000000000000000000000000000",
  "difficulty": "0x400",
  "extraData": "",
  "gasLimit": "0x2fefd8",
  "nonce": "0x0000000000000042",
  "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp": "0x00"
}
```
## 初始化创世区块
```shell
geth --nousb --datadir=/root/lueth/data0 init /root/lueth/genesis.json
```
```info
# 目录结构
.
├── data0
│   ├── geth
│   │   ├── chaindata # 区块数据
│   │   │   ├── 000001.log
│   │   │   ├── CURRENT
│   │   │   ├── LOCK
│   │   │   ├── LOG
│   │   │   └── MANIFEST-000000
│   │   └── lightchaindata
│   │       ├── 000001.log
│   │       ├── CURRENT
│   │       ├── LOCK
│   │       ├── LOG
│   │       └── MANIFEST-000000
│   └── keystore # 账户数据
└── genesis.json
```
- identity： 指定节点 ID
- rpc： 表示开启 HTTP-RPC 服务
- rpcport： 指定 HTTP-RPC 服务监听端口号（默认为 8545）
- datadir： 指定区块链数据的存储位置
- port： 指定和其他节点连接所用的端口号（默认为 30303）
- nodiscover： 关闭节点发现机制，防止加入有同样初始配置的陌生节点

## 启动私有链
初始化完成后，就有了一条属于自己的私有链，之后就可以启动自己的私有链节点并做一些操作，在终端中输入以下命令即可启动节点
```info
# 监听的端口不要和 ETH 默认端口冲突
# 该命令会进入一个使用 JS 与 Geth 交互的控制台
geth --nousb --identity "CreationNode" --rpc --rpcport "8548" --rpcapi eth,web3,personal --allow-insecure-unlock --datadir /root/lueth/data0 --port "30304" --nodiscover console
# 输出日下
INFO [11-07|07:59:21.499] Bumping default cache on mainnet         provided=1024 updated=4096
WARN [11-07|07:59:21.500] Sanitizing cache to Go's GC limits       provided=4096 updated=2651
INFO [11-07|07:59:21.501] Maximum peer count                       ETH=50 LES=0 total=50
INFO [11-07|07:59:21.502] Smartcard socket not found, disabling    err="stat /run/pcscd/pcscd.comm: no such file or directory"
INFO [11-07|07:59:21.503] Starting peer-to-peer node               instance=Geth/CreationNode/v1.9.7-unstable-b9bac1f3-20191106/linux-amd64/go1.13.4
INFO [11-07|07:59:21.503] Allocated trie memory caches             clean=662.00MiB dirty=662.00MiB
INFO [11-07|07:59:21.503] Allocated cache and file handles         database=/root/lueth/data0/geth/chaindata cache=1.29GiB handles=524288
INFO [11-07|07:59:21.535] Opened ancient database                  database=/root/lueth/data0/geth/chaindata/ancient
INFO [11-07|07:59:21.536] Initialised chain configuration          config="{ChainID: 1024 Homestead: 0 DAO: <nil> DAOSupport: false EIP150: 0 EIP155: 0 EIP158: 0 Byzantium: 0 Constantinople: 0 Petersburg: 0 Istanbul: <nil> Engine: unknown}"
INFO [11-07|07:59:21.536] Disk storage enabled for ethash caches   dir=/root/lueth/data0/geth/ethash count=3
INFO [11-07|07:59:21.536] Disk storage enabled for ethash DAGs     dir=/root/.ethash                 count=2
INFO [11-07|07:59:21.536] Initialising Ethereum protocol           versions="[64 63]" network=1 dbversion=7
INFO [11-07|07:59:21.595] Loaded most recent local header          number=0 hash=b052b0…1553c1 td=1024 age=50y6mo3w
INFO [11-07|07:59:21.595] Loaded most recent local full block      number=0 hash=b052b0…1553c1 td=1024 age=50y6mo3w
INFO [11-07|07:59:21.595] Loaded most recent local fast block      number=0 hash=b052b0…1553c1 td=1024 age=50y6mo3w
INFO [11-07|07:59:21.596] Loaded local transaction journal         transactions=0 dropped=0
INFO [11-07|07:59:21.596] Regenerated local transaction journal    transactions=0 accounts=0
INFO [11-07|07:59:21.614] Allocated fast sync bloom                size=1.29GiB
INFO [11-07|07:59:21.615] Initialized fast sync bloom              items=0 errorrate=0.000 elapsed=13.254µs
INFO [11-07|07:59:21.638] New local node record                    seq=2 id=5909ee204c9c150a ip=127.0.0.1 udp=0 tcp=30304
INFO [11-07|07:59:21.638] Started P2P networking                   self="enode://e80abb88f4b1264a7f86222f130c405a928d8db5bc7111ff9ae7a1e64c0c9a9de9e188b13e0707e067395191af0cd9b6786018d00df4c95a0b274ae1561a1bb0@127.0.0.1:30304?discport=0"
INFO [11-07|07:59:21.639] IPC endpoint opened                      url=/root/lueth/data0/geth.ipc
INFO [11-07|07:59:21.640] HTTP endpoint opened                     url=http://127.0.0.1:8548      cors= vhosts=localhost
WARN [11-07|07:59:21.714] Served eth_coinbase                      reqid=3 t=19.656µs err="etherbase must be explicitly specified"
Welcome to the Geth JavaScript console!
instance: Geth/CreationNode/v1.9.7-unstable-b9bac1f3-20191106/linux-amd64/go1.13.4
at block: 0 (Thu, 01 Jan 1970 00:00:00 UTC)
 datadir: /root/lueth/data0
 modules: admin:1.0 debug:1.0 eth:1.0 ethash:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
```
## 模块说明
- admin： 操作管理节点相关的方法
- eth： 操作区块链相关的方法
- miner： 启动和停止挖矿的方法
- net： 查看 P2P 网络状态的方法
- personal： 管理账户的方法
- txpool： 查看交易内存池的方法
- web3： 包含了以上对象，还包含一些单位换算的方法

## 操作私有链
我们可以使用里面的内置对象做一些操作，这些内置对象提供的功能很丰富，比如查看区块和交易、创建账户、挖矿、发送交易、部署智能合约等
## 创建账户
```info
personal.newAccount()
# 输出如下，会生成账户地址
Password: 
Repeat password: 
INFO [11-07|08:00:36.060] Your new key was generated               address=0x313a2a9E1d56C1f3b62C36f523a8CADd97603728
WARN [11-07|08:00:36.060] Please backup your key file!             path=/root/lueth/data0/keystore/UTC--2019-11-07T08-00-34.371818348Z--313a2a9e1d56c1f3b62c36f523a8cadd97603728
WARN [11-07|08:00:36.060] Please remember your password! 
"0x313a2a9e1d56c1f3b62c36f523a8cadd97603728"
```
## 查看账户余额
```info
# 需要传入账户地址
eth.getBalance(eth.accounts[0])
eth.getBalance("0x313a2a9e1d56c1f3b62c36f523a8cadd97603728")
# 输出如下
0
```
## 开始挖矿
```info
# start 的参数是挖矿使用的线程数。第一次启动挖矿会先生成挖矿所需的 DAG 文件，这个过程有点慢，等进度达到 100% 后，就会开始挖矿
miner.start(1)
INFO [11-07|08:03:28.408] Updated mining threads                   threads=1
INFO [11-07|08:03:28.408] Transaction pool price threshold updated price=1000000000
INFO [11-07|08:03:28.408] Etherbase automatically configured       address=0x313a2a9E1d56C1f3b62C36f523a8CADd97603728
null
> INFO [11-07|08:03:28.409] Commit new mining work                   number=1 sealhash=05f16a…b93c5b uncles=0 txs=0 gas=0 fees=0 elapsed=918.751µs
INFO [11-07|08:03:31.682] Generating DAG in progress               epoch=0 percentage=0 elapsed=2.569s
INFO [11-07|08:03:34.692] Generating DAG in progress               epoch=0 percentage=1 elapsed=5.580s
INFO [11-07|08:03:37.406] Generating DAG in progress               epoch=0 percentage=2 elapsed=8.293s
INFO [11-07|08:03:39.700] Generating DAG in progress               epoch=0 percentage=3 elapsed=10.588s
INFO [11-07|08:03:41.957] Generating DAG in progress               epoch=0 percentage=4 elapsed=12.845s
INFO [11-07|08:03:44.418] Generating DAG in progress               epoch=0 percentage=5 elapsed=15.306s
INFO [11-07|08:03:46.851] Generating DAG in progress               epoch=0 percentage=6 elapsed=17.739s
INFO [11-07|08:03:49.118] Generating DAG in progress               epoch=0 percentage=7 elapsed=20.006s
...
```
## 停止挖矿
```info
# 直接在控制台输入
miner.stop()
# 挖到一个区块会奖励 5 个以太币，挖矿所得的奖励会进入矿工的账户
# 这个账户叫做 coinbase，默认情况下 coinbase 是本地账户中的第一个账户
# 可以通过 miner.setEtherbase() 将其他账户设置成 coinbase
# 账户余额的返回值单位是 Wei
eth.getBalance(eth.accounts[0])
282000000000000000000
# 换算成以太币
web3.fromWei(282000000000000000000)
282
```
## 交易以太坊
### 创建账户
```info
personal.newAccount()
# 输出如下，会生成账户地址
Password: 
Repeat password: 
INFO [11-07|08:26:03.690] Your new key was generated               address=0xF8f9066aD7f61Da776f6b61c6ca19fF9fe30E419
WARN [11-07|08:26:03.691] Please backup your key file!             path=/root/lueth/data0/keystore/UTC--2019-11-07T08-26-00.970435910Z--f8f9066ad7f61da776f6b61c6ca19ff9fe30e419
WARN [11-07|08:26:03.691] Please remember your password! 
"0xf8f9066ad7f61da776f6b61c6ca19ff9fe30e419"
```
### 发送交易
```info
# 我们要从账户 0 向账户 1 转账，所以要先解锁账户 0，才能发起交易
personal.unlockAccount(eth.accounts[0])
Unlock account 0x313a2a9e1d56c1f3b62c36f523a8cadd97603728
Password: 
true
# 发送交易，账户 0 -> 账户 1
amount = web3.toWei(5,'ether')
"5000000000000000000"
eth.sendTransaction({from:eth.accounts[0],to:eth.accounts[1],value:amount})
INFO [11-07|08:33:36.896] Setting new local account                address=0x313a2a9E1d56C1f3b62C36f523a8CADd97603728
INFO [11-07|08:33:36.896] Submitted transaction                    fullhash=0xe62a2a0a963e6669c6bca5baa08568305429a25c32692f32f7c960025ac3628a recipient=0xF8f9066aD7f61Da776f6b61c6ca19fF9fe30E419
"0xe62a2a0a963e6669c6bca5baa08568305429a25c32692f32f7c960025ac3628a"
```
### 继续挖矿确认交易
此时如果没有挖矿，用 txpool.status 命令可以看到本地交易池中有一个待确认的交易，可以使用 eth.getBlock("pending", true).transactions 查看当前待确认交易
```info
miner.start(1);admin.sleepBlocks(1);miner.stop();
# 输出如下
INFO [11-07|08:36:38.253] Updated mining threads                   threads=1
INFO [11-07|08:36:38.253] Transaction pool price threshold updated price=1000000000
INFO [11-07|08:36:38.254] Commit new mining work                   number=142 sealhash=3eb02b…c41147 uncles=0 txs=0 gas=0 fees=0 elapsed=121.86µs
INFO [11-07|08:36:38.255] Commit new mining work                   number=142 sealhash=517236…45f48c uncles=0 txs=1 gas=21000 fees=2.1e-05 elapsed=916.724µs
INFO [11-07|08:36:46.597] Successfully sealed new block            number=142 sealhash=517236…45f48c hash=16f4e4…28a3d8 elapsed=8.342s
INFO [11-07|08:36:46.597] 🔨 mined potential block                  number=142 hash=16f4e4…28a3d8
INFO [11-07|08:36:46.597] Commit new mining work                   number=143 sealhash=18c5e7…1abf66 uncles=0 txs=0 gas=0     fees=0       elapsed=165.129µs
# 再次查看账户 1 的余额
eth.getBalance(eth.accounts[1])
5000000000000000000
```
### 查看交易和区块
- 查看当前区块总数
```info
eth.blockNumber
142
```
- 通过交易 Hash 查看交易（Hash 值包含在上面交易返回值中）
```info
eth.getTransaction("0xe62a2a0a963e6669c6bca5baa08568305429a25c32692f32f7c960025ac3628a")
# 输出如下
{
  blockHash: "0x16f4e44e154f36a1c13b5322c2654fff773f3beaf152cbc1110571a3c928a3d8",
  blockNumber: 142,
  from: "0x313a2a9e1d56c1f3b62c36f523a8cadd97603728",
  gas: 21000,
  gasPrice: 1000000000,
  hash: "0xe62a2a0a963e6669c6bca5baa08568305429a25c32692f32f7c960025ac3628a",
  input: "0x",
  nonce: 0,
  r: "0x2f3f974285652e4200b57be0b2a602bd74852c404c44f9b50163cd064b260d35",
  s: "0x6cd103e7fc6ebef343a0c695dabf560878bc1dcc6a69eebdaabd20631aa92e59",
  to: "0xf8f9066ad7f61da776f6b61c6ca19ff9fe30e419",
  transactionIndex: 0,
  v: "0x823",
  value: 5000000000000000000
}
```
- 通过区块号查看区块
```info
eth.getBlock(4)
# 输出如下
{
  difficulty: 131136,
  extraData: "0xd883010907846765746888676f312e31332e34856c696e7578",
  gasLimit: 3153874,
  gasUsed: 0,
  hash: "0x6898c2396d16e65bd3dbbb13ecf265af9e1ebd27d0a715c1c09b75807b36f4d5",
  logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  miner: "0x313a2a9e1d56c1f3b62c36f523a8cadd97603728",
  mixHash: "0x9c1ddec31dd9a96c7e1e941aa8efdc103b5e7b6507b17dfbe7bf76d3413c48e7",
  nonce: "0x3755ec8109b25dd5",
  number: 4,
  parentHash: "0x37eff231bf1594f4b70e486340e330cd43dd372f490a07fe6fdf0e0d194b47cb",
  receiptsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
  sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  size: 536,
  stateRoot: "0x57638ff400ae9a8c751beccbc03c2e13023688e14e98bf14a8841ea97331d33f",
  timestamp: 1573114122,
  totalDifficulty: 525376,
  transactions: [],
  transactionsRoot: "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
  uncles: []
}
```
## 附：创世区块配置说明
### 链配置 (config)
#### 义链配置，会影响共识协议，虽然链配置对创世影响不大，但新区块的出块规则均依赖链配置
- chainId： 指定了独立的区块链网络 ID。网络 ID 在连接到其他节点的时候会用到，以太坊公网的网络 ID 是 1，为了不与公有链网络冲突，运行私有链节点的时候要指定自己的网络 ID，不同 ID 网络的节点无法相互连接
- xxxBlock： 相关协议机制的升级区块所在的高度，签名算法是 homestead -> eip150 -> eip155 -> eip158 -> byzantium -> constantinople -> petersburg，从 homesteadBlock 之前区块都通过 homestead 相关算法机制来验证，homesteadBlock 到 eip155Block 之间的用 eip155 算法来验证，依此类推
#### 初始账户资产配置
- alloc： 创世中初始账户资产配置。在生成创世区块时，将此数据集中的账户资产写入区块中，相当于预挖矿。这对开发测试和私有链非常好用，不需要挖矿就可以直接为任意多个账户分配资产
#### 创世区块头信息配置
- coinbase： 挖矿所得的奖励会进入矿工的账户，这个账户叫做 coinbase，默认情况下 coinbase 是本地账户中的第一个账户
- difficulty： 难度系数，用来度量挖出一个区块平均需要的运算次数，难度规则与链配置中的签名算法有关
- extraData： 附加信息
- gasLimit： 燃料上限（GAS 俗称燃料），单个区块允许的最多 GAS 总量，以此可以用来决定单个区块中能打包多少笔交易；私有链，可以填最大
- nonce： 64 位随机数，用于确定每笔交易只能被处理一次的计数器
- mixhash： 与 nonce 配合用于挖矿，由上一个区块的一部分生成的 hash，创世区块是 0
- parentHash： 上一个区块的 hash 值，创世区块是 0
- timestamp： 设置创世块的时间戳

## 附：常用操作命令
### 创建账户
```info
personal.newAccount()
```
### 解锁账户
```info
personal.unlockAccount()
```
### 枚举系统中的账户
```info
eth.accounts
```
### 查看账户余额
查看账户余额，返回值的单位是 Wei（Wei 是以太坊中最小货币面额单位，类似比特币中的聪，1 ether = 10^18 Wei）
```info
eth.getBalance()
```
### 列出区块总数
```info
eth.blockNumber
```
### 获取交易
```info
eth.getTransaction()
```
### 获取区块
```info
eth.getBlock()
```
### 开始挖矿
miner.start()
### 停止挖矿
miner.stop()
### Wei 换算成以太币
web3.fromWei()
### 以太币换算成 Wei
web3.toWei()
### 交易池中的状态
txpool.status
### 连接到其他节点
admin.addPeer()

