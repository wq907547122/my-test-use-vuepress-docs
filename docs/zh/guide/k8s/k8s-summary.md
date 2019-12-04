# 概述

[[toc]]

## 认识 Kubernetes?
Kubernetes 是一个跨主机集群的<a href="https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/" target="_blank">开源的容器调度平台，它可以自动化应用容器的部署、扩展和操作</a> , 提供以容器为中心的基础架构。
<br/>
使用 Kubernetes, 您可以快速高效地响应客户需求:

- 快速、可预测地部署您的应用程序
- 拥有即时扩展应用程序的能力
- 不影响现有业务的情况下，无缝地发布新功能
- 优化硬件资源，降低成本

我们的目标是构建一个软件和工具的生态系统，以减轻您在公共云或私有云运行应用程序的负担。

### Kubernetes 具有如下特点:
- <b>便携性:</b> 无论公有云、私有云、混合云还是多云架构都全面支持
- <b>可扩展:</b> 它是模块化、可插拔、可挂载、可组合的，支持各种形式的扩展
- <b>自修复:</b> 它可以自保持应用状态、可自重启、自复制、自缩放的，通过声明式语法提供了强大的自修复能力
Kubernetes 项目由 Google 公司在 2014 年启动。Kubernetes 建立在 Google 公司超过十余年的运维经验基础之上，Google 所有的应用都运行在容器上, 再与社区中最好的想法和实践相结合，也许它是最受欢迎的容器平台。

<br/>
准备好<a href="https://kubernetes.io/docs/setup/" target="_blank">开始</a>?

### 为什么是容器?
查看此文，可以了解为什么您要使用容器 <a href="https://aucouranton.com/2014/06/13/linux-containers-parallels-lxc-openvz-docker-and-more/" target="_blank">容器</a>?
![](/images/gainian/why_containers.svg)
传统 部署应用程序的方式，一般是使用操作系统自带的包管理器在主机上安装应用依赖，之后再安装应用程序。这无疑将应用程序的可执行文件、应用的配置、应用依赖库和应用的生命周期与宿主机操作系统进行了紧耦合。在此情境下，可以通过构建不可改变的虚拟机镜像版本，通过镜像版本实现可预测的发布和回滚，但是虚拟机实在是太重量级了，且镜像体积太庞大，便捷性差。
<br/>
新方式 是基于操作系统级虚拟化而不是硬件级虚拟化方法来部署容器。容器之间彼此隔离并与主机隔离：它们具有自己的文件系统，不能看到彼此的进程，并且它们所使用的计算资源是可以被限制的。它们比虚拟机更容易构建，并且因为它们与底层基础架构和主机文件系统隔离，所以它们可以跨云和操作系统快速分发。
<br/>
由于容器体积小且启动快，因此可以在每个容器镜像中打包一个应用程序。这种一对一的应用镜像关系拥有很多好处。使用容器，不需要与外部的基础架构环境绑定, 因为每一个应用程序都不需要外部依赖，更不需要与外部的基础架构环境依赖。完美解决了从开发到生产环境的一致性问题。
<br/>
容器同样比虚拟机更加透明，这有助于监测和管理。尤其是容器进程的生命周期由基础设施管理，而不是由容器内的进程对外隐藏时更是如此。最后，每个应用程序用容器封装，管理容器部署就等同于管理应用程序部署。
<br/>
容器优点摘要:
- <b>敏捷的应用程序创建和部署:</b> 与虚拟机镜像相比，容器镜像更容易创建，提升了硬件的使用效率。
- <b>持续开发、集成和部署:</b> 提供可靠与频繁的容器镜像构建和部署，可以很方便及快速的回滚 (由于镜像不可变性).
- <b>关注开发与运维的分离:</b> 在构建/发布时创建应用程序容器镜像，从而将应用程序与基础架构分离。
- <b>开发、测试和生产环境的一致性:</b> 在笔记本电脑上运行与云中一样。
- <b>云和操作系统的可移植性:</b> 可运行在 Ubuntu, RHEL, CoreOS, 内部部署, Google 容器引擎和其他任何地方。
- <b>以应用为中心的管理:</b> 提升了操作系统的抽象级别，以便在使用逻辑资源的操作系统上运行应用程序。
- <b>松耦合、分布式、弹性伸缩 <a href="https://martinfowler.com/articles/microservices.html" target="_blank">微服务</a>:</b> 应用程序被分成更小，更独立的部分，可以动态部署和管理 - 而不是巨型单体应用运行在专用的大型机上。
- <b>资源隔离:</b> 通过对应用进行资源隔离，可以很容易的预测应用程序性能。
- <b>资源利用:</b> 高效率和高密度

### 为什么我们需要 Kubernetes，它能做什么?
最基础的，Kubernetes 可以在物理或虚拟机集群上调度和运行应用程序容器。然而，Kubernetes 还允许开发人员从物理和虚拟机’脱离’，从以主机为中心的基础架构转移到以容器为中心的基础架构，这样可以提供容器固有的全部优点和益处。Kubernetes 提供了基础设施来构建一个真正以容器为中心的开发环境。
<br/>
Kubernetes 满足了生产中运行应用程序的许多常见的需求，例如：
- <a href="https://kubernetes.io/docs/concepts/workloads/pods/pod/" target="_blank">Pod</a> 提供复合应用并保留一个应用一个容器的容器模型,
- <a href="https://kubernetes.io/docs/concepts/storage/volumes/" target="_blank">挂载外部存储</a>
- <a href="https://kubernetes.io/docs/concepts/configuration/secret/" target="_blank">Secret管理</a>
- <a href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/" target="_blank">应用健康检查</a>
- <a href="https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/" target="_blank">副本应用实例</a>
- <a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" target="_blank">横向自动扩缩容</a>
- <a href="https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/" target="_blank">服务发现</a>
- <a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank">负载均衡</a>
- <a href="https://kubernetes.io/docs/tasks/run-application/rolling-update-replication-controller/" target="_blank">滚动更新</a>
- <a href="https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/" target="_blank">资源监测</a>
- <a href="https://kubernetes.io/docs/concepts/cluster-administration/logging/" target="_blank">日志采集和存储</a>
- <a href="https://kubernetes.io/docs/tasks/debug-application-cluster/debug-application-introspection/" target="_blank">支持自检和调试</a>
- <a href="https://kubernetes.io/docs/reference/access-authn-authz/authorization/" target="_blank">认证和鉴权</a>
这提供了平台即服务 (PAAS) 的简单性以及基础架构即服务 (IAAS) 的灵活性，并促进跨基础设施供应商的可移植性。
<br/>
有关详细信息，请参阅 <a href="https://kubernetes.io/docs/home/" target="_blank">用户指南</a>

### 为什么 Kubernetes 是一个平台?
Kubernetes 提供了很多的功能，总会有新的场景受益于新特性。它可以简化应用程序的工作流，加快开发速度。被大家认可的应用编排通常需要有较强的自动化能力。这就是为什么 Kubernetes 被设计作为构建组件和工具的生态系统平台，以便更轻松地部署、扩展和管理应用程序。
<br/>
<a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/" target="_blank">Label</a> 允许用户按照自己的方式组织管理对应的资源。 <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/" target="_blank">注解</a> 使用户能够以自定义的描述信息来修饰资源，以适用于自己的工作流，并为管理工具提供检查点状态的简单方法。
<br/>
此外，<a href="https://kubernetes.io/docs/concepts/overview/components/" target="_blank">Kubernetes 控制面 (Control Plane)</a> 是构建在相同的 <a href="https://kubernetes.io/docs/concepts/overview/kubernetes-api/" target="_blank">APIs</a> 上面，开发人员和用户都可以用。用户可以编写自己的控制器， 调度器等等，如果这么做，根据新加的自定义 <a href="https://github.com/kubernetes/kubernetes/blob/master/docs/design/extending-api.md" target="_blank">API</a> ，可以扩展当前的通用 <a href="https://kubernetes.io/docs/reference/kubectl/overview/" target="_blank">CLI 命令行工具</a>。
<br/>
这种 <a href="https://git.k8s.io/community/contributors/design-proposals/architecture/principles.md">设计</a> 使得许多其他系统可以构建在 <a href="https://github.com/kubernetes/kubernetes/" target="_blank">Kubernetes</a> 之上。

### Kubernetes 不是什么:
Kubernetes 不是一个传统意义上，包罗万象的 PaaS (平台即服务) 系统。我们保留用户选择的自由，这非常重要。
- Kubernetes 不限制支持的应用程序类型。 它不插手应用程序框架 (例如 <a href="https://wildfly.org/" target="_blank">Wildfly</a>), 不限制支持的语言运行时 (例如 Java, Python, Ruby)，只迎合符合 <a href="https://12factor.net/" target="_blank">12种因素的应用程序</a>，也不区分”应用程序”与”服务”。Kubernetes 旨在支持极其多样化的工作负载，包括无状态、有状态和数据处理工作负载。如果应用可以在容器中运行，它就可以在 Kubernetes 上运行。
- Kubernetes 不提供作为内置服务的中间件 (例如 消息中间件)、数据处理框架 (例如 Spark)、数据库 (例如 mysql)或集群存储系统 (例如 Ceph)。这些应用可以运行在 Kubernetes 上。
- Kubernetes 没有提供点击即部署的服务市场
- Kubernetes 从源代码到镜像都是非垄断的。 它不部署源代码且不构建您的应用程序。 持续集成 (CI) 工作流是一个不同用户和项目都有自己需求和偏好的领域。 所以我们支持在 Kubernetes 分层的 CI 工作流，但不指定它应该如何工作。
- Kubernetes 允许用户选择其他的日志记录，监控和告警系统 (虽然我们提供一些集成作为概念验证)
- Kubernetes 不提供或授权一个全面的应用程序配置语言/系统 (例如 <a href="https://github.com/google/jsonnet" target="_blank">jsonnet</a>).
- Kubernetes 不提供也不采用任何全面机器配置、保养、管理或自我修复系统

另一方面，许多 PaaS 系统运行 在 Kubernetes 上面，例如 <a href="https://github.com/openshift/origin" target="_blank">Openshift</a>, <a href="https://azure.microsoft.com/en-us/services/kubernetes-service/" target="_blank">Deis</a>, and <a href="https://eldarion.com/" target="_blank">Eldarion</a>。 您也可以自定义您自己的 PaaS, 与您选择的 CI 系统集成，或与 Kubernetes 一起使用: 将您的容器镜像部署到 Kubernetes。
<br/>
由于 Kubernetes 在应用级别而不仅仅在硬件级别上运行，因此它提供 PaaS 产品通用的一些功能，例如部署、扩展、负载均衡、日志记录、监控等。但是，Kubernetes 不是单一的，默认解决方案是可选和可插拔的。
<br/>
此处，Kubernetes 不仅仅是一个 “编排系统”；它消除了编排的需要。 “编排”技术定义的是工作流的执行: 从 A 到 B，然后到 C。相反，Kubernetes 是包括一套独立、可组合的控制过程，通过声明式语法使其连续地朝着期望状态驱动当前状态。 不需要告诉它具体从 A 到 C 的过程，只要告诉到 C 的状态即可。 也不需要集中控制；该方法更类似于”编舞”。这使得系统更容易使用并且更强大、更可靠、更具弹性和可扩展性
<br/>
### Kubernetes 是什么意思? K8s?
名称 Kubernetes 源于希腊语，意为 “舵手” 或 “飞行员”， 且是英文 “governor” 和 “cybernetic”的词根。 K8s 是通过将 8 个字母 “ubernete” 替换为 8 而导出的缩写。另外，在中文里，k8s 的发音与 Kubernetes 的发音比较接近。

## Kubernetes 组件
本文档概述了 Kubernetes 所需的各种二进制组件, 用于提供齐全的功能。
- Master组件
- Node组件
### Master 组件
Master 组件提供的集群控制。Master 组件对集群做出全局性决策(例如：调度)，以及检测和响应集群事件(副本控制器的replicas字段不满足时,启动新的副本)。
<br/>
Master 组件可以在集群中的任何节点上运行。然而，为了简单起见，设置脚本通常会启动同一个虚拟机上所有 Master 组件，并且不会在此虚拟机上运行用户容器。请参阅构建<a href="https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/" target="_blank">高可用性群集</a>示例对于多主机 VM 的设置。
#### API服务器
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/" target="_blank">kube-apiserver</a>对外暴露了Kubernetes API。它是的 Kubernetes 前端控制层。它被设计为水平扩展，即通过部署更多实例来缩放。请参阅<a href="https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/" target="_blank">构建高可用性群集</a>.

#### etcd
<a href="https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/" target="_blank">etcd</a> 用于 Kubernetes 的后端存储。所有集群数据都存储在此处，始终为您的 Kubernetes 集群的 etcd 数据提供备份计划。
#### kube-controller-manager
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/" target="_blank">kube-controller-manager</a>运行控制器，它们是处理集群中常规任务的后台线程。逻辑上，每个控制器是一个单独的进程，但为了降低复杂性，它们都被编译成独立的可执行文件，并在单个进程中运行。
<br/>
这些控制器包括:
- 节点控制器: 当节点移除时，负责注意和响应。
- 副本控制器: 负责维护系统中每个副本控制器对象正确数量的 Pod。
- 端点控制器: 填充 端点(Endpoints) 对象(即连接 Services & Pods)。
- 服务帐户和令牌控制器: 为新的命名空间创建默认帐户和 API 访问令牌.

#### 云控制器管理器-(cloud-controller-manager)
cloud-controller-manager 是用于与底层云提供商交互的控制器。云控制器管理器可执行组件是 Kubernetes v1.6 版本中引入的 Alpha 功能。
<br/>
cloud-controller-manager 仅运行云提供商特定的控制器循环。您必须在 kube-controller-manager 中禁用这些控制器循环，您可以通过在启动 kube-controller-manager 时将 --cloud-provider 标志设置为external来禁用控制器循环。
<br/>
cloud-controller-manager 允许云供应商代码和 Kubernetes 核心彼此独立发展，在以前的版本中，Kubernetes 核心代码依赖于云提供商特定的功能代码。在未来的版本中，云供应商的特定代码应由云供应商自己维护，并与运行 Kubernetes 的云控制器管理器相关联。
<br/>
以下控制器具有云提供商依赖关系:
- 节点控制器: 用于检查云提供商以确定节点是否在云中停止响应后被删除
- 路由控制器: 用于在底层云基础架构中设置路由
- 服务控制器: 用于创建，更新和删除云提供商负载平衡器
- 数据卷控制器: 用于创建，附加和装载卷，并与云提供商进行交互以协调卷
#### 调度器 - (kube-scheduler)
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/" target="_blank">kube-scheduler</a>监视没有分配节点的新创建的 Pod，选择一个节点供他们运行。
#### 插件(addons)
插件是实现集群功能的 Pod 和 Service。 Pods 可以通过 Deployments，ReplicationControllers 管理。插件对象本身是受命名空间限制的，被创建于 kube-system 命名空间。
<br/>
Addon 管理器用于创建和维护附加资源. 有关详细信息，请参阅<a href="http://releases.k8s.io/HEAD/cluster/addons">here</a>.

#### DNS
虽然其他插件并不是必需的，但所有 Kubernetes 集群都应该具有Cluster DNS，许多示例依赖于它。
<br/>
Cluster DNS 是一个 DNS 服务器，和您部署环境中的其他 DNS 服务器一起工作，为 Kubernetes 服务提供DNS记录。
<br/>
Kubernetes 启动的容器自动将 DNS 服务器包含在 DNS 搜索中。
<br/>
#### 用户界面
dashboard 提供了集群状态的只读概述。有关更多信息，请参阅<a href="https://kubernetes.io/docs/tasks/access-kubernetes-api/http-proxy-access-api/" target="_blank">使用HTTP代理访问 Kubernetes API</a>

#### 容器资源监控
<a href="https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/" target="_blank">容器资源监控</a>将关于容器的一些常见的时间序列度量值保存到一个集中的数据库中，并提供用于浏览这些数据的界面。
#### 集群层面日志
<a href="https://kubernetes.io/docs/concepts/cluster-administration/logging/" target="_blank">集群层面日志</a> 机制负责将容器的日志数据保存到一个集中的日志存储中，该存储能够提供搜索和浏览接口.

### 节点组件
节点组件在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行时环境。
#### kubelet
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/" target="_blank">kubelet</a>是主要的节点代理,它监测已分配给其节点的 Pod(通过 apiserver 或通过本地配置文件)，提供如下功能:
- 挂载 Pod 所需要的数据卷(Volume)。
- 下载 Pod 的 secrets。
- 通过 Docker 运行(或通过 rkt)运行 Pod 的容器。
- 周期性的对容器生命周期进行探测。
- 如果需要，通过创建 镜像 Pod（Mirror Pod） 将 Pod 的状态报告回系统的其余部分。
- 将节点的状态报告回系统的其余部分。
#### kube-proxy
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/" target="_blank">kube-proxy</a>通过维护主机上的网络规则并执行连接转发，实现了Kubernetes服务抽象。
#### docker
Docker 用于运行容器。
#### rkt
支持 rkt 运行容器作为 Docker 的试验性替代方案。
#### supervisord
supervisord 是一个轻量级的进程监控系统，可以用来保证 kubelet 和 docker 运行。
#### fluentd
fluentd 是一个守护进程，它有助于提供集群层面日志 集群层面的日志。

## Kubernetes API
<a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md" target="_blank">API协议文档</a>描述了主系统和API概念。
<br/>
<a href="https://kubernetes.io/docs/reference/" target="_blank">API参考文档</a>描述了API整体规范。
<br/>
<a href="https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/" target="_blank">访问文档</a>讨论了通过远程访问API的相关问题。
<br/>
Kubernetes API是系统描述性配置的基础。 <a href="https://kubernetes.io/docs/reference/kubectl/kubectl/" target="_blank">Kubectl</a> 命令行工具被用于创建、更新、删除、获取API对象。
<br/>
Kubernetes 通过API资源存储自己序列化状态(现在存储在<a href="https://etcd.io/" target="_blank">etcd</a>)。
<br/>
Kubernetes 被分成多个组件，各部分通过API相互交互。
- <a href="https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/#api-%E5%8F%98%E6%9B%B4" target="_blank">API 变更</a>
- <a href="https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/#openapi-%E5%92%8C-api-swagger-%E5%AE%9A%E4%B9%89" target="_blank">OpenAPI 和 API Swagger 定义</a>
- <a href="https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/#api-%E7%89%88%E6%9C%AC" target="_blank">API 版本</a>
- <a href="https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/#api-%E7%BB%84" target="_blank">API 组</a>
- <a href="https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/#%E5%90%AF%E7%94%A8-api-%E7%BB%84" target="_blank">启用 API 组</a>
- <a href="https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/#%E5%90%AF%E7%94%A8%E7%BB%84%E4%B8%AD%E8%B5%84%E6%BA%90" target="_blank">启用组中资源</a>

### API 变更
根据经验，任何成功的系统都需要随着新的用例出现或现有用例发生变化的情况下，进行相应的进化与调整。因此，我们希望Kubernetes API也可以保持持续的进化和调整。同时，在较长一段时间内，我们也希望与现有客户端版本保持良好的向下兼容性。一般情况下，增加新的API资源和资源字段不会导致向下兼容性问题发生；但如果是需要删除一个已有的资源或者字段，那么必须通过<a href="https://kubernetes.io/docs/reference/using-api/deprecation-policy/" target="_blank">API废弃流程</a>来进行。
<br/>
参考<a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md" target="_blank">API变更文档</a>，了解兼容性变更的要素以及如何变更API的流程。
### OpenAPI 和 API Swagger 定义
完整的 API 细节被记录在 <a href="https://www.openapis.org/" target="_blank">OpenAPI</a>.

随着 Kubernetes 1.10 版本的正式启用，Kubernetes API 服务通过 /openapi/v2 接口提供 OpenAPI 规范。 通过设置 HTTP 标头的规定了请求的结构。
<table style="width:100%;">
    <tr>
        <th style="background:#555;" width="30%">Header</th>
        <th style="background:#555;" width="70%">Possible Values</th>
    </tr>
    <tr>
        <td>Accept</td>
        <td>application/json, application/com.github.proto-openapi.spec.v2@v1.0+protobuf (the default content-type is application/json for */* or not passing this header)</td>
    </tr>
    <tr>
        <td>Accept-Encoding</td>
        <td>gzip (not passing this header is acceptable)</td>
    </tr>
</table>
在1.14版本之前，区分结构的接口通过(/swagger.json, /swagger-2.0.0.json, /swagger-2.0.0.pb-v1, /swagger-2.0.0.pb-v1.gz) 提供不同格式的 OpenAPI 规范。但是这些接口已经被废弃，并且已经在 Kubernetes 1.14 中被删除。


#### 获取 OpenAPI 规范的例子:
<table style="width:100%;">
    <tr>
        <th style="background:#555;" width="30%">1.10之前</th>
        <th style="background:#555;" width="70%">1.10开始</th>
    </tr>
    <tr>
        <td>GET /swagger.json</td>
        <td>GET /openapi/v2 Accept: application/json</td>
    </tr>
    <tr>
        <td>GET /swagger-2.0.0.pb-v1</td>
        <td>GET /openapi/v2 Accept: application/com.github.proto-openapi.spec.v2@v1.0+protobuf</td>
    </tr>
    <tr>
        <td>GET /swagger-2.0.0.pb-v1.gz</td>
        <td>GET /openapi/v2 Accept: application/com.github.proto-openapi.spec.v2@v1.0+protobuf Accept-Encoding: gzip</td>
    </tr>
</table>
Kubernetes实现了另一种基于Protobuf的序列化格式，该格式主要用于集群内通信，并在设计方案中进行了说明，每个模式的IDL文件位于定义API对象的Go软件包中。 在 1.14 版本之前， Kubernetes apiserver 也提供 API 服务用于返回 Swagger v1.2 Kubernetes API 规范通过 /swaggerapi 接口. 但是这个接口已经被废弃，并且在 Kubernetes 1.14 中已经被移除。

### API 版本
为了使删除字段或者重构资源表示更加容易，Kubernetes 支持 多个API版本。每一个版本都在不同API路径下，例如 /api/v1 或者 /apis/extensions/v1beta1。

我们选择在API级别进行版本化，而不是在资源或字段级别进行版本化，以确保API提供清晰，一致的系统资源和行为视图，并控制对已废止的API和/或实验性API的访问。 JSON和Protobuf序列化模式遵循架构更改的相同准则 - 下面的所有描述都同时适用于这两种格式。

请注意，API版本控制和软件版本控制只有间接相关性。 <a href="https://git.k8s.io/community/contributors/design-proposals/release/versioning.md" target="_blank">API和发行版本建议</a> 描述了API版本与软件版本之间的关系。

不同的API版本名称意味着不同级别的软件稳定性和支持程度。 每个级别的标准在<a href="https://git.k8s.io/community/contributors/devel/api_changes.md#alpha-beta-and-stable-versions" target="_blank">API变更文档</a>中有更详细的描述。 内容主要概括如下：

- Alpha 测试版本：
<ul>
    <li>版本名称包含了 alpha (例如：v1alpha1)</li>
    <li>可能是有缺陷的。启用该功能可能会带来隐含的问题，默认情况是关闭的。</li>
    <li>支持的功能可能在没有通知的情况下随时删除。</li>
    <li>API的更改可能会带来兼容性问题，但是在后续的软件发布中不会有任何通知。</li>
    <li>由于bugs风险的增加和缺乏长期的支持，推荐在短暂的集群测试中使用。</li>
</ul>
- Beta 测试版本：
<ul>
    <li>版本名称包含了 beta (例如: v2beta3)。</li>
    <li>代码已经测试过。启用该功能被认为是安全的，功能默认已启用。</li>
    <li>所有已支持的功能不会被删除，细节可能会发生变化。</li>
    <li>对象的模式和/或语义可能会在后续的beta测试版或稳定版中以不兼容的方式进行更改。 发生这种情况时，我们将提供迁移到下一个版本的说明。 这可能需要删除、编辑和重新创建API对象。执行编辑操作时需要谨慎行事，这可能需要停用依赖该功能的应用程序。</li>
    <li>建议仅用于非业务关键型用途，因为后续版本中可能存在不兼容的更改。 如果您有多个可以独立升级的集群，则可以放宽此限制。</li>
    <li>请尝试我们的 beta 版本功能并且给出反馈！一旦他们退出 beta 测试版，我们可能不会做出更多的改变。</li>
</ul>
- 稳定版本：
<ul>
    <li>版本名称是 vX，其中 X 是整数。</li>
    <li>功能的稳定版本将出现在许多后续版本的发行软件中。</li>
</ul>

### API 组
为了更容易地扩展Kubernetes API，我们实现了<a href="https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md" target="_blank">API组</a>。 API组在REST路径和序列化对象的 <b>apiVersion</b> 字段中指定。
<br/>
目前有几个API组正在使用中：
<br/>
1.核心组（通常被称为遗留组）位于REST路径 /api/v1 并使用 apiVersion：v1。
<br/>
2.指定的组位于REST路径 /apis/$GROUP_NAME/$VERSION，并使用 apiVersion：$GROUP_NAME/$VERSION （例如 apiVersion：batch/v1）。 在Kubernetes API参考中可以看到支持的API组的完整列表。
<br/>
社区支持使用以下两种方式来提供自定义资源对API进行扩展<a href="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/" target="_blank">自定义资源</a>：
<br/>
1.<a href="https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/" target="_blank">CustomResourceDefinition</a> 适用于具有非常基本的CRUD需求的用户。
<br/>
2.需要全套Kubernetes API语义的用户可以实现自己的apiserver， 并使用<a href="https://kubernetes.io/docs/tasks/access-kubernetes-api/configure-aggregation-layer/" target="_blank">聚合器</a> 为客户提供无缝的服务。

### 启用 API 组
某些资源和API组默认情况下处于启用状态。 可以通过在apiserver上设置 --runtime-config 来启用或禁用它们。 --runtime-config 接受逗号分隔的值。 例如：要禁用batch/v1，请设置 --runtime-config=batch/v1=false，以启用batch/v2alpha1，请设置--runtime-config=batch/v2alpha1。 该标志接受描述apiserver的运行时配置的逗号分隔的一组键值对。
<br/>
<b style="font-size:20px;">重要:loudspeaker:</b>
:::danger 重要 :
启用或禁用组或资源需要重新启动apiserver和控制器管理器来使得 --runtime-config 更改生效。
:::

### 启用组中资源
DaemonSets，Deployments，HorizontalPodAutoscalers，Ingress，Jobs 和 ReplicaSets是默认启用的。 其他扩展资源可以通过在apiserver上设置 --runtime-config 来启用。 
<br/>
--runtime-config 接受逗号分隔的值。 例如：要禁用 Deployment 和 Ingress， 请设置 
<br/>
--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingress=false


## Kubernetes 对象管理
kubectl 命令行工具支持多种不同的方式来创建和管理 Kubernetes 对象。本文档概述了不同的方法。阅读 Kubectl book 来了解 kubectl 管理对象的详细信息。
### 管理技巧
:::danger 
警告：
应该只使用一种技术来管理 Kubernetes 对象。混合和匹配技术作用在同一对象上将导致未定义行为。
:::
| Management technique             | Operates on           | Recommended environment  | Supported writers  | Learning curve |
| -------------------------------- |:---------------------:| ------------------------:|-------------------:|---------------:|
| Imperative commands              | Live objects          | Development projects     | 1+                 | Lowest         |  
| Imperative object configuration  | Individual files      | Production projects      | 1                  | Moderate       |  
| Declarative object configuration | Directories of files  | Production projects      | 1+                 | Highes         |  

### 命令式命令
使用命令式命令时，用户可以在集群中的活动对象上进行操作。用户将操作传给 kubectl 命令作为参数或标志。
<br/>
这是开始或者在集群中运行一次性任务的最简单方法。因为这个技术直接在活动对象上操作，所以它不提供以前配置的历史记录。
<br/>
例子
<br/>
通过创建 Deployment 对象来运行 nginx 容器的实例：
<br/>
kubectl run nginx --image nginx
<br/>
使用不同的语法来达到同样的上面的效果：
<br/>
kubectl create deployment nginx --image nginx
<br/>
<b>权衡</b>
<br/>
与对象配置相比的优点：

- 命令简单，易学且易于记忆。
- 命令仅需一步即可对集群进行更改。
与对象配置相比的缺点：

- 命令不与变更审查流程集成。
- 命令不提供与更改关联的审核跟踪。
- 除了实时内容外，命令不提供记录源。
- 命令不提供用于创建新对象的模板。

### 命令式对象配置
在命令式对象配置中，kubectl 命令指定操作（创建，替换等），可选标志和至少一个文件名。指定的文件必须包含 YAML 或 JSON 格式的对象的完整定义。

有关对象定义的详细信息，请查看 <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/" target="_blank">API 参考1.16</a>。

:::danger
replace 命令式命令将现有规范替换为新提供的规范，并删除对配置文件中缺少的对象的所有更改。此方法不应与规范独立于配置文件进行更新的资源类型一起使用。比如类型为 LoadBalancer 的服务，它的 externalIPs 字段就是独立于集群的配置进行更新。
:::

例子
<br/>
创建在配置文件中定义的对象：
<br/>
kubectl create -f nginx.yaml
<br/>
删除在两个配置文件中定义的对象：
<br/>
kubectl delete -f nginx.yaml -f redis.yaml
<br/>
通过覆盖实时配置来更新配置文件中定义的对象：
<br/>
kubectl replace -f nginx.yaml
<br/>
#### 权衡
与命令式命令相比的优点：
- 对象配置可以存储在源控制系统中，比如 Git。
- 对象配置可以与流程集成，例如在推送和审计之前检查更新。
- 对象配置提供了用于创建新对象的模板。
与命令式命令相比的缺点：
- 对象配置需要对对象架构有基本的了解。
- 对象配置需要额外的写 YAML 文件的步骤。
与声明式对象配置相比的优点：
- 命令式对象配置行为更加简单易懂。
- 从 Kubernetes 1.5 版本开始，命令式对象配置更加成熟。
与声明式对象配置相比的缺点：
- 命令式对象配置针对文件而不是目录上效果最佳。
- 对活动对象的更新必须反映在配置文件中，否则将在下一次替换是丢失

### 声明式对象配置
使用声明式对象配置时，用户对本地存储的对象配置文件进行操作，但是用户未定义要对该文件执行的操作。会自动通过 kubectl 按对象检测来创建、更新和删除对象。这使得可以在目录上工作，其中可能需要对不同的对象执行不同的操作。
:::tip 注意：
声明式对象配置保留其他编写者所做的修改，即使这些更改并未合并到对象配置文件中。可以通过使用 patch API 操作仅写入观察到的差异，而不是使用 replace API 操作来替换整个对象配置来实现
:::

<b>例子</b>
处理 configs 目录中的所有对象配置文件，创建并更新活动对象。可以首先使用 diff 子命令查看将要进行的更改，然后在进行应用：
<br/>
```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

递归处理目录：
<br/>
```bash
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```
#### 权衡
与命令式对象配置相比的优点：
- 即使未将对活动对象所做的更改未合并回到配置文件中，也将保留这些更改。
- 声明性对象配置更好地支持对目录进行操作并自动检测每个对象的操作类型（创建，修补，删除）。
<br/>
<br/>
与命令式对象配置相比的缺点：
- 声明式对象配置难于调试并且出现异常时难以理解。
- 使用差异的部分更新会创建复杂的合并和补丁操作。

## 名称
Kubernetes REST API 中的所有对象都由名称和 UID 明确标识。
<br/>
对于非唯一的用户提供的属性，Kubernetes 提供了<a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/" target="_blank">标签</a>和<a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/" target="_blank">注释</a>。
<br/>
有关名称和 UID 的精确语法规则，请参见标识符设计文档。
<br/>
### 名称
客户端提供的字符串，引用资源 url 中的对象，如/api/v1/pods/some name。
<br/>
一次只能有一个给定类型的对象具有给定的名称。但是，如果删除对象，则可以创建同名的新对象。
<br/>
按照惯例，Kubernetes 资源的名称最大长度应为 253 个字符，由小写字母、数字、-和 . 组成，但某些资源有更具体的限制。
<br/>
例如，下面是一个配置文件，Pod 名为 nginx demo，容器名为 nginx：
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```

### UIDs
Kubernetes 系统生成的字符串，唯一标识对象。
<br/>
在 Kubernetes 集群的整个生命周期中创建的每个对象都有一个不同的 uid，它旨在区分类似实体的历史事件。
## 命名空间
Kubernetes 支持多个虚拟集群，它们底层依赖于同一个物理集群。 这些虚拟集群被称为命名空间。
### 何时使用多个命名空间
命名空间适用于存在很多跨多个团队或项目的用户的场景。 对于只有几到几十个用户的集群，根本不需要创建或考虑命名空间。当您需要命名空间提供的特性时，请开始使用它们。
<br/>
命名空间为名称提供了一个范围。 资源的名称需要在命名空间内是惟一的，但不能跨命名空间。命名空间不能嵌套在另外一个命名空间内，而且每个 Kubernetes 资源只能属于一个命名空间。
<br/>
命名空间是在多个用户之间划分集群资源的一种方法（通过<a href="https://kubernetes.io/docs/concepts/policy/resource-quotas/" target="_blank">资源配额</a>）。
<br/>
在 Kubernetes 未来版本中，相同命名空间中的对象默认将具有相同的访问控制策略。
<br/>
不需要使用多个命名空间来分隔轻微不同的资源，例如同一软件的不同版本： 使用标签来区分同一命名空间中的不同资源。
### 使用命名空间
命名空间的创建和删除已在<a href="https://kubernetes.io/docs/tasks/administer-cluster/namespaces/" target="_blank">命名空间的管理指南文档</a>中进行了描述。
#### 查看命名空间
您可以使用以下命令列出集群中现存的命名空间：
```sh
kubectl get namespace

返回结果：
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
kube-public   Active    1d
```
Kubernetes 会创建三个初始命名空间： Kubernetes starts with three initial namespaces:
- default 没有指明使用其它命名空间的对象所使用的默认命名空间
- kube-system Kubernetes 系统创建对象所使用的命名空间
- kube-public 这个命名空间是自动创建的，所有用户（包括未经过身份验证的用户）都可以读取它。这个命名空间主要用于集群使用，以防某些资源在整个集群中应该是可见和可读的。这个命名空间的公共方面只是一种约定，而不是要求。
<br>
<span style="color:red;">下面是说明的英文：</span>
- default   ：The default namespace for objects with no other namespace
- kube-system  ：The namespace for objects created by the Kubernetes system
- kube-public  ：This namespace is created automatically and is readable by all users (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement

#### 为请求设置命名空间
要为当前的请求设定一个命名空间，请使用 --namespace 参数。
```sh
例如：
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

#### 设置命名空间首选项
您可以永久保存该上下文中所有后续 kubectl 命令使用的命名空间。
```yaml
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# 验证查看当前的命令空间（Validate it）：
kubectl config view | grep namespace:
```

### 命名空间和 DNS
当您创建一个 [服务](https://kubernetes.io/docs/concepts/services-networking/service/) 时，Kubernetes 会创建一个相应的[DNS 条目](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)。
```yaml
该条目的形式是 <service-name>.<namespace-name>.svc.cluster.local， 
这意味着如果容器只使用 <service-name>，它将被解析到本地命名空间的服务。 
这对于跨多个命名空间（如开发、分级和生产）使用相同的配置非常有用。 
如果您希望跨命名空间访问，则需要使用完全限定域名（FQDN）。
```

### 并非所有对象都在命名空间中
大多数 kubernetes 资源（例如 Pod、服务、副本控制器等）都位于某些命名空间中。 但是命名空间资源本身并不在命名空间中。
<br/>
而且底层资源，例如[节点](https://kubernetes.io/docs/concepts/architecture/nodes/)和持久化卷不属于任何命名空间。
<br/>
查看哪些 Kubernetes 资源在命名空间中，哪些不在命名空间中：
```sh
# In a namespace
kubectl api-resources --namespaced=true

# Not in a namespace
kubectl api-resources --namespaced=false
```

## Labels and Selectors
标签是附加到对象（例如Pods）的键/值对。标签旨在用于指定对用户有意义且与用户相关的对象的标识属性，但并不直接暗示核心系统的语义。标签可用于组织和选择对象的子集。标签可以在创建时附加到对象，然后可以随时添加和修改。每个对象可以定义一组键/值标签。每个键对于给定的对象必须是唯一的。
(Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system. Labels can be used to organize and to select subsets of objects. Labels can be attached to objects at creation time and subsequently added and modified at any time. Each object can have a set of key/value labels defined. Each Key must be unique for a given object.)
```yaml
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```
Labels allow for efficient queries and watches and are ideal for use in UIs and CLIs. Non-identifying information should be recorded using [annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/).

### Motivation
标签使用户能够以松散耦合的方式将自己的组织结构映射到系统对象上，而无需客户端存储这些映射。
<br/>
服务部署和批处理管道通常是多维实体（例如，多个分区或部署，多个发布轨道，多层，每层多个微服务）。管理通常需要横切操作，这破坏了严格层次表示的封装，尤其是由基础结构而非用户确定的刚性层次。
<br/>
标签示例：
<br/>
- "release" : "stable"， "release" : "canary"
- "environment" : "dev"，"environment" : "qa"，"environment" : "production"
- "tier" : "frontend"，"tier" : "backend"，"tier" : "cache"
- "partition" : "customerA"， "partition" : "customerB"
- "track" : "daily"， "track" : "weekly"

这些只是常用标签的示例；您可以自由制定自己的约定。请记住，标签键对于给定对象必须是唯一的。

### 语法和字符集
Labels are key/value pairs. Valid label keys have two segments: an optional prefix and name, separated by a slash (/). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (.), not longer than 253 characters in total, followed by a slash (/).
<br/>
If the prefix is omitted, the label Key is presumed to be private to the user. Automated system components (e.g. kube-scheduler, kube-controller-manager, kube-apiserver, kubectl, or other third-party automation) which add labels to end-user objects must specify a prefix.
<br/>
The kubernetes.io/ and k8s.io/ prefixes are reserved for Kubernetes core components.
<br/>
Valid label values must be 63 characters or less and must be empty or begin and end with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.
<br/>
For example, here’s the configuration file for a Pod that has two labels environment: production and app: nginx :
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```

### Label selectors
Unlike [names and UIDs](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/), labels do not provide uniqueness. In general, we expect many objects to carry the same label(s).

Via a label selector, the client/user can identify a set of objects. The label selector is the core grouping primitive in Kubernetes.

The API currently supports two types of selectors: equality-based and set-based. A label selector can be made of multiple requirements which are comma-separated. In the case of multiple requirements, all must be satisfied so the comma separator acts as a logical AND (&&) operator.

The semantics of empty or non-specified selectors are dependent on the context, and API types that use selectors should document the validity and meaning of them.

:::tip
 For some API types, such as ReplicaSets, the label selectors of two instances must not overlap within a namespace, or the controller can see that as conflicting instructions and fail to determine how many replicas should be present
:::

### Equality-based requirement
Equality- or inequality-based requirements allow filtering by label keys and values. Matching objects must satisfy all of the specified label constraints, though they may have additional labels as well. Three kinds of operators are admitted =,==,!=. The first two represent equality (and are simply synonyms), while the latter represents inequality. For example:
<br/>
environment = production
tier != frontend
<br/>
The former selects all resources with key equal to environment and value equal to production. The latter selects all resources with key equal to tier and value distinct from frontend, and all resources with no labels with the tier key. One could filter for resources in production excluding frontend using the comma operator: environment=production,tier!=frontend
One usage scenario for equality-based label requirement is for Pods to specify node selection criteria. For example, the sample Pod below selects nodes with the label “accelerator=nvidia-tesla-p100”.
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```
### Set-based requirement
Set-based label requirements allow filtering keys according to a set of values. Three kinds of operators are supported: in,notin and exists (only the key identifier). For example:
<br/>
```yaml
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```
<br/>
The first example selects all resources with key equal to environment and value equal to production or qa. The second example selects all resources with key equal to tier and values other than frontend and backend, and all resources with no labels with the tier key. The third example selects all resources including a label with key partition; no values are checked. The fourth example selects all resources without a label with key partition; no values are checked. Similarly the comma separator acts as an AND operator. So filtering resources with a partition key (no matter the value) and with environment different than  qa can be achieved using partition,environment notin (qa). The set-based label selector is a general form of equality since environment=production is equivalent to environment in (production); similarly for != and notin.
 
 Set-based requirements can be mixed with equality-based requirements. For example: partition in (customerA, customerB),environment!=qa
 
 ### API
 LIST and WATCH filtering
 LIST and WATCH operations may specify label selectors to filter the sets of objects returned using a query parameter. Both requirements are permitted (presented here as they would appear in a URL query string):
 
 - equality-based requirements: ?labelSelector=environment%3Dproduction,tier%3Dfrontend
 - set-based requirements: ?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29
 Both label selector styles can be used to list or watch resources via a REST client. For example, targeting apiserver with kubectl and using equality-based one may write:
 ```yaml
kubectl get pods -l environment=production,tier=frontend 
or using set-based requirements:

kubectl get pods -l 'environment in (production),tier in (frontend)'
As already mentioned set-based requirements are more expressive.  For instance, they can implement the OR operator on values:

kubectl get pods -l 'environment in (production, qa)'
or restricting negative matching via exists operator:

kubectl get pods -l 'environment,environment notin (frontend)'
```
### Set references in API objects
Some Kubernetes objects, such as [services](https://kubernetes.io/docs/concepts/services-networking/service/) and [replicationcontrollers](https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/), also use label selectors to specify sets of other resources, such as [pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/)

### Service and ReplicationController
The set of pods that a service targets is defined with a label selector. Similarly, the population of pods that a replicationcontroller should manage is also defined with a label selector.

Labels selectors for both objects are defined in json or yaml files using maps, and only equality-based requirement selectors are supported:
```yaml
"selector": {
    "component" : "redis",
}

or ==>

selector:
    component: redis
    
this selector (respectively in json or yaml format) is equivalent to component=redis or component in (redis)
```
### Resources that support set-based requirements
Newer resources, such as [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/), 
[Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), 
[Replica Set](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/), 
and [Daemon Set](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/), support set-based requirements as well.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```
:::tip 说明
matchLabels是{key,value}成对的Map。一个单一的{key,value}在matchLabels Map相当于一个元件matchExpressions，其key字段是“键”，
则operator是“以”和values阵列仅包含“值”。
matchExpressions是Pod选择器要求的列表。有效的运算符包括In，NotIn，Exists和 DoesNotExist。对于In和NotIn，
设置的值必须为非空。来自matchLabels和的所有需求都matchExpressions被“与”在一起-必须完全满足才能匹配。
:::

### Selecting sets of nodes
One use case for selecting over labels is to constrain the set of nodes onto which a pod can schedule.
 See the documentation on [node selection](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/) for more information

## 注解
你可以使用 Kubernetes 注解为对象附加任意的非标识的元数据。客户端程序（例如工具和库）能够获取这些元数据信息。
### 为对象附加元数据
您可以使用标签或注解将元数据附加到 Kubernetes 对象。 标签可以用来选择对象和查找满足某些条件的对象集合。 
相反，注解不用于标识和选择对象。 注解中的元数据，可以很小，也可以很大，可以是结构化的，也可以是非结构化的，能够包含标签不允许的字符。
<br/>
注解和标签一样，是键/值对:
```yaml
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```
以下是一些例子，用来说明哪些信息可以使用注解来记录
- 由声明性配置所管理的字段。 将这些字段附加为注解，能够将它们与客户端或服务端设置的默认值、自动生成的字段以及通过自动调整大小或自动伸缩系统设置的字段区分开来。
- 构建、发布或镜像信息（如时间戳、发布 ID、Git 分支、PR 数量、镜像哈希、仓库地址）。
- 指向日志记录、监控、分析或审计仓库的指针。
- 可用于调试目的的客户端库或工具信息：例如，名称、版本和构建信息。
- 用户或者工具/系统的来源信息，例如来自其他生态系统组件的相关对象的 URL。
- 推出的轻量级工具的元数据信息：例如，配置或检查点。
- 负责人员的电话或呼机号码，或指定在何处可以找到该信息的目录条目，如团队网站。
从用户到最终运行的指令，以修改行为或使用非标准功能。
<br/>
您可以将这类信息存储在外部数据库或目录中而不使用注解，但这样做就使得开发人员很难生成用于部署、管理、自检的客户端共享库和工具

### 语法和字符集
注解 存储的形式是键/值对。有效的注解键分为两部分：可选的前缀和名称，以斜杠（/）分隔。
 名称段是必需项，并且必须在63个字符以内，以字母数字字符（[a-z0-9A-Z]）开头和结尾，并允许使用破折号（-），下划线（_），点（.）和字母数字。 前缀是可选的。 
 如果指定，则前缀必须是DNS子域：一系列由点（.）分隔的DNS标签，总计不超过253个字符，后跟斜杠（/）。 如果省略前缀，则假定注释键对用户是私有的。 
由系统组件添加的注释（例如，kube-scheduler，kube-controller-manager，kube-apiserver，kubectl 或其他第三方组件），必须为终端用户添加注释前缀。
<br/>
kubernetes.io / 和 k8s.io / 前缀是为Kubernetes核心组件保留的。

例如，这是Pod的配置文件，其注释为 imageregistry：https：// hub.docker.com / 
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```
## 字段选择器
字段选择器允许您根据一个或多个资源字段的值[筛选 Kubernetes 资源](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)。 下面是一些使用字段选择器查询的例子：
- metadata.name=my-service
- metadata.namespace!=default
- status.phase=Pending
下面这个 kubectl 命令将筛选出[status.phase](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)字段值为 Running 的所有 Pod：
```sh
kubectl get pods --field-selector status.phase=Running
```
:::tip 注意
字段选择器本质上是资源*过滤器*。默认情况下，字段选择器/过滤器是未被应用的，这意味着指定类型的所有资源都会被筛选出来。 这使得以下的两个 kubectl 查询是等价的：
<br/>
kubectl get pods
<br/>
kubectl get pods --field-selector ""
:::

### 支持的字段
不同的 Kubernetes 资源类型支持不同的字段选择器。 所有资源类型都支持 metadata.name 和 metadata.namespace 字段。 使用不被支持的字段选择器会产生错误，例如：
```sh
kubectl get ingress --field-selector foo.bar=baz
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```
### 支持的运算符
您可以使用 =、==和 != 对字段选择器进行运算（= 和 == 的意义是相同的）。 例如，下面这个 kubectl 命令将筛选所有不属于 default 名称空间的 Kubernetes Service：
<br/>
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default

### 链式选择器
同[标签](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)和其他选择器一样，字段选择器可以通过使用逗号分隔的列表组成一个选择链。 下面这个 kubectl 命令将筛选 status.phase 字段不等于 Running 同时 spec.restartPolicy 字段等于 Always 的所有 Pod：
```sh
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```
### 多种资源类型
您能够跨多种资源类型来使用字段选择器。 下面这个 kubectl 命令将筛选出所有不在 default 命名空间中的 StatefulSet 和 Service：
<br/>
```sh
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
## 推荐使用的标签
除了 kubectl 和 dashboard 之外，您可以其他工具来可视化和管理 Kubernetes 对象。 一组通用的标签可以让多个工具之间互操作，用所有工具都能理解的通用方式描述对象。
<br/>
除了支持工具外，推荐的标签还以一种可以查询的方式描述了应用程序。
<br/>
元数据围绕 应用（application） 的概念进行组织。Kubernetes 不是 平台即服务（PaaS），没有或强制执行正式的应用程序概念。 相反，应用程序是非正式的，并使用元数据进行描述。应用程序包含的定义是松散的。
:::tip 注意
这些是推荐的标签。它们使管理应用程序变得更容易但不是任何核心工具所必需的。
:::
共享标签和注解都使用同一个前缀：app.kubernetes.io。没有前缀的标签是用户私有的。共享前缀可以确保共享标签不会干扰用户自定义的标签。

### 标签
为了充分利用这些标签，应该在每个资源对象上都使用它们。

<table>
    <tr>
        <th style="background:#555;" width="35%">键</th>
        <th style="background:#555;" width="35%">描述</th>
        <th style="background:#555;" width="15%">示例</th>
        <th style="background:#555;" width="15%">类型</th>
    </tr>
    <tr>
        <td>app.kubernetes.io/name</td>
        <td>应用程序的名称</td>
        <td>mysql</td>
        <td>字符串</td>
    </tr>
    <tr>
        <td>app.kubernetes.io/instance</td>
        <td>用于唯一确定应用实例的名称</td>
        <td>wordpress-abcxzy</td>
        <td>字符串</td>
    </tr>
    <tr>
        <td>app.kubernetes.io/version</td>
        <td>应用程序的当前版本（例如，语义版本，修订版哈希等）</td>
        <td>5.7.21</td>
        <td>字符串</td>
    </tr>
    <tr>
        <td>app.kubernetes.io/component</td>
        <td>架构中的组件</td>
        <td>database</td>
        <td>字符串</td>
    </tr>
    <tr>
        <td>app.kubernetes.io/part-of</td>
        <td>此级别的更高级别应用程序的名称</td>
        <td>wordpress</td>
        <td>字符串</td>
    </tr>
    <tr>
        <td>app.kubernetes.io/managed-by</td>
        <td>用于管理应用程序的工具</td>
        <td>helm</td>
        <td>字符串</td>
    </tr>
</table>
为说明这些标签的实际使用情况，请看下面的 StatefulSet 对象：

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

### 应用和应用实例
应用可以在 Kubernetes 集群中安装一次或多次。在某些情况下，可以安装在同一命名空间中。例如，可以不止一次地为不同的站点安装不同的 wordpress。
<br/>
应用的名称和实例的名称是分别记录的。例如，某 WordPress 实例的 app.kubernetes.io/name 为 wordpress，而其实例名称表现为 app.kubernetes.io/instance 的属性值 wordpress-abcxzy。这使应用程序和应用程序的实例成为可能是可识别的。应用程序的每个实例都必须具有唯一的名称。
### 示例
为了说明使用这些标签的不同方式，以下示例具有不同的复杂性。
#### 一个简单的无状态服务
考虑使用 Deployment 和 Service 对象部署的简单无状态服务的情况。以下两个代码段表示如何以最简单的形式使用标签。
<br/>
下面的 Deployment 用于监督运行应用本身的 pods。
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

下面的 Service 用于暴露应用。
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```
### 带有一个数据库的 Web 应用程序
考虑一个稍微复杂的应用：一个使用 Helm 安装的 Web 应用（WordPress），其中 使用了数据库（MySQL）。以下代码片段说明用于部署此应用程序的对象的开始。
<br/>
以下 Deployment 的开头用于 WordPress：
<br/>
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```
这个 Service 用于暴露 WordPress：
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```
MySQL 作为一个 StatefulSet 暴露，包含它和它所属的较大应用程序的元数据：
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```
Service 用于将 MySQL 作为 WordPress 的一部分暴露：
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/version: "5.7.21"
...
```
使用 MySQL StatefulSet 和 Service，您会注意到有关 MySQL 和 Wordpress 的信息，包括更广泛的应用程序。

## 理解 Kubernetes 对象
本页说明了 Kubernetes 对象在 Kubernetes API 中是如何表示的，以及如何在 .yaml 格式的文件中表示。
### 理解 Kubernetes 对象
在 Kubernetes 系统中，Kubernetes 对象 是持久化的实体。Kubernetes 使用这些实体去表示整个集群的状态。特别地，它们描述了如下信息：
- 哪些容器化应用在运行（以及在哪个 Node 上）
- 可以被应用使用的资源
- 关于应用运行时表现的策略，比如重启策略、升级策略，以及容错策略
Kubernetes 对象是 “目标性记录” —— 一旦创建对象，Kubernetes 系统将持续工作以确保对象存在。通过创建对象，本质上是在告知 Kubernetes 系统，所需要的集群工作负载看起来是什么样子的，这就是 Kubernetes 集群的 期望状态（Desired State）。
<br/>
操作 Kubernetes 对象 —— 无论是创建、修改，或者删除 —— 需要使用 [Kubernetes API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)。
比如，当使用 kubectl 命令行接口时，CLI 会执行必要的 Kubernetes API 调用，也可以在程序中使用 [客户端库](https://kubernetes.io/docs/reference/using-api/client-libraries/) 直接调用 Kubernetes API。

### 对象规约（Spec）与状态（Status）
每个 Kubernetes 对象包含两个嵌套的对象字段，它们负责管理对象的配置：对象 spec 和 对象 status 。 spec 是必需的，它描述了对象的 期望状态（Desired State） —— 希望对象所具有的特征。 status 描述了对象的 实际状态（Actual State） ，它是由 Kubernetes 系统提供和更新的。在任何时刻，Kubernetes 控制面一直努力地管理着对象的实际状态以与期望状态相匹配。
<br/>
例如，Kubernetes Deployment 对象能够表示运行在集群中的应用。 当创建 Deployment 时，可能需要设置 Deployment 的规约，以指定该应用需要有 3 个副本在运行。 Kubernetes 系统读取 Deployment 规约，并启动我们所期望的该应用的 3 个实例 —— 更新状态以与规约相匹配。 如果那些实例中有失败的（一种状态变更），Kubernetes 系统通过修正来响应规约和状态之间的不一致 —— 这种情况，会启动一个新的实例来替换。
关于对象 spec、status 和 metadata 的更多信息，查看 [Kubernetes API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md) 约定。

### 描述 Kubernetes 对象
当创建 Kubernetes 对象时，必须提供对象的规约，用来描述该对象的期望状态，以及关于对象的一些基本信息（例如名称）。 当使用 Kubernetes API 创建对象时（或者直接创建，或者基于kubectl），API 请求必须在请求体中包含 JSON 格式的信息。 大多数情况下，需要在 .yaml 文件中为 kubectl 提供这些信息。 kubectl 在发起 API 请求时，将这些信息转换成 JSON 格式。
<br/>
这里有一个 .yaml 示例文件，展示了 Kubernetes Deployment 的必需字段和对象规约：
```yaml
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # tells deployment to run 2 pods matching the template
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
使用类似于上面的 .yaml 文件来创建 Deployment，一种方式是使用 kubectl 命令行接口（CLI）中的 kubectl apply 命令， 将 .yaml 文件作为参数。下面是一个示例
```yaml
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
输出类似如下这样：
deployment.apps/nginx-deployment created
```
### 必需字段
在想要创建的 Kubernetes 对象对应的 .yaml 文件中，需要配置如下的字段：
- apiVersion - 创建该对象所使用的 Kubernetes API 的版本
- kind - 想要创建的对象的类型
- metadata - 帮助识别对象唯一性的数据，包括一个 name 字符串、UID 和可选的 namespace

也需要提供对象的 spec 字段。对象 spec 的精确格式对每个 Kubernetes 对象来说是不同的，包含了特定于该对象的嵌套字段。
Kubernetes API 参考能够帮助我们找到任何我们想创建的对象的 spec 格式。 
例如，可以从 [这里](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#podspec-v1-core) 查看 Pod 的 spec 格式，
 并且可以从 [这里](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.16/#deploymentspec-v1-apps) 查看 Deployment 的 spec 格式。














