let fs = require("fs");
let route = new require("express").Router();

let delay = 300,
  longDelay = 2000,
  shortDelay = 10;

function readJsonFileSync(filepath, encoding) {
  let file = fs.readFileSync(filepath, encoding || "utf8");
  return JSON.parse(file);
}

function getConfig(file) {
  let filepath = __dirname + "/" + file;
  return readJsonFileSync(filepath);
}


route.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

route.get("/user", function(req, res){
  setTimeout(function(){
    res.json(getConfig("./v1/user/index.json"));
  }, delay);
});

route.get("/organization/details", function(req, res){
  setTimeout(function(){
    res.json(getConfig("./v1/organization/details.json"));
  }, shortDelay);
});


module.exports = route;
