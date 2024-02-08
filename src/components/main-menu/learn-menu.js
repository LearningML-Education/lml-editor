import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class LearnMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
    <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          ${msg("Learn LML")}
        </a>
    
        <div class="navbar-dropdown">
          <a class="navbar-item">${msg("Tutorials")}</a>
          <a class="navbar-item">${msg("LearningML Manual")}</a>
          <a class="navbar-item">${msg("About")}</a>
        </div>
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('learn-menu', LearnMenu);
