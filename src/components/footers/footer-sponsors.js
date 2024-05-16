import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class FooterSponsors extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext, subscribe: true });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
<div class="columns">
  <div class="column">
    First column
  </div>
  <div class="column">
    Second column
  </div>
  <div class="column">
    Third column
  </div>
  <div class="column">
    Fourth column
  </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('footer-sponsors', FooterSponsors);
