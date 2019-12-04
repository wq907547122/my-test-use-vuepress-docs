FROM nginx:1.17.5
RUN rm -rf /usr/share/nginx/html/*
ADD ims.tar.gz /usr/share/nginx/html/
COPY logo.png /usr/share/nginx/html/
# 复制文件信息
RUN mv /usr/share/nginx/html/ims/images /usr/share/nginx/html
# 复制配置文件
COPY nginx.conf /etc/nginx/nginx.conf


