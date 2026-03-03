import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { dataTypeContext, datasetContext } from '../../contexts.js';
import { classMap } from 'lit/directives/class-map.js';
import { collectExample, playRawAudio } from '../../services/lml-algorithms-bridge.js';
import { assetUrl } from '../../utils/assetPaths.js';


export class DatasetManager extends LitElement {

  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true });

  static properties = {
    editinglabelName: { type: Boolean },
    labelName: { type: String },
    textEntry: { type: String },
    editText: { type: Boolean },
    addTextsWindowOpened: { type: Boolean },
    cameraOpened: { type: Boolean },
    dataset: { type: Set }
  };

  constructor() {
    super();
    this.editinglabelName = false;
    this.labelName = "Unnamed";
    this.textEntry = "";
    this.editText = false;
    this.addTextsWindowOpened = false;
    this.cameraOpened = false;
    this.deletedSounds = 0;
    this.stopCollecting = false;
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(this.labelName);
  }

  editlabelName() {
    if (this.editinglabelName) {
      let oldLabel = this.labelName;
      this.labelName = this.querySelector("#inputlabelName").value;
      if (this._datasetConsumer.value.has(oldLabel) && oldLabel != this.labelName) {
        this._datasetConsumer.value.set(this.labelName,
          this._datasetConsumer.value.get(oldLabel));
        this._datasetConsumer.value.delete(oldLabel);
      }
      console.log(this._datasetConsumer.value);
    }
    this.editinglabelName = !this.editinglabelName;
  }

  _removeClass() {
    if (this._datasetConsumer.value.has(this.labelName)) {
      this._datasetConsumer.value.delete(this.labelName);
    }
    console.log(this._datasetConsumer.value);

    this.dispatchEvent(new CustomEvent('remove-label', {
      bubbles: true
    }));
  }

  removeClass() {
    if (confirm(msg("Are you sure?"))) {
      this._removeClass();
    }
  }

  ////
  // Funciones para manejar los datasets de textos
  ///
  closeAddTextWindow() {
    this.addTextsWindowOpened = false;
    this.querySelector("#inputTexts").value = "";
  }

  openAddTextWindow() {
    this.addTextsWindowOpened = true;
  }

  isValidNumberEntry(entry) {
    let items = this.fromCSV2Array(entry);

    // primero miramos que todas los items separados por coma sean números
    if (items.some(item => isNaN(item))) return false;

    // después comprobamos si this.dimension es 0, lo cual significa que es
    // la primera entrada y será la que define la dimensión de los vectores
    if (this._dataTypeConsumer.value.dimension == 0) {
      this._dataTypeConsumer.value.dimension = items.length;
    }

    // por último comprobamos que la dimensión del array items coincida con this.dimension
    if (this._dataTypeConsumer.value.dimension != items.length) return false;

    // si hemos llegado hasta aquí, todo está bien

    return true;

  }

  addTextToDataset(texts) {
    console.log("KUKUUUUU");
    for (let entry of texts.split("\n")) {
      if (entry == "") continue;
      if (this._dataTypeConsumer.value.type == 'numerical' && !this.isValidNumberEntry(entry)) {
        alert(msg("Invalid entry"));
        break;
      }

      this._datasetConsumer.value.set(this.labelName,
        this._datasetConsumer.value.get(this.labelName).add(entry));
    }

    this.requestUpdate();
  }

  addTexts() {
    this.editText = false;
    let texts = this.querySelector("#inputTexts").value;
    if (this._datasetConsumer.value.has(this.labelName)) {
      this.addTextToDataset(texts);
    }
    console.log(this._datasetConsumer.value);
    this.closeAddTextWindow();
  }

  editTexts(e) {
    let texts = this.querySelector("#inputTexts").value;
    // Si el texto ha sido cambiado por el usuario, es decir `texts` no coincide 
    // con el atributo this.textEntry, hay que borrar el valor que tenía ...
    if (this.textEntry != texts) {
      this.removeTextEntry(this.textEntry, false);
      this.textEntry = texts;
    }

    // Y añadir el nuevo valor (cambiado por el usuario), es decir, conseguimos
    // la edición borrando la entrada y añadiendo la nueva entrada modificada.
    this.addTexts();
  }

  // Si se está editando un texto, se usa esta función sin mostrar la ventana
  // de diálogo de confirmación.
  removeTextEntry(e, ask = true) {
    this.editText = true;
    if (ask && confirm(msg("Surely you want to delete this item?")) || !ask) {
      let entry = e.target == undefined
        ? e
        : e.target.parentElement.getAttribute("text-entry")
      if (this._datasetConsumer.value.has(this.labelName)) {
        this._datasetConsumer.value.get(this.labelName).delete(entry);
      }
      console.log(this._datasetConsumer.value);

      this.requestUpdate();
    }
  }

  editTextEntry(e) {
    let entry = e.target.parentElement.getAttribute("text-entry");
    this.textEntry = entry;
    this.editText = true;
    console.log(entry);

    this.addTextsWindowOpened = true;
    this.querySelector("#inputTexts").value = entry;
  }

  _uploadTexts() {
    this.querySelector(`#textFileInput_${this.labelName}`)?.click();
  }

  onLoadedText(event) {
    // Obtener la lista de archivos seleccionados
    const file = event.target.files[0];

    if (!file) {
      console.error("No se seleccionó ninguna imagen.");
      return;
    }

    const reader = new FileReader();

    let that = this;
    reader.onload = function (e) {
      const textContent = e.target.result;
      that.addTextToDataset(textContent);
    };

    reader.readAsText(file);
  }


  ////
  // Funciones para manejar los datasets de imágenes
  //
  addImageToDataset(imageB64) {
    if (this._datasetConsumer.value.has(this.labelName)) {
      this._datasetConsumer.value.set(this.labelName,
        this._datasetConsumer.value.get(this.labelName).add(imageB64));
    }
    this.requestUpdate();
  }

  _uploadImages() {
    this.querySelector(`#imageFileInput_${this.labelName}`)?.click();
  }

  onLoaded(event) {
    // Obtener la lista de archivos seleccionados
    const files = event.target.files;

    // Convertir cada archivo a Base64
    Array.from(files).forEach(file => {
      const reader = new FileReader();

      reader.onload = () => {
        this.addImageToDataset(reader.result);
      };

      // Leer el archivo como Data URL (Base64)
      reader.readAsDataURL(file);
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
    if (this.stream) {
      const canvas = document.createElement('canvas');
      canvas.width = this.video.width;
      canvas.height = this.video.height;
      const context = canvas.getContext('2d');

      // Dibujar el fotograma actual en el lienzo
      context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      // Obtener el contenido del lienzo como datos base64
      const base64String = canvas.toDataURL('image/png');
      this.addImageToDataset(base64String);
      this.requestUpdate();
    }
  }

  ////
  // Funciones para manejar los datasets de audio
  //
  async collectExampleInterval() {
    console.log("collectExampleInterval");
    if (this.stopCollecting) {
      console.log('Proceso de recolección detenido');
      return;  // Salir de la función si stopCollecting es true
    }
    try {
      const result = await collectExample(this.labelName);

      // Agregar los datos resultantes al dataset
      if (this._datasetConsumer.value.get(this.labelName)) {
        this._datasetConsumer.value.get(this.labelName).add({
          'rawAudio': result.rawAudio,
          'spectrogram': result.spectrogram
        });
      }
      // Actualizar el componente
      this.requestUpdate();
      console.log(this._datasetConsumer.value);
      // Una vez que la promesa se resuelva, vuelve a llamar a la función
      this.collectExampleInterval();
    } catch (error) {
      console.error('Error al ejecutar collectExample:', error);
    }
  }

  collectAudioSample() {
    const recordButton = this.querySelector(`#recordButton_${this.labelName}`);
    const stopButton = this.querySelector(`#stopButton_${this.labelName}`);
    if (!recordButton || !stopButton) return;
    recordButton.disabled = true;
    stopButton.disabled = false;

    this.stopCollecting = false;
    this.collectExampleInterval();
  }

  stopRecording() {
    this.stopCollecting = true;
    const recordButton = this.querySelector(`#recordButton_${this.labelName}`);
    const stopButton = this.querySelector(`#stopButton_${this.labelName}`);
    if (!recordButton || !stopButton) return;
    recordButton.disabled = false;
    stopButton.disabled = true;
  }

  templateButtons(editorType) {
    switch (editorType) {
      case 'text':
        return this.templateTextButtons();
      case 'image':
        return this.templateImageButtons();
      case 'numerical':
        return this.templateNumberButtons();
      case 'audio':
        return this.templateAudioButtons();
    }
  }

  templateData(editorType) {
    switch (editorType) {
      case 'text':
        return this.templateTextData();
      case 'image':
        return this.templateImageData();
      case 'numerical':
        return this.templateNumberData();
      case 'audio':
        return this.templateAudioData();
    }
  }

  templateTextButtons() {
    return html`
    <input 
      id="textFileInput_${this.labelName}"
      accept="text/*"
      hidden="true" 
      type="file"
      @change=${this.onLoadedText} 
      >
    <div class="panel-block is-justify-content-center">    
      <div class="field is-grouped">
        <p class="control">      
          <button @click=${this.openAddTextWindow} class="button  is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-regular fa-keyboard"></i>
            </span>
            <span>${msg('Add')}</span>
          </button>
        </p>
        <p class="control">
          <button @click=${this._uploadTexts} class="button  is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-upload"></i>
            </span>
            <span>${msg('Load')}</span>
          </button>
        </p>
      </div>
    </div>
    `;
  }

  templateImageButtons() {
    return html`
    <input 
      id="imageFileInput_${this.labelName}"
      accept="image/png, image/jpeg, image/webp, image/svg+xml"
      hidden="true" 
      type="file"
      @change=${this.onLoaded} 
      multiple>

    <div class="panel-block is-justify-content-center">
      <div class="field is-grouped">
      ${!this.cameraOpened
        ? html`
          <p class="control">      
            <button @click=${this._uploadImages} class="button mr-1 is-primary is-fullwidth">
              <span class="icon">
              <i class="fa-solid fa-images"></i>
              </span>
              <span>${msg('Upload')}</span>
            </button>
          </p>
          <p class="control"> 
            <button @click=${this.openCamera} class="button mr-1 is-primary is-fullwidth">
              <span class="icon">
              <i class="fa-solid fa-camera"></i>
              </span>
              <span>${msg('Camera')}</span>
            </button>
          </p>`

        : html`
          <p class="control"> 
            <button @click=${this.takePictureFromCamera} class="button mr-1 is-primary is-fullwidth">
              <span class="icon">
                <i class="fa-solid fa-camera"></i>
              </span>
              <span>${msg('Shot')}</span>
            </button>
          </p>
          <p class="control"> 
            <button @click=${this.closeCamera} class="button mr-1 is-primary is-fullwidth">
              <span class="icon">
                <i class="fa-solid fa-xmark"></i>
              </span>
              <span>${msg('Close')}</span>
            </button>
          </p>`

      }
      </div>
    </div>
    `;
  }

  templateNumberButtons() {
    return html`
    <input 
      id="textFileInput_${this.labelName}"
      accept="text/*"
      hidden="true" 
      type="file"
      @change=${this.onLoadedText} 
      >
    <div class="panel-block is-justify-content-center">
      <div class="field is-grouped">
        <p class="control">
          <button @click="${this.openAddTextWindow}" class="button is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-regular fa-keyboard"></i>
            </span>
            <span>${msg('Add')}</span>
          </button>
        </p>
        <p class="control">
          <button @click="${this._uploadTexts}" class="button  is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-upload"></i>
            </span>
            <span>${msg('Load')}</span>
          </button>
        </p>
      </div>
    </div>

    </div>
    `;
  }

  templateAudioButtons() {
    return html`    
    </div>
    <div class="panel-block is-justify-content-center">
      <div class="field is-grouped">
        <p class="control">
          <button id="recordButton_${this.labelName}" @click="${this.collectAudioSample}" class="button is-primary is-fullwidth">
            <span class="icon">
              <i class="fa-solid fa-microphone"></i>
            </span>
            <span>${msg('Record')}</span>
          </button>
        </p>
        <p class="control">
          <button id="stopButton_${this.labelName}" @click="${this.stopRecording}" disabled class="button  is-primary is-fullwidth">
            <span class="icon">
              <i class="fa-solid fa-circle-stop"></i>
            </span>
            <span>${msg('Stop')}</span>
          </button>
        </p>
      </div>
    </div>

    </div>
    `;
  }

  templateTextData() {
    return html`
      
      <div class="container itemdata p-3">
        ${this._datasetConsumer.value.get(this.labelName)
        ? Array.from(this._datasetConsumer.value.get(this.labelName)).reverse().map((entry, index) =>
          html`
          <div class="panel-block">
            <span @click=${this.editTextEntry} text-entry=${entry} class="mr-2">
              <i class="fa-solid fa-pen-to-square"></i>
            </span>
            <span @click=${this.removeTextEntry} text-entry=${entry} class="panel-icon is-clickable">
              <i class="fa-solid fa-trash-can"></i>
            </span>
            <p> <span class="truncate">${entry}</p>
          </div>
          `
        )
        : html``
      }        
      </div>

      <div class=${classMap({ "modal": true, "is-active": this.addTextsWindowOpened })}>
        <div class="modal-background"></div>
        <div class="modal-content">
          <nav class="panel has-background-warning">
            <p class="panel-heading has-background-warning">
              ${msg("Add one or more text examples")}
            </p>
            
            <div class="panel-block">
              <textarea id="inputTexts" class="textarea" placeholder="${msg("Separate each text by a line break")}" rows="10"></textarea>
            </div>
            
            <div class="panel-block">
                ${this.editText
        ? html`
                    <button @click=${this.editTexts} class="button is-primary  is-fullwidth">
                      ${msg("Edit text examples")}
                    </button>`
        : html`
                    <button @click=${this.addTexts} class="button is-primary  is-fullwidth">
                      ${msg("Add text examples")}
                    </button>`
      }
            </div>
          </nav>          
        </div>
        <button @click=${this.closeAddTextWindow} class="modal-close is-large" aria-label="close"></button>
      </div>
    `;
  }

  deleteImage(label, image) {
    let removeImage = confirm(msg("Surely you want to delete this item?"));
    if (removeImage) {
      this._datasetConsumer.value.get(label).delete(image);
      this.requestUpdate();
    }
  }

  templateImageData() {
    return html`
      <div class="container itemdata p-3">    
      <video id="video" ?hidden=${!this.cameraOpened} width="400px" height="300px" autoplay></video>
      
      ${this._datasetConsumer.value.get(this.labelName) && !this.cameraOpened
        ? Array.from(this._datasetConsumer.value.get(this.labelName)).reverse().map((image, index) =>
          html`
            <img @click=${() => { this.deleteImage(this.labelName, image) }} class="image-item" src=${image}/>
          `
        )
        : html``
      }     
    </div>
    `;
  }

  fromCSV2Array(csv) {
    return csv.split(",").map(v => parseFloat(v));
  }

  templateNumberData() {
    return html`        
      <div class="container itemdata p-3">
        <div class="table-container">
          <table class="table is-bordered">
            <tbody>
            ${this._datasetConsumer.value.get(this.labelName)
        ? Array.from(this._datasetConsumer.value.get(this.labelName)).reverse().map((entry, index) =>
          html`
                <tr>
                  <td>
                    <div class="panel-block">
                      <span @click=${this.editTextEntry} text-entry=${entry} class="mr-2 is-clickable">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span @click=${this.removeTextEntry} text-entry=${entry} class="is-clickable">
                        <i class="fa-solid fa-trash-can"></i>
                      </span> 
                    </div>
                  </td>
                  ${this.fromCSV2Array(entry).map(e =>
            html`<td>${e}</td>`)}
                </tr>
                `
        )
        : html``
      } 
            </tbody>
          </table>
        </div>
      </div>

      <div class=${classMap({ "modal": true, "is-active": this.addTextsWindowOpened })}>
        <div class="modal-background"></div>
        <div class="modal-content">
          <nav class="panel has-background-warning">
            <p class="panel-heading has-background-warning">
              ${msg("Add one or more text examples")}
            </p>
            
            <div class="panel-block">
              <textarea id="inputTexts" class="textarea" placeholder="${msg("Separate each text by a line break")}" rows="10"></textarea>
            </div>
            
            <div class="panel-block">
                ${this.editText
        ? html`
                    <button @click=${this.editTexts} class="button is-primary  is-fullwidth">
                      ${msg("Edit text examples")}
                    </button>`
        : html`
                    <button @click=${this.addTexts} class="button is-primary  is-fullwidth">
                      ${msg("Add text examples")}
                    </button>`
      }
            </div>
          </nav>          
        </div>
        <button @click=${this.closeAddTextWindow} class="modal-close is-large" aria-label="close"></button>
      </div>
    `;
  }

  templateAudioData() {

    return html`
      <div class="container itemdata p-3">    
        <div class="buttons" id="sounds_${this.labelName}">
         
        ${this._datasetConsumer.value.get(this.labelName)
        ? Array.from(this._datasetConsumer.value.get(this.labelName)).map((soundData, index) => {

          function play() {
            console.log("PLAY");
            playRawAudio(soundData.rawAudio);
          }

          function remove() {
            this._datasetConsumer.value.get(this.labelName).delete(soundData);
            this.requestUpdate();
          }

          return html`
            <div class="audio-container">
              <img src="${assetUrl('images/sound-70.png')}" class="sound-image">
              <div class="sample-text">sample-${index}</div>
              <button @click=${play} class="button is-primary play-button">
                <i class="fa-solid fa-play" aria-hidden="true"></i>
              </button>
              <button @click=${remove} class="button is-danger delete-button">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
              </button>
            </div>
              `
        }

        )
        : html``
      }
         
        </div>
      </div>
    `;
  }

  render() {
    console.log("IUUUUUU");
    return html`
<nav class="panel mb-3">
  <p class="panel-heading">
        ${this.editinglabelName
        ? html`<input id="inputlabelName" style="width: 200px;" class="input" value=${this.labelName} type="text" placeholder="Text input">`
        : html`<span id="labelName">${this.labelName}</span> <span class="tag is-info">${this._datasetConsumer.value.get(this.labelName).size}</span>`
      }

      <a @click=${this.editlabelName} class="m-2 has-text-white"><i class=${classMap({ "fa-solid": true, "fa-check": this.editinglabelName, "fa-pen-to-square": !this.editinglabelName })}></i></a>
      
      <a @click=${this.removeClass} class="m-2 has-text-white"><i class="fa-regular fa-trash-can"></i></a> 
        
  </p>
  
  ${this.templateData(this._dataTypeConsumer.value.type)}

  ${this.templateButtons(this._dataTypeConsumer.value.type)}
   
</nav>
    `
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    const initShadow = globalThis.__lmlInitShadowRoot;
    if (typeof initShadow === 'function') {
      initShadow(this, root);
    }
    return root;
  }
}

window.customElements.define('dataset-manager', DatasetManager);
