import Component from "../../modules/layout/component";
import template from "./template.html";

export default class Action extends Component {
  template (into, text) {
    return template({
      text
    });
  }

  elements () {
    return {
      button: "button"
    };
  }

  events () {
    return {
      "button click": "click"
    };
  }

  constructor(text, cb, className) {
    super(null, text);
    this.callbacks = [];

    if (typeof cb === "function") {
      this.onClick(cb);
    }

    if (typeof className === "string") {
      this.template.className = className;
    }
  }

  onClick(cb) {
    if (typeof cb === "function") {
      this.callbacks.push(cb);
    }
    else {
      throw new Error("First parameter should be a function");
    }
  }

  click (ev) {
    let self = this;
    if (!this.isLoading() && this.isEnabled()) {
      this.elements.button[0].classList.add("load");
      this.callbacks.forEach(function(cb) {
        cb(ev, self);
      });
    }
    return this;
  }

  disable () {
    this.elements.button[0].disabled = true;
    return this;
  }

  enable () {
    this.elements.button[0].disabled = false;
    return this;
  }

  isEnabled () {
    return !this.elements.button[0].disabled;
  }

  isLoading () {
    return this.elements.button[0].classList.contains("load");
  }

  rearm () {
    this.elements.button[0].classList.remove("load");
    return this;
  }
}
