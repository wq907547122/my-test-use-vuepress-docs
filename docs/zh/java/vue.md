---
home: false
heroImage: /logo.png
actionText: 快速进入 →
actionLink: /zh/java/vue/js-skils.md
features:
- title: 模块1
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: 模块2
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 模块3
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You
---
# vue学习笔记以及常用技巧
[请点击下面继续学习内容](/zh/java/vue/js-skils.md)

# Github访问速度很慢的原因，以及解决方法
- 1，CDN，Content Distribute Network，可以直译成内容分发网络，CDN解决的是如何将数据快速可靠从源站传递到用户的问题。用户获取数据时，不需要直接从源站获取，通过CDN对于数据的分发，用户可以从一个较优的服务器获取数据，从而达到快速访问，并减少源站负载压力的目的。
- 2，为什么访问速度慢、下载慢？
  <br/>
  答：github的CDN被某墙屏了，由于网络代理商的原因，所以访问下载很慢。ping github.com 时，速度只有300多ms。
- 3，如何解决？
<br/>
答：绕过dns解析，在本地直接绑定host，该方法也可加速其他因为CDN被屏蔽导致访问慢的网站。
<br/>
hosts文件所在目录，C:\Windows\System32\drivers\etc
<br/>
修改windows里的hosts文件，添加如下内容
```vue
# Github cdn start ===>
151.101.44.249 github.global.ssl.fastly.net 
192.30.253.113 github.com 
103.245.222.133 assets-cdn.github.com 
23.235.47.133 assets-cdn.github.com 
203.208.39.104 assets-cdn.github.com 
204.232.175.78 documentcloud.github.com 
204.232.175.94 gist.github.com 
107.21.116.220 help.github.com 
207.97.227.252 nodeload.github.com 
199.27.76.130 raw.github.com 
107.22.3.110 status.github.com 
204.232.175.78 training.github.com 
207.97.227.243 www.github.com 
185.31.16.184 github.global.ssl.fastly.net 
185.31.18.133 avatars0.githubusercontent.com 
185.31.19.133 avatars1.githubusercontent.com
192.30.253.120 codeload.github.com

# Github cdn end <======

```
windows下刷新DNS的方法：
<br/>
打开cmd
<br/>
输入ipconfig /flushdns
<br/>
亲测有用，下载速度明显提升
