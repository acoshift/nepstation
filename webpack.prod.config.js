var path = require('path')
var webpack = require('webpack')
// Webpack Plugins
var ProvidePlugin = require('webpack/lib/ProvidePlugin')
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin')
var DedupePlugin = webpack.optimize.DedupePlugin
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
var DefinePlugin = require('webpack/lib/DefinePlugin')

var metadata = {
  title: 'NepStation',
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
  ENV: process.env.ENV = process.env.NODE_ENV = 'production'
}
/*
 * Config
 */
module.exports = {
  metadata: metadata,

  devServer: {
    port: metadata.port,
    host: metadata.host,
    historyApiFallback: true,
    contentBase: 'src/public',
    publicPath: '/__build__',
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  },

  node: { global: 'window', progress: false, crypto: 'empty', module: false, clearImmediate: false, setImmediate: false },

  entry: {
    'vendor': './src/vendor.ts',
    'app': './src/bootstrap.ts'
  },

  output: {
    path: root('__build__'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    cache: false,
    extensions: ['', '.ts', '.js', '.json', '.css', '.html', '.jade']
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [
          /node_modules/
        ]
      }
    ],
    loaders: [
      // Support for *.json files.
      { test: /\.json$/, loader: 'json-loader' },

      // CSS as raw text
      { test: /\.css$/, loader: 'to-string-loader!css-loader' },

      // html as raw text
      { test: /\.html$/, loader: 'html-loader?minimize=false' },

      // jade
      { test: /\.jade$/, loader: 'html-loader?minimize=false!jade-html-loader' },

      // Fonts
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9\.\=]+)?$/, loader: 'file?name=./fonts/[hash].[ext]' },

      // Images
      { test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=./img/[hash].[ext]' },

      // Support for .ts files.
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          'ignoreDiagnostics': [
            2403, // 2403 -> Subsequent variable declarations
            2300, // 2300 -> Duplicate identifier
            2374, // 2374 -> Duplicate number index signature
            2375  // 2375 -> Duplicate string index signature
          ]
        },
        transpileOnly: true,
        exclude: [ /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/ ]
      }
    ]
  },

  plugins: [
    new DedupePlugin(),
    new OccurenceOrderPlugin(true),
    new DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),
    new ProvidePlugin({
      // TypeScript helpers
      '__metadata': 'ts-helper/metadata',
      '__decorate': 'ts-helper/decorate',
      '__awaiter': 'ts-helper/awaiter',
      '__extends': 'ts-helper/extends',
      '__param': 'ts-helper/param',
      'Reflect': 'es7-reflect-metadata/dist/browser'
    }),
    new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity }),
    new UglifyJsPlugin({
      comments: false,
      mangle: false,
      unsafe: true,
      copyright: false
    })
  ],

  tslint: {
    emitErrors: true,
    failOnHint: true
  }
}

// Helper functions

function root (args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [__dirname].concat(args))
}

function rootNode (args) {
  args = Array.prototype.slice.call(arguments, 0)
  return root.apply(path, ['node_modules'].concat(args))
}
