import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';
import './model-card.js';


export class ModelSelector extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
<div class="columns">
  <div class="column">
    <model-card .title="Kakakak"></model-card>
  </div>
  <div class="column">
    <model-card></model-card>
  </div>
  <div class="column">
    <model-card></model-card>
  </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-selector', ModelSelector);
