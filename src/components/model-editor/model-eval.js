import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { modelContext, statusContext, encodingContext } from '../../contexts.js';
import { encode } from '../../feature-extraction/encoding.js';
import { uploadImages } from './uploadImages.js';

export class ModelEval extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _encodingConsumer = new ContextConsumer(this, { context: encodingContext });
  _modelConsumer = new ContextConsumer(this, { context: modelContext });

  static properties = {
    imageSrc: { type: String },
    cameraOpened: { type: Boolean },
    results: { type: Array }
  }

  constructor() {
    super();
    this.imageSrc = null;
    this.cameraOpened = false;
    this.results = [];
    updateWhenLocaleChanges(this);
  }

  checkInput(e) {
    let textToEncode = this.querySelector("#textInput").value;
    let encoder = this._encodingConsumer.value.text;
    encode('text', encoder, [textToEncode]).then(features => {
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
      this.results = results
    })
  }

  checkImage(image) {
    let encoder = this._encodingConsumer.value.image;
    encode('image', encoder, [image]).then(features => {
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
      this.results = results;
    })
  }

  checkNumber() {
    let that = this;
    function isValidNumberEntry(entry) {
      let items = entry.split(",").map(v => parseFloat(v));;

      // primero miramos que todas los items separados por coma sean números
      if (items.some(item => isNaN(item))) return false;

      // comprobamos que la dimensión del array items coincida con this.dimension
      if (that._statusConsumer.value.dimension != items.length) return false;

      // si hemos llegado hasta aquí, todo está bien
      return true;
    }
    let textToEncode = this.querySelector("#numberInput").value;

    if (!isValidNumberEntry(textToEncode)) {
      window.alert(msg("This entry is not valid"));
      return;
    }

    let encoder = this._encodingConsumer.value.numerical;
    encode('numerical', encoder, [textToEncode]).then(features => {
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
      this.results = results;
    })

  }

  _uploadImage() {
    uploadImages().then(filesB64 => {
      this.imageSrc = filesB64[0];
      this.requestUpdate();
      this.checkImage(filesB64[0]);
    });
  }

  openCamera() {
    this.video = this.querySelector("#video");
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.stream = stream;
      this.video.srcObject = stream;
      this.cameraOpened = true;
    }).catch(e => {
      console.error('Error al iniciar la webcam:', e);
      window.alert(msg("Can't init camera. Are you using it in another application?"));
    });
  }

  closeCamera() {
    this.cameraOpened = false;
    this.stream.getTracks().forEach(track => {
      track.stop();
    })
    this.stream = null;
  }

  takePictureFromCamera() {
    this.cameraOpened = true;

    if (this.stream) {
      const canvas = document.createElement('canvas');
      canvas.width = this.video.width;
      canvas.height = this.video.height;
      const context = canvas.getContext('2d');

      // Dibujar el fotograma actual en el lienzo
      context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      // Obtener el contenido del lienzo como datos base64
      const base64String = canvas.toDataURL('image/png');
      this.imageSrc = base64String;

      this.checkImage(base64String);

      this.closeCamera();
      this.requestUpdate();
    }
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
    
    <div class="field is-grouped is-grouped-centered">
    ${!this.cameraOpened
        ? html`
        <p class="control">      
          <button @click=${this._uploadImage} class="button mr-1 is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-images"></i>
            </span>
            <span>${msg('Upload images')}</span>
          </button>
        </p>
        <p class="control"> 
          <button @click=${this.openCamera} class="button mr-1 is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-camera"></i>
            </span>
            <span>${msg('Take from camera')}</span>
          </button>
        </p>`

        : html`
        <p class="control"> 
          <button @click=${this.takePictureFromCamera} class="button mr-1 is-primary is-fullwidth">
            <span class="icon">
              <i class="fa-solid fa-camera"></i>
            </span>
            <span>${msg('Take picture')}</span>
          </button>
        </p>
        <p class="control"> 
          <button @click=${this.closeCamera} class="button mr-1 is-primary is-fullwidth">
            <span class="icon">
              <i class="fa-solid fa-xmark"></i>
            </span>
            <span>${msg('Close camera')}</span>
          </button>
        </p>`

      }
    </div>
  
    
    <div class="card-image has-text-centered">
      <video id="video" ?hidden=${!this.cameraOpened} width="320px" height="240px" autoplay></video>
    </div>
    <div class="card-image has-text-centered">
      <img ?hidden=${this.cameraOpened} width="300px"  src=${this.imageSrc} />
    </div>
    `;
  }

  templateNumberEval() {
    return html`
    <h6 class="subtitle is-6">${msg("Introduces new numbers and checks they are correctly classified ")}</h6>
    <input class="input" type="text" placeholder="Introduce numbers separated by commas" id="numberInput" />
    
    <div class="field mt-2 is-grouped is-justify-content-center">
      <p class="control">
        <button @click=${this.checkNumber} class="button is-primary">
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

  templateFormEval(editorType) {
    switch (editorType) {
      case 'text':
        return this.templateTextEval();
      case 'image':
        return this.templateImageEval();
      case 'numerical':
        return this.templateNumberEval();
    }
  }

  render() {

    return html`
      <h4 class="title is-4" > ${msg('Try')}</h4 >
        ${this.templateFormEval(this._statusConsumer.value.modelEditor)}

    ${this.results.map((r) =>
      html`${r[0]}(${parseFloat(r[1]).toFixed(4)}%)<progress class="progress is-primary" value=${r[1] * 100} max="100"></progress>`
    )}
      
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-eval', ModelEval);
