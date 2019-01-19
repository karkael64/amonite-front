import ajax from "./ajax.js";

/**
 *  @function <merge_objects> merge two objects into a new object, where first parameter is prior to second
 *  @param {object} base
 *  @param {object} data
 *  @return {object}
 */

function merge_objects (base, data) {
  var result = {};
  if(typeof base !== "object") base = {};

  Object.keys(base).forEach(function(key){
    result[key] = base[key];
  });

  if(typeof data === "object") {
    Object.keys(data).forEach(function(key){
      if(base[key] === undefined)
      base[key] = data[key];
    });
  }

  return base;
}


/**
 *  @function <request> send a request to server using ajax, with JSON body for request and response.
 *  @param {Model} model context
 *  @param {object} options custom parameters for the request
 *  @return {Promise}
 */

function request (model, options) {
  options.uri = options.uri || options.url || model.uri || model.url || "";

  let success = options.success || options.load || model.success || model.load || null;
  let failure = options.failure || options.error || model.failure || model.error || null;

  options.success = options.load = null;
  options.failure = options.error = null;

  let prom = new Promise(function (resolve, reject) {
    ajax(options).then(function (xhr) {
      try {
        var data = JSON.parse(xhr.responseText);
        if (typeof data === "object") {
          model.attributes = data;
          resolve(xhr, model);
        }
        else {
          reject(xhr, model);
        }
      }
      catch (e) {
        reject(xhr, model);
      }
    }).catch(function (xhr) {
      reject(xhr, model);
    });
  });

  if(Array.isArray(success)) {
    success.forEach(function (fn) {
      if(typeof fn === "function")
        prom.then(fn);
    });
  }
  if(typeof success === "function") {
    prom.then(fn);
  }

  if(Array.isArray(failure)) {
    failure.forEach(function (fn) {
      if(typeof fn === "function")
        prom.then(fn);
    });
  }
  if(typeof failure === "function") {
    prom.then(fn);
  }

  return prom;
}


/**
 *  @class <Model> is an object which stock data & can be sync with a server data.
 */

class Model {

  constructor (attributes) {
    this.attributes = {};
    if(typeof this.default === "object") {
      this.set(this.default);
    }
    this.set(attributes);
  }


  /**
   *  @method <get> returns model attribute
   *  @param {string} field
   *  @return {*} value
   */

  get (field) {
    return this.attributes[field];
  }


  /**
   *  @method <set> set model {field} attribute with {value}
   *  @param {string|object} field
   *  @param {*} value
   *  @return {Model} this
   */

  set (field, value) {
    let self = this;
    if (typeof field === "object") {
      Object.keys(field).forEach(function (f) {
        self.set(f, field[f]);
      });
    }
    else if (typeof field === "string"){
      this.attributes[field] = value;
    }
    return this;
  }


  /**
   *  @method <fetch> request sync with server, with a GET method
   *  @param {object|null} options
   *  @return {Promise}
   */

  fetch (options) {
    if (typeof options !== "object") options = {};
    options.method = options.method || this.method || "GET";
    options.data = options.body = options.post = null;

    return request(this, options);
  }


  /**
   *  @method <save> request sync with server, with a POST method
   *  @param {object|null} attributes to send in request body
   *  @param {object|null} options
   *  @return {Promise}
   */

  save (attributes, options) {
    this.set(attributes);
    if (typeof options !== "object") options = {};
    options.method = options.method || this.method || "POST";
    options.data = JSON.stringify(this.attributes);

    return request(this, options);
  }


  /**
   *  @method <clean> replace attributes object by new one empty.
   */

  clean () {
    this.attributes = {};
  }
}

export default Model;
