var gulp = require('gulp');
var minify_html = require('gulp-htmlmin');
var minify_css = require('gulp-clean-css');
var minify_js = require('gulp-uglify');
var minify_img = require('gulp-imagemin');

gulp.task('html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(minify_html({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        }))
        .pipe(gulp.dest('./public'))
});

gulp.task('css', function() {
    return gulp.src('./public/**/*.css')
        .pipe(minify_css())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function() {
    return gulp.src('./public/js/**/*.js')
        .pipe(minify_js())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('img', function() {
    return gulp.src('./public/images/**/*.*')
        .pipe(minify_img([
            minify_img.gifsicle({'optimizationLevel': 3}), 
            minify_img.jpegtran({'progressive': true}), 
            minify_img.optipng({'optimizationLevel': 7}), 
            minify_img.svgo()],
            {'verbose': true}))
        .pipe(gulp.dest('./public/images'))
});

// gulp.task('default', ['html','css','js','img']);
gulp.task('default', gulp.parallel('html','css','js','img'));  // 使用 gulp4 语法
