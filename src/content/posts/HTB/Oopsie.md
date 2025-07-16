---
title: Hack the box Oopsie题解
tags: 
  - HTB
  - 渗透测试
permalink: /archives/22239/
published: 2023-03-23 13:56:39
---

# 扫机器

拿到目标机器的IP，先看一下，开放了什么端口

```shell
nmap -sC -sV 10.129.95.191
```

![image-20230326131129358](./images/image-20230326131129358.png)

80和22端口有服务在运行，先从80端口入手

在访问80端口的服务时看到这一句话，就是要让我们找登录页，但是并没有找到可以点击登录的地方

![image-20230326131240016](./images/image-20230326131240016.png)

# 路径泄漏

F12打开调试就看到了泄露的路径

![image-20230326131406272](./images/image-20230326131406272.png)

看到可以以游客的身份登录

![image-20230326131702056](./images/image-20230326131702056.png)

登陆后看到有上传的地方，这就是我们的突破口

但是需要超级管理员的账号

![image-20230326131824692](./images/image-20230326131824692.png)

# 越权

当点进**Account**页面的时候URL引起了注意，id=2，那就意味着id=1是管理员账号了，那就试试

![image-20230326131950146](./images/image-20230326131950146.png)

**Account**确实是变成了admin，但是点到**Uploads**的时候还是显示需要管理员账号，那我们可以尝试看看能不能从cookie入手

![image-20230326132045627](./images/image-20230326132045627.png)

对应修改好后，上传页就能用了

![image-20230326132216835](./images/image-20230326132216835.png)

![image-20230326132245663](./images/image-20230326132245663.png)

# 上传webshell

用的是kali自带的**php-reverse-shell.php**，使用方法**GitHub**上有

利用成功，找有用的信息

![image-20230326135027686](./images/image-20230326135027686.png)

# 信息收集

在`/var/www/html/cdn-cgi/login`目录下发现了`db.php`，并且拿到了数据库的账号密码，

![image-20230326135310965](./images/image-20230326135310965.png)

在`/home/robert`下拿到了`user.txt`

![image-20230326135502246](./images/image-20230326135502246.png)

# 切换交互式shell

```shell
SHELL=/bin/bash script -q /dev/null
```

# 提权

用前面得到的信息切换到**robert**用户，然后使用id发现还有一个**bugtracker**组，查找此组是否具有特殊的访问权限

```shell
find / -type f -group bugtracker 2>/dev/null 			//-type f 为查找普通文档，-group bugtracker 限定查找的组为bugtracker，2>/dev/null 将错误输出到黑洞（不显示）
ls -al /usr/bin/bugtracker								//-al 以长格式方式显示并且显示隐藏文件
```

![image-20230326140625853](./images/image-20230326140625853.png)

可以发现拥有者有**s**（setuid）特殊权限，可执行的文件搭配这个权限，可以得到特权，任意存取该文件的所有者能使用的全部系统资源，我们尝试运行它，发现这个文件根据提供的ID值输出以该数字为编号的bug报告

使用**strings**命令看这个命令是怎么运行的

![image-20230326141105922](./images/image-20230326141105922.png)

> 1. bugtracker调用系统中的cat命令输出了位于/root/reports/目录下的bug报告，robert用户本应无权访问/root目录，而bugtracker设置了setuid后就拥有了/root目录的访问，就拥有了root权限
> 2. 且cat命令是使用绝对路径而不是相对路径来调用的，即在当前用户的环境变量指定的路径中搜寻cat命令，可以考虑创建一个恶意的cat命令，并修改当前用户环境变量，将权限提升为root

```shell
export PATH=/tmp:$PATH				//将/tmp目录设置为环境变量
cd /tmp/							//切换到/tmp目录下
echo '/bin/sh' > cat				//在此构造恶意的cat命令
chmod +x cat						//赋予执行权限
```

提权成功

![image-20230326141344832](./images/image-20230326141344832.png)

然后我们可以找到**/root**目录下的**root.txt**拿到**root** **flag**（此时cat命令已被替换，无法读取文件，所以使用**more**命令）

![image-20230326141653739](./images/image-20230326141653739.png)

# 答案

> 1. proxy
> 2. /cdn-cgi/login
> 3. cookie
> 4. 34322
> 5. /uploads
> 6. db.php
> 7. find
> 8. root
> 9. Set owner User ID
> 10. cat
> 11. f2c74ee8db7983851ab2a96a44eb7981
> 12. af13b0bee69f8a877c3faf667f7beacf

# 参考文章

- [渗透测试练习靶场hackthebox——Starting Point Oopsie攻略](https://blog.csdn.net/m0_48066270/article/details/108641892)
- [hack the box靶场oopsie靶机](https://blog.csdn.net/zr1213159840/article/details/123629681)
