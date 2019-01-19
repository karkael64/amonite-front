'use strict';

require('./gulp.dev.js');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var es = require('event-stream');
var po2json = require('po2json');

function compile(options) {
  if(!(typeof options === 'object')) options = {};
  return es.map(function(file, callback){
    var text = file.contents.toString();
    text = eval('(function(options){ return `' + text + '`; })').call(null, options);
    file.contents = Buffer.from(text);
    callback(null, file);
  });
}

function po() {
  return es.map(function(file, callback){
    var data = po2json.parse(file.contents, {format: 'raw'});
    var lang = data[''].language;
    var prepared = {};
    Object.keys(data).forEach(function(key){
      if(key) {
        prepared[key] = data[key][1];
      }
    });
    file.contents = Buffer.from(JSON.stringify(prepared, false, 2));
    file.path = file.base + lang + '.json';
    callback(null, file);
  });
}

gulp.task('sass-prod', ['sass'], function() {
  gulp.src('./build/design.css')
    .pipe(uglifycss())
    .pipe(gulp.dest('./build/design.min.css'));
});

gulp.task('babel-prod', ['js'], function(){
  gulp.src('./build/run.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/run.min.js'));
});

gulp.task('copy-prod', function(){
  gulp.src(['./application/icons/icons.eot', './application/icons/icons.ttf', './application/icons/icons.woff', './application/icons/icons.woff2'])
    .pipe(gulp.dest('./build/fonts/'));
  gulp.src(['./config/index.html'])
    .pipe(compile({
      styleURI: 'design.min.css',
      vueURI: 'vue.min.js',
      vueRouterURI: 'vue-router.min.js',
      scriptURI: 'run.min.js',
    }))
    .pipe(gulp.dest('./build/'));
  gulp.src(['./i18n/*.po'])
    .pipe(po())
    .pipe(gulp.dest('./application/modules/translate/'));
  gulp.src(['./node_modules/vue/dist/vue.min.js'])
    .pipe(gulp.dest('./build/'));
  gulp.src(['./node_modules/vue-router/dist/vue-router.min.js'])
    .pipe(gulp.dest('./build/'));
  gulp.src(['./application/**/*.png', './application/**/*.jpg'])
    .pipe(gulp.dest('./build/pictures/'));
});

gulp.task('icons-prod', ['iconfont', 'copy-prod', 'html']);
