import { LitElement, html } from 'lit';
import { ContextConsumer }  from '@lit/context';
import { appContext } from '../appContext';

export class LanguageMenu extends LitElement {

  _consumer = new ContextConsumer(this, { context: appContext });

  render() {
    console.log(this.config);

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
