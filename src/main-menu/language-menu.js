import { LitElement, html } from 'lit';
import { ContextConsumer } from '@lit/context';
import { configContext, langContext } from '../contexts';

export class LanguageMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });
  _langConsumer = new ContextConsumer(this, { context: langContext});

  setLanguage(event){
    let lang = event.target.getAttribute('lang');
    this._langConsumer.value.language = lang

    console.log( this._langConsumer.value.language);
  }

  render() {
    const languages = this._configConsumer.value.languages;
    
    return html`
<div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      <i class="fa-solid fa-globe"></i>
    </a>

    <div class="navbar-dropdown">
        ${Object.keys(languages).map(lang => {
          return html`
          <a @click=${this.setLanguage} lang=${lang} class="navbar-item">
            ${languages[lang]}
          </a>`
        })}
        
    </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('language-menu', LanguageMenu);
