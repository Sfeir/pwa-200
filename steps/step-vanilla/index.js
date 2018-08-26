import "babel-polyfill";

import { setupErrorListener } from "../../common/utils/setupErrorListener";
import { appRouter } from "./app-router";

setupErrorListener();

appRouter.resolve();

document.querySelectorAll('[data-link]').forEach(el => {
  const route = el.getAttribute('data-link');
  el.addEventListener('click', e => {
    e.preventDefault();
    appRouter.navigate(route);
  });
})
