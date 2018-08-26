import { Router } from '../../common/utils/Router';
import { HomeComponent } from "./components/Home";
import { services } from './services';

const root = document.querySelector("#root");
const home = new HomeComponent(root, { peoples: services.get('peoples')});

const routes = new Map([
  ['home', (params) => home.render(params)],
]);

export const appRouter = new Router(routes, '/home');

