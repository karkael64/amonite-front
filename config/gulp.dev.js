const { src, series, dest, watch, parallel } = require('gulp');

const { icons, reloadIcons } = require('./gulp/icon');
const { sass, reloadSass } = require('./gulp/sass');
const css = series(icons, sass);

const { translate, reloadTranslate, translateClean } = require("./gulp/translate");
const { babel, reloadBabel } = require("./gulp/babel");
const js = series(translate, babel, translateClean);
const reloadJs = parallel(reloadTranslate, reloadBabel);

const { html } = require('./gulp/html');

var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');

var Express = require('express');


function copyStatic () {
  src(['./app/**/*.png', './app/**/*.jpg', './app/**/*.jpeg'])
    .pipe(dest('./build/pictures/'));
  return src(['./config/din/*'])
    .pipe(dest('./build/fonts/'));
}

function stub (then) {
  const express = Express();
  let route = require('../stub/api');

  express.use('/enterprise-api/v1/', route);
  express.listen(2999, function(){
    console.log('stub listen :2999');
    then();
  });
}

function local (then) {
  connect.server({
    port: 3000,
    root: './build/',
    livereload: true
  });
  then();
}

const build = parallel(copyStatic, css, js, html);
const server = parallel(stub, local);
const reload = parallel(reloadIcons, reloadJs, reloadSass);

exports.build = build;
exports.server = server;
exports.reload = reload;
exports.dev = series(build, server, reload);
exports.js = js;
exports.css = css;
