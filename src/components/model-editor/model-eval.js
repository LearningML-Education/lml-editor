import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { modelContext, dataTypeContext, encodingContext } from '../../contexts.js';
import { collectExample } from 'lml-algorithms';

export class ModelEval extends LitElement {

  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });
  _encodingConsumer = new ContextConsumer(this, { context: encodingContext, subscribe: true });
  _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });

  static properties = {
    imageSrc: { type: String },
    cameraOpened: { type: Boolean },
    results: { type: Array },
    advancedMode: { type: Object, attribute: 'advanced-mode' }
  }

  constructor() {
    super();
    this.imageSrc = null;
    this.cameraOpened = false;
    this.results = [];
    updateWhenLocaleChanges(this);

    this.bc = new BroadcastChannel('lml-internal');
    this.bc.addEventListener('message', message => {
      if (message.data == 'requestUpdate') {
        this.requestUpdate();
      }
    });
  }

  checkInput(e) {
    if (!this._modelConsumer.value.model) {
      alert(msg('You must generate a model before trying to classify'));
      return;
    }
    let textToEncode = this.querySelector("#textInput").value;
    let encode = this._encodingConsumer.value.text;
    encode([textToEncode]).then(features => {
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
      this.results = results
    }).catch(error => {
      alert(error);
    })
  }

  checkImage(image) {
    if (!this._modelConsumer.value.model) {
      alert(msg('You must generate a model before trying to classify'));
      return;
    }

    let encode = this._encodingConsumer.value.image;
    encode([image]).then(features => {
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
      this.results = results;
    }).catch(error => {
      alert(error);
    })
  }

  checkNumber() {
    if (!this._modelConsumer.value.model) {
      alert(msg('You must generate a model before trying to classify'));
      return;
    }

    let that = this;
    function isValidNumberEntry(entry) {
      let items = entry.split(",").map(v => parseFloat(v));;

      // primero miramos que todas los items separados por coma sean números
      if (items.some(item => isNaN(item))) return false;

      // comprobamos que la dimensión del array items coincida con this.dimension
      if (that._dataTypeConsumer.value.dimension != items.length) return false;

      // si hemos llegado hasta aquí, todo está bien
      return true;
    }
    let textToEncode = this.querySelector("#numberInput").value;

    if (!isValidNumberEntry(textToEncode)) {
      window.alert(msg("This entry is not valid"));
      return;
    }

    let encode = this._encodingConsumer.value.numerical;
    encode([textToEncode]).then(features => {
      return this._modelConsumer.value.classify(features);
    }).then(results => {
      console.log(results);
      this.results = results;
    }).catch(error => {
      alert(error);
    })

  }

  _uploadImage() {
    document.getElementById('evalImageFileInput').click();
  }

  onLoaded(event) {
    // Obtener el archivo seleccionado (solo el primero en caso de múltiples archivos)
    const file = event.target.files[0];

    // Verificar si se seleccionó un archivo
    if (!file) {
      console.error("No se seleccionó ninguna imagen.");
      return;
    }

    // Crear una instancia de FileReader para leer el archivo
    const reader = new FileReader();

    // Definir el evento de carga para el lector de archivos
    reader.onload = () => {
      // Obtener el resultado en formato Base64
      const imageInBase64 = reader.result;

      // Imprimir o usar la imagen en Base64 según sea necesario
      this.imageSrc = imageInBase64;
      this.requestUpdate();
      this.checkImage(imageInBase64);
    };

    // Leer el archivo como Data URL (Base64)
    reader.readAsDataURL(file);
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

      //this.closeCamera();
      this.requestUpdate();
    }
  }

  startRecording() {
    const recordButton = document.querySelector('#recordButton');
    recordButton.disabled = true;

    collectExample("test").then(result => {
      let encode = this._encodingConsumer.value.audio;
      encode([result]).then(features => {
        return this._modelConsumer.value.classify(features);
      }).then(results => {
        console.log(results);
        recordButton.disabled = false;
        this.results = results;
      }).catch(error => {
        alert(error);
      })      
      
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
    </div>`;
  }

  templateImageEval() {
    return html`
    <input 
      id="evalImageFileInput" 
      accept="image/png, image/jpeg, image/webp, image/svg+xml"
      hidden="true" 
      type="file"
      @change=${this.onLoaded} >
    <h6 class="subtitle is-6">${msg("Introduces new images and checks they are correctly classified")}</h6> 
    <hr/>
    <div class="field is-grouped">
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
    <hr/>
    <input class="input" type="text" placeholder="Introduce numbers separated by commas" id="numberInput" />
    
    <div class="field mt-2 is-grouped is-justify-content-center">
      <p class="control">
        <button @click=${this.checkNumber} class="button is-primary">
          ${msg("Check")}
        </button>
      </p>
    </div>`;
  }


  templateAudioEval() {
    return html`
    <h6 class="subtitle is-6">${msg("Introduce new sound and checks they are correctly classified ")}</h6>
    <hr/>    
    
    <div class="field mt-2 is-grouped is-justify-content-center">
      <p class="control">
        <button id="recordButton" @click=${this.startRecording} class="button is-primary">
          ${msg("Record")}
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
      case 'audio':
        return this.templateAudioEval();
    }
  }

  templateAdvanced() {
    return html`

<div class="columns">
    <div class="column">
      <h4 ?hidden="${this.advancedMode}" class="title is-4" > ${msg('Try')}</h4 >
      ${this.templateFormEval(this._dataTypeConsumer.value.type)}
    </div>
    <div class="column">
      ${this.results.map((r) => {
      let result = parseFloat(100 * r[1]).toFixed(3).toString();
      if (result.includes('.')) {
        result = result.replace(/\.?0+$/, '');
      }
      return html`${r[0]}(${result}%)<progress class="progress is-primary" value=${r[1] * 100} max="100"></progress>`
    }

    )}  
    </div>
</div>

      
    `;
  }

  templateBasic() {
    return html`
<h4 class="title is-4" > ${msg('Try')}</h4 >
${this.templateFormEval(this._dataTypeConsumer.value.type)}

  ${this.results.map((r) => {
      let result = parseFloat(100 * r[1]).toFixed(3).toString();
      if (result.includes('.')) {
        result = result.replace(/\.?0+$/, '');
      }
      return html`${r[0]}(${result}%)<progress class="progress is-primary" value=${r[1] * 100} max="100"></progress>`
    }
    )} 
`
  }

  render() {
    return html`
    ${this.advancedMode.enabled ?
        this.templateAdvanced()
        :
        this.templateBasic()}

      `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-eval', ModelEval);
