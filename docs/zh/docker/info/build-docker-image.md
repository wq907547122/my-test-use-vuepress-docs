# 自制对应的文档镜像
## 1.在文件夹下有如下的文件
![](/images/minikube/6.png)
其中: ims.tar.gz就是我们对应的文档的dist文件夹打包使用tar命令打包为的
```sh
 tar zcvf ims.tar.gz ims/
```
### 1.1 Dockerfile文件内容
```yaml
FROM nginx:1.17.5
RUN rm -rf /usr/share/nginx/html/*
ADD ims.tar.gz /usr/share/nginx/html/
COPY logo.png /usr/share/nginx/html/
# 复制文件信息
RUN mv /usr/share/nginx/html/ims/images /usr/share/nginx/html
# 复制配置文件
COPY nginx.conf /etc/nginx/nginx.conf

```
### 1.2 nginx.conf内容
```conf
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;

   server {
        listen 80;
        location / {
                root html;
                try_files $uri $uri/ /index.html;
                index index.html index.htm;

        }
        location /ims/ {
                root html/ims;
                try_files $uri $uri/ /index.html;
                index index.html index.htm;
        }
    }
}

```
### 1.3 资源信息

- [ims.tar.gz](/images/file/ims.tar.gz)
- [Dockerfile](/images/file/Dockerfile)
- [logo.png](/images/file/logo.png)
- [nginx.conf](/images/file/nginx.conf)

## 2.打包镜像
```sh
docker build -t ims-docs:1.0.0 -t ims-docs .

命令执行结果打包成，如下：
Sending build context to Docker daemon  1.037MB
Step 1/6 : FROM nginx:1.17.5
 ---> 540a289bab6c
Step 2/6 : RUN rm -rf /usr/share/nginx/html/*
 ---> Using cache
 ---> 066ae51406da
Step 3/6 : ADD ims.tar.gz /usr/share/nginx/html/
 ---> Using cache
 ---> 27ea49792ed0
Step 4/6 : COPY logo.png /usr/share/nginx/html/
 ---> Using cache
 ---> e04cf25d5d87
Step 5/6 : RUN mv /usr/share/nginx/html/ims/images /usr/share/nginx/html
 ---> Using cache
 ---> e80c173fcf4b
Step 6/6 : COPY nginx.conf /etc/nginx/nginx.conf
 ---> b63028399f46
Successfully built b63028399f46
Successfully tagged ims-docs:1.0.0
Successfully tagged ims-docs:latest

```
 ### 删除虚悬镜像
```sh
docker rmi $(docker images -f "dangling=true" -q)
```

## 3.运行镜像
```sh
docker run -p 80:80 --name ims-docs-app --rm ims-docs
```

## 4.验证文档是否启动成功
在浏览器中输入:
```
http://192.168.0.36/ims/
```
![](/images/minikube/7.png)
