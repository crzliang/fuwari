---
title: docker单机部署GZCTF
permalink: /archives/3805/
published: 2023-02-21 21:04:25
tags: 
  - 运维
  - docker
  - GZCTF
---
# 前言

> 这篇文章已经有一年多的时间了，不建议按照这篇文章进行部署，请大家移步：[官方文档](https://gzctf.gzti.me/)



> 最早接触的自建CTF平台就是CTFd，然后在GitHub上面又发现了[**GZTime**](https://gztime.cc/)大佬开发的[GZCTF](https://github.com/GZTimeWalker/GZCTF)平台，然后就尝试着部署了，因为是全新的架构，部署的时候遇到了问题也在群里得到了解决，现在又想着在内网重新搭建一遍，发现有些细节的地方有点忘了，所以就想着写下这篇文章记录一下，也方便后续自己可能在其他地方进行部署的时候能比较快的完成部署。

## 准备内容

- ~~在GitHub上找到项目的[Releases](https://github.com/GZTimeWalker/GZCTF/releases)下载最新版的包（开发师傅不推荐用git）~~ 这个方法弃用了
- 现在只需准备下文的docker-compose.yml和appsettings.json文件即可
- 安装好docker和docker-compose，这两项的安装网上有教学

### 端口暴露范围设置

这里可设置也可以不设置，看个人需求，如果是云服务器的还是推荐设置，内网的话那就无所谓了，这里只列出docker部署时的设置方法，k3s及其他方式的可以看官方给的readme（下面的命令也是从readme里面抄来的）

- sudo nano /etc/sysctl.conf
- 添加如下内容，指定 ip_local_port_range：

```plain
net.ipv4.ip_local_port_range = 20000 50000
```

- 执行 `sudo sysctl -p `使配置生效
- 重启 Docker 服务

# 搭建

### 配置docker-compose.yml文件

- 在 `scripts`文件夹下的 `docker-compose.yml`文件中需要修改如下两个地方，第一个红框是要把注释去掉（因为是仅docker部署），第二个红框是设置数据库密码。

![image-20230418091416730](./images/image-20230418091416730.png)

- 把GZCTF/GZCTF文件夹下的 `appsettings.Template.json`文件重命名成 `appsettings.json`然后放到与 `docker-compose.yml`同文件夹下，然后还要进行简单的配置。

### 配置appsettings.json文件

- 第一个地方要改的是这个数据库的密码，改成在 `docker-compose.yml`给数据库设置的那个密码（这里要注意一下的就是，要把 `<>`这两个符号也要去掉，不然会报错）；其他的，用户名、端口等参数可以自行修改。

![image-20230221212130179](./images/image-20230221212130179.png)

- 第二个地方就是这个，原文件是一个域名，内网机器就改成内网IP，公网机器有IP没有域名就只填IP，有IP又有域名且要解析到这台机器的可以改为自己的域名

![image-20230221212547919](./images/image-20230221212547919.png)

# 启动

- 在含有 `docker-compose.yml`文件的目录下执行 `docker-compose up -d`

# 修改管理员密码

- 进入平台注册一个账号，然后返回 `ssh`，进到数据库容器内，连接上数据库

```bash
psql postgres://username:password@host:port/dbname			//这是连接命令
```

> - username：连接数据的用户名，默认值是postgres
> - password：密码，默认值是postgres
> - host：主机名，默认值是localhost
> - port：端口，默认值是5432
> - dbname：要连接的数据库名，默认值是postgres

- 例如按上面的默认值：

```bash
psql postgres://postgres:postgres@localhost:5432/postgres
```

- 然后直接执行

```bash
UPDATE "AspNetUsers" SET "Role"=3 WHERE "UserName"='需要设置为管理员的用户名';
```
