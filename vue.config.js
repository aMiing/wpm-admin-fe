/**
 * @author amingxiansen 1006934861@qq.com
 * @description cli配置
 */

const path = require('path');

const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  devPort,
  providePlugin,
} = require('./src/config');

const { version, author } = require('./package.json');
const Webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const dayjs = require('dayjs');
// const date = dayjs().format('YYYY_M_D')
const time = dayjs().format('YYYY-M-D HH:mm:ss');
process.env.VUE_APP_TITLE = title || 'wpm-admin';
process.env.VUE_APP_AUTHOR = author || 'amingxiansen 1006934861@qq.com';
process.env.VUE_APP_UPDATE_TIME = time;
process.env.VUE_APP_VERSION = version;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const resolve = dir => path.join(__dirname, dir);
const proxyUri = 'http://47.99.144.112:3000';
// const proxyUri = 'http://localhost:3000';
const payPath = 'https://shq-api.51fubei.com/gateway/agent';
module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy: {
      '/api': {
        target: proxyUri,
      },
      'customer-upload/': {
        target: proxyUri,
      },
      '/pay': {
        target: payPath,
        pathRewrite: {
          '^/pay': '',
        },
        changeOrigin: true,
      },
    },
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new CopyPlugin([
          {
            from: path.resolve(__dirname, './favicon.ico'),
            to: outputDir,
            ignore: ['.*'],
          },
        ]),
        new BundleAnalyzerPlugin(),
      ],
    };
  },
  chainWebpack(config) {
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    config.module
      .rule('svg')
      .exclude.add(resolve('src/remixIcon'))
      .add(resolve('src/colorfulIcon'))
      .end();

    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'remix-icon-[name]',
      })
      .end();

    config.module
      .rule('colorfulIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/colorfulIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'colorful-icon-[name]',
      })
      .end();
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .use('pug-html-loader')
      .loader('pug-html-loader')
      .end();
    config.module
      .rule('htmlLoader')
      .test(/\.html$/)
      .use('html-loader')
      .loader('html-loader')
      .end();
    /*  config.when(process.env.NODE_ENV === "development", (config) => {
      config.devtool("source-map");
    }); */
    config.when(process.env.NODE_ENV !== 'development', config => {
      config.performance.set('hints', false);
      config.devtool('none');
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          vabIcon: {
            name: 'vab-icon',
            priority: 30,
            test: /[\\/]node_modules[\\/]_?vab-icon(.*)/,
          },
          maptalks: {
            name: 'maptalks',
            priority: 40,
            test: /[\\/]node_modules[\\/]_?maptalks(.*)/,
          },
        },
      });
    });
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/styles/variables.scss";',

        /*sass-loader 9.0写法，感谢github用户 shaonialife*/
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext;
          const relativePath = path.relative(rootContext, resourcePath);
          if (relativePath.replace(/\\/g, '/') !== 'src/styles/variables.scss') {
            return '@import "~@/styles/variables.scss";' + content;
          }
          return content;
        },
      },
    },
  },
};
