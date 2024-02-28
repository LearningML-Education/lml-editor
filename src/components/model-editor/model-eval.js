import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { modelContext, statusContext, encodingContext } from '../../contexts.js';
import { encode } from '../../feature-extraction/encoding.js';

export class ModelEval extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext });
  _encodingConsumer = new ContextConsumer(this, { context: encodingContext });
  _modelConsumer = new ContextConsumer(this, { context: modelContext });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  checkInput(e){
    let modelEditor = this._statusConsumer.value.modelEditor;
    let textToEncode = this.querySelector("#textInput").value;
    let useEncoder = this._encodingConsumer.value.text;
    encode(modelEditor, useEncoder, [textToEncode]).then(features => {
      console.log(features);
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
    })    
  }

  render() {

    return html`
    <h4 class="title is-4">${msg('Try')}</h4>
    <h6 class="subtitle is-6">${msg("Introduces new terms and checks they are correctly classified ")}</h6>
    <textarea id="textInput" class="textarea"></textarea>
    
    <div class="field mt-2 is-grouped is-justify-content-center">
      <p class="control">
        <button @click=${this.checkInput} class="button is-primary">
          ${msg("Check")}
        </button>
      </p>
      <p class="control">
        <button class="button">          
          <img src="/images/scratch_icon.svg">          
        </button>
      </p>
      
    </div>
    
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-eval', ModelEval);
