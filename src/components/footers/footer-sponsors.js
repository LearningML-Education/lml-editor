import { LitElement, html } from 'lit';
import { updateWhenLocaleChanges } from '@lit/localize';

export class FooterSponsors extends LitElement {

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
