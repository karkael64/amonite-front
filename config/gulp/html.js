const {dest, src} = require('gulp');
const es = require('event-stream');
const concat = require('gulp-concat');

function compile(options) {
  if(!(typeof options === 'object')) options = {};
  return es.map(function(file, callback){
    var text = file.contents.toString();
    text = eval('(function(options){ return `' + text + '`; })').call(null, options);
    file.contents = Buffer.from(text);
    callback(null, file);
  });
}

function html () {
  return src('./config/template.html')
    .pipe(compile({
      design: '/design.css',
      run: '/run.js'
    }))
    .pipe(concat('index.html'))
    .pipe(dest('./build/'));
}

exports.html = html;
