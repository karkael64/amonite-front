const { parallel, series } = require("gulp");
const { translate, reloadTranslate, translateClean } = require("./translate");
const { babel, reloadBabel } = require("./babel");

const js = series(translate, babel, translateClean);
const reloadJs = parallel(reloadTranslate, reloadBabel);

exports.js = js;
exports.reloadJs = reloadJs;
