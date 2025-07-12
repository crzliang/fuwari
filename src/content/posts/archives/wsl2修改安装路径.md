---
title: wsl2修改安装路径
tags: 
  - wsl
permalink: /archives/24001/
published: 2023-04-01 22:19:51
---

# 暂停wsl运行

```shell
wsl -l -v
```

![img](https://img.crzliang.cn/img/1680358141230-07d18df0-c441-43d1-9951-9fe56b4663d3.png)

有Running说明还在运行，需要将其停止运行

```shell
wsl --shutdown
```

# 导出子系统

导出你需要更改路径的Linux系统，例如我需要导出我的Ubuntu-22.04，并导出到d盘

```shell
wsl --export Ubuntu-22.04 d:\Ubuntu-22.04.tar
```

在d盘就可以找到导出的文件

![img](https://img.crzliang.cn/img/1680358361458-bf62477b-e191-4270-af71-d678d58e7209.png)

# 注销子系统

注销要导出的子系统

```shell
wsl --unregister Ubuntu-22.04
```

![img](https://img.crzliang.cn/img/1680358448132-bd7d062d-9df2-4212-a89c-69ab04cbf966.png)

再次查看wsl的运行情况时，就没有了Ubuntu-22.04了

![img](https://img.crzliang.cn/img/1680358519243-2dfec0eb-623c-47de-84b6-5b4863756fb6.png)

# 导入子系统

```shell
wsl --import Ubuntu-22.04 D:\wsl-ubuntu D:\Ubuntu-22.04.tar
```

`import后面是：导入系统的名称+安装的路径+打包好的系统镜像的路径`

