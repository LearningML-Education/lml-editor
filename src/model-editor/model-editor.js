import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';
import './dataset-manager.js';


export class ModelEditor extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
<div class="columns">
  <div class="column">
    <h4 class="title is-4">${msg('Training')}</h4>
    <h6 class="subtitle is-6">${msg('First I need some text examples')}</h6>
    <dataset-manager></dataset-manager>
    <dataset-manager></dataset-manager>
    <dataset-manager></dataset-manager>
  </div>
  <div class="column">
    <h4 class="title is-4">${msg('Learn')}</h4>
    <h6 class="subtitle is-6">${msg("Now it's time to learn to classify text")}</h6>
  </div>
  <div class="column">
    <h4 class="title is-4">${msg('Try')}</h4>
    <h6 class="subtitle is-6">${msg("Introduces new terms and checks they are correctly classified ")}</h6>
  </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-editor', ModelEditor);
