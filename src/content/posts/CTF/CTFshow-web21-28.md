---
title: CTFshow-web21-28
tags:
  - web
  - CTF
permalink: /archives/42189/
published: 2022-10-13 09:00:40
---
## web21

- 题目：

![image-20221013094816541](./images/image-20221013094816541.png)

- burp抓包利用Intruder模块进行爆破，在根据hint1里的提示知道这是一个tomcat认证爆破，所以标记Authorization: Basic

![image-20221013094825370](./images/image-20221013094825370.png)

- Authorization字段后面的值经过了base64的加密，所以爆破时也要进行相应的加密

![image-20221013094832859](./images/image-20221013094832859.png)

- Payload sets的设置，字典利用题目给的附件，用户名猜一手admin，最后也是证明猜对了

![image-20221013094839110](./images/image-20221013094839110.png)

## web22

- 域名失效了做不了

![image-20221013094848348](./images/image-20221013094848348.png)

## web23

- 题目：

![image-20221013094856686](./images/image-20221013094856686.png)

- 源码：

```php
<?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-03 11:43:51
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-03 11:56:11
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/
error_reporting(0);

include('flag.php');
if(isset($_GET['token'])){
    $token = md5($_GET['token']);
    if(substr($token, 1,1)===substr($token, 14,1) && substr($token, 14,1) ===substr($token, 17,1)){
        if((intval(substr($token, 1,1))+intval(substr($token, 14,1))+substr($token, 17,1))/substr($token, 1,1)===intval(substr($token, 31,1))){
            echo $flag;
        }
    }
}else{
    highlight_file(__FILE__);

}
?>
```

- 分析源码编写php脚本：

```php
<?php

for ($i=0;$i<10000;$i++) {

    $token = md5($i);

    if (substr($token, 1, 1) === substr($token, 14, 1) && substr($token, 14, 1) === substr($token, 17, 1)) {
        if ((intval(substr($token, 1, 1)) + intval(substr($token, 14, 1)) + substr($token, 17, 1)) / substr($token, 1, 1) === intval(substr($token, 31, 1))){
            echo 'token'.$i.'md5'.$token;
        }
}
}
?>
```

- flag

![image-20221013094908217](./images/image-20221013094908217.png)

## web24

- 源码：

```php
<?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-03 13:26:39
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-03 13:53:31
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/

error_reporting(0);
include("flag.php");
if(isset($_GET['r'])){
    $r = $_GET['r'];
    mt_srand(372619038);
    if(intval($r)===intval(mt_rand())){
        echo $flag;
    }
}else{
    highlight_file(__FILE__);
    echo system('cat /proc/version');
}

?> Linux version 5.4.0-126-generic (buildd@lcy02-amd64-072) (gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1)) #142-Ubuntu SMP Fri Aug 26 12:12:57 UTC 2022 Linux version 5.4.0-126-generic (buildd@lcy02-amd64-072) (gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1)) #142-Ubuntu SMP Fri Aug 26 12:12:57 UTC 2022
```

- hint

![image-20221013100000106](./images/image-20221013100000106.png)

- 根据hint写php脚本

```php
<?php
mt_srand(372619038);
echo (mt_rand());
?>
```

- flag

![image-20221013100143229](./images/image-20221013100143229.png)

## web25

- 源码：

```php
<?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-03 13:56:57
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-03 15:47:33
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/


error_reporting(0);
include("flag.php");
if(isset($_GET['r'])){
    $r = $_GET['r'];
    mt_srand(hexdec(substr(md5($flag), 0,8)));
    $rand = intval($r)-intval(mt_rand());
    if((!$rand)){
        if($_COOKIE['token']==(mt_rand()+mt_rand())){
            echo $flag;
        }
    }else{
        echo $rand;
    }
}else{
    highlight_file(__FILE__);
    echo system('cat /proc/version');
}
Linux version 5.4.0-126-generic (buildd@lcy02-amd64-072) (gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1)) #142-Ubuntu SMP Fri Aug 26 12:12:57 UTC 2022 Linux version 5.4.0-126-generic (buildd@lcy02-amd64-072) (gcc version 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1)) #142-Ubuntu SMP Fri Aug 26 12:12:57 UTC 2022
```

- hint

![image-20221013100955137](./images/image-20221013100955137.png)

- 可以先通过r=0 得到mt_rand()第一个值为539472865

![image-20221013142205465](./images/image-20221013142205465.png)

- 再利用php_mt_seed-4.0推出种子

![image-20221013142439718](./images/image-20221013142439718.png)

- 通过这两行代码，去计算出token，其中seed的选择要与自己题目用到的php版本相近的seed

![image-20221013143622262](./images/image-20221013143622262.png)

- 我的php版本是php7.3.11

![image-20221013143911408](./images/image-20221013143911408.png)

- 计算token代码

![image-20221013142450572](./images/image-20221013142450572.png)

- flag

![image-20221013142138878](./images/image-20221013142138878.png)

## web26

- 打开题目后一直下一步，不输入任何东西，直接burp抓包后直接repeater发包就能得到flag（这应该算是非预期吧）

![image-20221013144535082](./images/image-20221013144535082.png)

- 正常的做题姿势
- burp抓包后用Intruder模块进行爆破

![image-20221013153318406](./images/image-20221013153318406.png)

## web27

- 打开题目，得到一份录取名单，教务管理系统，学院录取查询系统
- 得到身份证信息不清晰，那就抓包爆破

![image-20221013153948233](./images/image-20221013153948233.png)

- 成功爆破出完整的身份证号码

![image-20221013154808908](./images/image-20221013154808908.png)

- 解出响应包的Unicode编码，得到学号和密码

![image-20221013154924410](./images/image-20221013154924410.png)

- flag

![image-20221013155129376](./images/image-20221013155129376.png)

## web28

- 题目

![image-20221013155522718](./images/image-20221013155522718.png)

- hint

![image-20221013155446524](./images/image-20221013155446524.png)

- 抓包爆破

![image-20221013155743060](./images/image-20221013155743060.png)

- payloads设置：1和2都是一样

![image-20221013155751816](./images/image-20221013155751816.png)

- 爆破成功

![image-20221013160751377](./images/image-20221013160751377.png)
