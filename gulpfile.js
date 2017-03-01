var gulp = require('gulp');
//引入gulp组件
//同步执行gulp任务
var runSequence = require('run-sequence');
//js语法检查
var jshint = require('gulp-jshint');

//文件合并
var concat = require('gulp-concat');

//js压缩
var uglify = require('gulp-uglify');

//sass文件转换
var sass = require('gulp-sass');

//重命名
var rename = require('gulp-rename');

//Parse build blocks in HTML files to replace references to non-optimized scripts or stylesheets with useref
var useref = require('gulp-useref');

//css compress
var minifyCss = require('gulp-minify-css');

//condition
var gulpif = require('gulp-if');

//clean files
var clean = require('gulp-clean');

//file include 
var fileinclude = require('gulp-file-include');

//web服务器
var browserSync = require('browser-sync').create();


//检查脚本
gulp.task('lint', function() {
    gulp.src('./app/script/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//清空临时目录
gulp.task('tmp-clean', function() {
    return gulp.src(['_tmp'], { read: false })
        .pipe(clean({ force: true }));
});

//
gulp.task('sass', function() {
    return gulp.src('./app/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('app'));
});


//----------开发环境配置BEGIN----------

//清空开发环境目录
gulp.task('dev-clean', function() {
    return gulp.src(['app_dev'], { read: false })
        .pipe(clean({ force: true }));
});

//copy文件到临时目录
gulp.task('dev-copy', function() {
    return gulp.src([
            'app/**/*.css',
            'app/**/*.woff',
            'app/**/*.tff',
            'app/**/*.svg',
            'app/**/*.js',
            'app/**/*.json',
            'app/**/*.png'
        ])
        .pipe(gulp.dest('app_dev'));
});

//删除sass生成的临时文件
gulp.task('dev-clean-css', function() {
    return gulp.src(['app/css/public.css', 'app/css/my.css', 'app/css/purchase.css', 'app/css/redeem.css'], { read: false })
        .pipe(clean({ force: true }));
});

//include files to html pages
gulp.task('dev-fileinclude', function() {
    return gulp.src(['app/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app_dev'));
});

//开发环境任务
gulp.task('dev-rebuild', function(callback) {
    runSequence(
        'tmp-clean',
        'dev-clean',
        'sass',
        'dev-copy',
        'dev-clean-css',
        'dev-fileinclude',
        callback);
});

gulp.task('dev', ['dev-rebuild'], function(callback) {

    gulp.watch([
        'app/**/*.css',
        'app/**/*.scss',
        'app/**/*.js',
        'app/**/*.html',
        'app/**/*.tpl'
    ], ['dev-rebuild'], callback);

});

//----------开发环境配置END----------



//----------生产环境配置BEGIN----------

//清空开发环境目录
gulp.task('dist-clean', function() {
    return gulp.src(['app_dist'], { read: false })
        .pipe(clean({ force: true }));
});

//copy文件到临时目录
gulp.task('dist-copy', function() {
    return gulp.src([
            'app/**/*.css',
            'app/**/*.woff',
            'app/**/*.tff',
            'app/**/*.svg',
            'app/**/*.js',
            'app/**/*.json',
            'app/**/*.png'
        ])
        .pipe(gulp.dest('_tmp'));
});

//删除sass生成的临时文件
gulp.task('dist-clean-css', function() {
    return gulp.src(['app/css/public.css', 'app/css/my.css', 'app/css/purchase.css', 'app/css/redeem.css'], { read: false })
        .pipe(clean({ force: true }));
});

//include files to html pages
gulp.task('dist-fileinclude', function() {
    return gulp.src(['app/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('_tmp'));
});

//页面引用的css、js合并压缩
gulp.task('dist-useref', function() {
    return gulp.src(['_tmp/*.html'])
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('app_dist'));
});

//copy文件到临时目录
gulp.task('dist-copy2', function() {
    return gulp.src([
            'app/**/*.woff',
            'app/**/*.tff',
            'app/**/*.svg',
            'app/**/*.png'
        ])
        .pipe(gulp.dest('app_dist'));
});

//开发环境任务
gulp.task('dist-rebuild', function(callback) {
    runSequence(
        'tmp-clean',
        'dist-clean',
        'sass',
        'dist-copy',
        'dist-copy2',
        'dist-clean-css',
        'dist-fileinclude',
        'dist-useref',
        callback);
});

gulp.task('dist', ['dist-rebuild'], function(callback) {

    gulp.watch([
        'app/**/*.css',
        'app/**/*.scss',
        'app/**/*.js',
        'app/**/*.html',
        'app/**/*.tpl'
    ], ['dist-rebuild'], callback);

});

//----------生产环境配置END----------

//默认任务
gulp.task('default', ['dev'], function() {
    console.log("warning: there's no default tasks, run 'dev' for you ");
});


//生产环境任务
gulp.task('prod', ['dist'], function() {
    console.log('dist completed!');
});
