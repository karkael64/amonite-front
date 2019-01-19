'use strict';

const { build } = require('./gulp.dev.js');

const { src, dest, series, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');

function sassProd() {
  return src('./build/design.css')
    .pipe(uglifycss())
    .pipe(dest('./build/design.min.css'));
}

function babelProd() {
  return src('./build/run.js')
    .pipe(uglify())
    .pipe(dest('./build/run.min.js'));
}

exports.build = build;
exports.prod = series(build, parallel( sassProd, babelProd));
