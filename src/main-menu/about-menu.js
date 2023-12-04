import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class AboutMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  handleClick() {
   return;
  }

  render() {

    return html`
    <div class="navbar-item">
      <button class="button is-info" @click="${this.handleClick}">
        ${msg("About")}
      </button>
    </div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('about-menu', AboutMenu);
