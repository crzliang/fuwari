---
title: DC-2复现
tags: 
  - vulnhub
  - 渗透测试
category: 靶场&靶机
permalink: /archives/54062/
published: 2022-06-05 05:30:31
---

# DC-2复现

## 描述

> 与 DC-1 非常相似，DC-2 是另一个专门构建的易受攻击的实验室，目的是获得渗透测试领域的经验。
>
> 与最初的 DC-1 一样，它的设计考虑到了初学者。
>
> 必须具备 Linux 技能和熟悉 Linux 命令行，以及一些基本渗透测试工具的经验。
>
> 就像 DC-1 一样，有五个标志，包括最终标志。
>
> 再说一次，就像 DC-1 一样，标志对初学者很重要，但对有经验的人来说并不那么重要。
>
> 简而言之，唯一真正重要的标志是最终标志。
>
> 对于初学者来说，谷歌是你的朋友。好吧，除了所有的隐私问题等等等等。
>
> 我还没有探索实现 root 的所有方法，因为我放弃了我一直在研究的以前的版本，并从基本操作系统安装之外完全重新开始。

## 开始

### Flag1:

- 使用nmap扫C段，得到目标IP：192.168.207.137

![img](./images/1654348280925-a2c8411d-30cd-48a8-a321-0768f48403a1.png)

- 得到ip我们就开一下都开启了哪些端口

![img](./images/1654348336822-35c2b2e5-e08c-4c97-846e-d5ce1859fb39.png)

- 开启了80和7744端口，我们先从80端口入手，直接用浏览器访问192.168.207.137:80

![img](./images/1654348955430-8fe2c8a3-6388-4575-91de-0617ed1a33dc.png)

- 访问之后跳到了`http://dc-2/`，但是访问不成功，根据之前扫出来的结果也得知，这是dns没被解析，那就手动去添加hosts地址
- kali的hosts文件在`etc/`下

![img](./images/1654349376987-138156b7-688d-44f0-9eea-b1e9b23ddc31.png)

- 修改好之后，直接进到

> Flag1:
>
> Your usual wordlists probably won’t work, so instead, maybe you just need to be cewl.
>
> More passwords is always better, but sometimes you just can’t win them all.
>
> Log in as one to see the next flag.
>
> If you can’t find it, log in as another.

![image-20220604215708275](./images/image-20220604215708275.png)

### Flag2:

- 根据翻译提示，接下来需要我们进行密码的爆破，那么我们需要一个密码字典，然后翻译中还有一个词`cewl`这是kali自带的一个字典生成工具

`cewl http://dc-2/ -w dc-2.txt    #生成字典`

- 得到有238个关键词的字典

![image-20220604220502248](./images/image-20220604220502248.png)

- 我们在访问`http://dc-2/`的时候发现网站是由wordpress搭建的，kali中带有的wpscan是一款免费的、用于非商业用途的黑盒 WordPress 安全扫描器。

- 我们就直接使用工具扫描网站

  ![image-20220604225232357](./images/image-20220604225232357.png)

- 然后发现了admin、jerry、tom三个用户名，

![image-20220604224440952](./images/image-20220604224440952.png)

- 利用这三个用户名和之前爬下来的字典进行爆破

`wpscan --url http://dc-2/ -U user.txt -P dc-2.txt`

![image-20220604225340060](./images/image-20220604225340060.png)

- 爆出了jerry和tom的密码；

> 用户名/密码
>
> jerry / adipiscing
>
> tom / parturient  

- wordpress是有后台管理网站的，我们上网查到一般都是在url后面加/wp-login.php
- 随便一个账户登录进去后，在Pages中找到了flag2

![image-20220604225805888](./images/image-20220604225805888.png)

> Flag 2:
>
> If you can't exploit WordPress and take a shortcut, there is another way.
>
> Hope you found another entry point.

![image-20220604225924615](./images/image-20220604225924615.png)

- 到这也就宣布80端口已经没有了利用的价值，得另寻他路才能找到后续的flag，我们前面扫到的7744端口还没有用到，那么接下来就能用上了

### Flag3:

- 经过几次尝试只有tom的账号能连上

![image-20220604230423791](./images/image-20220604230423791.png)

- 登录成功后发现当前目录下就有flag3，但是cat并不能用，而vi能用，我们就直接看到了flag3的内容

> Poor old Tom is always running after Jerry. Perhaps he should su for all the stress he causes.

![image-20220604230712815](./images/image-20220604230712815.png)

### Flag4:

- flag3将线索指向了jerry，也就意味着需要切换用户，然而并没有这么简单，根据提示，这是要绕过rbash

![image-20220604230900598](./images/image-20220604230900598.png)

- 通过指令发现当前只有4个命令可用

![image-20220604231121563](./images/image-20220604231121563.png)

- 通过百度得知了绕过的方法：即我们获取到的shell为：Restricted shell(受限制的shell)，可以添加环境变量来绕过

```txt
#绕过rbash

BASH_CMDS[a]=/bin/sh;a



#添加环境变量

export PATH=$PATH:/bin/

export PATH=$PATH:/usr/bin/
```

![image-20220604231349157](./images/image-20220604231349157.png)

- 输入密码后也成功的切换到jerry的账号，并找到了flag4

![image-20220604231537492](./images/image-20220604231537492.png)

> Good to see that you've made it this far - but you're not home yet. 
>
> You still need to get the final flag (the only flag that really counts!!!).  
>
> No hints here - you're on your own now.  :-)
>
> Go on - git outta here!!!!

![image-20220604231629358](./images/image-20220604231629358.png)

### Flag5:

- 通过flag4得知可利用git提权

- 又发现jerry可以以root用户的身份执行git命令而且还不需要密码

![image-20220604232739815](./images/image-20220604232739815.png)

- 通过百度找到了两种提权方法

```txt
方法1：

sudo git -p help #强制进入交互状态

!/bin/bash #打开一个用户为root的shell



方法2：

sudo git help config #在末行命令模式输入

!/bin/bash 或者 !'sh' #打开一个用户为root的shell
```

- 成功提权后进到根目录下就找到了最后的flag

![image-20220604233008680](./images/image-20220604233008680.png)
