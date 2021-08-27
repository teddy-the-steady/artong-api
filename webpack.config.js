const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  /* [IMPORTANT] local 테스트시 주석 해제.. TODO] env로 쪼개자*/
  // entry: {
  //   artong: path.join(__dirname, 'artong/handler/artong.ts'),
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