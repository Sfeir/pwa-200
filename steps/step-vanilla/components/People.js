import { RoutedComponent } from '../../../common/utils/component/RoutedComponent'
import { PlainComponent } from '../../../common/utils/component/PlainComponent'
import { PeopleCardComponent } from './PeopleCard';

export class PeopleComponent extends RoutedComponent {
  constructor(parent, { peoples }) {
    super(parent);
    this.peoplesService = peoples;
    this.filteredPeople = [];
    this.loading = true;
    this.query = '';
  }

  async getPeoples() {
    this.loading = true;
    this.peoples = await this.peoplesService.getPeoples();
    this.loading = false;
  };

  async init() {
    const container = document.createElement("div");
    this.usernamePrompt = new PlainComponent(container);
    this.content = new PlainComponent(container);
    this.container = this.parent.appendChild(container);
    await this.getPeoples();
  }

  filterPeople(ids) {
    this.filteredPeople = this.peoples.filter(people => ids.includes(''+people.id));
  }

  // TODO: split between a ListComponent and a ShowPeopleComponent for better filtering management
  async render([ peopleId ] = [], filter = true) {
    if (!this.container) {
      await this.init();
    }

    if (filter) {
      if (peopleId) {
        this.filterPeople([ peopleId ]);
      }
    } else {
      this.filteredPeople = this.peoples;
    }

    // TODO: hidden optimization
    if (this.filteredPeople.length < 1 && !this.loading) {
      this.content.render(`
        <div class="people-list-all md-padding" layout="row" layout-wrap layout-align="center center">
            <div>
                <div>
                    <h1>No sfeirien found</h1>
                </div>
            </div>
        </div>
      `)
    } else {
      this.content.render(`
        <div class="people-list-all md-padding" layout="row" layout-wrap layout-align="center center">
            <div class="people-card-list" data-people-cards-wrapper>
            </div>
        </div>
      `)

      // TODO: optimization for re-rendering
      const peopleCardsWrapper = this.content.container.querySelector('[data-people-cards-wrapper]');
      this.peopleCards = this.filteredPeople.map(people => ({ component: new PeopleCardComponent(peopleCardsWrapper), people }));
      this.peopleCards.forEach(({ component, people}) => {
        component.render({ people, describe: false })
      });
    }
  }
}
