var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ENV = process.env.ENV = process.env.NODE_ENV = 'development'

var metadata = {
  title: 'NepStation',
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
  ENV: ENV
}
/*
 * Config
 */
module.exports = {
  metadata: metadata,

  devtool: 'source-map',
  debug: true,
  // cache: false,

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
      { test: /\.ts$/, loader: 'ts-loader', exclude: [ /\.(spec|e2e|async)\.ts$/ ] },

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
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }),
    new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
    new HtmlWebpackPlugin({ template: 'src/index.html', inject: false }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    })
  ],

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  }
}

// Helper functions

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
