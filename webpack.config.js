const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
	// entry: {
  //   artong: path.join(__dirname, 'artong/handler/artong.ts'),
  //   photo: path.join(__dirname, 'artong/handler/photo.ts'),
  // },
  // output: {
  //   libraryTarget: 'commonjs',
  //   filename: 'artong/handler/[name].js',
  //   path: path.resolve(__dirname, 'dist')
  // },
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