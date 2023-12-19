import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class DatasetManager extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  dale(){
    alert ("vamooooo");
  }

  render() {

    return html`
<nav class="panel mb-3">
  <p class="panel-heading">
        <!-- <input style="width: 200px;" class="input" type="text" placeholder="Text input"> -->
        Clase 1
        <a class="m-2"><i class="fa-solid fa-pen-to-square" data-tooltip="Tooltip Text"></i></a>
        <a class="m-2"><i class="fa-regular fa-trash-can"></i></a> 
        <a class="m-2"><i class="fa-solid fa-square-plus"></i></a>
        
      </div>
    </div>
  
  </p>
  
  <div class="container p-3">
    <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
    <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
    <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>
    <p> <span class="truncate">El Parque Nacional de Doñana es desde hace dos semanas la primera reserva ecológica expulsada de la lista verde de la Unión Internacional para la Conservación de la Naturaleza (UICN), la mayor organización ambiental del mundo. La salida del espacio protegido de este prestigioso sello verde se debe a la mala gestión de la Junta de Andalucía (PP), responsable de ejecutar medidas para revertir el deterioro de su biodiversidad, en caída libre por culpa de la agricultura intensiva, el turismo y la extrema sequía. Hasta ahora, ninguno de los 77 enclaves en 60 países había abandonado esta distinción de sostenibilidad.</p>

  </div>

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
   
</nav>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('dataset-manager', DatasetManager);
