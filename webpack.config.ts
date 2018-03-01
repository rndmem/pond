import * as CleanPlugin from 'clean-webpack-plugin'
import * as CopyPlugin from 'copy-webpack-plugin'
import * as webpack from 'webpack'

const PRODUCTION = process.env.NODE_ENV === 'production'

const STATS = {
  all: false,
  errors: true,
  errorDetails: true,
  moduleTrace: true,
  warnings: true
}

const config: webpack.Configuration = {
  resolve: {extensions: ['.ts', '.js']},

  output: {filename: 'index.js'},

  module: {
    rules: [
      {test: /\.ts$/, use: 'ts-loader'},
      {test: /\.(frag|vert)$/, use: 'raw-loader'}
    ]
  },

  stats: STATS,

  devServer: PRODUCTION
    ? undefined
    : {
        clientLogLevel: 'warning',
        progress: false,
        overlay: {warnings: true, errors: true},
        stats: STATS
      },

  plugins: [
    new CleanPlugin('dist', {verbose: false}),
    new CopyPlugin([
      {context: 'src', from: '**/*.html'},
      {context: 'src', from: '**/*.png'}
    ])
  ]
}

export default config
