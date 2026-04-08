import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getLocale, setLocaleFromUrl } from './localization.js';
import { allLocales } from './locale-codes.js';
import { updateWhenLocaleChanges } from '@lit/localize';

const localeNames = {
  'en': 'English',
  'es': 'Español',
  'ca': 'Catalá',
  'gl': 'Galego',
  'eu': 'Euskara',
  'it': 'Italiano',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'pt': 'Português',
  'nl': 'Nederlands',
  'fr': 'Français'
};

export class LanguageMenu extends LitElement {
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
    if (event?.detail?.menu !== 'language' && event?.detail?.open) {
      this.dropdownOpen = false;
    }
  }

  localeChanged(event) {
    const newLocale = event.target.getAttribute('locale');
    if (newLocale !== getLocale()) {
        const url = new URL(window.location.href);
        url.searchParams.set('locale', newLocale);
        window.history.pushState(null, '', url.toString());
        setLocaleFromUrl();
    }
}

  toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    window.dispatchEvent(new CustomEvent('lml-menu-toggle', {
      detail: { menu: 'language', open: this.dropdownOpen }
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
      <span class="icon">
        <i class="fas fa-globe"></i>
      </span>
    </a>

    <div class="navbar-dropdown">
       
        ${allLocales.map(
            (locale) => html`<a class="navbar-item" @click=${this.localeChanged} locale=${locale}>
              ${localeNames[locale]}
              </a>`
        )}
      
        
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

window.customElements.define('language-menu', LanguageMenu);
