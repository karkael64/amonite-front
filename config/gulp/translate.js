const { src, dest, watch } = require('gulp');

const po2json = require('po2json');
const es = require('event-stream');
const del = require('fs').unlinkSync;

function mapTranslate() {
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
    file.path = file.base + '/' + lang + '.json';
    callback(null, file);
  });
}

function clean() {
  return es.map(function(file, callback){
    del(file.path);
    callback(null, file);
  });
}

function translate () {
  return src(['./i18n/*.po'])
    .pipe(mapTranslate())
    .pipe(dest('./i18n/'));
}

function translateClean () {
  return src(['./i18n/*.json'])
    .pipe(clean());
}

const { js } = require('../gulp.dev');
function reloadTranslate(then) {
  watch('./i18n/*.po', js);
  then();
}

exports.translate = translate;
exports.translateClean = translateClean;
exports.reloadTranslate = reloadTranslate;
