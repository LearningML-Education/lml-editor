import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

export class LearnMenu extends LitElement {
  static properties = {
    dropdownOpen: { type: Boolean }
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.dropdownOpen = false;
    this.handleExternalToggle = this.handleExternalToggle.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('lml-menu-toggle', this.handleExternalToggle);
  }

  disconnectedCallback() {
    window.removeEventListener('lml-menu-toggle', this.handleExternalToggle);
    super.disconnectedCallback();
  }

  handleExternalToggle(event) {
    if (event?.detail?.menu !== 'learn' && event?.detail?.open) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    window.dispatchEvent(new CustomEvent('lml-menu-toggle', {
      detail: { menu: 'learn', open: this.dropdownOpen }
    }));
  }

  render() {

    return html`
    <div class=${classMap({
      'navbar-item': true,
      'has-dropdown': true,
      'is-hoverable': true,
      'is-active': this.dropdownOpen
    })}>
        <a class="navbar-link" href="#" @click=${this.toggleDropdown}>
          ${msg("Learn LML")}
        </a>
    
        <div class="navbar-dropdown">
          <a class="navbar-item" target="_blank" href="https://web.learningml.org/actividades/">${msg("Tutorials")}</a>
          <a class="navbar-item" target="_blank" href="https://learningml.org/manual/">${msg("LearningML Manual")}</a>      
        </div>
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

window.customElements.define('learn-menu', LearnMenu);
