import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { 
  statusContext, 
  datasetContext, 
  featuresContext,
  textEmbeddingContext
} from '../../contexts.js';
import { classMap } from 'lit/directives/class-map.js';
import { encodeSentence } from '../../feature-extraction/textEmbbedding.js';
import { train } from '../../algorithms/sequential.js';


export class ModelLearn extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext });
  _featuresConsumer = new ContextConsumer(this, { context: featuresContext });
  _textEmbeddingConsumer = new ContextConsumer(this, { context: textEmbeddingContext });


  static properties = {
    buttonLoading: { type: Boolean }
  }

  constructor() {
    super();
    this.buttonLoading = false;
    updateWhenLocaleChanges(this);
  }

  learningText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Now it's time to learn to classify text");
      case 'image':
        return msg("Now it's time to learn to classify images");
      case 'number':
        return msg("Now it's time to learn to classify numbers");
    }
    return "";
  }

  learnButtonText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Learn to recognize texts");
      case 'image':
        return msg("Learn to recognize images");
      case 'number':
        return msg("Learn to recognize numbers");
    }
    return "";
  }

  learn() {
    let promises = [];
    let useEncoder = this._textEmbeddingConsumer.value.use
    this.buttonLoading = true;
    this._datasetConsumer.value.forEach((element, key) => {
      promises.push(encodeSentence(useEncoder, Array.from(element)).then(features => {
        this._featuresConsumer.value.set(key, features);
      }));
    });

    Promise.all(promises).then(() => {
      console.log(this._featuresConsumer.value);
      train(this._featuresConsumer.value).then(m => {
        console.log(m);
      });
      this.buttonLoading = false;
    });
    
  }

  render() {
    return html`
    <h4 class="title is-4">${msg('Learn')}</h4>
    <h6 class="subtitle is-6">${this.learningText(this._statusConsumer.value.modelEditor)}</h6>
    <button @click=${this.learn} class=${classMap({ "button": true, "is-fullwidth": true, "is-primary": true, "is-loading": this.buttonLoading })}>
      <span class="icon"><i class="fa-solid fa-gears"></i></span>
      <span>${this.learnButtonText(this._statusConsumer.value.modelEditor)}</span>
    </button>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-learn', ModelLearn);
