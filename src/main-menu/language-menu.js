import { LitElement, html } from 'lit';
import { ContextConsumer, ContextProvider } from '@lit/context';
import { appContext, langContext } from '../contexts';
import { LangController } from './langController';

export class LanguageMenu extends LitElement {

  _consumer = new ContextConsumer(this, { context: appContext });

  constructor() {
    super();
    this.contextProvider = new ContextProvider(this, { context: langContext });
  }

  firstUpdated(){
    this.contextProvider.setValue(new LangController(this._consumer.value.defaultLanguage));
  }

  render() {

    const languages = this._consumer.value.languages;

    return html`
<div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      ${this._consumer.value.defaultLanguage}
      <i class="fa-solid fa-globe"></i>
    </a>

    <div class="navbar-dropdown">
        <a class="navbar-item">
            Español
        </a>
        <a class="navbar-item">
            English
        </a>
        <a class="navbar-item">
            Galego
        </a>
    </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('language-menu', LanguageMenu);
