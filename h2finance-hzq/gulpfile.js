var gulp = require('gulp');
var webpack = require('webpack');
var del = require('del');
var minifycss = require('gulp-minify-css');//压缩css
var uglify = require('gulp-uglify');//压缩js
var rename = require('gulp-rename');//重命名
var webpackconfig = require('./webpack.config');

/**
 *  清理生产目录文件
 */
gulp.task('clean', function(cb) {
  del(['./dist/*.js','./dist/*.css','./dist/*.map']).then(paths => {
    console.log('删除文件和文件夹成功\n', paths.join('\n'));
    cb();
  });
});

/**
 *  任务名称：webpack
 *  任务内容：webpack打包，执行之前优先执行clean
 */
gulp.task('webpack',['clean'], function(cb) {
  webpack(webpackconfig, cb)
});

/**
 *  任务名称：style
 *	任务内容：压缩css文件
 */
gulp.task('style',function() {
  gulp.src('./dist/style.css')
    //.pipe(rename({suffix:'.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist'));
});

/**
 *  任务名称：script
 *	任务内容：压缩js文件
 */
gulp.task('script',function(){
  gulp.src('./dist/*.js')
    //.pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

/**
 *  任务名称：默认任务
 *	任务流程：clean -> webpack -> style -> script
 */
gulp.task('default', ['webpack'], function() {
  gulp.start('style','script')
});



