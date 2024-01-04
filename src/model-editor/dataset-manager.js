import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext, datasetContext } from '../contexts.js';
import { classMap } from 'lit/directives/class-map.js';


export class DatasetManager extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true });

  static properties = {
    editinglabelName: { type: Boolean },
    labelName: { type: String },
    faCheck: { type: Boolean },
    faPenToSquare: { type: Boolean },
    dataset: { type: Set },
    textEntry: { type: String },
    editText: { type: Boolean },
    addTextsWindowOpened: { type: Boolean },
    cameraOpened: { type: Boolean },
    numberOfItems: { type: Number }
  };

  constructor() {
    super();
    this.editinglabelName = false;
    this.labelName = "Unnamed";
    this.faCheck = false;
    this.faPenToSquare = true;
    this.dataset = this._datasetConsumer.value;
    this.textEntry = "";
    this.editText = false;
    this.addTextsWindowOpened = false;
    this.cameraOpened = false;
    this.numberOfItems = 0;
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.dataset = this._datasetConsumer.value;
  }

  editlabelName() {
    if (this.editinglabelName) {
      let oldLabel = this.labelName;
      this.labelName = this.querySelector("#inputlabelName").value;
      if (this._datasetConsumer.value.has(oldLabel)) {
        this._datasetConsumer.value.set(this.labelName,
          this._datasetConsumer.value.get(oldLabel));
        this._datasetConsumer.value.delete(oldLabel);
      }
      console.log(this._datasetConsumer.value);
    }
    this.faCheck = this.editlabelName;
    this.faPenToSquare = !this.faCheck;
    this.editinglabelName = !this.editinglabelName;
  }

  removeClass() {
    if (confirm(msg("Are you sure?"))) {
      if (this._datasetConsumer.value.has(this.labelName)) {
        this._datasetConsumer.value.delete(this.labelName);
      }
      console.log(this._datasetConsumer.value);

      this.numberOfItems = 0;
      this.dispatchEvent(new CustomEvent('remove-label', {
        bubbles: true
      }));
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

  addTextToDataset(texts) {
    texts.split("\n").forEach(entry => {
      if (entry == "") return;
      this._datasetConsumer.value.set(this.labelName,
        this._datasetConsumer.value.get(this.labelName).add(entry));
      this.numberOfItems++;
    });
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
      this.numberOfItems--;
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

      if (e.target != undefined) this.numberOfItems--;
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

  async loadTextFromFile(e) {
    const pickerOpts = {
      types: [
        {
          description: "Texts",
          accept: {
            "text/*": [".txt"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };

    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);

    const file = await fileHandle.getFile();
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
  }

  async uploadImages() {
    const pickerOpts = {
      types: [
        {
          description: "Images",
          accept: {
            "images/*": [".jpg", ".png"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: true,
    };

    const filesHandle = await window.showOpenFilePicker(pickerOpts);

    filesHandle.forEach(async (fileHandle) => {
      const file = await fileHandle.getFile();
      const reader = new FileReader();

      // Definir la función de devolución de llamada cuando la lectura se complete
      let that = this;
      reader.onload = function (e) {
        console.log(e);
        // Convertir el contenido a base64
        //const base64String = e.target.result.split(',')[1];
        const base64String = e.target.result
        that.addImageToDataset(base64String);
        console.log(that._datasetConsumer.value);
        that.numberOfItems++;
        that.requestUpdate();
      };

      // Leer el contenido del archivo como base64
      reader.readAsDataURL(file);
    });

  }

  async openCamera() {
    let video = this.querySelector("#video");
    try {
      // Obtener acceso a la webcam
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Mostrar el flujo de video en el elemento video
      video.srcObject = this.stream;
      this.cameraOpened = true;
    } catch (error) {
      console.error('Error al iniciar la webcam:', error);
    }
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
      canvas.width = video.width;
      canvas.height = video.height;
      const context = canvas.getContext('2d');

      // Dibujar el fotograma actual en el lienzo
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Obtener el contenido del lienzo como datos base64
      const base64String = canvas.toDataURL('image/png');
      this.addImageToDataset(base64String);

      this.numberOfItems++;
      this.dispatchEvent(event);
      this.requestUpdate();
    }
  }

  templateButtons(editorType) {
    switch (editorType) {
      case 'text':
        return this.templateTextButtons();
      case 'image':
        return this.templateImageButtons();
      case 'number':
        return this.templateNumberButtons();
    }
  }

  templateData(editorType) {
    switch (editorType) {
      case 'text':
        return this.templateTextData();
      case 'image':
        return this.templateImageData();
      case 'number':
        return this.templateNumberData();
    }
  }

  templateTextButtons() {
    return html`
    <div class="panel-block">    
      <div class="field is-grouped">
        <p class="control">      
          <button @click=${this.openAddTextWindow} class="button  is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-regular fa-keyboard"></i>
            </span>
            <span>${msg('Add new texts')}</span>
          </button>
        </p>
        <p class="control">
          <button @click=${this.loadTextFromFile} class="button  is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-upload"></i>
            </span>
            <span>${msg('Load texts from file')}</span>
          </button>
        </p>
      </div>
    </div>
    `;
  }

  templateImageButtons() {
    return html`
    <div class="panel-block">
      <div class="field is-grouped">
      ${!this.cameraOpened
        ? html`
          <p class="control">      
            <button @click=${this.uploadImages} class="button mr-1 is-primary is-fullwidth">
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
    </div>
    `;
  }

  templateNumberButtons() {
    return html`
    <div class="panel-block">
      <div class="field is-grouped">
        <p class="control">
          <button class="button is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-regular fa-keyboard"></i>
            </span>
            <span>${msg('Add numbers')}</span>
          </button>
        </p>
        <p class="control">
          <button class="button  is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-upload"></i>
            </span>
            <span>${msg('Load numbers from file')}</span>
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
        ${this.dataset.get(this.labelName)
        ? Array.from(this.dataset.get(this.labelName)).reverse().map((entry, index) =>
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

  templateImageData() {
    return html`
      <div class="container itemdata p-3">    
      <video id="video" ?hidden=${!this.cameraOpened} width="400px" height="300px" autoplay></video>
      
      ${this.dataset.get(this.labelName) && !this.cameraOpened
        ? Array.from(this.dataset.get(this.labelName)).reverse().map((image, index) =>
          html`
            <img class="image-item" src=${image}/>
          `
        )
        : html``
      }     
    </div>
    `;
  }

  templateNumberData() {
    return html`
      <div class="container p-3">
        <div class="table-container">
          <table class="table is-bordered">
            <tbody>
              <tr @click=${this.dale}>
                <td>4.2</td><td>3.5</td><td>4.2</td><td>3.5</td>
                <td>4.2</td><td>3.5</td><td>4.2</td><td>3.5</td>
              </tr>
              <tr @click=${this.dale}>
                <td>4.2</td><td>3.5</td><td>4.2</td><td>3.5</td>
                <td>4.2</td><td>3.5</td><td>4.2</td><td>3.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  render() {
    return html`
<nav class="panel mb-3">
  <p class="panel-heading">
        ${this.editinglabelName
        ? html`<input id="inputlabelName" style="width: 200px;" class="input" value=${this.labelName} type="text" placeholder="Text input">`
        : html`<span id="labelName">${this.labelName}</span> <span class="tag is-info">${this.numberOfItems}</span>`
      }

      <a @click=${this.editlabelName} class="m-2"><i class=${classMap({ "fa-solid": true, "fa-check": this.faCheck, "fa-pen-to-square": this.faPenToSquare })}></i></a>
      
      <a @click=${this.removeClass} class="m-2"><i class="fa-regular fa-trash-can"></i></a> 
        
  </p>
  
  ${this.templateData(this._statusConsumer.value.modelEditor)}

  ${this.templateButtons(this._statusConsumer.value.modelEditor)}
   
</nav>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('dataset-manager', DatasetManager);
