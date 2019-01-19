import Component from "../../modules/layout/component";
import template from "./template.html";

export default class Input extends Component {
  template (into, options) {
    return template({
      name: options.name,
      type: options.type || "text",
      defaultValue: options.defaultValue || "",
      placeholder: options.placeholder || ""
    });
  }

  elements () {
    return {
      input: "input",
      removeContent: ".remove-content",
      showPassword: ".show-password",
      errorMessage: ".error-message"
    };
  }

  events () {
    return {
      "input focus": "hideErrors",
      "input change": "verifyErrors",
      "input input": "showIcons",
      "removeContent click": "removeContent",
      "showPassword click": "showPassword"
    };
  }

  constructor(name, type, defaultValue, placeholder, errorFunction) {
    if (typeof name !== "string") {
      throw new TypeError("Input name should be a string");
    }

    type = type || "text";

    super(null, {
      name,
      type,
      defaultValue,
      placeholder
    });

    this.originalType = type;

    if (typeof errorFunction === "function") {
      this.errorFunction = errorFunction;
    }

    this.showIcons();
  }

  get name () {
    return this.elements.input[0].name;
  }

  get type () {
    return this.originalType;
  }

  get value () {
    return this.elements.input[0].value;
  }

  set value (value) {
    this.elements.input[0].value = value;
    return this;
  }

  hideErrors () {
    this.elements.errorMessage[0].classList.add("hidden");
    return this;
  }

  verifyErrors () {
    if (this.errorFunction) {
      let err;
      try {
        err = this.errorFunction(this.value);
      }
      catch (e) {
        err = e;
      }
      if (err) {
        this.elements.errorMessage[0].classList.remove("hidden");
        if (typeof err === "number") {
          this.elements.errorMessage[0].textContent = `Error #${err}`;
        }
        else if (err && err.message) {
          this.elements.errorMessage[0].textContent = err.message;
        }
        else {
          this.elements.errorMessage[0].textContent = "" + err; //  eslint-disable-line
        }
        return err;
      }
      else {
        this.elements.errorMessage[0].classList.add("hidden");
        return false;
      }
    }
  }

  showIcons () {
    this.elements.removeContent[0].classList.remove("show");
    this.elements.showPassword[0].classList.remove("show");

    if ((this.originalType === "text") && (this.value.length)) {
      this.elements.removeContent[0].classList.add("show");
    }
    if (this.originalType === "password") {
      this.elements.showPassword[0].classList.add("show");
    }
    return this;
  }

  removeContent () {
    this.value = "";
    this.showIcons();
  }

  showPassword () {
    if (this.originalType === "password") {
      this.elements.input[0].type = this.elements.input[0].type === "text" ? "password" : "text";
    }
    return this;
  }
}
