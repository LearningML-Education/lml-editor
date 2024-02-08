import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext, datasetContext, featuresContext } from '../../contexts.js';
import { encode } from '../../feature-extraction/use.js';


export class ModelLearn extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext });
  _featuresConsumer = new ContextConsumer(this, { context: featuresContext });


  constructor() {
    super();
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
    this._datasetConsumer.value.forEach((element, key) => {
      promises.push(encode(Array.from(element)).then(features => {
        this._featuresConsumer.value.set(key, features);
      }));
    });

    Promise.all(promises).then(() => {
      console.log(this._featuresConsumer.value);
    });

  }

  render() {

    return html`
    <h4 class="title is-4">${msg('Learn')}</h4>
    <h6 class="subtitle is-6">${this.learningText(this._statusConsumer.value.modelEditor)}</h6>
    <button @click=${this.learn} class="button is-fullwidth is-primary is-loading">
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
