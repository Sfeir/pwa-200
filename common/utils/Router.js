export class Router {

  constructor(routes, defaultRoute) {
    this.routes = routes;
    this.defaultRoute = defaultRoute;

    window.onpopstate = e => {
      this.resolve();
    };
  }


  resolve() {
    const routeParams = window.location.pathname.split('/').slice(1);
    const routePath = routeParams.shift();
    if (this.routes.has(routePath)) {
      this.routes.get(routePath)(routeParams);
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
