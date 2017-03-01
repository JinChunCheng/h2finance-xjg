var path = require('path');// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");//将组件中的样式提取出来
var HtmlWebpackPlugin = require('html-webpack-plugin');//html模板插入代码
var vue = require("vue-loader");//webpack的loader插件

//webpck插件
var plugins = [
  //提公用js到common.js文件中
  new webpack.optimize.CommonsChunkPlugin('common.js'),
  //将样式统一发布到style.css中
  new ExtractTextPlugin("style.css", {
    allChunks: true,
    disable: false
  }),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    template:"index.html",//原始模板
    filename:"index.html",//输出新文件
    inject: true
  }),
  // 使用 ProvidePlugin 加载使用率高的依赖库
  new webpack.ProvidePlugin({
    $: 'webpack-zepto'
  })
];
//编译输入路径
var entry = ['./src/main'];
//编译输出路径
var buildPath = "/dist/";


// 模块导入
module.exports = {
  debug: true,
  entry: entry,
  output: {
    path: __dirname + buildPath,
    filename: 'build.js'
  },
  // 服务器配置相关，自动刷新!
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    grogress: true,
  },
  module: {
    // 加载器
    loaders: [
      // 解析.vue文件
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      // 转化ES6的语法
      { 
        // 让webpack去验证文件是否是.js结尾将其转换
        test: /\.js$/, 
        // 通过babel转换
        loader: 'babel', 
        // 不用转换的node_modules文件夹
        exclude: /node_modules/ 
      },
      // 编译css并自动添加css前缀
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
        "style-loader", "css-loader?sourceMap!cssnext-loader")
      },
      //.scss 文件想要编译，scss就需要这些东西！来编译处理
      //install css-loader style-loader sass-loader node-sass --save-dev
      { 
        test: /\.scss$/, 
        loader: 'style!css!sass?sourceMap'
      },
      // 图片转化，小于8K自动转化为base64的编码
      { 
        test: /\.(png|jpg|gif)$/, 
        loader: 'url-loader?limit=8192&name=images/[name].[ext]'
      },
      //html模板编译？
      { 
        test: /\.(html|tpl)$/, 
        loader: 'html-loader' 
      },{
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }]
  },
  // .vue的配置。需要单独出来配置
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract('vue-style-loader', 'css-loader', 'sass-loader'),
      sass: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!sass-loader')
    }
  },
  // 转化成es5的语法
  babel: {
    presets: ['es2015', "stage-0"],
    plugins: ['transform-runtime']
  },
  resolve: {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['', '.js', '.vue'],
    //别名
    alias: {}
  },
  plugins: plugins,
  // 开启source-map，webpack有多种source-map，在官网文档可以查到
  devtool: 'eval-source-map'
};




