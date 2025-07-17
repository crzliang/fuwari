---
title: 使用vercel部署wowchemy学术网站
tags:
  - vercel
  - wowchemy
  - 学术网站
  - hugo
category: 开发
permalink: /archives/52454/
published: 2024-05-29 23:15:29
---
# 起因

> 在搜索资料的时候看到了北大的一个科研组的主页，使用Hugo Blox（以前称为 Wowchemy Hugo Modules） Web 框架构建的。其中Research Group模板，很简洁，感觉还不错，就想把协会的主页给换了。
>
> 协会原有的主页是用的docusaurus搭建的，这个更像一种文档文库，不太适合用于主页展示。

# 部署

部署和自定义的过程并不难，跟着官方文档走即可

[官方文档](https://docs.hugoblox.com/)

使用Netlify进行部署会简单很多，但是我不喜欢它的添加自己域名的那一块，所以我就选择了vercel部署，但是官方给的教程过于简略，有点过时了，并不适合当前的vercel环境

# vercel部署注意事项

如果只按照官方文档给的教程去部署，百分百失败，部署最后一定会提示**部署时长超过了，vercel所支持的最大部署时长45分钟**，这是翻译过的，大致意思就是这样。

这是因为vercel目前默认的node.js版本是20.x，这个版本安装附加包是使用 `dnf install-y package-name`

所以当我们使用默认的环境时，安装golang依赖就要使用 `dnf install-y golang`而不是 `yum -y install golang`，这个命令是适用于18.x版本的node.js

[vercel镜像说明](https://vercel.com/docs/deployments/build-image)
