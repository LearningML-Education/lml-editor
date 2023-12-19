import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';
import './dataset-manager.js';


export class ModelEditor extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    labels: {type: Array}
  }

  constructor() {
    super();
    this.labels = [];
    updateWhenLocaleChanges(this);
  }

  addNewLabel(){
    let labelName = this.querySelector("#inputLabelName").value;
    if(labelName != ""){
      this.labels.push(labelName);
      this.requestUpdate();
    }

    console.log(this.labels);
    
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
