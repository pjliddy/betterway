'use strict'

// default gulp package
const gulp = require('gulp')

// gulp utilities
const concat = require('gulp-concat')
const gutil = require('gulp-util')
const rename = require("gulp-rename")

// gulp compile packages
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const minifyHTML = require('gulp-minify-html');
const babel = require("gulp-babel")
const uglify = require('gulp-uglify')

// gulp server packages
const browserSync = require('browser-sync').create()

// gulp file transfer packages
// const sftp = require('gulp-sftp')

// unsorted packages
// const header = require('gulp-header')
// const pkg = require('./package.json')
// const changed = require('gulp-changed')

// gulp packages for deploying to ftp
// var gzip = require('gulp-gzip');

// const distSrc = 'dist/**'
// const sassSrc = 'scss/*.scss'
// const cssSrc = 'css/*.css'
// const jsSrc = 'js/**/*.js'


// path variables
const distDest = 'dist/'

const htmlSrc = '*.html'
const htmlDest = distDest

const hbsSrc = 'js/templates/*.hbs'
const hbsDest = distDest + 'js/templates/'

const sassSrc = 'scss/styles.scss'
const sassDest = 'css/'
const sassOutput = 'styles.css'

const cssDest = 'dist/css'

const jsSrc = 'js/**/*.js'
const jsDest = './dist/js'

// Run everything
gulp.task('default', ['minify-html', 'minify-handlebars', 'sass', 'minify-css', 'minify-js', 'copy-vendor'])

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
  return gulp.src(sassSrc)
    .pipe(sass())
    .pipe(concat(sassOutput))
    .pipe(gulp.dest(sassDest))
})

// Minify compiled CSS into dist directory
gulp.task('minify-css', ['sass'], function() {
  return gulp.src(['css/*.css', '!css/*.min.css'])
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

// Minify html into dist directory
gulp.task('minify-html', function() {
  return gulp.src(htmlSrc)
    .pipe(minifyHTML({ conditionals: true, spare:true}))
    .pipe(gulp.dest(htmlDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

// Minify handlebars into dist directory
gulp.task('minify-handlebars', function() {
  return gulp.src(hbsSrc)
    .pipe(minifyHTML({ conditionals: true, spare:true}))
    .pipe(gulp.dest(hbsDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

// Minify JS
gulp.task('minify-js', function() {
  return gulp.src(jsSrc)
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({
      stream: true
    }))
});


//
// NOT REFACTORED YET
//



// Run development server task with browserSync locally on port 3000
gulp.task('serve', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
  gutil.log('Execute: serve')

  gulp.watch(sassSrc, ['sass']);
  gulp.watch(cssSrc, ['minify-css']);
  gulp.watch('js/**/*.js', ['minify-js']);

  // Reload the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
  gulp.watch(jsSrc, browserSync.reload);
});

// Configure the browserSync task
gulp.task('browserSync', function() {
  gutil.log('Execute: browserSync')

  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

// Compiles SCSS files from /scss into /css
// gulp.task('sass', function() {
//   gutil.log('Execute: sass')
//
//   return gulp.src('scss/styles.scss')
//     .pipe(sass())
//     .pipe(concat('styles.css'))
//     .pipe(gulp.dest('./css/'))
//     .pipe(browserSync.reload({
//       stream: true
//     }))
// });




// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy-vendor', function() {
  gutil.log('Execute: copy-vendor')

  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('vendor/jquery'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('vendor/font-awesome'))
})




gulp.task('push-dev', function () {
  gutil.log('Execute: push-dev');

  return gulp.src(distSrc)
    .pipe(changed(distSrc))
    // .pipe(gulp.dest(dist))
    .pipe(sftp({
      auth: 'privateKeyEncrypted',
      host: 'bwarealty.com',
      remotePath: '/home/bwarealty/dev/',
      key: '~/.ssh/bwa_id_rsa',
      authFile: '.ftppass'
    }))
})



// defining single task with name "build"
gulp.task('build', function() {
  gutil.log('Execute: build');

  // only copy desired files to dist folder
  gulp.src('./css/**').pipe(gulp.dest('./dist/css'));
  gulp.src('./img/**').pipe(gulp.dest('./dist/img'));
  gulp.src('./js/**').pipe(gulp.dest('./dist/js'));
  gulp.src('./vendor/**').pipe(gulp.dest('./dist/vendor'));
  gulp.src('./cgi/*.php').pipe(gulp.dest('./dist/cgi'));
  gulp.src('./*.html').pipe(gulp.dest('./dist'));
  gulp.src('./*.png').pipe(gulp.dest('./dist'));
  gulp.src('./*.ico').pipe(gulp.dest('./dist'));
  gulp.src('./*.svg').pipe(gulp.dest('./dist'));
  gulp.src('./browserconfig.xml').pipe(gulp.dest('./dist'));
  gulp.src('./manifest.json').pipe(gulp.dest('./dist'));
  gulp.src('./*.html').pipe(gulp.dest('./dist'));


  //minify css
  // gulp.src('./dist/css/*.css')
  //   .pipe(minifyCss({compatibility: 'ie8'}))
  //   .pipe(gulp.dest('./dist'));

  //gzipping css
  // gulp.src('./dist/css/*.css')
  //   .pipe(awspublish.gzip({ ext: '.gz' }))
  //   .pipe(gulp.dest('./dist'));

  //minifying html
  // gulp.src('./dist/*.html')
  //   .pipe(minifyHTML({ conditionals: true, spare:true}))
  //   .pipe(gulp.dest('./dist'));

  // var headers = { 'Cache-Control': 'max-age=315360000, no-transform, public' };

});

// Set the banner content
// var banner = ['/*!\n',
//   ' * Betterway Atlanta Realty - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
//   ' * Copyright 2017-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
//   ' */\n',
//   ''
// ].join('');
