var gulp = require('gulp');
var html_minify = require('gulp-htmlmin');
var css_clean = require('gulp-clean-css');
var js_uglify = require('gulp-uglify');
var img_minify = require('gulp-imagemin');

// 压缩html
gulp.task('html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(html_minify({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        }))
        .pipe(gulp.dest('./public'))
});
// 压缩css
gulp.task('css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(css_clean())
        .pipe(gulp.dest('./public/css'));
});
// 压缩js
gulp.task('js', function() {
    return gulp.src('./public/js/**/*.js')
        .pipe(js_uglify())
        .pipe(gulp.dest('./public/js'));
});
// 压缩图片
gulp.task('img', function() {
    return gulp.src('./public/images/**/*.*')
        .pipe(img_minify([
            img_minify.gifsicle({'optimizationLevel': 3}), 
            img_minify.jpegtran({'progressive': true}), 
            img_minify.optipng({'optimizationLevel': 7}), 
            img_minify.svgo()],
            {'verbose': true}))
        .pipe(gulp.dest('./public/images'))
});
// 默认任务, 使用gulp4语法
// gulp.task('default', ['html','css','js','img']);
gulp.task('default', gulp.parallel('html','css','js','img'));
