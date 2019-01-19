import FR from "../../../i18n/fr.json";
import EN from "../../../i18n/en.json";
const FILES = {
  "en": EN,
  "fr": FR
};

const LANGUAGES = Object.keys(FILES);

function translate( field, ...args ) {
  let text = FILES[translate.language][field] || field;
  let fn = eval("(function(...args){return `" + text + "`;})")
  return fn.apply(null, args);
}

function to( language ) {
  if( LANGUAGES.indexOf( language ) !== -1 ) {
    translate.language = language;
    temporary.language = language;
  }
  return translate;
}

function temporary( language ) {
  if( LANGUAGES.indexOf( language ) !== -1 ) {
    temporary.language = translate.language;
    translate.language = language;
  }
  return translate;
}

function resolve() {
  var switcher = temporary.language;
  temporary.language = translate.language;
  translate.language = switcher;
  return translate;
}

translate.to = to;
translate.temporary = temporary;
translate.resolve = resolve;

translate.to( LANGUAGES[0] );
translate.to( (navigator.language || navigator.userLanguage).substr(0, 2) );

export default translate;
