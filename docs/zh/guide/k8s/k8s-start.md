# 概念Kubernetes 1.16
概念部分可以帮助你了解 Kubernetes 的各个组成部分以及 Kubernetes 用来表示集群的一些抽象概念，并帮助你更加深入的理解 Kubernetes 是如何工作的。

[[toc]]


## 概述
要使用 Kubernetes，你需要用 Kubernetes API 对象 来描述集群的 预期状态（desired state） ：包括你需要运行的应用或者负载，它们使用的镜像、副本数，以及所需网络和磁盘资源等等。你可以使用命令行工具 kubectl 来调用 Kubernetes API 创建对象，通过所创建的这些对象来配置预期状态。你也可以直接调用 Kubernetes API 和集群进行交互，设置或者修改预期状态。
<br/>
一旦你设置了你所需的目标状态，Kubernetes 控制面（control plane） 会通过 Pod 生命周期事件生成器( PLEG )，促成集群的当前状态符合其预期状态。为此，Kubernetes 会自动执行各类任务，比如运行或者重启容器、调整给定应用的副本数等等。Kubernetes 控制面由一组运行在集群上的进程组成：
- Kubernetes 主控组件（Master） 包含三个进程，都运行在集群中的某个节上，通常这个节点被称为 master 节点。这些进程包括：
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/" target="_blank">kube-apiserver</a>、
<a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/" target="_blank">kube-controller-manager</a> 
和 <a href="https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/" target="_blank">kube-scheduler</a>。
- 集群中的每个非 master 节点都运行两个进程：
   <ul>
    <li>
        <a href="https://kubernetes.io/docs/admin/kubelet/" target="_blank">kubelet</a>
        ，和 master 节点进行通信。
    </li>
    <li>
        <a href="https://kubernetes.io/docs/admin/kube-proxy/" target="_blank">kube-proxy</a>
        ，一种网络代理，将 Kubernetes 的网络服务代理到每个节点上。
    </li>
   </ul>

## Kubernetes 对象
- 基本的 Kubernetes 对象包括：
<ul>
    <li><a href="https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/" target="_blank">Pod</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/services-networking/service/" target="_blank">Service</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/storage/volumes/" target="_blank">Volumes</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/" target="_blank">Namespace</a></li>
</ul>
另外，Kubernetes 包含大量的被称作控制器（controllers） 的高级抽象。控制器基于基本对象构建并提供额外的功能和方便使用的特性。具体包括：
<ul>
    <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/" target="_blank">ReplacaSet</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank">Deployment</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/" target="_blank">StatefulSet</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/" target="_blank">DaemonSet</a></li>
    <li><a href="https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/" target="_blank">Job</a></li>
</ul>
