import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class FooterCopyRight extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
  <div class="notification is-primary is-light">
    <div class="content has-text-centered">
      <p>
        <strong>LearningML® </strong> copyright by <a href="https://juandarodriguez.es">Juan David Rodríguez</a>. The source code is licensed
        <a href="https://opensource.org/license/agpl-v3/">GNU Affero GPL</a>. The website content
        is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
      </p>
    </div>
  </div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('footer-copyright', FooterCopyRight);
