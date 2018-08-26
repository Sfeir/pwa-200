import "babel-polyfill";

import { setupErrorListener } from "../../common/utils/setupErrorListener";
import { appRouter } from "./app-router";

import 'normalize.css';
import "../../common/css/app.css";

setupErrorListener();

appRouter.resolve();

document.querySelectorAll('[data-link]').forEach(el => {
  const route = el.getAttribute('data-link');
  el.addEventListener('click', e => {
    e.preventDefault();
    appRouter.navigate(route);
  });
})
