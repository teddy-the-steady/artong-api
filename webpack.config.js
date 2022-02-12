const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.webpack.isLocal ? {
    artong: path.join(__dirname, 'artong/handler/artong.ts'),
  } : null,
  output: slsw.lib.webpack.isLocal ? {
    libraryTarget: 'commonjs',
    filename: 'artong/handler/[name].js',
    path: path.resolve(__dirname, 'dist')
  } : null,
	module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.sql$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ]
  },
	resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [new IgnorePlugin({resourceRegExp: /^pg-native$/})],
}