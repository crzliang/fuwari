---
title: DC-6复现
tags: 
  - vulnhub
  - 渗透测试
category: 靶场&靶机
permalink: /archives/4971/
published: 2022-10-20 19:18:00
---

# DC-6复现

> ## 描述
>
> DC-6 是另一个特意建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 这不是一个过于困难的挑战，因此对初学者来说应该很棒。
>
> 这一挑战的最终目标是获得根并阅读唯一的标志。
>
> 必须具备 Linux 技能和熟悉 Linux 命令行，以及一些基本渗透测试工具的经验。
>
> 对于初学者来说，谷歌可以提供很大的帮助，但你可以随时在@DCAU7 上给我发推文，寻求帮助，让你重新开始。但请注意：我不会给你答案，相反，我会给你一个关于如何前进的想法。
>
> ## 线索
>
> 好吧，这并不是一个真正的线索，但对于那些只想继续工作的人来说，更多的是一些“我们不想花五年时间等待某个过程完成”的建议。
>
> cat /usr/share/wordlists/rockyou.txt | grep k01 > passwords.txt 这应该可以为您节省几年时间。;-)

# 信息收集

获取ip地址以及开启的服务

![image-20221020192153759](./images/image-20221020192153759.png)

访问80端口的服务，并不能正常的访问到

![image-20221020195313552](./images/image-20221020195313552.png)

修改hosts文件，然后就可以正常访问了

![image-20221020195457215](./images/image-20221020195457215.png)

该网站是wordpress搭建的博客

![image-20221020195845417](./images/image-20221020195845417.png)

利用dirsearch扫出网站的后台登陆网站

![image-20221020201934903](./images/image-20221020201934903.png)

# 爆破

使用wpscan枚举爆破用户名

![image-20221020200347155](./images/image-20221020200347155.png)

新建users.txt并写入以上的用户名，作为后面的爆破字典

根据题目描述中的线索，新建一个密码字典

![image-20221020200746495](./images/image-20221020200746495.png)

直接使用命令会发现报错了，我现在用的这个版本的kali是经过了gz打包，所以要解压出来，可鞥不同版本会有所不同

![image-20221020201150488](./images/image-20221020201150488.png)

解压后再执行就成了

![image-20221020201334710](./images/image-20221020201334710.png)

利用wpscan爆破出网站的账号密码

```bash
wpscan --url http://wordy/ -U users.txt -P passwords.txt
```



![image-20221020202043925](./images/image-20221020202043925.png)

# 登录（漏洞利用）

利用爆破出的账号登录后台，发现一个ip转换工具

![image-20221020202859842](./images/image-20221020202859842.png)

经过百度得知Activity Monitor插件存在CVE-2018-15877远程命令执行漏洞

![image-20221020203048051](./images/image-20221020203048051.png)

执行下面的命令，证明该漏洞可用

```bash
127.0.0.1| ls /
```

![image-20221020203250683](./images/image-20221020203250683.png)

抓包改包，弹shell

![弹shell](./images/image-20221020204106275.png)

利用python将bash切换成交互模式

```bash
python -c 'import pty;pty.spawn("/bin/bash")'
```

![bash](./images/image-20221020204232671.png)

# 敏感信息挖掘

在home目录下发现了四个账号的文件夹

![ls](./images/image-20221022163144399.png)

graham文件夹中是没有东西的，jens文件夹里面有一个backups.sh，mark文件夹的stuff文件夹中有一个things-to-do的文件，sarah文件夹里面也是空的

![jens](./images/image-20221022163549105.png)

![mark](./images/image-20221022163500101.png)

从things-to-do文件中我们得知了graham的密码

![翻译](./images/image-20221022163809535.png)

直接切换用户（因为该机器还开启了22端口，所以也是可以利用ssh登录的）

![su](./images/image-20221022164925248.png)

![ssh登录](./images/image-20221022171716365.png)

命令`sudo -l`列出当前用户可执行与无法执行的指令，发现可以免密登录jens

![列指令](./images/image-20221022170024694.png)

![切换用户](./images/image-20221022165644469.png)

继续用`sudo -l`列出当前用户可执行与无法执行的指令，发现jens可以免密码运行root权限nmap，在提权中是可以使用nmap进行提权的，那就进行尝试

![列指令](./images/image-20221022165805933.png)

# 提权（nmap提权）

大佬总结的原理：nmap 可以执行脚本文件，可以创建一个文件并写入反弹 shell 的命令，默认用root 权限执行，所以反弹的 shell 也是 root

> - echo 'os.execute("/bin/bash")' > shell.nse #创建一个 shell.nse 的文件，并写入os.execute("/bin/bash")
>
> - 其中，--script用法：nmap --script=脚本名称 目标

![image-20221022170709967](./images/image-20221022170709967.png)

提权成功，在root文件夹中找到flag

![theflag](./images/image-20221022171435028.png)