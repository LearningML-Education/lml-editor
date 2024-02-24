import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext, textEmbeddingContext } from '../../contexts.js';
import { encodeSentence } from '../../feature-extraction/textEmbbedding.js';
import { classify } from '../../algorithms/sequential.js';

export class ModelEval extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _textEmbeddingConsumer = new ContextConsumer(this, { context: textEmbeddingContext, subscribe: true });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  checkInput(e){
    let textToEncode = this.querySelector("#textInput").value;
    let useEncoder = this._textEmbeddingConsumer.value.use;
    encodeSentence(useEncoder, [textToEncode]).then(features => {
      console.log(features);
      classify()
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
