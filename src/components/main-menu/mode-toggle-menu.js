import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { classMap } from 'lit/directives/class-map.js';


export class ModeToggleMenu extends LitElement {

  static properties = {
    advanced: { type: Boolean },
  }

  constructor() {
    super();
    this.advanced = false;
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  handleToggleClick() {
    this.advanced = !this.advanced;

    this.dispatchEvent(new CustomEvent('toggle-advanced-mode', {
      bubbles: true,
      composed: true,
      detail: { advanced: this.advanced }
    }));
  }

  render() {

    return html`

    <div class="navbar-item">
      <button class="button is-primary" @click="${this.handleToggleClick}">
        <span class="icon">
          <i class=${classMap({ "fas": true, "fa-toggle-off": !this.advanced, "fa-toggle-on": this.advanced })}></i>
        </span>
        <span>${msg("Advanced")}</span>
      </button>
    </div>
        `
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    const initShadow = globalThis.__lmlInitShadowRoot;
    if (typeof initShadow === 'function') {
      initShadow(this, root);
    }
    return root;
  }
}

window.customElements.define('mode-toggle-menu', ModeToggleMenu);
