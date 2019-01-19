import Route from "./route";

const ROUTERS = [];

class Router {

  constructor (baseUrl) {
    this.baseUrl = baseUrl || "";
    this.routes = [];
    ROUTERS.push(this);
  }

  add (route, controller) {
    if (typeof route === "string" && typeof controller === "function") {
      route = new Route(this.baseUrl + route, controller);
    }
    if (route instanceof Route) {
      this.routes.push(route);
    }
  }

  test () {
    let found = null;
    this.routes.forEach(function (route) {
      if (!found) {
        var args = route.getArgs();
        if (args !== null) {
          found = route;
          route.go(args);
        }
      }
    });
    return found;
  }
}

function popstate() {
  let found = null;
  ROUTERS.forEach(function (router) {
    if (!found) {
      found = router.test();
    }
  });
  Router.current = found;
}

window.addEventListener("popstate", popstate);
window.addEventListener("load", popstate);

export default Router;
