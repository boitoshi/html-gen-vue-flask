// frontend/vue.config.js
module.exports = {
    outputDir: '../backend/app/static',
    assetsDir: 'assets',
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    }
  };
  