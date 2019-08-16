


module.exports = {
    entry: './public/js/fgGraph.js',
    output: {
      path: __dirname + '/public/build',
      filename: 'bundle.js'
    },
    module: {

    },
    resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
  }
