var sliceArgs = Function.prototype.call.bind(Array.prototype.slice);
var toString  = Function.prototype.call.bind(Object.prototype.toString);
var path = require('path');
var webpack = require('webpack');
// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var DedupePlugin = webpack.optimize.DedupePlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

/*
 * Config
 */
module.exports = {
  devtool: 'source-map', // for faster builds use 'eval'
  debug: true,

  devServer: {
    historyApiFallback: true,
    contentBase: 'src/public',
    publicPath: '/__build__'
  },

  entry: {
    'lib': [
      'core-js',
      'rxjs',
      //'zone.js',
      'reflect-metadata',
      'angular2/bootstrap',
      'angular2/common',
      'angular2/core',
      'angular2/router',
      'angular2/http',
    ],
    'app': './src/app/bootstrap'
  },

  output: {
    path: root('__build__'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    extensions: ['','.ts','.js','.json', '.css', '.html']
  },

  module: {
    loaders: [
      // Support for *.json files.
      { test: /\.json$/,  loader: 'json' },

      // CSS
      //{ test: /\.css$/,   loader: 'style!css' },
      { test: /\.css$/,   loader: 'raw' },

      // html as raw text
      { test: /\.html$/,  loader: 'raw' },

      // Fonts
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9\.\=]+)?$/, loader: 'file?name=./fonts/[hash].[ext]' },

      // Images
      { test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=./img/[hash].[ext]' },

      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts',
        query: { 'ignoreDiagnostics': [ 2403 ] }, // 2403 -> Subsequent variable declarations
        exclude: [ /\.spec\.ts$/, /\.e2e\.ts$/ ] // /node_modules/
      }
    ]
  },

  plugins: [
    new CommonsChunkPlugin({ name: 'lib', filename: 'lib.js', minChunks: Infinity, chunks: ['app'] }),
    //new CommonsChunkPlugin({ name: 'common',   filename: 'common.js' }),
    new DedupePlugin(),
    //new UglifyJsPlugin({ minimize: true, comments: false }),
  ]
};

// Helper functions

function root(args) {
  args = sliceArgs(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
  args = sliceArgs(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
