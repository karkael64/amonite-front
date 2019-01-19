const { src, series, dest, watch } = require("gulp");
const iconfontCss = require("gulp-iconfont-css");
const gulpIconfont = require("gulp-iconfont");

function icons () {
  return src(["./app/**/*.svg"])
    .pipe(iconfontCss({
      fontName: "icons",
      fontPath: "./fonts/",
      path: "./config/icons.tpl-scss",
      targetPath: "icons.scss"
    }))
    .pipe(gulpIconfont({
      fontName: "icons",
      fontHeight: 1000,
      descent: 136,
      winAscent: 833,
      winDescent: 103,
      normalize: true
     }))
    .pipe(dest("./build/fonts/"));
}

function reloadIcons(then){
  watch("./app/**/*.svg", icons);
  then();
}

exports.icons = icons;
exports.reloadIcons = reloadIcons;
