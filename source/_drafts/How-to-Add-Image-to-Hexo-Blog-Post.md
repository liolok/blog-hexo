---
title: How to Add Image to Hexo Blog Post
tags: [Hexo]
date: 2019-04-14 12:10:00
updated: 2019-04-14 12:10:00
---

Adding an image in markdown is supposed to be really easy. Here is the syntax:

```md
![alt](path/to/image "title")
```

- `alt` is alternate text, provides alternative information for the image if user cannot view it for some reason like slow connection, wrong path or user is using screen reader;
- `title` is optional tooltip text, appears when cursor is floating over the image.

Alternate text and tooltip text may be similiar usually. However the most important part is `path` or `URL` or whatever you'd like to name it. It indicates the image file location, no matter in local preview or online, we can not view the image without a correct path.

So the problem finally becomes to "where to put the image file" and "how to fill path to image file". Here come several sulutions below.

<!-- more -->

# Image Hosting Sevice

*"An image hosting service allows individuals to upload images to an Internet website. The image host will then store the image onto its server, and show the individual different types of code to allow others to view that image."* － [Wikipedia](https://en.wikipedia.org/wiki/Image_hosting_service "Image hosting service - Wikipedia")

There are websites providing this type of sevice: You upload an image file, then get the link of it, or even its markdown code directly.

```md
![An Imgur Image](https://i.imgur.com/ucHPX7L.gif "An Imgur Image")
```

> In addition, you could even find editors or plugins to do the uploading work and insert markdown code automatically after you drag&drop or paste the image.

<!-- Then why I don't use an image hosting service? This paticular blog you're reading, my blog, is hosted by GitHub Pages, which is a static site hosting service itself. Whoa, "site" sounds like way more than "image", so why would one use an independent image hosting service? Actually there may be some reason: If the blog has more and more posts and image files finally get too large, your site will exceed usage limits of GitHub Pages:

- Published GitHub Pages sites may be no larger than 1GB.
- GitHub Pages sites have a *soft* bandwidth limit of 100GB per month. -->

# Asset Folder

[Asset Folders | Hexo](https://hexo.io/docs/asset-folders "Asset Folders | Hexo")

## Global Asset Folder

We could put file in `source/images/`, then use `![](/images/filename)`. Watch closely, there is a slash '/' at first, which leads to a root-relative link. If in site's configuration, `root` is `example.com`, then the link becomes `example.com/images/filename` in the end.

```markdown
![Site Favicon](/images/sakamoto/favicon.png "My Site Favicon")
```

![Site Favicon](/images/sakamoto/favicon.png "My Site Favicon")

## Post Asset Folder

First of all, this feature need to be enabled in Hexo site configuration file:

```yml _config.yml
post_asset_folder: true
```

Now you may place image files in `source/_posts` like this:

```plain source/_posts/
2019-02-14-Test-Post.md
2019-02-14-Test-Post/
+-- Test-Image-1.png
+-- Test-Image-2.png
+-- Subdirectory/
|   +-- Test-Image-3.png
|   +-- Test-Image-4.png
```

Then in coresponding post markdown file we fill the path.

### Base-relative

```md source/_posts/2019-02-14-Test-Post.md
![](Test-Image-1.png)
![](./Test-Image-2.png)
![](Subdirectory/Test-Image-3.png)
![](./Subdirectory/Test-Image-4.png)
```

This base-relative type goes wrong with home page and editor's preview.

### Works Only in Hexo Site

```plain source/_posts/2019-02-14-Test-Post.md
{% asset_img example.jpg This is an example image %}
{% asset_img "spaced asset.jpg" "spaced title" %}
```

Apparently this is not markdown syntax at all, hence it surely doesn't work with editor's preview, or even on GitHub repository. Consider using this "official recommended" method **only if you don't mind**.

```md source/_posts/2019-02-14-Test-Post.md
![](2019-02-14-Test-Post/Test-Image-1.png)
![](./2019-02-14-Test-Post/Test-Image-2.png)
![](2019-02-14-Test-Post/Subdirectory/Test-Image-3.png)
![](./2019-02-14-Test-Post/Subdirectory/Test-Image-4.png)
```

In this way the base-relative link is correct **in local**, but let's see what it would look like on website:

```html

```
