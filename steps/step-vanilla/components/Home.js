import { Component } from "../../../common/utils/component/Component";
import { PlainComponent } from "../../../common/utils/component/PlainComponent";

import "./Home.css";
import { PeopleCardComponent } from "./PeopleCard";

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
    this.loading = false;
    this.render();
  }

  get random() {
    return this.peoples[Math.floor(Math.random() * this.peoples.length)];
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
          <div data-people-card>
              <h1>You have ${this.peoples.length} friends. Do you know ?</h1>
          </div>
        </div>
      `);
      const randomPeopleWrapper = this.content.container.querySelector('[data-people-card]');
      this.peopleCard = new PeopleCardComponent(randomPeopleWrapper);
      this.peopleCard.render({ people: this.random });
    }
  }
}
