import { Router } from '../../common/utils/Router';
import { HomeComponent } from "./components/Home";

const root = document.querySelector("#root");
const home = new HomeComponent(root);

const routes = new Map([
  ['/home', () => home.render()],
]);

export const appRouter = new Router(routes, '/home');

