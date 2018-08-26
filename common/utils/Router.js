export class Router {

  constructor(routes, defaultRoute) {
    this.routes = routes;
    this.defaultRoute = defaultRoute;

    window.onpopstate = e => {
      this.resolve();
    };
  }


  resolve() {
    const path = window.location.pathname;
    if (this.routes.has(path)) {
      this.routes.get(path)();
    } else if (this.defaultRoute) {
      this.navigate(this.defaultRoute);
    } else {
      throw new Error(`There isn't any route to follow!`);
    }
  }

  navigate(route, data = {}) {
    history.pushState(data, '', route);
    this.resolve();
  }
}
