import { Component } from "../../../common/utils/component/Component";
import { PlainComponent } from "../../../common/utils/component/PlainComponent";

const capitalize = ([s, ...tring]) => [s.toUpperCase(), ...tring].join('');
const mySplit = (string) => string ? string.split('@')[0] : '';

export class PeopleCardComponent extends Component {

  init() {
    const container = document.createElement("div");
    this.content = new PlainComponent(container);
    this.container = this.parent.appendChild(container);
  }

  render({ people, skillOn, describe = false }) {
    if (!this.container) {
      this.init();
    }

    // TODO: data-links (ng-href) <=> routing paramétré
    this.content.render(`
      <md-card class="md-whiteframe-4dp">

      <md-card-title layout="row">
          <md-card-title-text class="${describe ? 'first-info-people': ''}" layout="${describe ? 'row': 'column'}" layout-align="space-around">
              <span flex="75">
                <span class="md-headline">
                  <a data-link="/people/${people.email}">${capitalize(people.firstname)} ${(people.lastname.toUpperCase())}</a>
                </span>
                <span layout="column" class="layout-column" flex="100">
                  <div class="people-name">${people.functionName}</div>
                  <div>
                      <md-icon md-people-randomsvg-icon="img/md-email.svg"></md-icon>
                      <a href="mailto:${people.name}<${people.email}>">${people.email}</a>
                  </div>`

                  +(people.contactInfoPro.mobilePhone
                  ? `<div>
                      <md-icon md-svg-icon="img/md-phone.svg"></md-icon>
                      <a href="tel:${people.contactInfoPro.mobilePhone}">${people.contactInfoPro.mobilePhone}</a>
                  </div>`
                  : people.contactInfoPro.fixedPhone ?
                  `<div >
                      <md-icon md-svg-icon="img/md-phone.svg"></md-icon>
                      <a href="tel:${people.contactInfoPro.fixedPhone}">${people.contactInfoPro.fixedPhone}</a>
                  </div>` : ''
                  )+

                `</span>
              </span>`

              +(describe ?
              `<div flex class="img-circle">
                  <img class="thumb" err-src="img/profile.svg" src="${people.photo}" alt="image profile" />
              </div>`: ''
              )+

            `</md-card-title-text>`
            +(!describe ?
            `<md-card-title-media flex="30">
                <div class="card-media">
                    <a href="#/people/${people.email}">
                      <img class="thumb" err-src="img/profile.svg" src="${people.photo}">
                    </a>
                </div>
            </md-card-title-media>`: ''
            )+
        `</md-card-title>̀`

        +(skillOn ?
        `<md-content id="skills" class="md-padding">
            <h2>Skills</h2>
            <div layout="row" layout-wrap layout-align="space-around center">`
                +(people.skills.map(skill => `
                <md-button aria-label="skill" class="${skill.toLowerCase() == skillOn.toLowerCase() ? 'skillActive' : ''}"
                          class="md-raised"
                          data-link="/people/skill/${skill}">
                    ${skill}
                </md-button>`
                ).join())+
            `</div>
        </md-content>`: ''
        )+

        `<md-card-content>
            Manager :  <span>${people.manager}</span>
            <br>
            Location : <a href="http://www.sfeir.com/contact/">${people.entity}</a>`

            +(people.entity == 'Sfeir-Benelux'
            ? `<a target="_blank" title="Locate" href="http://sfeirmaplux.appspot.com/#sferian/${mySplit(people.email)}">
              <md-icon md-svg-icon="img/md-map.svg"></md-icon>
            </a>`
            : (people.entity == 'Sfeir-Paris' ?
            `<a target="_blank" title="Locate" href="http://map.sfeir.com/#sferian/${mySplit(people.email)}">
                <md-icon md-svg-icon="img/md-map.svg"></md-icon>
            </a>̀`: ''
            ))+

        `</md-card-content>`
        +(describe
        ? `<md-tabs md-dynamic-height md-border-bottom class="tab-information">
            <md-tab label="Organisation">
                <md-content class="md-padding">
                    <ul>
                        <li>${people.functionName}</li>
                        <li><br/>${people.functionDescription || "-"}</li>
                    </ul>
                    <ul>
                        <li>Current customer</li>
                        <li>${people.currentClient || "—"}</li>
                    </ul>
                    <h3 hidden="${!people.skills[0]}">Skills</h3>
                    <div layout="row" layout-wrap layout-align="space-around center">`
                      +(people.skills.map(skill => `
                      <md-button aria-label="skill" hidden="${!skill}" data-link="/people/skill/${skill}">${skill}</md-button>
                      `).join())+
                    `</div>
                </md-content>
            </md-tab>

            <md-tab disabled="${!manager.isManager}" label="Collaborateurs">
                <md-content id="skills" class="md-padding">
                    <div layout="row" layout-wrap layout-align="space-around center">`

                    +(manager.collab.map(collab => `
                        <p>
                          <a data-link="/people/${collab}">${collab}</a>
                        </p>
                    `).join())+

                    `</div>
                </md-content>
            </md-tab>
        </md-tabs>̀
        <md-card-footer class="information-footer" layout="row" layout-wrap layout-align="center center">
            <md-card-icon-actions>
                <md-button target="_blank" href="https://twitter.com/${people.twitter}" class="md-icon-button" aria-label="twitter">
                    <md-tooltip md-direction="top">
                        Twitter
                    </md-tooltip>
                    <md-icon md-svg-icon="img/md-twitter.svg"></md-icon>
                </md-button>
                <md-button target="_blank" href="https://sfeirgroup.slack.com/messages/@${people.slack}/" class="md-icon-button" aria-label="slack">
                    <md-tooltip md-direction="top">
                        Slack
                    </md-tooltip>
                    <md-icon md-svg-icon="img/md-slack.svg"></md-icon>
                </md-button>
                <md-button target="_blank" href="https://github.com/${people.github}" class="md-icon-button" aria-label="github">
                    <md-tooltip md-direction="top">
                        GitHub
                    </md-tooltip>
                    <md-icon md-svg-icon="img/md-github.svg"></md-icon>
                </md-button>
                <md-button target="_blank" href="${people.linkedIn}" class="md-icon-button" aria-label="linkedin">
                    <md-tooltip md-direction="top">
                        Linkedin
                    </md-tooltip>
                    <md-icon md-svg-icon="img/md-linkedin.svg"></md-icon>
                </md-button>
            </md-card-icon-actions>
        </md-card-footer>`
        : '')+
      `</md-card>`
    );
  }
}
