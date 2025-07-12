# 🍥Fuwari

基于 [Astro](https://astro.build) 开发的静态博客模板。

[**🖥️在线预览（Vercel）**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

## ✨ 功能特性

- [x] 基于 Astro 和 Tailwind CSS 开发
- [x] 流畅的动画和页面过渡
- [x] 亮色 / 暗色模式
- [x] 自定义主题色和横幅图片
- [x] 响应式设计
- [ ] 评论
- [x] 搜索
- [x] 文内目录
- [x] 自定义 Permalinks（永久链接）(这个功能是原版本中没有的，是我用AI编写添加的)

## 👀 要求

- Node.js <= 22
- pnpm <= 9

## 🚀 使用方法 1

使用 [create-fuwari](https://github.com/L4Ph/create-fuwari) 在本地初始化项目。

```sh
# npm
npm create fuwari@latest

# yarn
yarn create fuwari

# pnpm
pnpm create fuwari@latest

# bun
bun create fuwari@latest

# deno
deno run -A npm:create-fuwari@latest
```

1. 通过配置文件 `src/config.ts` 自定义博客
2. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
3. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 `astro.config.mjs` 中的站点设置。

## 🚀 使用方法 2

1. 使用此模板[生成新仓库](https://github.com/saicaca/fuwari/generate)或 Fork 此仓库
2. 进行本地开发，Clone 新的仓库，执行 `pnpm install` 和 `pnpm add sharp` 以安装依赖  
   - 若未安装 [pnpm](https://pnpm.io)，执行 `npm install -g pnpm`
3. 通过配置文件 `src/config.ts` 自定义博客
4. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
5. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages 等；部署前需编辑 `astro.config.mjs` 中的站点设置。

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
