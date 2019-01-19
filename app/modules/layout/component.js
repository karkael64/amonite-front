function container (el, self, args) {
  if (el instanceof HTMLElement) {
    return el;
  }
  else if (typeof el === "string") {
    return container(document.querySelector(el), self, args);
  }
  else if (typeof el === "function") {
    return container(el.apply(self, args), self, args);
  }
  else {
    return null;
  }
}

function template (el, self, args) {
  if (el instanceof HTMLElement) {
    return el;
  }
  else if (typeof el === "function") {
    return template(el.apply(self, args), self, args);
  }
  else {
    let div = document.createElement("div");
    div.setAttribute("component", self.constructor.name);
    if (typeof el === "string") {
      div.innerHTML = el;
    }
    return div;
  }
}

function elements (el, self, args) {
  let into;
  if (typeof el === "function") {
    return elements(el.apply(self, args), self, args);
  }
  else if ((typeof el === "object") && ((into = self.template) instanceof HTMLElement)) {
    let result = {};
    Object.keys(el).forEach(function (name) {
      if (el[name] instanceof HTMLElement) {
        result[name] = [el[name]];
      }
      if (typeof el[name] === "string") {
        result[name] = [...into.querySelectorAll(el[name])];
      }
      else if (el[name] && el[name].forEach) {
        result[name] = el[name];
      }
    });
    return result;
  }
  else {
    return {};
  }
}

function events (el, self, args) {
  if (typeof el === "function") {
    return events(el.apply(self, args), self, args);
  }
  else if(typeof el === "object") {
    Object.keys(el).forEach(function (pair) {
      let split = pair.split(" ");
      if ((typeof el[pair] === "string") && (split.length > 1)) {
        let events = split.pop();
        let selectors = split.join(" ");
        el[pair].split(",").forEach(function (method) {
          events.split(",").forEach(function (eventName) {
            selectors.split(",").forEach(function (selector) {
              let node, fn = function(){
                self[method].apply(self, arguments);
              };
              if (eventName && (typeof self[method] === "function")) {
                if ((node = self.elements[selector]) instanceof HTMLElement) {
                  node.addEventListener(eventName, fn);
                }
                else if (node && node.forEach) {
                  node.forEach(function(n){
                    n.addEventListener(eventName, fn);
                  });
                }
                else if (self.template && (node = self.template.querySelector(selector))) {
                  node.addEventListener(eventName, fn);
                }
              }
            });
          });
        });
      }
      else if (typeof el[pair] === "object") {
        let selectors = split.join(" ");
        Object.keys(el[pair]).forEach(function (events) {
          let method = el[pair][events];
          if (typeof method === "string") {
            events.split(",").forEach(function (eventName) {
              selectors.split(",").forEach(function (selector) {
                let node, fn = function(){
                  let args = [...arguments];
                  args.unshift(this);
                  self[method].apply(self, args);
                };
                if (eventName && (typeof self[method] === "function")) {
                  if ((node = self.elements[selector]) instanceof HTMLElement) {
                    node.addEventListener(eventName, fn);
                  }
                  else if (node && node.forEach) {
                    node.forEach(function(n){
                      n.addEventListener(eventName, fn);
                    });
                  }
                  else if (self.template && (node = self.template.querySelector(selector))) {
                    node.addEventListener(eventName, fn);
                  }
                }
              });
            });
          }
        });
      }
    });
  }
}


/**
 *  @class <Component> is used to build DOM elements, generating data, template & events
 */

export default class Component {
  constructor () {
    var templateArgs = [...arguments];
    templateArgs.unshift(null);
    this.setTemplate.apply(this, templateArgs);
    this.setContainer.apply(this, arguments);
  }

  setTemplate (dom) {
    let t, args = [...arguments];
    args.shift();
    if ( (t = template(dom || this.template, this, args)) instanceof HTMLElement ) {
      this.template = t;
      if ( (t = elements(this.elements, this, args)) instanceof Object ) {
        this.elements = t;
      }
      events(this.events, this, args);
    }
    return this;
  }

  setContainer (element) {
    let t;
    if ( (t = container(element || this.container, this, arguments)) instanceof HTMLElement) {
      this.container = t;
      if (this.template instanceof HTMLElement) {
        this.container.appendChild(this.template);
      }
    }
    return this;
  }

  clearComponent (name) {
    let element;
    if(this.elements[name] && (element = this.elements[name][0])) {
      while(element.firstChild)
        element.removeChild(element.firstChild);
      return this;
    }
    else {
      throw new Error(`Element "${name}" is not an element of this component`);
    }
  }

  appendComponent (name, component) {
    let element;
    if(this.elements[name] && (element = this.elements[name][0])) {
      if(component instanceof Component) {
        component.setContainer(element);
        return this;
      }
      else {
        throw new Error("Second parameter is not a Component object");
      }
    }
    else {
      throw new Error(`Element "${name}" is not an element of this component`);
    }
  }

  fillComponent (element, component) {
    return this.clearComponent(element).appendComponent(element, component);
  }
}
