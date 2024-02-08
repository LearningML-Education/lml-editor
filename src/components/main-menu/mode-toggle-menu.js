import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class ModeToggleMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    modeClass: { String },
  }

  constructor() {
    super();
    this.advanced = false;
    this.modeClass = "";
    updateWhenLocaleChanges(this);
  }

  handleToggleClick() {
    this.advanced = !this.advanced;
    this.modeClass = this.advanced ? "is-success" : "";
  }

  render() {

    return html`
    <div class="navbar-item">
      <button class="button is-rounded ${this.modeClass}" @click="${this.handleToggleClick}">
      ${this.advanced ? msg("Advanced mode") : msg("Basic mode")}
      </button>
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('mode-toggle-menu', ModeToggleMenu);
