# 🍥Fuwari

这是一个基于 [Astro](https://astro.build) 构建的个人博客项目，原模板作者为 [saicaca](https://github.com/saicaca)，本仓库在其作品基础上进行了简化调整与个性化改造，更偏向个人使用场景。

和原作者默认演示站相比，这个版本做了一些差异化处理，例如：

- 更偏向个人博客展示，而不是模板演示
- 调整了部分页面视觉风格与字体配置
- 增加了自定义 Permalinks（永久链接）能力
- 集成了评论系统等更符合个人站点使用习惯的配置

## ✨ 功能特性

- [x] 基于 Astro 与 Tailwind CSS 构建，适合静态博客部署
- [x] 响应式布局，兼容桌面端与移动端浏览
- [x] 支持亮色 / 暗色模式切换
- [x] 支持主题色、横幅、头像与基础站点信息自定义
- [x] 支持文章搜索与目录导航
- [x] 支持自定义 Permalinks（永久链接）结构
- [x] 支持 Giscus 评论系统接入
- [x] 支持个性化字体配置与界面风格调整
- [x] 适合作为个人博客而非纯模板演示站点使用

## 👀 要求

- Node.js <= 22
- pnpm <= 9

## 🚀 使用方法

本项目的基础使用方式可直接参考原作者仓库 [`saicaca/fuwari`](README.md:1) 的说明：

- 原项目仓库：https://github.com/saicaca/fuwari
- 初始化与部署方式建议优先参考原仓库文档
- 当前仓库主要记录我基于原模板做的个性化修改

## ⚙️ 文章 Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # 仅当文章语言与 `config.ts` 中的网站语言不同时需要设置
permalink: "/custom/path/"  # 可选：自定义永久链接
---
```

## 🔗 Permalinks（永久链接）配置

Permalinks 功能允许你自定义博客文章的 URL 结构，提供更灵活的链接格式。

### 全局配置

在 `src/config.ts` 中的 `siteConfig` 里配置默认的 permalink 模式：

```typescript
export const siteConfig: SiteConfig = {
  // ...其他配置...
  permalink: {
    pattern: "/posts/:slug/", // 默认模式
  },
};
```

### 可用的变量

在 `pattern` 中可以使用以下变量：

- `:year` - 文章发布年份 (如: 2023)
- `:month` - 文章发布月份 (如: 10)
- `:day` - 文章发布日期 (如: 01)
- `:slug` - 文章的 slug (文件名或自定义)
- `:title` - 文章标题的 URL 友好版本
- `:category` - 文章分类的 URL 友好版本

### 模式示例

```typescript
// 默认模式
pattern: "/posts/:slug/"
// 结果: /posts/my-article/

// 按日期组织
pattern: "/:year/:month/:slug/"
// 结果: /2023/10/my-article/

// 按分类组织
pattern: "/:category/:slug/"
// 结果: /tech/my-article/

// 完整日期
pattern: "/:year/:month/:day/:slug/"
// 结果: /2023/10/01/my-article/

// 使用标题
pattern: "/blog/:title/"
// 结果: /blog/my-awesome-article/
```

### 文章级别的自定义 Permalink

你可以在文章的 frontmatter 中为特定文章设置自定义 permalink：

```markdown
---
title: "我的特殊文章"
published: 2023-10-01
permalink: "/special/custom-path/"
---

文章内容...
```

**注意：** 文章级别的 `permalink` 会覆盖全局配置的 `pattern`。

### 注意事项

1. **唯一性**：确保生成的 permalink 是唯一的，避免冲突
2. **SEO 友好**：建议使用描述性的 URL 结构
3. **向前兼容**：更改 permalink 模式可能会破坏现有链接
4. **特殊字符**：标题和分类会自动转换为 URL 友好的格式

## 🧞 指令

下列指令均需要在项目根目录执行：

| Command                           | Action                            |
|:----------------------------------|:----------------------------------|
| `pnpm install` 并 `pnpm add sharp` | 安装依赖                              |
| `pnpm dev`                        | 在 `localhost:4321` 启动本地开发服务器      |
| `pnpm build`                      | 构建网站至 `./dist/`                   |
| `pnpm preview`                    | 本地预览已构建的网站                        |
| `pnpm new-post <filename>`        | 创建新文章                             |
| `pnpm astro ...`                  | 执行 `astro add`, `astro check` 等指令 |
| `pnpm astro --help`               | 显示 Astro CLI 帮助                   |
