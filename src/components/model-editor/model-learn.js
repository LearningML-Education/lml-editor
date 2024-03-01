import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { 
  statusContext, 
  datasetContext, 
  featuresContext,
  encodingContext,
  modelContext
} from '../../contexts.js';
import { classMap } from 'lit/directives/class-map.js';
import { encode } from '../../feature-extraction/encoding.js';

export class ModelLearn extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext });
  _featuresConsumer = new ContextConsumer(this, { context: featuresContext });
  _encoderComsumer = new ContextConsumer(this, { context: encodingContext });
  _modelConsumer = new ContextConsumer(this, {context: modelContext});


  static properties = {
    buttonLoading: { type: Boolean },
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
      case 'numerical':
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
      case 'numerical':
        return msg("Learn to recognize numbers");
    }
    return "";
  }

  learn() {
    let promises = [];
    let modelEditor = this._statusConsumer.value.modelEditor;
    let encoder = this._encoderComsumer.value[modelEditor]
    this.buttonLoading = true;
    this._datasetConsumer.value.forEach((element, key) => {
      promises.push(encode(modelEditor, encoder, Array.from(element)).then(features => {
        this._featuresConsumer.value.set(key, features);
      }));
    });

    Promise.all(promises).then(() => {
      this._modelConsumer.value.train(this._featuresConsumer.value).then(m => {
        this.buttonLoading = false;
        console.log(m);
      });
    });
    
  }

  render() {
    return html`

    <div class=${classMap({ "modal": true, "is-active": this.buttonLoading })}>
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image is-9by4">
          <img src="/images/robot.gif">
        </p>
      </div>
    </div>

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
