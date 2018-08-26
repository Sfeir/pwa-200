import { Component } from "../../../common/utils/component/Component";
import { PlainComponent } from "../../../common/utils/component/PlainComponent";

import "./Home.css";

export class HomeComponent extends Component {
  constructor(parent, { peoples }) {
    super(parent);
    this.peoplesService = peoples;
    this.filteredPeople = [];
    this.loading = true;
    this.query = "";
    this.peoples = [];
  }

  async getPeoples() {
    this.peoples = await this.peoplesService.getPeoples();
    this.random = this.peoples[Math.floor(Math.random() * this.peoples.length)];
    this.loading = false;
    this.render();
  }

  init() {
    const container = document.createElement("div");
    this.usernamePrompt = new PlainComponent(container);
    this.content = new PlainComponent(container);
    this.container = this.parent.appendChild(container);
    this.getPeoples();
  }

  async render() {
    if (!this.container) {
      this.init();
    }

    if (this.peoples.length < 1) {
      this.content.render(`
        <div class="people-random animation-show">
          <div class="people-list-loading home-spinner-wrapper">
            <div class="mdl-spinner mdl-js-spinner is-active"></div>
          </div>
        </div>
      `);
    } else {
      this.content.render(`
        <div class="people-random">
          <div flex="100" flex-xs="100" flex-sm="75" flex-gt-sm="40"">
              <h1>You have ${this.peoples.length} friends. Do you know ?</h1>
          </div>
        </div>
      `);
    }
  }
}
