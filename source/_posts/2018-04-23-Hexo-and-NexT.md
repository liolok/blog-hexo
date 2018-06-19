---
title: Hexo + NexT 博客定制
tags: [Hexo, NexT]
description: <center>上一篇讲的是本博客的搭建, 这一篇总结博客及主题的私人定制.</center>
date: 2018-04-23 19:03:17
updated: 2018-04-25 21:10:31
---

> 配置修改提示: 
> - 对照本文修改配置时, 应善用编辑器的**查找**功能*(Ctrl+F)*;
> - 建议修改前先把原有的语句备份注释*(一般是Ctrl+/)*;
> - 注意YAML语法缩进, 统一使用两个空格缩进表示层级关系, 冒号与参数间用一个空格隔开.

# Hexo 站点配置

照例先上官中[配置文档](https://hexo.io/zh-cn/docs/configuration.html), 通常这意味着本章节内容远不及官方文档全面, 而更倾向于个人的改动和见解.

## 站点配置文件

[创建](https://liolok.github.io/2018/04/14/Hexo-GitHub-Pages/#创建一个博客)博客`blogname`完成后, 站点配置信息位于`blogname\_config.yml`文件(下图**右**)中, 本章节的配置修改, 如无特殊说明, 均在**站点配置文件**中操作.

![注意区分站点配置和主题配置](注意区分站点配置和主题配置.png  "注意区分站点配置和主题配置")

## 修改站点语言和时区

```yaml
language: zh-CN
timezone: Asia/Shanghai
```

`language`, 语言字段, 填写`zh-CN`以适配NexT主题的简体中文. (参见NexT的[commit#e1e6cf8](https://github.com/theme-next/hexo-theme-next/commit/e1e6cf8fe0e0b6f22fed22e766019be74f83de5d))

> 注: 不填写默认为`en`即英文, 也是可以的, 这完全取决于你喜欢英文还是方块字, 与文章的语言无关.

`timezone`, 时区字段, 填写`Asia/Shanghai`. (参见维基的[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))

> 注: 如果不填写该字段, Hexo会默认使用电脑的时区, 但此处的"电脑"是GitHub的美国服务器还是本机, 笔者尚不能确定, 只好确保时区信息正确.

## 修改站点的网站链接

```yaml
url: https://liolok.github.io/
root: /
```

`url`是站点所在的网址, `root`则是当站点被放在网站子目录下时指定子目录的. 如下:

```yaml
url: https://liolok.github.io/blog
root: /blog/
```
## 修改文章默认文件名

这个要从博客目录下的`hexo new "文章标题"`说起, 这条命令会在`source\_post`目录下新建一个与Markdown文件, 我们就在这个文件里进行写作. 但是文章数量多起来之后这个目录恐怕会十分混乱. 

```yaml
new_post_name: :year-:month-:day-:title.md # File name of new posts
```

`new_post_name`, 文章默认文件名, 将默认的`title.md`改为`:year-:month-:day-:title.md`, 这样一来, `source\_post`目录下的文件(文件夹)命名就有了日期前缀而不是只有标题了, 方便本地文章的管理.

![为文章默认文件名加上日期前缀](为文章默认文件名加上日期前缀.png "为文章默认文件名加上日期前缀")

所以上图中与Markdown文件同名的文件夹又是哪里来的呢, 参见下一小节.

## 开启文章资源文件夹

```yaml
post_asset_folder: true
```

开启了[文章资源文件夹](https://hexo.io/zh-cn/docs/asset-folders.html)这个选项后, 我们在运行`hexo new "文章标题"`命令时, Hexo会在新建Markdown文件的同时创建同名目录, 用来存放每篇文章所引用的资源, 这也同样是为了便于针对不同的文章分类管理资源文件.

资源具体可以是图片, CSS, JS文件等等, 不过笔者目前也只用到了图片. 下面就举一个本地图片插入的例子.

```markdown
![示例图片替代文本](示例图片.jpg "示例图片标题")
```

!["示例图片替代文本](示例图片.jpg "示例图片标题")

>2018/04/29更新:
上面的写法只在文章页面生效, 如果需要让图片在博客首页也能正常显示, 需要使用Hexo内置的插件语法:
```markdown
{% asset_img 示例图片.jpg 示例图片标题 %}
```

~~没错, 配合资源文件夹, 直接用标准的Markdown语法就可以做到, 无需插件. 相对路径中的斜杠`\`和反斜杠`/`均亲测可用, 也没有遇到官方文档中提到的*首页可能无法正常显示图片*问题.~~

~~笔者如此执着于Markdown标准语法, 是为了让文章的编辑能尽量做到所见即所得, 而不是彻底敲了代码再看输出. 配合[Typora](https://typora.io/)的插入图片功能及其优先使用相对路径选项, 只需要手动填写标题和代替文本即可, 笔者选择保持两者与图片文件名一致.~~

## 解决引号半角变全角

本地文章里英文半角的单引号`'`跟双引号`"`在生成博客之后居然变成中文全角的`’`跟`“`了, 这还得了, 经过一番折腾以及对照后发现居然还不是主题以及站点的语言配置原因, 差点又怀疑人生, 所幸找到了Hexo的[issue#1981](https://github.com/hexojs/hexo/issues/1981), 看到了Hexo作者tommy351大神早在2016年轻描淡写的一句"试试看". 解决方案如下, 添加Marked渲染器配置字段:

```yaml
marked:
  smartypants: false
```

## 添加站点404页面

404页面是当前网站下找不到链接对应内容的跳转页面, 一般要么是链接写错了要么是网站文件丢了. 如果不自己写,  也不是就没有这个页面, 而是会显示GitHub的404页面, 倒不是说不好看, 但是跟博客风格不统一, 还是不太好.

在博客根目录`blogname`下运行`hexo new page 404`, 然后打开`blogname\source\404\index.md`进行如下修改: 

```yaml
---
title: 404 Not Found <!-- 页面标题 -->
date: 2018-04-21 13:51:57
permalink: /404 <!-- 永久链接 -->
---
```

以上是`index.md`文件的头部, 后面的内容就跟写文章一样了, 在距"找不到页面"离题不远的范围内自由发挥即可.

> 如需使用前文中的方法引用资源文件, 同样把文件放在`blogname\source\404\index`目录下, 但相对路径要用`404\index\资源文件名`.

## 使用NexT主题

### 安装

在`blogname`根目录下运行`git clone https://github.com/theme-next/hexo-theme-next themes/next` 

### 更新

在`blogname\themes\next`目录下运行`git pull`

### 开启

修改**站点**配置文件, 将`theme`字段改为`next`

```yaml
theme: next
```
# NexT 主题配置

## 主题配置文件

**主题**配置文件在`blogname\themes\next`下, 而**站点**配置文件在`blogname`根目录下, 注意区分. 下文的配置修改, 如无特殊说明, 均在**主题配置文件**(下图**左**)中操作.

![注意区分站点配置和主题配置](注意区分站点配置和主题配置.png "注意区分站点配置和主题配置")

> 笔者创建本文时, NexT主题的[新官网](https://theme-next.org/)仍然在建, 所以绝大多数配置参考自[旧版文档](https://theme-next.iissnan.com/theme-settings.html)和网络上更早的相关博文. 希望等全新的NexT网站建设完毕之后可以看到更多更详细的文(玩)档(法).

## 修改汉化配置

`blogname\themes\next\languages`目录下存放的是NexT的多语言适配文件. 配合Hexo的站点语言配置, 我们可以修改其中的内容来实现一些多语言适配的修改, 如`zh-CN.yml`文件中的`symbol`字段`comma` `period` `colon`分别对应逗号句号和冒号, 笔者习惯使用英文符号, 所以做了如下修改:

```yaml
symbol:
  comma: ", "
  period: ". "
  colon: ": "
```

当然这里只是根据个人口味酌情修改.

## 修改网站图标

把新图标文件放到`blogname\themes\next\source\images`目录下, 并修改`facicon`的`small`和`medium`即可.

```yaml
favicon:
  # small: /images/favicon-16x16-next.png
  # medium: /images/favicon-32x32-next.png
  small: /images/sakamoto.png
  medium: /images/sakamoto.png
```

效果如下: 

![网站图标](网站图标.png "网站图标")

## 修改网站页脚

先上效果图: 

![网站页脚](网站页脚.png "网站页脚")

以下均为`footer`段内内容, 注意两个空格缩进.

### 设定建站年份

```yaml
footer:
  # 其他字段
  since: 2018
```

> 如不设定则直接显示当前年份, 这样就不会有`© 20XX - 20XX`字样了.

### 修改分隔图标

这个图标的作用是分隔建站年份跟右边的版权信息. 图标名称参见[Font Awesome](https://fontawesome.com/icons).

```yaml
footer:
  # 其他字段
  icon:
    name: paper-plane  # 图标名称
    animated: false  # 是否开启跳动动画
    color: "#808080" # 十六进制颜色代码
```

> 比如`heart` `true` `#ff0000`这个组合效果是跳动的红心.

### 增加托管信息

```yaml
footer:
  # 其他字段
  custom_text: Hosted by <a target="_blank" rel="external nofollow" href="https://pages.github.com/">GitHub Pages</a>
```

饮水思源, 表明博客站点托管于GitHub Pages服务.

## 修改文章末尾

先上效果图:

![文章末尾](文章末尾.png "文章末尾")

> 这里的本文链接来自于**站点配置**中的站点链接`url`(前面做过修改)和文章链接`permalink`(使用默认值).

### 设定版权信息

设定并开启文章的版权声明, 会在每一篇文章末尾显示. 笔者选择的是大多数个人博客的版权协议[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh).

```yaml
post_copyright:
  enable: true
  license: <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" rel="external nofollow" target="_blank">CC BY-NC-ND 4.0</a>
```

### 修改标签图标

把文章标签前面默认的`#`符号替换为Font Awesome中的Tag图标

修改主题布局模板`blogname\themes\next\layout\_macro\post.swig`文件, 搜索`rel="tag">#`并将其替换为`rel="tag"><i class="fa fa-tag"></i>`

## 修改侧边栏

![侧边栏](侧边栏.png "侧边栏")

<center>侧边栏效果图</center>

### 添加博主头像

将头像文件放到`blogname\themes\next\source\images`中, 并修改`avatar`字段:

```yaml
avatar: /images/头像文件名
```

### 添加社交链接

添加链接及图标(仍然参见[Font Awesome](https://fontawesome.com/icons)), 用 `||` 隔开:

```yaml
social:
  GitHub: https://github.com/yourname || github
  Google: https://plus.google.com/yourname || google
```

如需加密社交链接, 要先开启**两处**依赖项`exturl`, 并对链接进行[Base64加密](https://www.base64encode.org/)后填入字段.

```yaml
exturl: true
```
## 移动端配置

### 统一开启侧边栏及返回顶部按钮

这样做的好处是各平台阅读体验能得到统一, 否则移动端看不到侧边栏, 既没有文章目录方便跳转, 也没有社交链接联系博主, 也没有快速返回顶部的按钮.

```yaml
sidebar:
  onmobile: true
```

>  不过需要注意: 该选项仅适用于NexT主题的Muse和Mist两个样式.

### Android Chrome 网站主题色

```yaml
android_chrome_color: "#fff"  # 白色
```

这里的颜色可以参考[Material Design](https://material.io/guidelines/style/color.html#color-color-palette), 不过博主只简单把默认的黑色改成了白色.

## 文章阅读进度条

![文章阅读进度条](文章阅读进度条.png "文章阅读进度条")

个人觉得这个插件还是很实用且美观的~

### 安装

在`blogname`根目录下运行: 

```bash
git clone https://github.com/theme-next/theme-next-reading-progress themes/next/source/lib/reading_progress
```

### 更新

在`blogname\themes\next\source\lib\reading_progress`目录下运行`git pull`即可.

### 开启并配置

```yaml
reading_progress:
  enable: true
  color: "#37c6c0"  # 十六进制颜色代码, 默认挺好看的
  height: 2px  # 进度条宽度, 默认为2像素, 可以适度调宽
```

## 网页3D动态背景

### 安装

在`blogname`根目录下运行: 

```bash
git clone https://github.com/theme-next/theme-next-three source/lib/three themes/next/source/lib/three
```

### 更新

在`blogname\themes\next\source\lib\three`目录下运行`git pull`即可.

### 开启并配置

以下三种动态背景只能选一个, 笔者三个都试过之后选了线条, 球面有点精神污染的意思.

```yaml
three_waves: false
canvas_lines: true
canvas_sphere: false
```
