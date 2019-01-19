/**
 *  @function <ajax> execute a request to server
 *  @param {string|function|object} method or builder
 *  @param {string|function} uri to resource
 *  @param {string|function} data to send in request body
 *  @param {function|Array.<function>} success functions
 *  @param {function|Array.<function>} failure functions
 *  @param {object|function} headers to send to request headers
 *  @param {string|function} overrideMimeType to enforce response reading format
 *  @return {Promise}
 */

function ajax () {
  let builder = ajax_parameters.apply(this, arguments);

  let prom = new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("loadend", function () {
      resolve(xhr);
    });
    xhr.addEventListener("error", function () {
      reject(xhr);
    });

    xhr.open(builder["method"], builder["uri"]);

    if (builder["headers"]) {
      Object.keys(builder["headers"]).forEach(function(key) {
        let str = try_exec(builder["headers"][key]);
        if (typeof str === "string") {
          xhr.setRequestHeader(key, str);
        }
      });
    }

    if (typeof builder["overrideMimeType"] === "string") {
      xhr.overrideMimeType(builder["overrideMimeType"]);
    }

    xhr.send(builder["data"]);
  });

  if(Array.isArray(builder.success)) {
    builder.success.forEach(function (fn) {
      if(typeof fn === "function")
        prom.then(fn);
    });
  }
  if(typeof builder.success === "function") {
    prom.then(builder.success);
  }

  if(Array.isArray(builder.failure)) {
    builder.failure.forEach(function (fn) {
      if(typeof fn === "function")
        prom.then(fn);
    });
  }
  if(typeof builder.failure === "function") {
    prom.then(builder.failure);
  }

  return prom;
}


/**
 *  @function <ajax_parameters> execute parameters and returns in good format
 *  @param {string|function|object} method or builder
 *  @param {string|function} uri to resource
 *  @param {string|function} data to send in request body
 *  @param {function|Array.<function>} success functions
 *  @param {function|Array.<function>} failure functions
 *  @param {object|function} headers to send to request headers
 *  @param {string|function} overrideMimeType to enforce response reading format
 *  @return {Object}
 */

function ajax_parameters (method, uri, data, success, failure, headers, overrideMimeType) {
  if(typeof method === "object") {
    return ajax_parameters(
      method["method"],
      method["uri"] || method["url"] || method["file"] || method["source"],
      method["data"] || method["body"] || method["post"],
      method["success"] || method["load"],
      method["failure"] || method["error"],
      method["headers"],
      method["overrideMimeType"]
    );
  }
  else {
    return {
      "method": try_exec.call(this, method, "GET"),
      "uri": try_exec.call(this, uri, ""),
      "data": try_exec.call(this, data, null),
      success,
      failure,
      "headers": try_exec.call(this, headers, null),
      "overrideMimeType": try_exec.call(this, overrideMimeType, null)
    }
  }
}


/**
 *  @function <try_exec> execute {fn} if it is a function or
 *    return {fn} if it is a string or
 *    return {def}.
 *  @return {string|*}
 */

function try_exec (fn, def) {
  if (typeof fn === "function") {
    return fn.call(this);
  }
  if (typeof fn === "string") {
    return fn;
  }
  return def;
}

export { ajax as default, ajax, try_exec };
