import Component from "./component";
import Page from "./page";

export default class Section extends Component {
  wrapper () {
    return null;
  }

  constructor(options) {
    super(null, options);
    this.template.setAttribute("section", this.template.getAttribute("component"));
    this.template.removeAttribute("component");
  }

  setSection() {
    let page;
    if (page = Page.getPageByConstructor(this.wrapper())) {
      page.setPage(this);
    }
  }
}
