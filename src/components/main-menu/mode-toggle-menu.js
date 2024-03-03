import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext } from '../../contexts.js';
import { classMap } from 'lit/directives/class-map.js';


export class ModeToggleMenu extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext });

  static properties = {
    advanced: { Boolean },
  }

  constructor() {
    super();
    this.advanced = false;
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.advanced = this._statusConsumer.value.advancedMode;
  }

  handleToggleClick() {
    this.advanced = !this.advanced;
    this._statusConsumer.value.advancedMode = this._statusConsumer;

    this.dispatchEvent(new CustomEvent('toggle-advanced-mode', {
      bubbles: true
    }));
  }

  render() {

    return html`

    <div class="navbar-item">
      <button class="button is-primary" @click="${this.handleToggleClick}">
        <span class="icon">
          <i class=${classMap({ "fas": true, "fa-toggle-off": !this.advanced, "fa-toggle-on": this.advanced })}></i>
        </span>
        <span>${this.advanced ? msg("Advanced mode on") : msg("Advanced mode off")}</span>
      </button>
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('mode-toggle-menu', ModeToggleMenu);
