import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class FileMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    showSave: { type: Boolean }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
    <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          ${msg("File")}
        </a>
    
        <div class="navbar-dropdown">
          
          <a class="navbar-item">${msg("New")}</a>
          <a class="navbar-item">${msg("Upload from your computer")}</a>
          ${this.showSave 
          ? html `<a class="navbar-item">${msg("Save to your computer")}</a>`
          : html ``
        }
        </div>
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('file-menu', FileMenu);
