import { LitElement, html } from 'lit';
import { getLocale, setLocaleFromUrl } from './localization.js';
import { allLocales } from './locale-codes.js';
import { updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext, langContext } from '../contexts';

const localeNames = {
  en: 'English',
  'es': 'Español',
  'ca': 'Catalá',
};

export class LanguageMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });
  _langConsumer = new ContextConsumer(this, { context: langContext });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  setLanguage(event) {
    let lang = event.target.getAttribute('lang');
    this._langConsumer.value.language = lang

    console.log(this._langConsumer.value.language);
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

  render() {
    const languages = this._configConsumer.value.languages;

    return html`
<div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      <i class="fa-solid fa-globe"></i>
    </a>

    <div class="navbar-dropdown">
       
        ${allLocales.map(
            (locale) => html`<a class="navbar-item" @click=${this.localeChanged} locale=${locale} ?selected=${locale === getLocale()
                }>
              ${localeNames[locale]}
              </a>`
        )}
      
        
    </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('language-menu', LanguageMenu);
