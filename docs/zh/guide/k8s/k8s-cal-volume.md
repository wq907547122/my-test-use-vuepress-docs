# 计算、存储、网络扩展

[[toc]]

## 集群管理概述
集群管理概述面向任何创建和管理 Kubernetes 集群的读者人群。 我们假设你对用户指南中的概念大概了解。
### 规划集群
查阅 [安装](https://kubernetes.io/docs/setup/) 中的指导，获取如何规划、建立以及配置 Kubernetes 集群的示例。本文所列的文章称为发行版 。
<br/>
在选择一个指南前，有一些因素需要考虑：
- 你是打算在你的电脑上尝试 Kubernetes，还是要构建一个高可用的多节点集群？请选择最适合你需求的发行版。
- <b>如果你正在设计一个高可用集群</b>，请了解[在多个 zones 中配置集群](https://kubernetes.io/docs/concepts/cluster-administration/federation/)。
- 您正在使用 类似 [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) 这样的<b>被托管的Kubernetes集群</b>, 还是<b>管理您自己的集群</b>?
- 你的集群是在<b>本地</b>还是<b>云（IaaS）</b>上？ Kubernetes 不能直接支持混合集群。作为代替，你可以建立多个集群。
- <b>如果你在本地配置 Kubernetes</b>，需要考虑哪种[网络模型](https://kubernetes.io/docs/concepts/cluster-administration/networking/)最适合
- 你的 Kubernetes 在 <b>裸金属硬件</b> 还是 <b>虚拟机（VMs）</b>上运行？
- 你<b>只想运行一个集群</b>，还是打算<b>活动开发 Kubernetes 项目代码</b>？如果是后者，请选择一个活动开发的发行版。某些发行版只提供二进制发布版，但提供更多的选择。
- 让你自己熟悉运行一个集群所需的[组件](https://kubernetes.io/docs/concepts/overview/components/) 。
请注意：不是所有的发行版都被积极维护着。请选择测试过最近版本的 Kubernetes 的发行版。

### 管理集群
- [管理集群](https://kubernetes.io/docs/tasks/administer-cluster/cluster-management/)叙述了和集群生命周期相关的几个主题：创建一个新集群、升级集群的 master 和 worker 节点、执行节点维护（例如内核升级）以及升级活动集群的 Kubernetes API 版本。
- 学习如何 [管理节点](https://kubernetes.io/docs/concepts/architecture/nodes/).
- 学习如何设定和管理集群共享的 [资源配额](https://kubernetes.io/docs/concepts/policy/resource-quotas/) 
### 集群安全
- [Certificates](https://kubernetes.io/docs/concepts/cluster-administration/certificates/) 描述了使用不同的工具链生成证书的步骤。
- [Kubernetes 容器环境](https://kubernetes.io/docs/concepts/containers/container-environment-variables/) 描述了 Kubernetes 节点上由 Kubelet 管理的容器的环境。
- [控制到 Kubernetes API](https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/) 的访问描述了如何为用户和 service accounts 建立权限许可。
- [用户认证](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)阐述了 Kubernetes 中的认证功能，包括许多认证选项。
- [授权](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)从认证中分离出来，用于控制如何处理 HTTP 请求
- [使用 Admission Controllers](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/) 阐述了在认证和授权之后拦截到 Kubernetes API 服务的请求的插件。
- 在 [Kubernetes Cluster 中使用 Sysctls](https://kubernetes.io/docs/tasks/administer-cluster/sysctl-cluster/) 描述了管理员如何使用 sysctl 命令行工具来设置内核参数
- [审计](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)描述了如何与 Kubernetes 的审计日志交互
### 保护 kubelet
- [Master 节点通信](https://kubernetes.io/docs/concepts/architecture/master-node-communication/)
- [TLS引导](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
- [Kubelet认证/授权](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/)
### 可选集群服务
- [DNS 与 SkyDNS](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) 集成描述了如何将一个 DNS 名解析到一个 Kubernetes service。
- [记录和监控集群活动](https://kubernetes.io/docs/concepts/cluster-administration/logging/)阐述了 Kubernetes 的日志如何工作以及怎样实现

## 证书
当使用客户端证书进行认证时，用户可以使用现有部署脚本，或者通过 easyrsa、openssl 或 cfssl 手动生成证书。
### easyrsa
使用 easyrsa 能够手动地为集群生成证书。
1.下载、解压并初始化 easyrsa3 的补丁版本。
```sh
curl -LO https://storage.googleapis.com/kubernetes-release/easy-rsa/easy-rsa.tar.gz
tar xzf easy-rsa.tar.gz
cd easy-rsa-master/easyrsa3
./easyrsa init-pki


```
1.1 生成 CA（通过 --batch 参数设置自动模式。 通过 --req-cn 设置默认使用的 CN）
```sh
./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
```
1.2 生成服务器证书和密钥。 参数 --subject-alt-name 设置了访问 API 服务器时可能使用的 IP 和 DNS 名称。 
MASTER_CLUSTER_IP 通常为 --service-cluster-ip-range 参数中指定的服务 CIDR 的 首个 IP 地址，--service-cluster-ip-range 同时用于 API 服务器和控制器管理器组件。 --days 参数用于设置证书的有效期限。 下面的示例还假设用户使用 cluster.local 作为默认的 DNS 域名。
```sh
./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
"IP:${MASTER_CLUSTER_IP},"\
"DNS:kubernetes,"\
"DNS:kubernetes.default,"\
"DNS:kubernetes.default.svc,"\
"DNS:kubernetes.default.svc.cluster,"\
"DNS:kubernetes.default.svc.cluster.local" \
--days=10000 \
build-server-full server nopass
```
1.3 拷贝 pki/ca.crt、 pki/issued/server.crt 和 pki/private/server.key 至您的目录。
<br/>
1.4 填充并在 API 服务器的启动参数中添加以下参数：
```yaml
--client-ca-file=/yourdirectory/ca.crt
--tls-cert-file=/yourdirectory/server.crt
--tls-private-key-file=/yourdirectory/server.key
```

### openssl
使用 openssl 能够手动地为集群生成证书。
<br/>
1. 生成密钥位数为 2048 的 ca.key：
```sh
openssl genrsa -out ca.key 2048
```
2. 依据 ca.key 生成 ca.crt （使用 -days 参数来设置证书有效时间）：
```sh
openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
```
3. 生成密钥位数为 2048 的 server.key：
```yaml
openssl genrsa -out server.key 2048
```
4. 创建用于生成证书签名请求（CSR）的配置文件。 确保在将其保存至文件（如 csr.conf）之前将尖括号标记的值（如 <MASTER_IP>） 替换为你想使用的真实值。 注意：MASTER_CLUSTER_IP 是前面小节中描述的 API 服务器的服务集群 IP (service cluster IP)。 下面的示例也假设用户使用 cluster.local 作为默认的 DNS 域名。
```sh
[ req ]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn

[ dn ]
C = <country>
ST = <state>
L = <city>
O = <organization>
OU = <organization unit>
CN = <MASTER_IP>

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = kubernetes
DNS.2 = kubernetes.default
DNS.3 = kubernetes.default.svc
DNS.4 = kubernetes.default.svc.cluster
DNS.5 = kubernetes.default.svc.cluster.local
IP.1 = <MASTER_IP>
IP.2 = <MASTER_CLUSTER_IP>

[ v3_ext ]
authorityKeyIdentifier=keyid,issuer:always
basicConstraints=CA:FALSE
keyUsage=keyEncipherment,dataEncipherment
extendedKeyUsage=serverAuth,clientAuth
subjectAltName=@alt_names
```
5. 基于配置文件生成证书签名请求：
```sh
openssl req -new -key server.key -out server.csr -config csr.conf
```
6. 使用 ca.key、ca.crt 和 server.csr 生成服务器证书：
```sh
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
-CAcreateserial -out server.crt -days 10000 \
-extensions v3_ext -extfile csr.conf
```
7. 查看证书
```yaml
openssl x509  -noout -text -in ./server.crt
```
最后，添加同样的参数到 API 服务器的启动参数中。
### cfssl
<b>cfssl</b> 是另一种用来生成证书的工具。
1. 按如下所示的方式下载、解压并准备命令行工具。 注意：你可能需要基于硬件架构和你所使用的 cfssl 版本对示例命令进行修改。
```sh
curl -L https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -o cfssl
chmod +x cfssl
curl -L https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -o cfssljson
chmod +x cfssljson
curl -L https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -o cfssl-certinfo
chmod +x cfssl-certinfo
```
2. 创建目录来存放物料，并初始化 cfssl：
```yaml
mkdir cert
cd cert
../cfssl print-defaults config > config.json
../cfssl print-defaults csr > csr.json
```
3.创建用来生成 CA 文件的 JSON 配置文件，例如 ca-config.json：
```json
{
  "signing": {
    "default": {
      "expiry": "8760h"
    },
    "profiles": {
      "kubernetes": {
        "usages": [
          "signing",
          "key encipherment",
          "server auth",
          "client auth"
        ],
        "expiry": "8760h"
      }
    }
  }
}
```
4. 创建用来生成 CA 证书签名请求（CSR）的 JSON 配置文件，例如 ca-csr.json。 确保将尖括号标记的值替换为你想使用的真实值。
```json
{
  "CN": "kubernetes",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names":[{
    "C": "<country>",
    "ST": "<state>",
    "L": "<city>",
    "O": "<organization>",
    "OU": "<organization unit>"
  }]
}
```
5. 生成 CA 密钥（ca-key.pem）和证书（ca.pem）：
```sh
../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
```
6. 按如下所示的方式创建用来为 API 服务器生成密钥和证书的 JSON 配置文件。 确保将尖括号标记的值替换为你想使用的真实值。 MASTER_CLUSTER_IP 是前面小节中描述的 API 服务器的服务集群 IP。 下面的示例也假设用户使用 cluster.local 作为默认的 DNS 域名。
```json
{
  "CN": "kubernetes",
  "hosts": [
    "127.0.0.1",
    "<MASTER_IP>",
    "<MASTER_CLUSTER_IP>",
    "kubernetes",
    "kubernetes.default",
    "kubernetes.default.svc",
    "kubernetes.default.svc.cluster",
    "kubernetes.default.svc.cluster.local"
  ],
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [{
    "C": "<country>",
    "ST": "<state>",
    "L": "<city>",
    "O": "<organization>",
    "OU": "<organization unit>"
  }]
}
```
7. 为 API 服务器生成密钥和证书，生成的秘钥和证书分别默认保存在文件 server-key.pem 和 server.pem 中：
```yaml
../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
--config=ca-config.json -profile=kubernetes \
server-csr.json | ../cfssljson -bare server
```
### 分发自签名 CA 证书
客户端节点可能拒绝承认自签名 CA 证书有效。 对于非生产环境的部署，或运行在企业防火墙后的部署，用户可以向所有客户端分发自签名 CA 证书， 并刷新本地的有效证书列表。
<br/>
在每个客户端上执行以下操作：
```sh
sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
sudo update-ca-certificates

执行结果：
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```
### 证书 API
您可以按照[这里](https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/)记录的方式， 使用 certificates.k8s.io API 来准备 x509 证书，用于认证。

## 管理资源
您已经部署了应用并通过服务暴露它。然后呢？Kubernetes 提供了一些工具来帮助管理您的应用部署，包括缩扩容和更新。
我们将更深入讨论的特性包括[配置文件](https://kubernetes.io/docs/concepts/configuration/overview/)和[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)。
### 组织资源配置
许多应用需要创建多个资源，例如 Deployment 和 Service。可以通过将多个资源组合在同一个文件中（在 YAML 中以 --- 分隔）来简化对它们的管理。例如：
<br/>
nginx-app.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx-svc
  labels:
    app: nginx
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```
可以用创建单个资源相同的方式来创建多个资源：
```yaml
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
运行结果：
service/my-nginx-svc created
deployment.apps/my-nginx created
```
资源将按照它们在文件中的顺序创建。因此，最好先指定服务，这样在控制器（例如 Deployment）创建 Pod 时能够确保调度器可以将与服务关联的多个 Pod 分散到不同节点。
<br/>
kubectl create 也接受多个 -f 参数:
```sh
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```
还可以指定目录路径，而不用添加多个单独的文件：
```sh
kubectl apply -f https://k8s.io/examples/application/nginx/
```
kubectl 将读取任何后缀为 .yaml，.yml 或者 .json 的文件。
<br/>
建议的做法是，将同一个微服务或同一应用层相关的资源放到同一个文件中，将同一个应用相关的所有文件按组存放到同一个目录中。如果应用的各层使用 DNS 相互绑定，那么您可以简单地将堆栈的所有组件一起部署。
<br/>
还可以使用 URL 作为配置源，便于直接使用已经提交到 Github 上的配置文件进行部署：
<br/>
```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/zh/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx created
```
### kubectl 中的批量操作
资源创建并不是 kubectl 可以批量执行的唯一操作。kubectl 还可以从配置文件中提取资源名，以便执行其他操作，特别是删除您之前创建的资源：
```yaml
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
返回结果：
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```
在仅有两种资源的情况下，可以使用”资源类型/资源名”的语法在命令行中同时指定这两个资源：
```sh
kubectl delete deployments/my-nginx services/my-nginx-svc
```
对于资源数目较大的情况，您会发现使用 -l 或 --selector 指定的筛选器（标签查询）能很容易根据标签筛选资源：
```sh
kubectl delete deployment,services -l app=nginx
返回结果
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```
由于 kubectl 用来输出资源名称的语法与其所接受的资源名称语法相同，所以很容易使用 $() 或 xargs 进行链式操作：
```yaml
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
输出结果：
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```
上面的命令中，我们首先使用 examples/application/nginx/ 下的配置文件创建资源，并使用 -o name 的输出格式（以”资源/名称”的形式打印每个资源）打印所创建的资源。然后，我们通过 grep 来过滤 “service”，最后再打印 kubectl get 的内容。
<br/>
如果您碰巧在某个路径下的多个子路径中组织资源，那么也可以递归地在所有子路径上执行操作，方法是在 --filename,-f 后面指定 --recursive 或者 -R。
<br/>
例如，假设有一个目录路径为 project/k8s/development，它保存开发环境所需的所有清单，并按资源类型组织：
```yaml
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```
默认情况下，对 project/k8s/development 执行的批量操作将停止在目录的第一级，而不是处理所有子目录。 如果我们试图使用以下命令在此目录中创建资源，则会遇到一个错误：
```sh
kubectl apply -f project/k8s/development
返回错误信息
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```
然而，在 --filename,-f 后面标明 --recursive 或者 -R 之后：
```yaml
kubectl apply -f project/k8s/development --recursive
返回结果：
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```
:::tip 说明
--recursive 可以用于接受 --filename,-f 参数的任何操作，例如：kubectl {create,get,delete,describe,rollout} 等。
:::
有多个 -f 参数出现的时候，--recursive 参数也能正常工作：
```yaml
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
返回结果：
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```
如果您有兴趣学习更多关于 kubectl 的内容，请阅读 [kubectl 概述](https://kubernetes.io/docs/reference/kubectl/overview/)。
### 有效地使用标签
到目前为止我们使用的示例中的资源最多使用了一个标签。在许多情况下，应使用多个标签来区分集合。
<br/>
例如，不同的应用可能会为 app 标签设置不同的值。 但是，类似 guestbook 示例 这样的多层应用，还需要区分每一层。前端可以带以下标签：
```yaml
labels:
  app: guestbook
  tier: frontend
```
Redis 的主节点和从节点会有不同的 tier 标签，甚至还有一个额外的 role 标签：
```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```
以及
```yaml
labels:
  app: guestbook
  tier: backend
  role: slave
```
标签允许我们按照标签指定的任何维度对我们的资源进行切片和切块：
```yaml
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
显示的标签结果(添加字段的查询),在表头添加APP、tier、role
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>

标签做过滤条件
kubectl get pods -lapp=guestbook,role=slave
返回结果：过滤标签的=guestbook && slave
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```
### 金丝雀部署
另一个需要多标签的场景是用来区分同一组件的不同版本或者不同配置的多个部署。常见的做法是部署一个使用*金丝雀发布*来部署新应用版本（在 pod 模板中通过镜像标签指定），保持新旧版本应用同时运行，这样，新版本在完全发布之前也可以接收实时的生产流量。
<br/>
例如，您可以使用 track 标签来区分不同的版本。
<br/>
主要稳定的发行版将有一个 track 标签，其值为 stable：
```yaml
name: frontend
replicas: 3
...
labels:
app: guestbook
tier: frontend
track: stable
...
image: gb-frontend:v3
```
然后，您可以创建 guestbook 前端的新版本，让这些版本的 track 标签带有不同的值（即 canary），以便两组 pod 不会重叠：
```yaml
name: frontend-canary
replicas: 1
...
labels:
   app: guestbook
   tier: frontend
   track: canary
...
image: gb-frontend:v4
```
前端服务通过选择标签的公共子集（即忽略 track 标签）来覆盖两组副本，以便流量可以转发到两个应用：
```yaml
  selector:
     app: guestbook
     tier: frontend
```
您可以调整 stable 和 canary 版本的副本数量，以确定每个版本将接收实时生产流量的比例(在本例中为 3:1)。一旦有信心，您就可以将新版本应用的 track 标签的值从 canary 替换为 stable，并且将老版本应用删除。

想要了解更具体的示例，请查看 [Ghost 部署教程](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary)。
### 更新标签
有时，现有的 pod 和其它资源需要在创建新资源之前重新标记。这可以用 kubectl label 完成。 例如，如果想要将所有 nginx pod 标记为前端层，只需运行
```sh
kubectl label pods -l app=nginx tier=fe
返回结果：
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```
:::tip 说明
kubectl label pods -l app=nginx tier=fe 命令说明：
<br/>
首先用标签 “app=nginx” 过滤所有的 pod，然后用 “tier=fe” 标记它们。想要查看您刚才标记的 pod，请运行：
```sh
kubectl get pods -l app=nginx -L tier
可以看到标签tier已经被修改为了fe
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```
这将输出所有 “app=nginx” 的 pod，并有一个额外的描述 pod 的 tier 的标签列（用参数 -L 或者 --label-columns 标明）。
<br/>
想要了解更多信息，请参考 [标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) 和 [kubectl label](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#label)。
:::

### 更新注解
有时，您可能希望将注解附加到资源中。注解是 API 客户端（如工具、库等）用于检索的任意非标识元数据。这可以通过 kubectl annotate 来完成。例如
```sh
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```
查看对应的ymal配置文件的注解已经修改为我们命令给的了
```yaml
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```
想要了解更多信息，请参考 [注解](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) 和 [kubectl annotate](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#annotate) 文档。
### 缩扩您的应用
当应用上的负载增长或收缩时，使用 kubectl 能够轻松实现规模的缩扩。例如，要将 nginx 副本的数量从 3 减少到 1，请执行以下操作：
```yaml
kubectl scale deployment/my-nginx --replicas=1
deployment.extensions/my-nginx scaled
```
现在，您的 deployment 管理的 pod 只有一个了。
```sh
kubectl get pods -l app=nginx

可以看到只有一个pod在运行：
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```
想要让系统自动选择需要 nginx 副本的数量，范围从 1 到 3，请执行以下操作：
```sh
kubectl autoscale deployment/my-nginx --min=1 --max=3
输出如下：
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```
现在，您的 nginx 副本将根据需要自动地增加或者减少。

想要了解更多信息，请参考 [kubectl scale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale), [kubectl autoscale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale) 和 [pod 水平自动伸缩](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) 文档。
### 就地更新资源
有时，有必要对您所创建的资源进行小范围、无干扰地更新。
#### kubectl apply
建议在源代码管理中维护一组配置文件（参见[配置即代码](https://martinfowler.com/bliki/InfrastructureAsCode.html)），这样，它们就可以和应用代码一样进行维护和版本管理。然后，您可以用 [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) 将配置变更应用到集群中。
<br/>
这个命令将会把推送的版本与以前的版本进行比较，并应用您所做的更改，但是不会自动覆盖任何你没有指定更改的属性。
```yaml
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
返回结果：
deployment.apps/my-nginx configured
```
注意，kubectl apply 将为资源增加一个额外的注解，以确定自上次调用以来对配置的更改。当调用它时，kubectl apply 会在以前的配置、提供的输入和资源的当前配置之间找出三方差异，以确定如何修改资源。
<br/>
目前，新创建的资源是没有这个注解的，所以，第一次调用 kubectl apply 将使用提供的输入和资源的当前配置双方之间差异进行比较。在第一次调用期间，它无法检测资源创建时属性集的删除情况。因此，不会删除它们。
<br/>
所有后续调用 kubectl apply 以及其它修改配置的命令，如 kubectl replace 和 kubectl edit，都将更新注解，并允许随后调用的 kubectl apply 使用三方差异进行检查和执行删除。
:::tip 注意
想要使用 apply，请始终使用 kubectl apply 或 kubectl create --save-config 创建资源。
:::
#### kubectl edit
或者，您也可以使用 kubectl edit 更新资源：
```sh
kubectl edit deployment/my-nginx
```
这相当于首先 get 资源，在文本编辑器中编辑它，然后用更新的版本 apply 资源：
```sh
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```
这使您可以更加容易地进行更重大的更改。请注意，可以使用 EDITOR 或 KUBE_EDITOR 环境变量来指定编辑器。
<br/>
想要了解更多信息，请参考 [kubectl edit](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#edit) 文档。

#### kubectl patch
您可以使用 kubectl patch 来更新 API 对象。此命令支持 JSON patch，JSON merge patch，以及 strategic merge patch。 
请参考 [使用 kubectl patch 更新 API 对象](https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/) 和 [kubectl patch](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#patch)
#### 破坏性的更新
在某些情况下，您可能需要更新某些初始化后无法更新的资源字段，或者您可能只想立即进行递归更改，例如修复 Deployment 创建的不正常的 Pod。若要更改这些字段，请使用 replace --force，它将删除并重新创建资源。在这种情况下，您可以简单地修改原始配置文件：
```sh
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
输入结果：
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```
#### 在不中断服务的情况下更新应用
在某些时候，您最终需要更新已部署的应用，通常都是通过指定新的镜像或镜像标签，如上面的金丝雀发布的场景中所示。kubectl 支持几种更新操作，每种更新操作都适用于不同的场景。
<br/>
我们将指导您通过 Deployment 如何创建和更新应用。
<br/>
假设您正运行的是 1.7.9 版本的 nginx：
<br/>
```sh
kubectl run my-nginx --image=nginx:1.7.9 --replicas=3
输入结果：
deployment.apps/my-nginx created
```
要更新到 1.9.1 版本，只需使用我们前面学到的 kubectl 命令将 .spec.template.spec.containers[0].image 从 nginx:1.7.9 修改为 nginx:1.9.1。
```sh
kubectl edit deployment/my-nginx
```
没错，就是这样！Deployment 将在后台逐步更新已经部署的 nginx 应用。
它确保在更新过程中，只有一定数量的旧副本被开闭，并且只有一定基于所需 pod 数量的新副本被创建。
想要了解更多细节，请参考 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)。

## Cluster Networking
Networking is a central part of Kubernetes, but it can be challenging to understand exactly how it is expected to work. There are 4 distinct networking problems to address:
<br/>
1.Highly-coupled container-to-container communications: this is solved by pods and localhost communications.
<br/>
2.Pod-to-Pod communications: this is the primary focus of this document.
<br/>
3.Pod-to-Service communications: this is covered by services.
<br/>
4.External-to-Service communications: this is covered by services.
<br/>
Kubernetes is all about sharing machines between applications. Typically, sharing machines requires ensuring that two applications do not try to use the same ports. Coordinating ports across multiple developers is very difficult to do at scale and exposes users to cluster-level issues outside of their control.
<br/>
Dynamic port allocation brings a lot of complications to the system - every application has to take ports as flags, the API servers have to know how to insert dynamic port numbers into configuration blocks, services have to know how to find each other, etc. Rather than deal with this, Kubernetes takes a different approach

### The Kubernetes network model
Every Pod gets its own IP address. This means you do not need to explicitly create links between Pods and you almost never need to deal with mapping container ports to host ports. This creates a clean, backwards-compatible model where Pods can be treated much like VMs or physical hosts from the perspectives of port allocation, naming, service discovery, load balancing, application configuration, and migration.
<br/>
Kubernetes imposes the following fundamental requirements on any networking implementation (barring any intentional network segmentation policies):

- pods on a node can communicate with all pods on all nodes without NAT
- agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node

Note: For those platforms that support Pods running in the host network (e.g. Linux):
- pods in the host network of a node can communicate with all pods on all nodes without NAT

This model is not only less complex overall, but it is principally compatible with the desire for Kubernetes to enable low-friction porting of apps from VMs to containers. If your job previously ran in a VM, your VM had an IP and could talk to other VMs in your project. This is the same basic model.
<br/>
Kubernetes IP addresses exist at the Pod scope - containers within a Pod share their network namespaces - including their IP address. This means that containers within a Pod can all reach each other’s ports on localhost. This also means that containers within a Pod must coordinate port usage, but this is no different from processes in a VM. This is called the “IP-per-pod” model.
<br/>
How this is implemented is a detail of the particular container runtime in use.

It is possible to request ports on the Node itself which forward to your Pod (called host ports), but this is a very niche operation. How that forwarding is implemented is also a detail of the container runtime. The Pod itself is blind to the existence or non-existence of host ports.
<br/>
### How to implement the Kubernetes networking model
There are a number of ways that this network model can be implemented. This document is not an exhaustive study of the various methods, but hopefully serves as an introduction to various technologies and serves as a jumping-off point.
<br/>
The following networking options are sorted alphabetically - the order does not imply any preferential status

### ACI
[Cisco Application Centric Infrastructure](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html) offers an integrated overlay and underlay SDN solution that supports containers, virtual machines, and bare metal servers.
 ACI provides container networking integration for ACI. An overview of the integration is provided [here](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).
### AOS from Apstra
[AOS](http://www.apstra.com/products/aos/) is an Intent-Based Networking system that creates and manages complex datacenter environments from a simple integrated platform. AOS leverages a highly scalable distributed design to eliminate network outages while minimizing costs.

The AOS Reference Design currently supports Layer-3 connected hosts that eliminate legacy Layer-2 switching problems. These Layer-3 hosts can be Linux servers (Debian, Ubuntu, CentOS) that create BGP neighbor relationships directly with the top of rack switches (TORs). AOS automates the routing adjacencies and then provides fine grained control over the route health injections (RHI) that are common in a Kubernetes deployment.

AOS has a rich set of REST API endpoints that enable Kubernetes to quickly change the network policy based on application requirements. Further enhancements will integrate the AOS Graph model used for the network design with the workload provisioning, enabling an end to end management system for both private and public clouds.

AOS supports the use of common vendor equipment from manufacturers including Cisco, Arista, Dell, Mellanox, HPE, and a large number of white-box systems and open network operating systems like Microsoft SONiC, Dell OPX, and Cumulus Linux.

Details on how the AOS system works can be accessed [here](http://www.apstra.com/products/how-it-works/)

### AWS VPC CNI for Kubernetes
The [AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s) offers integrated AWS Virtual Private Cloud (VPC) networking for Kubernetes clusters. This CNI plugin offers high throughput and availability, low latency, and minimal network jitter. Additionally, users can apply existing AWS VPC networking and security best practices for building Kubernetes clusters. This includes the ability to use VPC flow logs, VPC routing policies, and security groups for network traffic isolation.
<br/>
Using this CNI plugin allows Kubernetes pods to have the same IP address inside the pod as they do on the VPC network. The CNI allocates AWS Elastic Networking Interfaces (ENIs) to each Kubernetes node and using the secondary IP range from each ENI for pods on the node. The CNI includes controls for pre-allocation of ENIs and IP addresses for fast pod startup times and enables large clusters of up to 2,000 nodes.
<br/>
Additionally, the CNI can be run alongside [Calico for network policy enforcement](https://docs.aws.amazon.com/eks/latest/userguide/calico.html). 
The AWS VPC CNI project is open source with [documentation on GitHub](https://github.com/aws/amazon-vpc-cni-k8s).
### Big Cloud Fabric from Big Switch Networks
[Big Cloud Fabric](https://www.bigswitch.com/container-network-automation) is a cloud native networking architecture, designed to run Kubernetes in private cloud/on-premises environments. Using unified physical & virtual SDN, Big Cloud Fabric tackles inherent container networking problems such as load balancing, visibility, troubleshooting, security policies & container traffic monitoring.
<br>
With the help of the Big Cloud Fabric’s virtual pod multi-tenant architecture, container orchestration systems such as Kubernetes, RedHat OpenShift, Mesosphere DC/OS & Docker Swarm will be natively integrated alongside with VM orchestration systems such as VMware, OpenStack & Nutanix. Customers will be able to securely inter-connect any number of these clusters and enable inter-tenant communication between them if needed.
<br/>
BCF was recognized by Gartner as a visionary in the latest [Magic Quadrant](http://go.bigswitch.com/17GatedDocuments-MagicQuadrantforDataCenterNetworking_Reg.html). 
One of the BCF Kubernetes on-premises deployments (which includes Kubernetes, DC/OS & VMware running on multiple DCs across different geographic regions) is also referenced [here](https://portworx.com/architects-corner-kubernetes-satya-komala-nio/).

### Cilium
[Cilium](https://github.com/cilium/cilium) is open source software for providing and transparently securing network connectivity between application containers. Cilium is L7/HTTP aware and can enforce network policies on L3-L7 using an identity based security model that is decoupled from network addressing

### CNI-Genie from Huawei
[CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) is a CNI plugin that enables Kubernetes to [simultaneously have access to different implementations](https://github.com/huawei-cloudnative/CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables) of the [Kubernetes network model](https://git.k8s.io/website/docs/concepts/cluster-administration/networking.md#kubernetes-model) in runtime. 
This includes any implementation that runs as a [CNI plugin](https://github.com/containernetworking/cni#3rd-party-plugins), 
such as [Flannel](https://github.com/coreos/flannel#flannel), [Calico](https://docs.projectcalico.org/), [Romana](http://romana.io/), [Weave-net](https://www.weave.works/products/weave-net/).
<br/>
CNI-Genie also supports [assigning multiple IP addresses to a pod](https://github.com/huawei-cloudnative/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-addresses-per-pod), each from a different CNI plugin.

### cni-ipvlan-vpc-k8s
[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s) contains a set of CNI and IPAM plugins to provide a simple, host-local, low latency, high throughput, and compliant networking stack for Kubernetes within Amazon Virtual Private Cloud (VPC) environments by making use of Amazon Elastic Network Interfaces (ENI) and binding AWS-managed IPs into Pods using the Linux kernel’s IPvlan driver in L2 mode.
 <br/>
 The plugins are designed to be straightforward to configure and deploy within a VPC. Kubelets boot and then self-configure and scale their IP usage as needed without requiring the often recommended complexities of administering overlay networks, BGP, disabling source/destination checks, or adjusting VPC route tables to provide per-instance subnets to each host (which is limited to 50-100 entries per VPC). In short, cni-ipvlan-vpc-k8s significantly reduces the network complexity required to deploy Kubernetes at scale within AWS

### Contiv
[Contiv](https://github.com/contiv/netplugin) provides configurable networking (native l3 using BGP, overlay using vxlan, classic l2, or Cisco-SDN/ACI) for various use cases. [Contiv](http://contiv.io/) is all open sourced.

### Contrail / Tungsten Fabric
[Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), based on [Tungsten Fabric](https://tungsten.io/), is a truly open, multi-cloud network virtualization and policy management platform.
 Contrail and Tungsten Fabric are integrated with various orchestration systems such as Kubernetes, OpenShift, OpenStack and Mesos, 
 and provide different isolation modes for virtual machines, containers/pods and bare metal workloads

### DANM
[DANM](https://github.com/nokia/danm) is a networking solution for telco workloads running in a Kubernetes cluster. It’s built up from the following components:
- A CNI plugin capable of provisioning IPVLAN interfaces with advanced features
- An in-built IPAM module with the capability of managing multiple, cluster-wide, discontinuous L3 networks and provide a dynamic, static, or no IP allocation scheme on-demand
- A CNI metaplugin capable of attaching multiple network interfaces to a container, either through its own CNI, or through delegating the job to any of the popular CNI solution like SRI-OV, or Flannel in parallel
- A Kubernetes controller capable of centrally managing both VxLAN and VLAN interfaces of all Kubernetes hosts
- Another Kubernetes controller extending Kubernetes’ Service-based service discovery concept to work over all network interfaces of a Pod
With this toolset DANM is able to provide multiple separated network interfaces, the possibility to use different networking back ends and advanced IPAM features for the pods

### Flannel
[Flannel](https://github.com/coreos/flannel#flannel) is a very simple overlay network that satisfies the Kubernetes requirements. Many people have reported success with Flannel and Kubernetes.
### Google Compute Engine (GCE)
For the Google Compute Engine cluster configuration scripts,
 [advanced routing](https://cloud.google.com/vpc/docs/routes) is used to assign each VM a subnet (default is /24 - 254 IPs). 
 Any traffic bound for that subnet will be routed directly to the VM by the GCE network fabric. 
 This is in addition to the “main” IP address assigned to the VM, which is NAT’ed for outbound internet access. A linux bridge (called cbr0) is configured to exist on that subnet, and is passed to docker’s --bridge flag.
<br/>
Docker is started with:
```sh
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```
This bridge is created by Kubelet (controlled by the --network-plugin=kubenet flag) according to the Node’s .spec.podCIDR.
<br/>
Docker will now allocate IPs from the cbr-cidr block. Containers can reach each other and Nodes over the cbr0 bridge. Those IPs are all routable within the GCE project network.
<br/>
GCE itself does not know anything about these IPs, though, so it will not NAT them for outbound internet traffic. To achieve that an iptables rule is used to masquerade (aka SNAT - to make it seem as if packets came from the Node itself) traffic that is bound for IPs outside the GCE project network (10.0.0.0/8).
<br/>
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
Lastly IP forwarding is enabled in the kernel (so the kernel will process packets for bridged containers):
<br/>
sysctl net.ipv4.ip_forward=1
The result of all this is that all Pods can reach each other and can egress traffic to the internet
<br/>
### Jaguar
[Jaguar](https://gitlab.com/sdnlab/jaguar) is an open source solution for Kubernetes’s network based on OpenDaylight. Jaguar provides overlay network using vxlan and Jaguar CNIPlugin provides one IP address per pod
### k-vswitch
[k-vswitch](https://github.com/k-vswitch/k-vswitch) is a simple Kubernetes networking plugin based on [Open vSwitch](https://www.openvswitch.org/). It leverages existing functionality in Open vSwitch to provide a robust networking plugin that is easy-to-operate, performant and secure
### Knitter
[Knitter](https://github.com/ZTE/Knitter/) is a network solution which supports multiple networking in Kubernetes. It provides the ability of tenant management and network management. Knitter includes a set of end-to-end NFV container networking solutions besides multiple network planes, such as keeping IP address for applications, IP address migration, etc
### Kube-OVN
[Kube-OVN](https://github.com/alauda/kube-ovn) is an OVN-based kubernetes network fabric for enterprises. With the help of OVN/OVS, it provides some advanced overlay network features like subnet, QoS, static IP allocation, traffic mirroring, gateway, openflow-based network policy and service proxy.
### Kube-router
[Kube-router](https://github.com/cloudnativelabs/kube-router) is a purpose-built networking solution for Kubernetes that aims to provide high performance and operational simplicity.
 Kube-router provides a Linux [LVS/IPVS-based](http://www.linuxvirtualserver.org/software/ipvs.html) service proxy, a Linux kernel forwarding-based pod-to-pod networking solution with no overlays, and iptables/ipset-based network policy enforcer
### L2 networks and linux bridging
If you have a “dumb” L2 network, such as a simple switch in a “bare-metal” environment, 
you should be able to do something similar to the above GCE setup. 
Note that these instructions have only been tried very casually - it seems to work, but has not been thoroughly tested. 
If you use this technique and perfect the process, please let us know.
<br/>
Follow the “With Linux Bridge devices” section of [this very nice tutorial](https://blog.oddbit.com/post/2014-08-11-four-ways-to-connect-a-docker/) from Lars Kellogg-Stedman
### Multus (a Multi Network plugin)
[Multus](https://github.com/Intel-Corp/multus-cni) is a Multi CNI plugin to support the Multi Networking feature in Kubernetes using CRD based network objects in Kubernetes.
<br/>
Multus supports all [reference plugins](https://github.com/containernetworking/plugins) (eg. Flannel, DHCP, Macvlan) that implement the CNI specification and 3rd party plugins (eg. Calico, Weave, Cilium, Contiv). In addition to it, Multus supports SRIOV, DPDK, OVS-DPDK & VPP workloads in Kubernetes with both cloud native and NFV based applications in Kubernetes

### NSX-T
[VMware NSX-T](https://docs.vmware.com/cn/VMware-NSX-T-Data-Center/index.html) is a network virtualization and security platform. NSX-T can provide network virtualization for a multi-cloud and multi-hypervisor environment and is focused on emerging application frameworks and architectures that have heterogeneous endpoints and technology stacks. In addition to vSphere hypervisors, these environments include other hypervisors such as KVM, containers, and bare metal.

[NSX-T Container Plug-in (NCP)](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/2.0/nsxt_20_ncp_kubernetes.pdf) provides integration between NSX-T and container orchestrators such as Kubernetes, as well as integration between NSX-T and container-based CaaS/PaaS platforms such as Pivotal Container Service (PKS) and OpenShift.

### Project Calico
[Project Calico](https://docs.projectcalico.org/) is an open source container networking provider and network policy engine.
<br/>
Calico provides a highly scalable networking and network policy solution for connecting Kubernetes pods based on the same IP networking principles as the internet, for both Linux (open source) and Windows (proprietary - available from [Tigera](https://www.tigera.io/essentials/)). 
Calico can be deployed without encapsulation or overlays to provide high-performance, high-scale data center networking. Calico also provides fine-grained, intent based network security policy for Kubernetes pods via its distributed firewall.
<br/>
Calico can also be run in policy enforcement mode in conjunction with other networking solutions such as Flannel, aka canal, or native GCE, AWS or Azure networking.

# 日志架构
应用和系统日志可以让您了解集群内部的运行状况。日志对调试问题和监控集群活动非常有用。大部分现代化应用都有某种日志记录机制；同样地，大多数容器引擎也被设计成支持某种日志记录机制。针对容器化应用，最简单且受欢迎的日志记录方式就是写入标准输出和标准错误流。
<br/>
但是，由容器引擎或 runtime 提供的原生功能通常不足以满足完整的日志记录方案。例如，如果发生容器崩溃、pod 被逐出或节点宕机等情况，您仍然想访问到应用日志。因此，日志应该具有独立的存储和生命周期，与节点、pod 或容器的生命周期相独立。这个概念叫 集群级的日志 。集群级日志方案需要一个独立的后台来存储、分析和查询日志。Kubernetes 没有为日志数据提供原生存储方案，但是您可以集成许多现有的日志解决方案到 Kubernetes 集群中。
<br/>
集群级日志架构假定在集群内部或者外部有一个日志后台。如果您对集群级日志不感兴趣，您仍会发现关于如何在节点上存储和处理日志的描述对您是有用的

## Kubernetes 中的基本日志记录
本节，您会看到一个kubernetes 中生成基本日志的例子，该例子中数据被写入到标准输出。 这里通过一个特定的 pod 规约 演示创建一个容器，并令该容器每秒钟向标准输出写入数据。
<br/>
counter-pod.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counter
spec:
  containers:
  - name: count
    image: busybox
    args: [/bin/sh, -c,
            'i=0; while true; do echo "$i: $(date)"; i=$((i+1)); sleep 1; done']
```
用下面的命令运行 pod：
```sh
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
输出结果为：

pod/counter created
```
使用 kubectl logs 命令获取日志:
```sh
kubectl logs counter
输出结果为：

0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```
一旦发生容器崩溃，您可以使用命令 kubectl logs 和参数 --previous 检索之前的容器日志。 
如果 pod 中有多个容器，您应该向该命令附加一个容器名以访问对应容器的日志。 详见 [kubectl logs 文档](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)
## 节点级日志记录
![](/images/gainian/logging-node-level.png)
容器化应用写入 stdout 和 stderr 的任何数据，都会被容器引擎捕获并被重定向到某个位置。 例如，Docker 容器引擎将这两个输出流重定向到某个 [日志驱动](https://docs.docker.com/engine/admin/logging/overview) ， 该日志驱动在 Kubernetes 中配置为以 json 格式写入文件。
:::tip 注意
Docker json 日志驱动将日志的每一行当作一条独立的消息。该日志驱动不直接支持多行消息。您需要在日志代理级别或更高级别处理多行消息。
:::
默认情况下，如果容器重启，kubelet 会保留被终止的容器日志。 如果 pod 在工作节点被驱逐，该 pod 中所有的容器也会被驱逐，包括容器日志。
<br/>
节点级日志记录中，需要重点考虑实现日志的轮转，以此来保证日志不会消耗节点上所有的可用空间。
 Kubernetes 当前并不负责轮转日志，而是通过部署工具建立一个解决问题的方案。 
 例如，在 Kubernetes 集群中，用 kube-up.sh 部署一个每小时运行的工具 [logrotate](https://linux.die.net/man/8/logrotate)。 您也可以设置容器 runtime 来自动地轮转应用日志，比如使用 Docker 的 log-opt 选项。 在 kube-up.sh 脚本中，使用后一种方式来处理 GCP 上的 COS 镜像，而使用前一种方式来处理其他环境。 这两种方式，默认日志超过 10MB 大小时都会触发日志轮转。
<br/>
例如，您可以找到关于 kube-up.sh 为 GCP 环境的 COS 镜像设置日志的详细信息， 相应的脚本在 [这里](/images/file/configure-helper.sh)。
<br/>
当运行 [kubectl logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs) 时， 节点上的 kubelet 处理该请求并直接读取日志文件，同时在响应中返回日志文件内容。

:::tip 注意
当前，如果有其他系统机制执行日志轮转，那么 kubectl logs 仅可查询到最新的日志内容。 比如，一个 10MB 大小的文件，通过logrotate 执行轮转后生成两个文件，一个 10MB 大小，一个为空，所以 kubectl logs 将返回空。
:::
## 系统组件日志
系统组件有两种类型：在容器中运行的和不在容器中运行的。例如：
<br/>
- 在容器中运行的 kube-scheduler 和 kube-proxy。
- 不在容器中运行的 kubelet 和容器运行时（例如 Docker。
在使用 systemd 机制的服务器上，kubelet 和容器 runtime 写入日志到 journald。 如果没有 systemd，他们写入日志到 /var/log 目录的 .log 文件。
 容器中的系统组件通常将日志写到 /var/log 目录，绕过了默认的日志机制。他们使用 [klog](https://github.com/kubernetes/klog) 日志库。 您可以在[日志开发文档](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)找到这些组件的日志告警级别协议。

和容器日志类似，/var/log 目录中的系统组件日志也应该被轮转。 通过脚本 kube-up.sh 启动的 Kubernetes 集群中，日志被工具 logrotate 执行每日轮转，或者日志大小超过 100MB 时触发轮转。

## 集群级日志架构
虽然Kubernetes没有为集群级日志记录提供原生的解决方案，但您可以考虑几种常见的方法。以下是一些选项：

- 使用在每个节点上运行的节点级日志记录代理。
- 在应用程序的 pod 中，包含专门记录日志的 sidecar 容器。
- 将日志直接从应用程序中推送到日志记录后端。
## 使用节点级日志代理
![](/images/gainian/logging-with-node-agent.png)
您可以通过在每个节点上使用 节点级的日志记录代理 来实现群集级日志记录。日志记录代理是一种用于暴露日志或将日志推送到后端的专用工具。通常，日志记录代理程序是一个容器，它可以访问包含该节点上所有应用程序容器的日志文件的目录。
<br/>
由于日志记录代理必须在每个节点上运行，它可以用 DaemonSet 副本，Pod 或 本机进程来实现。然而，后两种方法被弃用并且非常不别推荐。
<br/>
对于 Kubernetes 集群来说，使用节点级的日志代理是最常用和被推荐的方式，因为在每个节点上仅创建一个代理，并且不需要对节点上的应用做修改。 但是，节点级的日志 _仅适用于应用程序的标准输出和标准错误输出_。
<br/>
Kubernetes 并不指定日志代理，但是有两个可选的日志代理与 Kubernetes 发行版一起发布。
 [Stackdriver](https://kubernetes.io/docs/tasks/debug-application-cluster/logging-stackdriver/) 日志 适用于 Google Cloud Platform，和 [Elasticsearch](https://kubernetes.io/docs/tasks/debug-application-cluster/logging-elasticsearch-kibana/)。 您可以在专门的文档中找到更多的信息和说明。两者都使用 [fluentd](http://www.fluentd.org/) 与自定义配置作为节点上的代理。

## 使用 sidecar 容器和日志代理
您可以通过以下方式之一使用 sidecar 容器：

- sidecar 容器将应用程序日志传送到自己的标准输出。
- sidecar 容器运行一个日志代理，配置该日志代理以便从应用容器收集日志
### 传输数据流的 sidecar 容器
利用 sidecar 容器向自己的 stdout 和 stderr 传输流的方式，您就可以利用每个节点上的 kubelet 和日志代理来处理日志。 sidecar 容器从文件，socket 或 journald 读取日志。每个 sidecar 容器打印其自己的 stdout 和 stderr 流。
<br/>
这种方法允许您将日志流从应用程序的不同部分分离开，其中一些可能缺乏对写入 stdout 或 stderr 的支持。重定向日志背后的逻辑是最小的，因此它的开销几乎可以忽略不计。 另外，因为 stdout、stderr 由 kubelet 处理，你可以使用内置的工具 kubectl logs。
<br/>
考虑接下来的例子。pod 的容器向两个文件写不同格式的日志，下面是这个 pod 的配置文件:
<br/>
admin/logging/two-files-counter-pod.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counter
spec:
  containers:
  - name: count
    image: busybox
    args:
    - /bin/sh
    - -c
    - >
      i=0;
      while true;
      do
        echo "$i: $(date)" >> /var/log/1.log;
        echo "$(date) INFO $i" >> /var/log/2.log;
        i=$((i+1));
        sleep 1;
      done
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  volumes:
  - name: varlog
    emptyDir: {}
```
在同一个日志流中有两种不同格式的日志条目，这有点混乱，即使您试图重定向它们到容器的 stdout 流。 取而代之的是，您可以引入两个 sidecar 容器。 每一个 sidecar 容器可以从共享卷跟踪特定的日志文件，并重定向文件内容到各自的 stdout 流。
<br/>
这是运行两个 sidecar 容器的 pod 文件。
<br/>
admin/logging/two-files-counter-pod-streaming-sidecar.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counter
spec:
  containers:
  - name: count
    image: busybox
    args:
    - /bin/sh
    - -c
    - >
      i=0;
      while true;
      do
        echo "$i: $(date)" >> /var/log/1.log;
        echo "$(date) INFO $i" >> /var/log/2.log;
        i=$((i+1));
        sleep 1;
      done
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  - name: count-log-1
    image: busybox
    args: [/bin/sh, -c, 'tail -n+1 -f /var/log/1.log']
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  - name: count-log-2
    image: busybox
    args: [/bin/sh, -c, 'tail -n+1 -f /var/log/2.log']
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  volumes:
  - name: varlog
    emptyDir: {}
```
现在当您运行这个 pod 时，您可以分别地访问每一个日志流，运行如下命令：
```sh
kubectl logs counter count-log-1

显示结果：
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001

kubectl logs counter count-log-2

显示结果：
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
...
```
集群中安装的节点级代理会自动获取这些日志流，而无需进一步配置。如果您愿意，您可以配置代理程序来解析源容器的日志行。
<br/>
注意，尽管 CPU 和内存使用率都很低（以多个 cpu millicores 指标排序或者按内存的兆字节排序）， 向文件写日志然后输出到 stdout 流仍然会成倍地增加磁盘使用率。 如果您的应用向单一文件写日志，通常最好设置 /dev/stdout 作为目标路径，而不是使用流式的 sidecar 容器方式。
<br/>
应用本身如果不具备轮转日志文件的功能，可以通过 sidecar 容器实现。 该方式的 [例子](https://github.com/samsung-cnct/logrotate) 是运行一个定期轮转日志的容器。
 然而，还是推荐直接使用 stdout 和 stderr，将日志的轮转和保留策略交给 kubelet。
### 具有日志代理功能的 sidecar 容器
![](/images/gainian/logging-with-sidecar-agent.png)
如果节点级日志记录代理程序对于你的场景来说不够灵活，您可以创建一个带有单独日志记录代理程序的 sidecar 容器，将代理程序专门配置为与您的应用程序一起运行。
:::tip 注意
在 sidecar 容器中使用日志代理会导致严重的资源损耗。此外，您不能使用 kubectl logs 命令访问日志，因为日志并没有被 kubelet 管理。
:::
例如，您可以使用 [Stackdriver](https://kubernetes.io/docs/tasks/debug-application-cluster/logging-stackdriver/)，它使用fluentd作为日志记录代理。 以下是两个可用于实现此方法的配置文件。 第一个文件包含配置 fluentd 的[ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)。
<br/>
admin/logging/fluentd-sidecar-config.yaml
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluentd.conf: |
    <source>
      type tail
      format none
      path /var/log/1.log
      pos_file /var/log/1.log.pos
      tag count.format1
    </source>

    <source>
      type tail
      format none
      path /var/log/2.log
      pos_file /var/log/2.log.pos
      tag count.format2
    </source>

    <match **>
      type google_cloud
    </match>
```
:::tip 注意
配置fluentd超出了本文的范围。要知道更多的关于如何配置fluentd，请参考[fluentd 官方文档](https://docs.fluentd.org/).
:::
第二个文件描述了运行 fluentd sidecar 容器的 pod 。flutend 通过 pod 的挂载卷获取它的配置数据。
<br/>
admin/logging/two-files-counter-pod-agent-sidecar.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counter
spec:
  containers:
  - name: count
    image: busybox
    args:
    - /bin/sh
    - -c
    - >
      i=0;
      while true;
      do
        echo "$i: $(date)" >> /var/log/1.log;
        echo "$(date) INFO $i" >> /var/log/2.log;
        i=$((i+1));
        sleep 1;
      done
    volumeMounts:
    - name: varlog
      mountPath: /var/log
  - name: count-agent
    image: k8s.gcr.io/fluentd-gcp:1.30
    env:
    - name: FLUENTD_ARGS
      value: -c /etc/fluentd-config/fluentd.conf
    volumeMounts:
    - name: varlog
      mountPath: /var/log
    - name: config-volume
      mountPath: /etc/fluentd-config
  volumes:
  - name: varlog
    emptyDir: {}
  - name: config-volume
    configMap:
      name: fluentd-config
```
一段时间后，您可以在 Stackdriver 界面看到日志消息。
<br/>
记住，这只是一个例子，事实上您可以用任何一个日志代理替换 fluentd ，并从应用容器中读取任何资源。

### 从应用中直接暴露日志目录
![](/images/gainian/logging-from-application.png)
<br/>
通过暴露或推送每个应用的日志，您可以实现集群级日志记录；然而，这种日志记录机制的实现已超出 Kubernetes 的范围。

# 配置 kubelet 垃圾回收策略
垃圾回收是 kubelet 的一个有用功能，它将清理未使用的镜像和容器。Kubelet 将每分钟对容器执行一次垃圾回收，每五分钟对镜像执行一次垃圾回收。
<br/>
不建议使用外部垃圾收集工具，因为这些工具可能会删除原本期望存在的容器进而破坏 kubelet 的行为。
## 镜像回收
Kubernetes 借助于 cadvisor 通过 imageManager 来管理所有镜像的生命周期。

镜像垃圾回收策略只考虑两个因素：HighThresholdPercent 和 LowThresholdPercent。 磁盘使用率超过上限阈值（HighThresholdPercent）将触发垃圾回收。 垃圾回收将删除最近最少使用的镜像，直到磁盘使用率满足下限阈值（LowThresholdPercent）。
## 容器回收
容器垃圾回收策略考虑三个用户定义变量。MinAge 是容器可以被执行垃圾回收的最小生命周期。MaxPerPodContainer 是每个 pod 内允许存在的死亡容器的最大数量。 MaxContainers 是全部死亡容器的最大数量。可以分别独立地通过将 MinAge 设置为 0，以及将 MaxPerPodContainer 和 MaxContainers 设置为小于 0 来禁用这些变量。
<br/>
Kubelet 将处理无法辨识的、已删除的以及超出前面提到的参数所设置范围的容器。最老的容器通常会先被移除。 MaxPerPodContainer 和 MaxContainer 在某些场景下可能会存在冲突，例如在保证每个 pod 内死亡容器的最大数量（MaxPerPodContainer）的条件下可能会超过允许存在的全部死亡容器的最大数量（MaxContainer）。 MaxPerPodContainer 在这种情况下会被进行调整：最坏的情况是将 MaxPerPodContainer 降级为 1，并驱逐最老的容器。 此外，pod 内已经被删除的容器一旦年龄超过 MinAge 就会被清理。
<br/>
不被 kubelet 管理的容器不受容器垃圾回收的约束。

## 用户配置
用户可以使用以下 kubelet 参数调整相关阈值来优化镜像垃圾回收：

- 1.image-gc-high-threshold，触发镜像垃圾回收的磁盘使用率百分比。默认值为 85%。

- 2.image-gc-low-threshold，镜像垃圾回收试图释放资源后达到的磁盘使用率百分比。默认值为 80%。

我们还允许用户通过以下 kubelet 参数自定义垃圾收集策略：

- 1.minimum-container-ttl-duration，完成的容器在被垃圾回收之前的最小年龄，默认是 0 分钟，这意味着每个完成的容器都会被执行垃圾回收。

- 2.maximum-dead-containers-per-container，每个容器要保留的旧实例的最大数量。默认值为 1。

- 3.maximum-dead-containers，要全局保留的旧容器实例的最大数量。默认值是 -1，这意味着没有全局限制。

容器可能会在其效用过期之前被垃圾回收。这些容器可能包含日志和其他对故障诊断有用的数据。 强烈建议为 maximum-dead-containers-per-container 设置一个足够大的值，以便每个预期容器至少保留一个死亡容器。 由于同样的原因，maximum-dead-containers 也建议使用一个足够大的值。
<br/>
查阅 [这个问题](https://github.com/kubernetes/kubernetes/issues/13287) 获取更多细节。

## 弃用
这篇文档中的一些 kubelet 垃圾收集（Garbage Collection）功能将在未来被 kubelet 驱逐回收（eviction）所替代。
<br/>
包括:
<table>
    <tr>
        <th style="background: #555;" width="35">现存参数</th>
        <th style="background: #555;" width="35">新参数</th>
        <th style="background: #555;" width="30">解释</th>
    </tr>
    <tr>
        <td>--image-gc-high-threshold</td>
        <td>--eviction-hard 或 --eviction-soft</td>
        <td>现存的驱逐回收信号可以触发镜像垃圾回收</td>
    </tr>
    <tr>
        <td>--image-gc-low-threshold</td>
        <td>--eviction-minimum-reclaim</td>
        <td>驱逐回收实现相同行为</td>
    </tr>
    <tr>
        <td>--maximum-dead-containers</td>
        <td></td>
        <td>一旦旧日志存储在容器上下文之外，就会被弃用</td>
    </tr>
    <tr>
        <td>--maximum-dead-containers-per-container</td>
        <td></td>
        <td>一旦旧日志存储在容器上下文之外，就会被弃用</td>
    </tr>
    <tr>
        <td>--minimum-container-ttl-duration</td>
        <td></td>
        <td>一旦旧日志存储在容器上下文之外，就会被弃用</td>
    </tr>
    <tr>
        <td>--low-diskspace-threshold-mb</td>
        <td>--eviction-hard or eviction-soft</td>
        <td>驱逐回收将磁盘阈值泛化到其他资源</td>
    </tr>
    <tr>
        <td>--outofdisk-transition-frequency</td>
        <td>--eviction-pressure-transition-period</td>
        <td>驱逐回收将磁盘压力转换到其他资源</td>
    </tr>
</table>

# 控制器管理器指标
控制器管理器指标为控制器管理器的性能和健康提供了重要的观测手段。
## 什么是控制器管理器度量
控制器管理器指标为控制器管理器的性能和健康提供了重要的观测手段。 这些度量包括常见的 Go 语言运行时度量，比如 go_routine 计数，以及控制器特定的度量，比如 etcd 请求延迟或 云提供商（AWS、GCE、OpenStack）的 API 延迟，这些参数可以用来测量集群的健康状况。
<br/>
从 Kubernetes 1.7 版本开始，详细的云提供商指标可用于 GCE、AWS、Vsphere 和 OpenStack 的存储操作。 这些度量可用于监视持久卷操作的健康状况。
<br/>
例如，在 GCE 中这些指标叫做









