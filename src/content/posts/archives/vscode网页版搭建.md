---
title: vscode网页版搭建
tags: 
  - vscode
categories: vscode
permalink: /archives/28937/
published: 2023-07-31 13:40:48
---
# 前言

> 在了解Vscode的隧道技术的时候就看到了一篇名为：《上课摸鱼必备 -- Vscode网页版的搭建教程》的文章，然后发现这个还挺好玩的，而且手上有一台云服务器就搭起来试试

# 准备工作

- 需要一台用来起服务的机器，需要Linux环境，不一定要是云服务器，本地的服务器也可以，需要外网访问的话，云服务器会方便点，本地的服务器想外网访问那就需要内网穿透了
- 下载所需的包，下载地址：https://github.com/coder/code-server/releases/

我的服务器是Ubuntu22.04的所以就选了code-server-4.16.0-linux-amd64.tar.gz这个版本

![image-20230731134212307](./images/image-20230731134212307.png)

# 部署

- 下载文件

```bash
wget https://github.com/coder/code-server/releases/download/v4.16.0/code-server-4.16.0-linux-amd64.tar.gz
```

- 解压文件

```bash
tar -zxvf code-server-4.16.0-linux-amd64.tar.gz
```

- 重命名

```bash
mv code-server-4.16.0-linux-amd64 code-server
```

## 运行服务

- 进到code-server的bin目录

```bash
cd /code-server/bin
```

- 运行服务

```bash
./code-server
```

## 配置文件

- 然后ctrl+c暂停服务，进到 `~/.config/code-server/`目录打开 `config.yaml`
- 把 `bind-addr`改为0.0.0.0，这样才能使得外部网络进行访问
- `password`密码可以改也可以用默认的

![image-20230731140723613](./images/image-20230731140723613.png)

# 后台运行

## 运行

使用nohup，让其在关闭终端了也能运行，运行下列命令后直接回车即可

```bash
nohup ./code-server &
```

![image-20230802160145092](./images/image-20230802160145092.png)

## 停止

要关闭运行的程序

先查看 `code-server`的pid。然后使用kill命令进行停止即可

![image-20230802160707317](./images/image-20230802160707317.png)
