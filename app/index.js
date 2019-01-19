import LoginSection from "./sections/login";
import OrganizationSection from "./sections/organization";

let login = new LoginSection({});
let orga = new OrganizationSection({});

window.addEventListener("load", function() {
  login.setSection();
});
