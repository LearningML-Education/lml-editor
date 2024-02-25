import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext, datasetContext, statusContext } from '../../contexts.js';
import { saveAs } from 'file-saver-es';


export class FileMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true  });
  _statusConsumer = new ContextConsumer(this, { context: statusContext });

  static properties = {
    showSave: { type: Boolean }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  saveDataset(e) {

    console.log(this._datasetConsumer.value);

    let jsonDataset = {};
    this._datasetConsumer.value.forEach((value, key) => {
      jsonDataset[key] = Array.from(value);
    });

    jsonDataset = {
      type: this._statusConsumer.value.modelEditor,
      data: jsonDataset
    }

    let jsonString = JSON.stringify(jsonDataset);

    console.log(jsonString);

    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, this._statusConsumer.value.modelName);
  }

  loadDataset(file) {
    let inputData;

    // Eliminamos todos los datos del dataset
    for(let k of this._datasetConsumer.value.keys()){
      this._datasetConsumer.value.delete(k);
    }

    try {
      inputData = JSON.parse(file);
      Object.keys(inputData.data).forEach(key => {
        this._statusConsumer.value.modelEditor = inputData.type;
        let data = inputData.data[key];
        for (let d of data) {
          if (this._statusConsumer.value.modelEditor == 'text') {
            if (!this._datasetConsumer.value.has(key)){
              this._datasetConsumer.value.set(key, new Set());
            }
            this._datasetConsumer.value.get(key).add(d);
          }
          if (this._statusConsumer.value.modelEditor == 'numerical') {
            let _d = this.truncateNumbers(d);
            this._datasetConsumer.value.set(key, d);
            this.featureDimension = d.split(",").length;
            this.featureDimensionLocked = true;
          }
          if (this._statusConsumer.value.modelEditor == 'image') {
            let i = new Image();
            i.src = d;
            this._datasetConsumer.value.set(key, d);
          }
        }
      });
    }
    catch {
      alert("Fichero erróneo. No puedo interpretar ese fichero. ¿Seguro que está bien construido?");
    }

    console.log(this._datasetConsumer.value);
  
  }

  onLoaded(e) {

    let file = e.target.files[0];
    let inputDataName = file.name.replace(/\.[^/.]+$/, "");

    this._statusConsumer.value.modelName = inputDataName;

    let fileReader = new FileReader();

    fileReader.readAsText(file);

    fileReader.onload = (e) => {
      this.loadDataset(fileReader.result.toString());
    }

  }

  openFileBrowser(){
    document.getElementById('fileInput').click();
  }

  render() {

    return html`
    <input id="fileInput" hidden="true" type="file" @change=${this.onLoaded}>

    <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          ${msg("File")}
        </a>
    
        <div class="navbar-dropdown">
          
          <a class="navbar-item">${msg("New")}</a>
          <a @click=${this.openFileBrowser} class="navbar-item">${msg("Upload from your computer")}</a>
          ${this.showSave
        ? html`<a @click=${this.saveDataset}  class="navbar-item">${msg("Save to your computer")}</a>`
        : html``
      }
        </div>
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('file-menu', FileMenu);
