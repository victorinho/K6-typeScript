const path = require('path');
const fs = require('fs');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const folderName = process.env.TESTS_PATH;

module.exports = () => {
  // Function to get all the files in a folder recursively
  function getFiles(dir) {
    const dirents = fs.readdirSync(dir, {withFileTypes: true});
    const files = dirents.map((dirent) => {
      const res = path.join(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    });
    return files.flat();
  }

  const testsPath = path.resolve(folderName ? folderName : path.join(__dirname, "src"))

  const entries = {};
  getFiles(path.join(testsPath, "Tests")).forEach(file => {
    entries[file.replace(testsPath, '').slice(0, -3)] = file.replace(testsPath, './');
  });

  return {
    mode: "production",
    context: testsPath,
    entry: entries,
    output: {
      path: path.resolve(__dirname, "dist"),
      libraryTarget: 'commonjs',
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        headers: path.resolve(__dirname, 'src/backend_requests/headers/'),
        utils: path.resolve(__dirname, 'src/backend_requests/utils/'),
        assertions: path.resolve(__dirname, 'src/Resources/assertions/')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
      ],
    },
    target: 'web',
    externals: /^(k6|https?:\/\/)(\/.*)?/,
    // Generate map files for compiled scripts
    devtool: "source-map",
    stats: {
      colors: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      // Copy assets to the destination folder
      // see `src/post-file-test.ts` for a test example using an asset
      new CopyPlugin({
        patterns: [{
          from: path.resolve(__dirname, 'assets'),
          noErrorOnMissing: true
        }],
      }),
    ],
    optimization: {
      // Don't minimize, as it's not used in the browser
      minimize: false,
    },
    performance: {
      hints: false
    }
  };
}
