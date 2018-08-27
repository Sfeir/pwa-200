import { Router } from '../../common/utils/Router';
import { HomeComponent } from "./components/Home";
import { services } from './services';
import { PeopleComponent } from './components/People';

const root = document.querySelector("#root");
const home = new HomeComponent(root, { peoples: services.get('peoples')});
const people = new PeopleComponent(root, { peoples: services.get('peoples')});

const routes = new Map([
  ['home', { component: home }],
  // TODO: refactor
  ['people', { component: people, render: (params) => params.length > 0 ? people.render(params) : people.render([], false) }],
]);

export const appRouter = new Router(root, routes, 'home');

