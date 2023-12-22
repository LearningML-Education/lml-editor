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
    addTextsWindowOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.editinglabelName = false;
    this.labelName = "Unnamed";
    this.faCheck = false;
    this.faPenToSquare = true;
    this.dataset = this._datasetConsumer.value;
    this.textEntry = "";
    this.addTextsWindowOpen = false;
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
      const event = new CustomEvent('edit-label', {
        bubbles: true,
        composed: true,
        detail: {
          oldLabel: oldLabel,
          newLabel: this.labelName
        }
      });

      this.dispatchEvent(event);
    }
    this.faCheck = this.editlabelName;
    this.faPenToSquare = !this.faCheck;
    this.editinglabelName = !this.editinglabelName;

  }

  removeClass() {
    if (confirm(msg("Are you sure?"))) {
      const event = new CustomEvent('remove-label', {
        bubbles: true,
        composed: true,
        detail: { label: this.labelName }
      });

      this.dispatchEvent(event);
    }
  }

  closeAddTextWindow() {
    this.addTextsWindowOpen = false;
    this.querySelector("#inputTexts").value = "";
  }

  openAddTextWindow() {
    this.addTextsWindowOpen = true;
  }

  /**
   * Ver `editTextEntry()`
   */
  addTexts() {
    let texts = this.querySelector("#inputTexts").value;

    if (this.textEntry != texts) {
      const event = new CustomEvent('remove-data-from-label', {
        bubbles: true,
        composed: true,
        detail: { label: this.labelName, element: this.textEntry }
      });
      this.textEntry = texts;
      this.dispatchEvent(event);
    }

    const event = new CustomEvent('add-texts-to-label', {
      bubbles: true,
      composed: true,
      detail: { label: this.labelName, texts: texts }
    });

    this.dispatchEvent(event);
    console.log(texts);

    this.closeAddTextWindow();
  }

  removeTextEntry(e) {
    if (confirm(msg("Surely you want to delete this item?"))) {
      let entry = e.target.parentElement.getAttribute("text-entry");
      const event = new CustomEvent('remove-data-from-label', {
        bubbles: true,
        composed: true,
        detail: { label: this.labelName, element: entry }
      });

      this.dispatchEvent(event);
      this.requestUpdate();
    }
  }

  /**
   * Esta función merece una explicación pues la forma de editar es un pelín enrevesada
   * 
   * Se ha definido una property denominada this.textEntry, que a la que se le asigna el
   * valor que haya en la caja de edición `text-entry`. De esa manera se pone en la caja
   * modal para añadir textos el texto seleccionado para editar. 
   * 
   * Si el usuario hace clic en el botón `añadir texto` se ejecutará `addTexts` y ahí
   * se comprobará si this.textEntry coincide con la entrada de la caja de edición. Si no 
   * coincide es porque el usuario la ha modificado, entonces se borra la entrada 
   * correspondiente a this.textEntry (valor antiguo) y se añade el nuevo valor introducido 
   * por el usuario.
   * 
   * @param {CustomEvent} e 
   */
  editTextEntry(e) {
    let entry = e.target.parentElement.getAttribute("text-entry");
    this.textEntry = entry;
    console.log(entry);

    this.addTextsWindowOpen = true;
    this.querySelector("#inputTexts").value = entry;
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
          <button class="button  is-primary is-fullwidth">
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
        <p class="control">      
          <button class="button mr-1 is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-images"></i>
            </span>
            <span>${msg('Upload images')}</span>
          </button>
        </p>
        <p class="control"> 
          <button class="button mr-1 is-primary is-fullwidth">
            <span class="icon">
            <i class="fa-solid fa-camera"></i>
            </span>
            <span>${msg('Take from camera')}</span>
          </button>
        </p>
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
      
      <div class="container textdata p-3">
        ${this.dataset.get(this.labelName)
        ? Array.from(this.dataset.get(this.labelName)).map((entry, index) =>
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

      <div class=${classMap({ "modal": true, "is-active": this.addTextsWindowOpen })}>
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
              <button @click=${this.addTexts} class="button is-primary  is-fullwidth">
                ${msg("Add text examples")}
              </button>
            </div>
          </nav>          
        </div>
        <button @click=${this.closeAddTextWindow} class="modal-close is-large" aria-label="close"></button>
      </div>
    `;
  }

  templateImageData() {
    return html`
      <div class="container p-3">
      <img @click=${this.dale} width="50px" src="/images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>
      <img width="50px" src="images/cabeza_genio.png"/>      
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
        : html`<span id="labelName">${this.labelName}</span>`
      }
        <a @click=${this.editlabelName} class="m-2"><i class=${classMap({ "fa-solid": true, "fa-check": this.faCheck, "fa-pen-to-square": this.faPenToSquare })}></i></a>
        
        <a @click=${this.removeClass} class="m-2"><i class="fa-regular fa-trash-can"></i></a> 
      </div>
    </div>
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
