import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class InputMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
    <div class="navbar-item">
      <input class="input" type="text" placeholder="${msg("Untitled")}">
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('input-menu', InputMenu);
