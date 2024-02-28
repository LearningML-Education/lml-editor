import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { modelContext, statusContext, encodingContext } from '../../contexts.js';
import { encode } from '../../feature-extraction/encoding.js';
import { uploadImages } from './uploadImages.js';

export class ModelEval extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext });
  _encodingConsumer = new ContextConsumer(this, { context: encodingContext });
  _modelConsumer = new ContextConsumer(this, { context: modelContext });

  static properties = {
    imageSrc: { type: String }
  }

  constructor() {
    super();
    this.imageSrc = null;
    updateWhenLocaleChanges(this);
  }

  checkInput(e) {
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

  openCamera() {

  }

  _uploadImage() {
    uploadImages(false).then(filesB64 => {
      console.log(filesB64);
      this.imageSrc = filesB64[0];
      this.requestUpdate();
    });
  }

  templateTextEval() {
    return html`
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
      
    </div>`;
  }

  templateImageEval() {
    return html`
    <h6 class="subtitle is-6">${msg("Introduces new images and checks they are correctly classified")}</h6>
    <div class="card-image has-text-centered">
      <img class="is-justify-content-center" height="200" src=${this.imageSrc} />
    </div>
    
    <div class="field mt-2 is-grouped is-justify-content-center">
      <p class="control">
        <button @click=${this._uploadImage} class="button">
            <span class="icon">
              <i class="fa-solid fa-images"></i>
            </span>
            <span>${msg("Upload image")}</span>
        </button>        
      </p>
      <p class="control">
         <button @click=${this.openCamera} class="button">
            <span class="icon">
              <i class="fa-solid fa-camera"></i>
            </span>
            <span>${msg("Take from camera")}</span>
        </button>
      </p>
      <p class="control">
        <button class="button">          
          <img src="/images/scratch_icon.svg">          
        </button>
      </p>
      
    </div>`;
  }

  templateNumberEval() {
    return html`< h2 > NÚMERO</h2 > `
  }

  templateFormEval(editorType) {
    switch (editorType) {
      case 'text':
        return this.templateTextEval();
      case 'image':
        return this.templateImageEval();
      case 'number':
        return this.templateNumberEval();
    }
  }

  render() {

    return html`
      <h4 class="title is-4" > ${msg('Try')}</h4 >
        ${this.templateFormEval(this._statusConsumer.value.modelEditor)}
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-eval', ModelEval);
