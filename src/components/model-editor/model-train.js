import { LitElement, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { datasetContext, statusContext } from '../../contexts.js';
import './dataset-manager.js';


export class ModelTrain extends LitElement {

  _datasetConsumer = new ContextConsumer(this, { context: datasetContext });
  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });


  static properties = {
    dataset: { type: Set }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('remove-label', e => {
      this.requestUpdate();
    });
  }

  addNewLabel() {
    let labelName = this.querySelector("#inputLabelName").value;
    if (labelName != "") {
      if (!this._datasetConsumer.value.has(labelName)) {
        this._datasetConsumer.value.set(labelName, new Set());
      }
      console.log(this._datasetConsumer.value);

      // Esta llamada a requestUpdate es imprescindible para que la 
      // propiedad this.dataset se actualice.
      // https://lit.dev/docs/v1/components/lifecycle/#requestupdate
      // https://stackoverflow.com/questions/60842652/how-can-i-reflect-changes-on-an-array-to-my-rendered-html-in-lit-element
      this.requestUpdate();
    }
    this.querySelector("#inputLabelName").value = "";
    this.querySelector("#inputLabelName").focus();

  }

  trainingText(editorType) {
    switch (editorType) {
      case 'text':
        return msg('first I need some example texts');
      case 'image':
        return msg('First I need some sample images');
      case 'number':
        return msg('first I need some example vectors');
    }
    return "";
  }


  render() {

    return html`

    <h4 class="title is-4">${msg('Training')}</h4>
    <h6 class="subtitle is-6">${this.trainingText(this._statusConsumer.value.modelEditor)}</h6>
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

  
    ${repeat(Array.from(this._datasetConsumer.value).toReversed(),
      entry => entry[0],
      (entry, index) => html`<dataset-manager labelName=${entry[0]}></dataset-manager>`
    )}
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-train', ModelTrain);
