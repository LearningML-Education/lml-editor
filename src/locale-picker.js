import { LitElement, html } from 'lit';
import { getLocale, setLocaleFromUrl } from './localization.js';
import { allLocales } from './locale-codes.js';
import { updateWhenLocaleChanges } from '@lit/localize';

const localeNames = {
    en: 'English',
    'es': 'Español',
    'ca': 'Catalá',
};

// Note we use updateWhenLocaleChanges here so that we're always up to date with
// the active locale (the result of getLocale()) when the locale changes via a
// history navigation.
export class LocalePicker extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }
    render() {
        return html`
      <select @change=${this.localeChanged}>
        ${allLocales.map(
            (locale) => html`<option value=${locale} ?selected=${locale === getLocale()
                }>
              ${localeNames[locale]}
            </option>`
        )}
      </select>
    `;
    }

    localeChanged(event) {
        const newLocale = event.target.value;
        if (newLocale !== getLocale()) {
            const url = new URL(window.location.href);
            url.searchParams.set('locale', newLocale);
            window.history.pushState(null, '', url.toString());
            setLocaleFromUrl();
        }
    }
}
customElements.define('locale-picker', LocalePicker);