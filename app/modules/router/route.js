const FORMATS = {
  number: function (str) {
    let n = parseFloat(str);
    if(isNaN(n))
      throw new Error("Bad type: expect argument to be a number.");
    return n;
  },
  integer: function (str) {
    let n = parseInt(str);
    if(isNaN(n))
      throw new Error("Bad type: expect argument to be an integer.");
    return n;
  },
  float: function (str) {
    let n = parseFloat(str);
    if(isNaN(n))
      throw new Error("Bad type: expect argument to be a float.");
    return n;
  },
  text: function (str) {
    try {
      let s = JSON.parse(str);
      if(typeof s === "string")
        return s;
    }
    catch (e) {}
    return str;
  },
  object: function (str) {
    try {
      let o = JSON.parse(str);
      if(typeof o === "object")
        return o;
    }
    catch (e) {}
    throw new Error("Bad type: expect argument to be an object.");
  },
  boolean: function (str) {
    try {
      let b = JSON.parse(str);
      if(typeof b === "boolean")
        return b;
    }
    catch (e) {}
    throw new Error("Bad type: expect argument to be a boolean.");
  },
  any: function (str) {
    try {
      return JSON.parse(str);
    }
    catch (e) {}
    return str;
  },
  uuid: function (str) {
    if (str.match(/[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}/))
      return str;
    else
      throw new Error("Bad type: expect argument to be an uuid.");
  }
}


class Route {

  constructor (path, controller) {
    if (typeof path !== "string")
      throw new Error("First parameter should be a string.");
    if (typeof controller !== "function")
      throw new Error("Second parameter should be a function.");
    this.path = path;
    this.controller = controller;
  }

  go (args) {
    this.controller(args || this.getArgs());
  }

  getArgs () {
    let current = Route.getRequestObject(),
      self = Route.getRequestObject(this.path),
      args = {};

    if (self[self.length-1] === "*") {
      if(current.length < self.length-1) {
        return null;
      }
    }

    else if (current.length !== self.length) {
      return null;
    }

    for (var i = 0; i < current.length; i++) {
      let chunk = self[i];
      if (chunk === "*")
        break;
      if (typeof chunk === "string" && chunk === current[i])
        continue;

      let key = Object.keys(chunk)[0],
        value = chunk[key];

      if (key === "") {
        args[value] = current[i];
      }
      else {
        let format = (value === "") ? "any" : value.toLowerCase();
        if(typeof current[i] === "string") {
          return null;
        }
        else {
          let brKey = Object.keys(current[i])[0],
            brValue = current[i][brKey];

          if (brKey !== key)
            return null;
          else {
            try {
              args[key] = FORMATS[format](brValue);
            }
            catch (e) {
              return null;
            }
          }
        }
      }
    }

    return args;
  }

  isMatch () {
    return this.getArgs() !== null;
  }

  static getBrowserRequest () {
    return window.location.hash.substr(1);
  }

  static getRequestObject (url) {
    if (typeof url !== "string")
      url = Route.getBrowserRequest();

    if(!url)
      return [];

    return url.split("/").map(function (item) {
      let split = item.split(":");

      if (split.length > 1) {
        let key = split.shift(),
          value = split.join(":");

        return { [key]: value };
      }
      else {
        return item;
      }
    });
  }
}

export default Route;
