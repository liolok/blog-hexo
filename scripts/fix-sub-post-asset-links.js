'use strict';

const url = require('url');
const chalk = require('chalk');

hexo.extend.filter.register('before_post_render', function (data) {
  // Need post asset folder option enabled
  if (!hexo.config.post_asset_folder) return;
  // Only proceed my sub post markdown source files
  let regexp_sub_post = /\/zh-Hans\.md$/;
  if (!regexp_sub_post.test(data.source)) return;
  // Start with '](./', this is how I write asset links in sub post files.
  let path_markdown = /\]\(\.\//g; // assets are under same folder in markdown
  let path_html = '](../'; // assets are under parent folder in html
  data.content = data.content.replace(path_markdown, path_html);
  hexo.log.d('Sub post asset links fixed:', chalk.magenta(data.source));
});
