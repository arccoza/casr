var metalsmith = require('metalsmith');
var watch = require('metalsmith-watch');
var postcss = require('metalsmith-with-postcss');
var browserify = require('metalsmith-browserify');


var b = browserify('js/main.js', [
    './src/js/main.js'
  ]);
b.bundle.transform('babelify', { presets: ['es2015'] });
b.bundle.transform('vueify');
b.bundle.transform('uglifyify',  { global: true });

metalsmith(__dirname)
  .source('src')
  .destination('pub')
  .use(watch())
  .use(postcss({
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    plugins: {
      'postcss-import': {},
      'postcss-if-media': {},
      'postcss-custom-media': {},
      'postcss-media-minmax': {},
      'postcss-custom-properties': {},
      'postcss-calc': {},
      'postcss-layout': {},
      'postcss-aspect-ratio': {},
      'autoprefixer': {}
    },
    removeExcluded: false
  }))
  .use(b)
  .build(function (err) {
    if (err) {
      throw err;
    }
  });
