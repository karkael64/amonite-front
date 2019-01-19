import Component from "./component";
import Section from "./section";

export default class Page extends Component {
  constructor() {
    super(Page.container);
    this.template.setAttribute("page", this.template.getAttribute("component"));
    this.template.removeAttribute("component");
    Page.instances[this.constructor.name] = this;
  }

  setSection(section) {
    if(section instanceof Section) {
      this.fillComponent("section", section);
    }
    return this;
  }

  setPage(section) {
    if(Page.page !== this) {
      let into = Page.container;
        while(into.firstChild)
      into.removeChild(into.firstChild);
      this.setContainer(into);
      Page.page = this;
    }
    return this.setSection(section);
  }

  static setContainer(into) {
    if(typeof into === "function") {
      return Page.setContainer(into());
    }
    if(typeof into === "string") {
      into = document.querySelector(into);
    }
    if(into instanceof HTMLElement) {
      Page.container = into;
    }
    else {
      Page.container = Page.container || document.body;
    }

    if(Page.page) {
      Page.page.setContainer(into);
    }
  }

  static getCurrentPage() {
    return Page.page;
  }

  static getPageByConstructor(constr) {
    var inst;
    if((inst = Page.instances[constr.name]) instanceof Page) {
      return inst;
    }
    else {
      return new constr;
    }
  }
}

Page.instances = {};
Page.container = null;
window.addEventListener("load", function(){
  Page.setContainer();
});
