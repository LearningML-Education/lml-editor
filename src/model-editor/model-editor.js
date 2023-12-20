import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { datasetContext } from '../contexts.js';
import './dataset-manager.js';


export class ModelEditor extends LitElement {

  _datasetConsumer = new ContextConsumer(this, { 
    context: datasetContext,
    subscribe: true
   });

  static properties = {
    labels: { type: Array }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.labels = Array.from(this._datasetConsumer.value.keys());
    console.log(this.labels);
  }

  addNewLabel() {
    let labelName = this.querySelector("#inputLabelName").value;
    if (labelName != "" && this.labels.indexOf(labelName) == -1) {
      //this.labels.push(labelName);

      const event = new CustomEvent('add-label', {
        bubbles: true,
        composed: true,
        detail: { label: labelName }
      });
      this.dispatchEvent(event);
      
      this.requestUpdate();
    }
    this.querySelector("#inputLabelName").value = "";
    this.querySelector("#inputLabelName").focus();

  }

  render() {

    return html`
<div class="columns">
  <div class="column">
    <h4 class="title is-4">${msg('Training')}</h4>
    <h6 class="subtitle is-6">${msg('First I need some text examples')}</h6>
      <div class="field has-addons">
        <div class="control">
          <input id="inputLabelName" class="input" type="text" placeholder="${msg('New class name')}">
        </div>
      <div class="control">
        <button @click=${this.addNewLabel} class="button is-primary is-fullwidth mb-4">
          <span class="icon">
          <i class="fa-solid fa-plus"></i>
          </span>
          <span>${msg('Add new class')}</span>
        </button>
    
  </div>
</div>

    ${this.labels.toReversed().map((label) =>
      html`<dataset-manager labelName=${label}></dataset-manager>`
    )}
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
