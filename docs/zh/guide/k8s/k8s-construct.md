# Kubernetes架构

[[toc]]

## 控制器(Controllers)
在机器人技术和自动化领域，控制回路是一个非终止回路，用于调节系统状态。
<br/>
这是控制回路的一个示例：房间中的恒温器。
<br/>
当您设定温度时，即告诉恒温器您想要的状态。实际的室温是 当前状态。温控器通过打开或关闭设备来使当前状态更接近所需状态。
<br/>
在Kubernetes中，控制器是监视集群 状态的控制环 ，然后在需要时进行更改或请求更改。每个控制器都尝试将当前群集状态移动到更接近所需状态。
<br/>

### 控制器模式(Controller pattern)
控制器跟踪至少一种Kubernetes资源类型。这些对象 的spec字段代表所需的状态。该资源的控制器负责使当前状态更接近于所需状态。
<br/>
控制器可以自行执行操作；更常见的是，在Kubernetes中，控制器会将消息发送到的 API服务器具有有用的副作用。您将在下面看到此示例。
#### 通过API服务器进行控制
该工作controller是Kubernetes内置控制器的一个示例。内置控制器通过与集群API服务器进行交互来管理状态。
<br/>
Job是运行Pod 的Kubernetes资源 ，或几个Pod，以执行一项任务，然后停止。
<br/>
（一旦调度，Pod对象将成为kubelet所需状态的一部分）。
<br/>
当作业控制器看到一个新任务时，它确保在集群中的某个位置，一组节点上的kubelet运行正确数量的Pod以完成工作。Job控制器本身不会运行任何Pod或容器。而是，作业控制器告诉API服务器创建或删除Pod。控制平面中其他组件  根据新信息采取行动（有新的Pod计划和运行），最终工作完成了。
<br/>
创建新作业后，所需的状态是该作业要完成。Job控制器使该Job的当前状态更接近于您想要的状态：创建Pod来完成您要为该Job进行的工作，从而使Job接近完成。
<br/>
控制器还更新配置它们的对象。例如：完成工作的工作后，工作控制器将更新该工作对象以对其进行标记Finished.
<br/>
（这有点像某些恒温器如何关闭灯以指示您的房间现在处于您设定的温度）.

#### 直接控制
与Job相比，某些控制器需要对集群外部的内容进行更改。

例如，如果使用控制循环来确保有足够的节点，则 在您的群集中，那么该控制器需要当前群集之外的内容以在需要时设置新节点。

与外部状态进行交互的控制器从API服务器中找到所需的状态，然后直接与外部系统进行通信以使当前状态更加紧密。

（实际上，有一个控制器可以水平扩展群集中的节点。请参阅“ <a href="https://kubernetes.io/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaling" target="_blank">群集自动</a>扩展” ）


### 所需状态与当前状态(Desired versus current state)

Kubernetes采用云原生系统视图，并能够处理不断变化的情况。
<br/>
随着工作的进行，您的集群可能随时随地发生变化，并且控制环会自动修复故障。这意味着，您的群集可能永远无法达到稳定状态。
<br/>
只要您的集群的控制器正在运行并且能够进行有用的更改，总体状态是否稳定都没有关系
<br/>

### 设计(Design)

作为其设计宗旨，Kubernetes使用许多控制器，每个控制器管理集群状态的特定方面。最常见的是，特定的控制回路（控制器）使用一种资源作为其所需状态，并使用另一种资源设法使该所需状态发生。
<br/>
使用简单的控制器而不是一组相互链接的单片式控制回路很有用。控制器可能会失败，因此Kubernetes旨在解决这一问题。
<br/>
例如：Jobs的控制器跟踪Job对象（以发现新工作）和Pod对象（以运行Jobs，然后查看工作何时完成）。在这种情况下，其他作业将创建作业，而作业控制器将创建容器。
<br/>
:::tip 注意：
译文：
<br/>
可以有多个控制器创建或更新相同类型的对象。在幕后，Kubernetes控制器确保仅关注与控制资源链接的资源。
<br/>
例如，您可以具有“部署”和“作业”；这些都创造了豆荚。作业控制器不会删除您的Deployment创建的Pod，因为控制器有一些信息(labels)可以用来区分那些Pod
<br/>
原文：
<br/>
There can be several controllers that create or update the same kind of object. Behind the scenes, Kubernetes controllers make sure that they only pay attention to the resources linked to their controlling resource.
<br/>
For example, you can have Deployments and Jobs; these both create Pods. The Job controller does not delete the Pods that your Deployment created, because there is information (labels ) the controllers can use to tell those Pods apart
:::

### 控制器运行方式(Ways of running controllers)
Kubernetes带有一组内置控制器，这些内置控制器在运行控制器 kube-controller-manager 内部。这些内置控制器提供了重要的核心行为。
<br/>
Deployment控制器和Job控制器是Kubernetes本身的一部分（“内置”控制器）的控制器示例。Kubernetes允许您运行弹性控制平面，这样，如果任何内置控制器发生故障，控制平面的另一部分将接管工作。
<br/>
您可以找到在控制平面之外运行的控制器来扩展Kubernetes。或者，如果需要，您可以自己编写一个新的控制器。您可以将自己的控制器作为一组Pod运行，也可以在Kubernetes外部运行。最合适的选择取决于特定控制器的功能
<br/>

## 云控制器管理器的基础概念
云控制器管理器（cloud controller manager，CCM）这个概念 （不要与二进制文件混淆）创建的初衷是为了让特定的云服务供应商代码和 Kubernetes 核心相互独立演化。云控制器管理器与其他主要组件（如 Kubernetes 控制器管理器，API 服务器和调度程序）一起运行。它也可以作为 Kubernetes 的插件启动，在这种情况下，它会运行在 Kubernetes 之上。
<br/>
云控制器管理器基于插件机制设计，允许新的云服务供应商通过插件轻松地与 Kubernetes 集成。目前已经有在 Kubernetes 上加入新的云服务供应商计划，并为云服务供应商提供从原先的旧模式迁移到新 CCM 模式的方案。
<br/>
本文讨论了云控制器管理器背后的概念，并提供了相关功能的详细信息。
<br/>
这是没有云控制器管理器的 Kubernetes 集群的架构：
<br/>
![](/images/gainian/pre-ccm-arch.png)

### 设计
在上图中，Kubernetes 和云服务供应商通过几个不同的组件进行了集成，分别是：
- Kubelet
- Kubernetes 控制管理器
- Kubernetes API 服务器

CCM 整合了前三个组件中的所有依赖于云的逻辑，以创建与云的单一集成点。CCM 的新架构如下所示：
![](/images/gainian/post-ccm-arch2.png)

### CCM 的组成部分
CCM 打破了 Kubernetes 控制器管理器（KCM）的一些功能，并将其作为一个单独的进程运行。具体来说，它打破了 KCM 中依赖于云的控制器。KCM 具有以下依赖于云的控制器：
- 节点控制器
- 卷控制器
- 路由控制器
- 服务控制器

在 1.9 版本中，CCM 运行前述列表中的以下控制器：

- 节点控制器
- 路由控制器
- 服务控制器
:::tip 注意
注意卷控制器不属于 CCM，由于其中涉及到的复杂性和对现有供应商特定卷的逻辑抽象，因此决定了卷控制器不会被移动到 CCM 之中。
:::
使用 CCM 支持 volume 的最初计划是使用 Flex volume 来支持可插拔卷，但是现在正在计划一项名为 CSI 的项目以取代 Flex。
<br/>
考虑到这些正在进行中的变化，在 CSI 准备就绪之前，我们决定停止当前的工作
### CCM 的功能
CCM 从依赖于云提供商的 Kubernetes 组件继承其功能，本节基于这些组件组织。

#### 1. Kubernetes 控制器管理器
CCM 的大多数功能都来自 KCM，如上一节所述，CCM 运行以下控制器。
- 节点控制器
- 路由控制器
- 服务控制器

##### 节点控制器
节点控制器负责通过从云提供商获取有关在集群中运行的节点的信息来初始化节点，节点控制器执行以下功能：
- 1.使用特定于云的域（zone）/区（region）标签初始化节点；
- 2.使用特定于云的实例详细信息初始化节点，例如，类型和大小；
- 3.获取节点的网络地址和主机名；
- 4.如果节点无响应，请检查云以查看该节点是否已从云中删除。如果已从云中删除该节点，请删除 Kubernetes 节点对象。
##### 路由控制器
Route 控制器负责适当地配置云中的路由，以便 Kubernetes 集群中不同节点上的容器可以相互通信。route 控制器仅适用于 Google Compute Engine 群集。
##### 服务控制器
服务控制器负责监听服务的创建、更新和删除事件。根据 Kubernetes 中各个服务的当前状态，它配置云负载均衡器（如 ELB, Google LB 或者 Oracle Cloud Infrastructure LB）以反映 Kubernetes 中的服务状态。此外，它还确保云负载均衡器的服务后端是最新的。

#### 2. Kubelet
节点控制器包含 kubelet 中依赖于云的功能，在引入 CCM 之前，kubelet 负责使用特定于云的详细信息（如 IP 地址，域/区标签和实例类型信息）初始化节点。CCM 的引入已将此初始化操作从 kubelet 转移到 CCM 中。
<br/>
在这个新模型中，kubelet 初始化一个没有特定于云的信息的节点。但是，它会为新创建的节点添加污点，使节点不可调度，直到 CCM 使用特定于云的信息初始化节点后，才会清除这种污点，便得该节点可被调度。

### 插件机制
云控制器管理器使用 Go 接口允许插入任何云的实现。具体来说，它使用[此处](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62)定义的 CloudProvider 接口。
<br/>
上面强调的四个共享控制器的实现，以及一些辅助设施（scaffolding）和共享的 cloudprovider 接口，将被保留在 Kubernetes 核心中。但特定于云提供商的实现将在核心之外构建，并实现核心中定义的接口。
<br/>
有关开发插件的更多信息，请参阅[开发云控制器管理器](https://kubernetes.io/docs/tasks/administer-cluster/developing-cloud-controller-manager/)。
<br/>
### 授权
本节分解了 CCM 执行其操作时各种 API 对象所需的访问权限。
#### 节点控制器
Node 控制器仅适用于 Node 对象，它需要完全访问权限来获取、列出、创建、更新、修补、监视和删除 Node 对象。
<br/>
v1/Node:
- Get
- List
- Create
- Update
- Patch
- Watch
- Delete
#### 路由控制器
路由控制器侦听 Node 对象创建并适当地配置路由，它需要访问 Node 对象。
<br/>
v1/Node:
- Get

#### 服务控制器
服务控制器侦听 Service 对象创建、更新和删除事件，然后适当地为这些服务配置端点。
<br/>
要访问服务，它需要列表和监视访问权限。要更新服务，它需要修补和更新访问权限。
<br/>
要为服务设置端点，需要访问 create、list、get、watch 和 update。
<br/>
v1/Service:
<br/>
- List
- Get
- Watch
- Patch
- Update
#### 其它
CCM 核心的实现需要访问权限以创建事件，并且为了确保安全操作，它需要访问权限以创建服务账户。
<br/>
v1/Event:
- Create
- Patch
- Update
v1/ServiceAccount:
- Create
针对 CCM 的 RBAC ClusterRole 看起来像这样：
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

### 供应商实施
以下云服务提供商已实现了 CCM：
- [AWS](https://github.com/kubernetes/cloud-provider-aws)
- [Azure](https://github.com/kubernetes-sigs/cloud-provider-azure)
- [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
- [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
- [GCP](https://github.com/kubernetes/cloud-provider-gcp)
- [Linode](https://github.com/linode/linode-cloud-controller-manager)
- [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
- [Oracle](https://github.com/oracle/oci-cloud-controller-manager)

### 群集管理
[这里](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)提供了有关配置和运行 CCM 的完整说明。

## Master 节点通信

### 概览
本文对 Master 节点（确切说是 apiserver）和 Kubernetes 集群之间的通信路径进行了分类。目的是为了让用户能够自定义他们的安装，对网络配置进行加固，使得集群能够在不可信的网络上（或者在一个云服务商完全公共的 IP 上）运行。
### Cluster -> Master
所有从集群到 master 的通信路径都终止于 apiserver（其它 master 组件没有被设计为可暴露远程服务）。
在一个典型的部署中，apiserver 被配置为在一个安全的 HTTPS 端口（443）上监听远程连接并启用一种或多种形式的客户端[身份认证](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)机制。
一种或多种客户端身份认证机制应该被启用，特别是在允许使用 [匿名请求](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#anonymous-requests) 或 [service account tokens](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#service-account-tokens) 的时候。
<br/>
应该使用集群的公共根证书开通节点，如此它们就能够基于有效的客户端凭据安全的连接 apiserver。
例如：在一个默认的 GCE 部署中，客户端凭据以客户端证书的形式提供给 kubelet。
请查看 [kubelet TLS bootstrapping](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) 获取如何自动提供 kubelet 客户端证书。
<br/>
想要连接到 apiserver 的 Pods 可以使用一个 service account 安全的进行连接。
这种情况下，当 Pods 被实例化时 Kubernetes 将自动的把公共根证书和一个有效的不记名令牌注入到 pod 里。
kubernetes service （所有 namespaces 中）都配置了一个虚拟 IP 地址，用于转发（通过 kube-proxy）请求到 apiserver 的 HTTPS endpoint。
<br/>
Master 组件通过非安全（没有加密或认证）端口和集群的 apiserver 通信。
这个端口通常只在 master 节点的 localhost 接口暴露，这样，所有在相同机器上运行的 master 组件就能和集群的 apiserver 通信。
一段时间以后，master 组件将变为使用带身份认证和权限验证的安全端口（查看[#13598](https://github.com/kubernetes/kubernetes/issues/13598)）。
<br/>
这样的结果使得从集群（在节点上运行的 nodes 和 pods）到 master 的缺省连接操作模式默认被保护，能够在不可信或公网中运行。
<br/>

### Master -> Cluster
从 master（apiserver）到集群有两种主要的通信路径。第一种是从 apiserver 到集群中每个节点上运行的 kubelet 进程。第二种是从 apiserver 通过它的代理功能到任何 node、pod 或者 service。
#### apiserver -> kubelet
从 apiserver 到 kubelet 的连接用于获取 pods 日志、连接（通过 kubectl）运行中的 pods，以及使用 kubelet 的端口转发功能。这些连接终止于 kubelet 的 HTTPS endpoint。
<br/>
默认的，apiserver 不会验证 kubelet 的服务证书，这会导致连接遭到中间人攻击，因而在不可信或公共网络上是不安全的。
<br/>
为了对这个连接进行认证，请使用 --kubelet-certificate-authority 标记给 apiserver 提供一个根证书捆绑，用于 kubelet 的服务证书。
<br/>
如果这样不可能，又要求避免在不可信的或公共的网络上进行连接，请在 apiserver 和 kubelet 之间使用 [SSH 隧道](https://kubernetes.io/docs/concepts/architecture/master-node-communication/#ssh-tunnels)。
<br/>
最后，应该启用[Kubelet 用户认证和/或权限认证](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet-authentication-authorization/)来保护 kubelet API。

#### apiserver -> nodes, pods, and services
从 apiserver 到 node、pod或者service 的连接默认为纯 HTTP 方式，因此既没有认证，也没有加密。
他们能够通过给API URL 中的 node、pod 或 service 名称添加前缀 https: 来运行在安全的 HTTPS 连接上。
但他们即不会认证 HTTPS endpoint 提供的证书，也不会提供客户端证书。
这样虽然连接是加密的，但它不会提供任何完整性保证。这些连接<b>目前还不能安全的</b>在不可信的或公共的网络上运行。
### SSH 隧道
[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/) 使用 SSH 隧道保护 Master -> Cluster 通信路径。
在这种配置下，apiserver 发起一个到集群中每个节点的 SSH 隧道（连接到在 22 端口监听的 ssh 服务）并通过这个隧道传输所有到 kubelet、node、pod 或者 service 的流量。
这个隧道保证流量不会在集群运行的私有 GCE 网络之外暴露。

## Nodes

### Node 是什么？
Node 是 Kubernetes 的工作节点，以前叫做 minion。取决于你的集群，Node 可以是一个虚拟机或者物理机器。每个 node 都有用于运行 pods 的必要服务，并由 master 组件管理。Node 上的服务包括 Docker、kubelet 和 kube-proxy。请查阅架构设计文档中 [The Kubernetes Node](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) 一节获取更多细节。

### Node 状态
一个 node 的状态包含以下信息:
- 地址
- <s>阶段</s><b>已废弃</b>
- 条件
- 容量
- 信息
下面对每个章节进行详细描述。

#### 地址
这些字段组合的用法取决于你的云服务商或者裸机配置。
- HostName：HostName 和 node 内核报告的相同。可以通过 kubelet 的 --hostname-override 参数覆盖。
- ExternalIP：通常是可以外部路由的 node IP 地址（从集群外可访问）。
- InternalIP：通常是仅可在集群内部路由的 node IP 地址
#### 阶段
已废弃：node 阶段已经不再使用。
#### 条件
conditions 字段描述了所有 Running nodes 的状态。
<table>
    <tr>
        <th style="color: #555;" width="20%">
            Node 条件
        </th>
        <th style="color: #555;" width="80%">
            描述
        </th>
    </tr>
    <tr>
        <td>OutOfDisk</td>
        <td>True 表示 node 的空闲空间不足以用于添加新 pods, 否则为 False</td>
    </tr>
    <tr>
        <td>Ready</td>
        <td>True 表示 node 是健康的并已经准备好接受 pods；False 表示 node 不健康而且不能接受 pods；Unknown 表示 node 控制器在最近 40 秒内没有收到 node 的消息</td>
    </tr>
    <tr>
        <td>MemoryPressure</td>
        <td>True 表示 node 不存在内存压力 – 即 node 内存用量低, 否则为 False</td>
    </tr>
    <tr>
        <td>DiskPressure</td>
        <td>True 表示 node 不存在磁盘压力 – 即磁盘用量低, 否则为 False</td>
    </tr>
</table>
Node 条件使用一个 JSON 对象表示。例如，下面的响应描述了一个健康的 node。

```yaml
"conditions": [
  {
    "kind": "Ready",
    "status": "True"
  }
]
```

如果 Ready 条件处于状态 “Unknown” 或者 “False” 的时间超过了 pod-eviction-timeout(一个传递给 [kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) 的参数)，
node 上的所有 Pods 都会被 Node 控制器计划删除。默认的删除超时时长为5分钟。某些情况下，
当 node 不可访问时，apiserver 不能和其上的 kubelet 通信。删除 pods 的决定不能传达给 kubelet，直到它重新建立和 apiserver 的连接为止。
与此同时，被计划删除的 pods 可能会继续在分区 node 上运行。
<br/>
在 1.5 版本之前的 Kubernetes 里，node 控制器会将不能访问的 pods 从 apiserver 中[强制删除](https://kubernetes.io/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)。
但在 1.5 或更高的版本里，在node 控制器确认这些 pods 已经在集群里停运行前不会强制删除它们。
你可以看到这些处于 “Terminating” 或者 “Unknown” 状态的 pods 可能在无法访问的 node 上运行。
为了防止 kubernetes 不能从底层基础设施中推断出一个 node 是否已经永久的离开了集群，集群管理员可能需要手动删除这个 node 对象。
从 Kubernetes 删除 node 对象将导致 apiserver 删除 node 上所有运行的 Pod 对象并释放它们的名字。

#### 容量
描述 node 上的可用资源：CPU、内存和可以调度到 node 上的 pods 的最大数量。
#### 信息
关于 node 的通用信息，例如内核版本、Kubernetes 版本（kubelet 和 kube-proxy 版本）、Docker 版本 （如果使用了）和 OS 名。这些信息由 Kubelet 从 node 搜集而来。
#### 管理
与 [pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/) 和 [services](https://kubernetes.io/docs/concepts/services-networking/service/) 不同，node 并不是在 Kubernetes 内部创建的：它是被外部的云服务商创建，例如 Google Compute Engine 或者你的集群中的物理或者虚拟机。这意味着当 Kubernetes 创建一个 node 时，它其实仅仅创建了一个对象来代表这个 node。创建以后，Kubernetes 将检查这个 node 是否可用。例如，如果你尝试使用如下内容创建一个 node：
```yaml
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

Kubernetes 会在内部创一个 node 对象（象征 node），并基于 metadata.name 字段（我们假设 metadata.name 能够被解析）通过健康检查来验证 node。如果 node 可用，意即所有必要服务都已运行，它就符合了运行一个 pod 的条件；否则它将被所有的集群动作忽略直到变为可用。请注意，Kubernetes 将保存不可用 node 的对象，除非它被客户端显式的删除。Kubernetes 将持续检查 node 是否变的可用。
<br/>
当前，有3个组件同 Kubernetes node 接口交互：node 控制器、kubelet 和 kubectl。
#### Node 控制器
Node 控制器是一个 Kubernetes master 组件，管理 nodes 的方方面面。
<br/>
Node 控制器在 node 的生命周期中扮演了多个角色。第一个是当 node 注册时为它分配一个 CIDR block（如果打开了 CIDR 分配）。
<br/>
第二个是使用云服务商提供了可用节点列表保持 node 控制器内部的 nodes 列表更新。如果在云环境下运行，任何时候当一个 node 不健康时 node 控制器将询问云服务 node 的虚拟机是否可用。如果不可用，node 控制器会将这个 node 从它的 nodes 列表删除。
<br/>
第三个是监控 nodes 的健康情况。Node 控制器负责在 node 不能访问时（也即是 node 控制器因为某些原因没有收到心跳，例如 node 宕机）将它的 NodeStatus 的 NodeReady 状态更新为 ConditionUnknown。后续如果 node 持续不可访问，Node 控制器将删除 node 上的所有 pods（使用优雅终止）。（默认情况下 40s 开始报告 ConditionUnknown，在那之后 5m 开始删除 pods。）Node 控制器每隔 --node-monitor-period 秒检查每个 node 的状态。
<br/>
在 Kubernetes 1.4 中我们更新了 node 控制器逻辑以更好的处理大批量 nodes 访问 master 出问题的情况（例如 master 的网络出了问题）。从 1.4 开始，node 控制器在决定删除 pod 之前会检查集群中所有 nodes 的状态。
<br/>
大部分情况下， node 控制器把删除频率限制在每秒 --node-eviction-rate 个（默认为 0.1）。这表示它在 10 秒钟内不会从超过一个 node 上删除 pods。
<br/>
当一个 availability zone 中的 node 变为不健康时，它的删除行为将发生改变。Node 控制器会同时检查 zone 中不健康（NodeReady 状态为 ConditionUnknown 或 ConditionFalse）的 nodes 的百分比。如果不健康 nodes 的部分超过 --unhealthy-zone-threshold （默认为 0.55），删除速率将会减小：如果集群较小（意即小于等于 --large-cluster-size-threshold 个 nodes - 默认为50），删除将会停止，否则删除速率将降为每秒 --secondary-node-eviction-rate 个（默认为 0.01）。在单个 availability zone 实施这些策略的原因是当一个 availability zone 可能从 master 分区时其它的仍然保持连接。如果你的集群没有跨越云服务商的多个 availability zones，那就只有一个 availability zone（整个集群）。
<br/>
在多个 availability zones 分布你的 nodes 的一个关键原因是当整个 zone 故障时，工作负载可以转移到健康的 zones。因此，如果一个 zone 中的所有 nodes 都不健康时，node 控制器会以正常的速率 --node-eviction-rate 删除。在所有的 zones 都不健康（也即集群中没有健康 node）的极端情况下，node 控制器将假设 master 的连接出了某些问题，它将停止所有删除动作直到一些连接恢复。
<br/>
从 Kubernetes 1.6 开始，NodeController 还负责删除运行在拥有 NoExecute taints 的 nodes 上的 pods，如果这些 pods 没有 tolerate 这些 taints。
此外，作为一个默认禁用的 alpha 特性，NodeController 还负责根据 node 故障（例如 node 不可访问或没有 ready）添加 taints。
请查看 [这个文档](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#taints-and-tolerations-beta-feature)了解关于 NoExecute taints 和这个 alpha 特性。

#### Nodes 自注册
当 kubelet 标志 --register-node 为 true （默认）时，它会尝试向 API 服务注册自己。这是首选模式，被绝大多数发行版选用。
<br/>
对于自注册模式，kubelet 使用下列参数启动：
- --api-servers : apiservers 地址。
- --kubeconfig : 用于向 apiserver 验证自己的凭据路径。
- --cloud-provider : 如何从云服务商读取关于自己的元数据。
- --register-node : 自动向 API 服务注册。
- --register-with-taints -- 使用 taints 列表（逗号分隔的 &#60;key&#62;=&#60;value&#62;:&#60;effect&#62;）注册 node。当 register-node 为 false 时无效。
- --node-ip : node IP 地址。
- --node-labels : 向集群注册时给 node 添加的 labels。
- --node-status-update-frequency : 指定 kubelet 向 master 发送状态的频率。
目前，任何 kubelet 都被授权可以创建/修改任意 node 资源，但通常只对自己的进行创建/修改。（未来我们计划只允许一个 kubelet 修改它自己 node 的资源。）

#### 手动 Node 管理
集群管理员可以创建及修改 node 对象。
<br/>
如果管理员希望手动创建 node 对象，请设置 kubelet 标记 --register-node=false。
<br/>
管理员可以修改 node 资源（忽略 --register-node 设置）。修改包括在 node 上设置 labels及标记它为不可调度。
<br/>
Nodes 上的 labels 可以和 pods 的 node selectors 一起使用来控制调度，例如限制一个 pod 只能在一个符合要求的 nodes 子集上运行。
<br/>
标记一个 node 为不可调度的将防止新建 pods 调度到那个 node 之上，但不会影响任何已经在它之上的 pods。这是重启 node 等操作之前的一个有用的准备步骤。例如，标记一个 node 为不可调度的，执行以下命令：
```yaml
kubectl cordon $NODENAME
```
请注意，被 daemonSet 控制器创建的 pods 将忽略 Kubernetes 调度器，且不会遵照 node 上不可调度的属性。这个假设基于守护程序属于节点机器，即使在准备重启而隔离应用的时候。
#### Node 容量
Node 的容量（cpu 数量和内存容量）是 node 对象的一部分。通常情况下，在创建 node 对象时，它们会注册自己并报告自己的容量。
如果你正在执行[手动 node 管理](https://kubernetes.io/zh/docs/concepts/architecture/nodes/#manual-node-administration)，那么你需要在添加 node 时手动设置 node 容量。
<br/>
Kubernetes 调度器保证一个 node 上有足够的资源供其上的所有 pods 使用。它会检查 node 上所有容器要求的总和不会超过 node 的容量。这包括所有 kubelet 启动的容器，但不包含 Docker 启动的容器和不在容器中的进程。
<br/>
如果希望显式的为非 pod 进程预留资源，你可以创建一个占位 pod。使用如下模板：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-reserver
spec:
  containers:
  - name: sleep-forever
    image: k8s.gcr.io/pause:0.8.0
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
```
设置 cpu 和 memory 值为你希望预留的资源量。将文件放在清单文件夹中（kubelet 的 --config=DIR 标志）。当你希望预留资源时，在每个 kubelet 上都这样执行。
### API 对象
Node 是 Kubernetes REST API 的顶级资源。更多关于 API 对象的细节可以在这里找到： Node API object.``





