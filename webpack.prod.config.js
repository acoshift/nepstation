var path = require('path')
var zlib = require('zlib')
var webpack = require('webpack')
var CompressionPlugin = require('compression-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackMd5Hash = require('webpack-md5-hash')
var ENV = process.env.ENV = process.env.NODE_ENV = 'production'

var metadata = {
  title: 'NepStation',
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
  ENV: ENV,
  ga: '',
  database: {
    url: 'https://farkpage.com/nepdb2',
    ns: 'test'
  }
}
/*
 * Config
 */
module.exports = {
  metadata: metadata,

  devtool: 'none',
  debug: false,

  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    // contentBase: 'src/',
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  },

  node: { global: 'window', progress: false, crypto: 'empty', module: false, clearImmediate: false, setImmediate: false },

  entry: {
    'polyfills': './src/polyfills.ts',
    'main': './src/main.ts'
  },

  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    cache: false,
    extensions: prepend(['.ts', '.js', '.json', '.css', '.html', '.jade'], '.async')
  },

  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'source-map-loader', exclude: [ root('node_modules/rxjs') ] }
    ],
    loaders: [
      // Support Angular 2 async routes via .async.ts
      { test: /\.async\.ts$/, loaders: ['es6-promise-loader', 'ts-loader'], exclude: [ /\.(spec|e2e)\.ts$/ ] },

      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          compilerOptions: {
            removeComments: true,
            noEmitHelpers: true
          }
        },
        exclude: [ /\.(spec|e2e|async)\.ts$/ ]
      },

      // Support for *.json files.
      { test: /\.json$/, loader: 'json-loader' },

      // Support for CSS as raw text
      { test: /\.css$/, loader: 'to-string-loader!css-loader' },
      // { test: /\.css$/, loader: 'raw-loader' },

      // Support for .html as raw text
      { test: /\.html$/, loader: 'html-loader?minimize=false' },
      // { test: /\.html$/, loader: 'raw-loader' },

      // Support for .jade to .html
      { test: /\.jade$/, loader: 'html-loader?minimize=false!jade-html-loader' },
      // { test: /\.jade$/, loader: 'raw-loader!jade-html-loader' },

      // Images
      { test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=assets/img/[hash].[ext]' },

      // Fonts
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9\.\=]+)?$/, loader: 'file-loader?name=assets/fonts/[hash].[ext]' }
    ]
  },

  plugins: [
    new WebpackMd5Hash(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }),
    new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeTagWhitespace: true
      },
      metadata: metadata
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      },
      database: JSON.stringify(metadata.database)
    }),
    new webpack.ProvidePlugin({
      // TypeScript helpers
      '__metadata': 'ts-helper/metadata',
      '__decorate': 'ts-helper/decorate',
      '__awaiter': 'ts-helper/awaiter',
      '__extends': 'ts-helper/extends',
      '__param': 'ts-helper/param',
      'Reflect': 'es7-reflect-metadata/src/global/browser'
    }),
    new webpack.optimize.UglifyJsPlugin({
      // to debug prod builds uncomment //debug lines and comment //prod lines

      // beautify: true, // debug
      // mangle: false, // debug
      // dead_code: false,// debug
      // unused: false, // debug
      // deadCode: false, // debug
      // compress : { screw_ie8 : true, keep_fnames: true, drop_debugger: false, dead_code: false, unused: false, }, // debug
      // comments: true, // debug

      beautify: false, // prod
      // disable mangling because of a bug in angular2 beta.1 and beta.2
      // TODO(mastertinner): enable mangling as soon as angular2 beta.3 is out
      // mangle: { screw_ie8 : true }, // prod
      mangle: false,
      compress: { screw_ie8: true }, // prod
      comments: false // prod
    }),
    new CompressionPlugin({
      algorithm: gzipMaxLevel,
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  }
}

// Helper functions

function gzipMaxLevel (buffer, callback) {
  return zlib['gzip'](buffer, {level: 9}, callback)
}

function root (args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [__dirname].concat(args))
}

function prepend (extensions, args) {
  args = args || []
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce(function (memo, val) {
    return memo.concat(val, args.map(function (prefix) {
      return prefix + val
    }))
  }, [''])
}

function rootNode (args) {
  args = Array.prototype.slice.call(arguments, 0)
  return root.apply(path, ['node_modules'].concat(args))
}
