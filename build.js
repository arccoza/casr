var metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
var markdown = require('metalsmith-markdown');
var highlight = require('highlight.js');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
// var postcss = require('postcss');
var postcss = require('./metalsmith-with-postcss');
var justAMoment = require('./metalsmith-just-a-moment');
var browserify = require('metalsmith-browserify');
var more = require('metalsmith-more');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var paginate = require('metalsmith-pagination');
var snippet = require('metalsmith-snippet');
var metadata = require('metalsmith-metadata');
var fileMetadata = require('metalsmith-filemetadata');
// var slug = require('metalsmith-slug');
var slug = require('slug');
var convert = require('metalsmith-convert');
var minimatch = require('minimatch');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var marked = require('marked');
var markedRenderer = new marked.Renderer();
var npath = require('path');

markedRenderer.code = function (code, lang) {
  try {
    code = highlight.highlight(lang, code, true).value;
  } catch (ex) {
  }

  return '<pre class="highlight highlight--block"><code>' + code + '</code></pre>';
}

markedRenderer.codespan = function (code) {
  // try {
  //   code = highlight.highlightAuto(code).value;
  // } catch (ex) {
  // }

  return '<code class="highlight highlight--span">' + code + '</code>';
}

// console.log(marked('```\nvar a;\n```', { renderer: markedRenderer }));

metalsmith(__dirname)
  .source('src')
  .destination('pub')
  .use(watch())
  .use(serve())
  .use(metadata({
    site: 'site.yaml',
    menus: 'menus.yaml'
  }))
  .use(drafts())
  // .use(fileMetadata([
  //   {pattern: "posts/*", metadata: {"type": "post"}},
  //   {pattern: "projects/*", metadata: {"type": "projects"}}
  // ]))
  // .use(justAMoment())
  // .use(require('./favi')())
  // .use(function(){
  //   return function(files, metalsmith, done) {
  //     'use strict';
  //     for(var path in files) {
  //       if(minimatch(path, 'img/**/*.@(jpg|png|gif|JPG|PNG|GIF)', { matchBase: true })) {
  //         var parts = npath.parse(path);

  //         if(!files[path].title)
  //           files[path].title = parts.name;

  //         parts.name = slug(files[path].title, {lower: true});
  //         parts.ext = parts.ext.toLowerCase();
  //         parts.base = parts.name + parts.ext;

  //         files[path].slug = slug(files[path].title, {lower: true});
  //         files[path].src = npath.format(parts);
  //         files[npath.format(parts)] = files[path];

  //         delete files[path];
  //       }
  //     }
  //     done();
  //   }
  // }())
  // .use(slug({
  //   patterns: ['img/**/*.@(jpg|png|gif|JPG|PNG|GIF)'],
  //   // property: 'filename',
  //   lowercase: true,
  //   renameFiles: true
  // }))
  // .use(convert([
  //   {
  //     src: 'img/@(rooms|restaurant-bar|conference|wedding|misc|slider)/**/*.@(jpg|JPG)',
  //     target: 'jpg',
  //     resize: { width: 1280, height: 720, resizeStyle: 'aspectfit' },
  //     nameFormat: '%b_hd%e'
  //   },
  //   {
  //     src: 'img/@(rooms|restaurant-bar|conference|wedding|misc)/**/*.@(jpg|JPG)',
  //     target: 'jpg',
  //     resize: { width: 500, height: 300, resizeStyle: 'aspectfit' },
  //     nameFormat: '%b_lthb%e'
  //   },
  //   {
  //     src: 'img/@(rooms|restaurant-bar|conference|wedding|misc)/**/*.@(jpg|JPG)',
  //     target: 'jpg',
  //     resize: { width: 150, height: 150, resizeStyle: 'aspectfill' },
  //     nameFormat: "%b_mthb%e"
  //   }
  // ]))
  .use(function(){
    return function(files, metalsmith, done) {
      'use strict';
      for(var path in files) {
        if(minimatch(path, 'img/**/*.@(jpg|png|gif|JPG|PNG|GIF)', { matchBase: true })) {
          var parts = npath.parse(path);

          if(!files[path].title)
            files[path].title = parts.name;

          parts.name = slug(files[path].title, {lower: true});
          parts.ext = parts.ext.toLowerCase();
          parts.base = parts.name + parts.ext;

          files[path].slug = slug(files[path].title, {lower: true});
          files[path].src = npath.format(parts);
          files[npath.format(parts)] = files[path];

          delete files[path];
        }
      }
      done();
    }
  }())
  .use(collections({
    imgGallery: {
      pattern: 'img/@(rooms|restaurant-bar|conference|misc)/**/*_mthb.jpg',
      sortBy: 'date',
      reverse: true
    },
    imgRooms: {
      pattern: 'img/rooms/**/*_mthb.jpg',
      sortBy: 'date',
      reverse: true
    },
    imgSlider: {
      pattern: 'img/slider/**/*_hd.jpg',
      sortBy: 'date',
      reverse: true
    },
    imgRestaurant: {
      pattern: 'img/restaurant-bar/**/*_mthb.jpg',
      sortBy: 'date',
      reverse: true
    },
    imgConference: {
      pattern: 'img/conference/**/*_mthb.jpg',
      sortBy: 'date',
      reverse: true
    },
    rooms: {
      pattern: 'rooms/**/*.md',
      sortBy: 'index',
      reverse: false
    },
    services: {
      pattern: 'services/**/*.md',
      sortBy: 'index',
      reverse: false
    },
    // posts: {
    //   pattern: 'posts/**/*.md',
    //   sortBy: 'date',
    //   reverse: true
    // },
    pages: {
      pattern: 'pages/**/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  // .use(paginate({
  //   'collections.all': {
  //     perPage: 9,
  //     layout: 'index.jade',
  //     first: 'index.html',
  //     path: 'all/page/:num/index.html',
  //     pageMetadata: {
  //       //title: 'Blog'
  //     }
  //   },
  //   'collections.posts': {
  //     perPage: 9,
  //     layout: 'index.jade',
  //     first: 'posts/index.html',
  //     path: 'posts/page/:num/index.html',
  //     pageMetadata: {
  //       //title: 'Blog'
  //     }
  //   },
  //   'collections.projects': {
  //     perPage: 9,
  //     layout: 'index.jade',
  //     first: 'projects/index.html',
  //     path: 'projects/page/:num/index.html',
  //     pageMetadata: {
  //       //title: 'Blog'
  //     }
  //   }
  // }))
  .use(markdown({
    gfm: true,
    tables: true,
    renderer: markedRenderer
  }))
  // .use(more({
  //   key: 'excerpt'
  // }))
  // .use(snippet({
  //   maxLength: 250,
  //   suffix: '...'
  // }))
  // TODO: Check why linksets are interfering with CSS.
  .use(permalinks({
    pattern: ':title',
    relative: false,
    date: 'YYYY/MM/DD'
    // linksets: [
    //   {
    //     match: { collection: 'pages' },
    //     pattern: 'page/:title',
    //     relative: false,
    //     date: 'YYYY/MM/DD'
    //   }
    // ]
  }))
  .use(function(){
    return function(files, metalsmith, done) {
      // for(f in files) {
      //   console.log(f, files[f].contents.length);
      // }
      // console.log(files);
      console.log(metalsmith._metadata.collections.imgGallery);
      // console.log(metalsmith._metadata);
      done();
    }
  }())
  .use(inPlace({
    engine: 'mustache',
    pattern: ['**/*.html']
  }))
  .use(layouts({
    engine: 'jade',
    directory: 'templates',
    default: 'page.jade',
    pattern: ['**/*.html']
  }))
  .use(postcss({
    pattern: ['**/*.css', '!**/_*/*', '!**/_*'],
    plugins: {
      'postcss-import': {},
      'postcss-if-media': {},
      'postcss-custom-media': {},
      'postcss-media-minmax': {},
      'postcss-layout': {},
      'postcss-aspect-ratio': {},
      'autoprefixer': {}
    }
  }))
  // .use(function(){
  //   return function(files, metalsmith, done) {
  //     console.log('---------------------------------------------------')
  //     for(f in files) {
  //       console.log(f, files[f].contents.length);
  //     }

  //     // console.log(files);
  //     // console.log(metalsmith._metadata.collections.pages);
  //     // console.log(metalsmith._metadata);
  //     done();
  //   }
  // }())
  .use(browserify('js/main.js', [
    './src/js/main.js'
  ]))
  .build(function (err) {
    if (err) {
      throw err;
    }
  });
