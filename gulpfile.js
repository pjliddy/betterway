'use strict'

/*
 *  Required Gulp Packages
 */

// default gulp package
const gulp = require('gulp')

// gulp utilities
const concat = require('gulp-concat')
const util = require('gulp-util')
const rename = require("gulp-rename")
const changed = require('gulp-changed')

// gulp compile packages
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const minifyHTML = require('gulp-minify-html')
const babel = require("gulp-babel")
const uglify = require('gulp-uglify')

// gulp server packages
const browserSync = require('browser-sync').create()

// gulp git packages
var git = require('gulp-git')
var subtree = require('gulp-subtree')

// gulp file transfer packages
// const sftp = require('gulp-sftp')

// gulp packages for deploying to ftp
// var gzip = require('gulp-gzip')

/*
 *  Variable Declarations
 */

const distDest = 'dist/'

const htmlSrc = '*.html'
const htmlDest = distDest

const hbsSrc = 'js/templates/*.hbs'
const hbsDest = distDest + 'js/templates/'

const sassWatch = 'scss/*.scss'
const sassSrc = 'scss/styles.scss'
const sassDest = 'css/'
const sassOutput = 'styles.css'

const cssSrc = sassDest + '*.css'
const cssDest = 'dist/css'

const jsSrc = 'js/**/*.js'
const jsDest = './dist/js'

const faviconSrc = ['./*.png', './*.ico', './*.svg', './browserconfig.xml', './manifest.json']
const cgiSrc = 'cgi/*.php'
const cgiDest = distDest + 'cgi/'
const imgSrc = ['img/*.png', 'img/*.jpg', 'img/*.gif']
const imgDest = distDest + 'img/'
const vendorSrc = 'vendor/**/*'
const vendorDest = distDest + 'vendor/'

/*
 *  Global Tasks
 */

// Run everything
gulp.task('default', [
  'minify-html',
  'minify-handlebars',
  // 'sass',
  'minify-css',
  'minify-js',
  'copy-images',
  'copy-cgi',
  'copy-favicons',
  'copy-vendor'
])

// Run development server task with browserSync locally on port 3000
gulp.task('serve', ['browserSync', 'default'], function() {
  // run gulp tasks when source files change
  gulp.watch(htmlSrc, ['minify-html'])
  gulp.watch(hbsSrc, ['minify-handlebars'])
  gulp.watch(sassWatch, ['minify-css'])
  gulp.watch(imgSrc, ['copy-images'])
  gulp.watch(cgiSrc, ['copy-cgi'])
  gulp.watch(faviconSrc, ['copy-favicons'])
  gulp.watch(vendorSrc, ['copy-vendor'])

  // Reload the browser whenever files change
  gulp.watch(htmlDest, browserSync.reload)
  gulp.watch(jsDest, browserSync.reload)
  gulp.watch(vendorDest, browserSync.reload)
  gulp.watch(cssDest, browserSync.reload)
})

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

/*
 *  Compile & Minify Tasks
 */

// Compile SCSS files from to css/
gulp.task('sass', function() {
  return gulp.src(sassSrc)
  .pipe(sass())
  .pipe(concat(sassOutput))
  // .pipe(changed(sassDest))
  .pipe(gulp.dest(sassDest))
})

// Minify compiled CSS to dist/
gulp.task('minify-css', ['sass'], function() {
  return gulp.src(['css/*.css', '!css/*.min.css'])
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    // .pipe(changed(cssDest))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

// use minifyHTML to minify html and handlebars files
function minifyHtmlFiles (src, dest) {
  return gulp.src(src)
    .pipe(minifyHTML({ conditionals: true, spare:true}))
    // .pipe(changed(dest))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({
      stream: true
    }))
}

// Minify html to dist/
gulp.task('minify-html', function() {
  return minifyHtmlFiles(htmlSrc, htmlDest)
})

// Minify handlebars to dist/
gulp.task('minify-handlebars', function() {
  return minifyHtmlFiles(hbsSrc, hbsDest)
})

// Minify JS to dist/
gulp.task('minify-js', function() {
  return gulp.src(jsSrc)
    .pipe(babel())
    // .pipe(uglify().on('error', util.log)) // notice the error event here
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    // .pipe(changed(jsDest))
    .pipe(gulp.dest(jsDest))
    .pipe(browserSync.reload({
      stream: true
    }))
})

/*
 *  File Copy Tasks
 */

// Copy favicons to dist/
function copy (src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest))
}

gulp.task('copy-favicons', function() {
  return copy(faviconSrc, distDest)
})

// Copy cgi contents to dist/
gulp.task('copy-cgi', function() {
  return copy(cgiSrc,cgiDest)
})

// Copy images to dist/
gulp.task('copy-images', function() {
  return copy(imgSrc,imgDest)
})

// Deploy vendor directory to dist/
gulp.task('deploy-vendor', function() {
  return copy(vendorSrc, vendorDest)
})

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy-vendor', function() {
  gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    // .pipe(changed('vendor/bootstrap'))
    .pipe(gulp.dest('vendor/bootstrap'))

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    // .pipe(changed('vendor/jquery'))
    .pipe(gulp.dest('vendor/jquery'))

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    // .pipe(changed('vendor/font-awesome'))
    .pipe(gulp.dest('vendor/font-awesome'))

  return copy(vendorSrc, vendorDest)
})

/*
 *  Git Deploy Scripts
 */

// Add dist files to remote repo on server
gulp.task('git-dist', function(){
  return gulp.src('dist/')
    .pipe(git.add({args: '-f'}))
    // commit files
    .pipe(git.commit(undefined, {
      args: '-m "commit build"',
      disableMessageRequirement: true
    }))
})

function deploy (server) {
  return gulp.src('dist')
    .pipe(subtree({
      remote: server,
      branch: 'master',
      message: 'Deploy to ' + server
    }))
}


// Push 'dist/' to dev server
gulp.task('deploy-dev', ['git-dist'], function () {
  // git subtree push --prefix dist dev master
  // return deploy('dev')
  return gulp.src('dist')
    .pipe(subtree({
      remote: 'dev',
      branch: 'master',
      message: 'Deploy to dev'
    }))
})

// Push 'dist/' to staging server
gulp.task('deploy-staging', ['default', 'git-dist'], function () {
  return deploy('staging')
})

//
// NOT REFACTORED YET
//

gulp.task('push-dev', function () {
  util.log('Execute: push-dev');

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
