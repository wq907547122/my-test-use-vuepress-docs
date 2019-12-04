# 安装minikube
安装的要求
<br/>

[[toc]]

## 安装docker
- 略
## 安装kubectl
- step1:访问官方github网址下载kubectl的二进制文件
```
https://github.com/kubernetes/kubernetes/releases 
```
![](/images/minikube/3.png)
- step 2: 找到想使用的发布版本，在每个发布版本的最后一行有类似“CHANGELOG-1.16.md”这样的内容，点击超链进入；
- step 3: 然后进入“Client Binaries”区域；
- step 4: 选择和目标机器系统匹配的二进制包下载；
![](/images/minikube/4.png)
- step 5: 解压缩，放入/usr/local/bin目录；
tar -zxvf kubernetes-client-linux-amd64.tar.gz
```sh
tar -zxvf kubernetes-client-linux-amd64.tar.gz
cd kubernetes/client/bin/
cp kubectl /usr/local/bin/
```
- step 6：kubectl是否安装成功
![](/images/minikube/5.png)


## 安装minikube
已经是在虚拟机上安装，需要添加 --vm-driver=none 参数
```sh
minikube start --vm-driver=none
```
- --vm-driver=none这是说表示minikube运行在宿主机不需要KVM或者VirtualBox，但根据官方文档的介绍，我们还是不采用这种方法
- 在下载的因为google需要翻墙，所以我们不能下载安装需要的docker镜像，我看可以通过手工下载阿里的镜像
```sh
需要将需要下载的镜像的所有前缀修改为：registry.cn-hangzhou.aliyuncs.com/google_containers
下面是全部的前缀需要下载的镜像：
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.3.15-0
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-controller-manager:v1.16.2
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-sidecar-amd64:1.14.13
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.13
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/coredns:1.6.2
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-kube-dns-amd64:1.14.13
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.16.2
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-addon-manager:v9.0.2 docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kubernetes-dashboard-amd64:v1.10.1
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-proxy:v1.16.2
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/storage-provisioner:v1.8.1
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-scheduler:v1.16.2
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.1

然后我们使用tag,修改为安装minikube需要的镜像：执行如下的命令
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.3.15-0 k8s.gcr.io/etcd:3.3.15-0
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-controller-manager:v1.16.2 k8s.gcr.io/kube-controller-manager:v1.16.2
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-sidecar-amd64:1.14.13 k8s.gcr.io/k8s-dns-sidecar-amd64:1.14.13
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.13 k8s.gcr.io/k8s-dns-dnsmasq-nanny-amd64:1.14.13
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/coredns:1.6.2 k8s.gcr.io/coredns:1.6.2
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-kube-dns-amd64:1.14.13 k8s.gcr.io/k8s-dns-kube-dns-amd64:1.14.13
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.16.2 k8s.gcr.io/kube-apiserver:v1.16.2
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-addon-manager:v9.0.2 k8s.gcr.io/kube-addon-manager:v9.0.2 
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kubernetes-dashboard-amd64:v1.10.1 k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.1
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-proxy:v1.16.2 k8s.gcr.io/kube-proxy:v1.16.2
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/storage-provisioner:v1.8.1 gcr.io/k8s-minikube/storage-provisioner:v1.8.1
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-scheduler:v1.16.2 k8s.gcr.io/kube-scheduler:v1.16.2
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.1 k8s.gcr.io/pause:3.1

```

下载istio:1.0.0的地址:
```sh
docker pull daocloud.io/liukuan73/proxy_init:1.0.0
docker pull daocloud.io/liukuan73/galley:1.0.0
docker pull daocloud.io/liukuan73/mixer:1.0.0
docker pull daocloud.io/liukuan73/proxyv2:1.0.0
docker pull daocloud.io/liukuan73/pilot:1.0.0
docker pull daocloud.io/liukuan73/citadel:1.0.0
docker pull daocloud.io/liukuan73/servicegraph:1.0.0
docker pull daocloud.io/liukuan73/sidecar_injector:1.0.0
docker pull daocloud.io/liukuan73/istio-grafana:1.0.0
```