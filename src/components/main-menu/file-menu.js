import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext, datasetContext, dataTypeContext, modelContext } from '../../contexts.js';
import { saveAs } from 'file-saver-es';


export class FileMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true  });
  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });
  _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });

  static properties = {
    showSaveDataset: { type: Boolean },
    showSaveModel: { type: Boolean}
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
      type: this._dataTypeConsumer.value.type,
      data: jsonDataset
    }

    let jsonString = JSON.stringify(jsonDataset);

    console.log(jsonString);

    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, this._dataTypeConsumer.value.name);
  }

  saveModel(e){    
    this._modelConsumer.value.saveToDisk(this._dataTypeConsumer.value).then(r => {      
      console.log('Model saved to disk');
      console.log(r);
    })
  }

  truncateNumbers(numbersCSV){
    let numbers = [];
    let numbersString = numbersCSV.split(",");
    for(let numberString of numbersString){
      numbers.push(parseFloat(numberString).toFixed(4));
    }

    return numbers.join(",");
  }

  loadDataset(file) {
    let inputData;

    // Eliminamos todos los datos del dataset
    for(let k of this._datasetConsumer.value.keys()){
      this._datasetConsumer.value.delete(k);
    }

    try {
      inputData = JSON.parse(file);
      this._dataTypeConsumer.value.type = inputData.type;
      Object.keys(inputData.data).forEach(key => {        
        let data = inputData.data[key];
        for (let d of data) {
          if (!this._datasetConsumer.value.has(key)){
            this._datasetConsumer.value.set(key, new Set());
          }                   
          if (this._dataTypeConsumer.value.type == 'numerical') {
              d = this.truncateNumbers(d);
              this._dataTypeConsumer.value.dimension = d.split(",").length;
          }
          
          this._datasetConsumer.value.get(key).add(d);
        }
      });

      let bc = new BroadcastChannel('lml-internal');
      bc.postMessage('requestUpdate');
    }
    catch {
      alert("Fichero erróneo. No puedo interpretar ese fichero. ¿Seguro que está bien construido?");
    }

    console.log(this._datasetConsumer.value);
  
  }

  onLoaded(e) {

    let file = e.target.files[0];
    let inputDataName = file.name.replace(/\.[^/.]+$/, "");

    this._dataTypeConsumer.value.name = inputDataName;

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
          
          <a href="${this._configConsumer.value.urlBase}" class="navbar-item">${msg("New")}</a>
          <a @click=${this.openFileBrowser} class="navbar-item">${msg("Upload dataset from your computer")}</a>
          ${this.showSaveDataset
        ? html`<a @click=${this.saveDataset}  class="navbar-item">${msg("Save dataset to your computer")}</a>`
        : html``
          }
          ${this.showSaveModel
        ? html`<a @click=${this.saveModel}  class="navbar-item">${msg("Save model to your computer")}</a>`
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
