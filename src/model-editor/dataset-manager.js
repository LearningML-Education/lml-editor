import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext } from '../contexts.js';
import { classMap } from 'lit/directives/class-map.js';


export class DatasetManager extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext });

  static properties = {
    editinglabelName: { type: Boolean },
    labelName: { type: String },
    faCheck: { type: Boolean },
    faPenToSquare: { type: Boolean }
  };

  constructor() {
    super();
    this.editinglabelName = false;
    this.labelName = "Unnamed";
    this.faCheck = false;
    this.faPenToSquare = true;
    updateWhenLocaleChanges(this);
  }

  editlabelName() {
    if (this.editinglabelName) this.labelName = this.querySelector("#inputlabelName").value;
    this.faCheck = this.editlabelName;
    this.faPenToSquare = !this.faCheck;
    this.editinglabelName = !this.editinglabelName;

  }

  removeClass() {
    if (confirm(msg("Are you sure?")) == true) {
      console.log("confirm");
    } else {
      console.log("cancelled");
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
      <div class="buttons">
        <button class="button  is-primary is-fullwidth">
          <span class="icon">
          <i class="fa-regular fa-keyboard"></i>
          </span>
          <span>${msg('Add new text')}</span>
        </button>
        <button class="button  is-primary is-fullwidth">
          <span class="icon">
          <i class="fa-solid fa-upload"></i>
          </span>
          <span>${msg('Load texts from file')}</span>
        </button>
        </div>
    </div>
    `;
  }

  templateImageButtons() {
    return html`
    <div class="panel-block">
      <button class="button mr-1 is-primary is-fullwidth">
        <span class="icon">
        <i class="fa-solid fa-images"></i>
        </span>
        <span>${msg('Upload images')}</span>
      </button>
      <button class="button mr-1 is-primary is-fullwidth">
        <span class="icon">
        <i class="fa-solid fa-camera"></i>
        </span>
        <span>${msg('Take from camera')}</span>
      </button>
    </div>
    `;
  }

  templateNumberButtons() {
    return html`
    <div class="panel-block">
      <div class="buttons">
        <button class="button is-primary is-fullwidth">
          <span class="icon">
          <i class="fa-regular fa-keyboard"></i>
          </span>
          <span>${msg('Add numbers')}</span>
        </button>
        <button class="button  is-primary is-fullwidth">
          <span class="icon">
          <i class="fa-solid fa-upload"></i>
          </span>
          <span>${msg('Load numbers from file')}</span>
        </button>
      </div>
    </div>
    `;
  }

  templateTextData() {
    return html`
      <div class="container p-3">
        <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
        <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
        <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
        <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
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
