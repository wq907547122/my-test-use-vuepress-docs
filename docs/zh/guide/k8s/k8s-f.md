# 启动的脚本配置

[[toc]]

## 示例
首先我们建立一个文件nginx.yml
![](/images/minikube/1.png)
- 内容如下
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-nginx
  template:
    metadata:
      labels:
        app: app-nginx
    spec:
      containers:
      - name: app-nginx
        image: nginx:1.10
        ports:
        - containerPort: 80

          
---       
kind: Service
apiVersion: v1
metadata:
  # Unique key of the Service instance
  name: app-nginx
spec:
  ports:
    # Accept traffic sent to port 80
    - name: http
      port: 80
      targetPort: 80
  selector:
    # Loadbalance traffic across Pods matching
    # this label selector
    app: app-nginx
  # Create an HA proxy in the cloud provider
  # with an External IP address - *Only supported
  # by some cloud providers*
  type: LoadBalancer

```
:::tip 说明
使用yml配置，要使用空格而不是使用 Tab【制表】的键盘
:::

- 访问波阿里的service:
![](/images/minikube/1.png)
![](/images/minikube/2.png)


## 部署Pod的简单代码
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

## 为请求设置命名空间
```
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```
### 设置命名空间首选项
您可以永久保存该上下文中所有后续 kubectl 命令使用的命名空间。
```
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view | grep namespace:
```

### 命名空间和 DNS
- 当您创建一个服务时，Kubernetes 会创建一个相应的DNS 条目
```
该条目的形式是 <service-name>.<namespace-name>.svc.cluster.local， 
这意味着如果容器只使用 <service-name>，它将被解析到本地命名空间的服务。 
这对于跨多个命名空间（如开发、分级和生产）使用相同的配置非常有用。 
如果您希望跨命名空间访问，则需要使用完全限定域名（FQDN）。
```