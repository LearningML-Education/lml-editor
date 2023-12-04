import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class ModeToggleMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    modeClass: { String },
    buttonText: { String }
  }

  constructor() {
    super();
    this.advanced = false;
    this.modeClass = "";
    this.buttonText = msg("Basic mode");
    updateWhenLocaleChanges(this);
  }

  handleToggleClick() {
    this.advanced = !this.advanced;
    this.modeClass = this.advanced ? "is-success" : "";
    this.buttonText = this.advanced ? msg("Advanced mode") : msg("Basic mode")
  }

  render() {

    return html`
    <div class="navbar-item">
      <button class="button is-rounded ${this.modeClass}" @click="${this.handleToggleClick}">
      ${this.buttonText}
      </button>
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('mode-toggle-menu', ModeToggleMenu);
