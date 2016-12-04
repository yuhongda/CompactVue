
var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/c-vue.js'
    },
    output: {
        path: './dist',
        publicPath: process.env.NODE_ENV == 'production' ? '' : '/dist/',
        filename: 'c-vue.min.js'
    },
    resolve:{
    },
    module: {
        loaders: [
          {
              test: /\.js$/,
              loader: 'babel',
              exclude: /node_modules/
          }
        ]
    },
    babel: {
        presets: ['es2015', 'es2017'],
        plugins: ['transform-runtime', 'transform-class-properties']
    }
}


module.exports.plugins = [
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     filename:'vendors.min.js'
    // }),
    new HtmlWebpackPlugin({
        filename:'index.html',
        template:'./demo.html',
        inject: 'head'
    })
];

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify("production")
          }
      }),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      }),
      new webpack.optimize.OccurenceOrderPlugin()
    ]);
} else {
    module.exports.devtool = 'eval-source-map'
}
