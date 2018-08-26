import { Component } from "../../../common/utils/component/Component";
import { PlainComponent } from "../../../common/utils/component/PlainComponent";

export class HomeComponent extends Component {

  init() {
    const container = document.createElement("div");
    this.usernamePrompt = new PlainComponent(container);

    this.container = this.parent.appendChild(container);
    this.counter = 0;
  }

  render() {
    if (!this.container) {
      this.init();
    }

    this.counter++;
    this.components.forEach(c => c.render());
    this.usernamePrompt.render(`<p>Hello World ${this.counter}!</p>`);
  }
}
