import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext } from '../contexts.js';


export class DatasetManager extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext });

  static properties = {
    className: {type: String}
  };

  constructor() {
    super();
    this.editingClassName = false;
    this.className = "Unnamed";
    updateWhenLocaleChanges(this);
  }

  editClassName() {
    console.log("editClassName");
    if(this.editingClassName){
      this.className =this.querySelector("#inputClassName").value;
      this.querySelector("#className").innerHTML = this.className;
      this.querySelector("#editClassName").innerHTML = '<i class="fa-solid fa-pen-to-square">';
    } else {
      this.querySelector("#className").innerHTML = '<input id="inputClassName" style="width: 200px;" class="input" type="text" placeholder="Text input">';
      this.querySelector("#editClassName").innerHTML = '<i class="fa-solid fa-check"></i>';
    }
    
    this.editingClassName = !this.editingClassName;
  }

  removeClass() {
    alert("remove class");
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
      <button class="button mr-1 is-primary is-fullwidth">
        <span class="icon">
        <i class="fa-regular fa-keyboard"></i>
        </span>
        <span>${msg('Add new text')}</span>
      </button>
      <button class="button mr-1 is-primary is-fullwidth">
        <span class="icon">
        <i class="fa-solid fa-upload"></i>
        </span>
        <span>${msg('Load texts from file')}</span>
      </button>
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
      <button class="button mr-1 is-primary is-fullwidth">
        <span class="icon">
        <i class="fa-regular fa-keyboard"></i>
        </span>
        <span>${msg('Add numbers')}</span>
      </button>
      <button class="button mr-1 is-primary is-fullwidth">
        <span class="icon">
        <i class="fa-solid fa-upload"></i>
        </span>
        <span>${msg('Load numbers from file')}</span>
      </button>
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
        ${this.editingClassName
          ? html`<input style="width: 200px;" class="input" type="text" placeholder="Text input">`
          : html`<span id="className">${this.className}</span>`}
        
        <a id="editClassName" @click=${this.editClassName} class="m-2"><i class="fa-solid fa-pen-to-square"></i></a>
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
