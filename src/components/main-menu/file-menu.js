import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { datasetContext, dataTypeContext, modelContext } from '../../contexts.js';
import { saveAs } from 'file-saver-es';
import { buildVocabulary } from '../../services/lml-algorithms-bridge.js';


export class FileMenu extends LitElement {

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

  async saveModel(e){    
    const model = this._modelConsumer.value;
    if(!model?.model && !model?.isTrained){
      alert(msg("You have to build a model first"));
      return;
    }
    let datatype = { ...this._dataTypeConsumer.value };
    if (datatype.type === 'text') {
      let vocabulary = null;
      try {
        const stored = JSON.parse(localStorage.getItem('lmlModel') || '{}');
        vocabulary = stored?.encoder?.vocabulary || null;
      } catch {}
      if (!Array.isArray(vocabulary)) {
        const texts = Array.from(this._datasetConsumer.value.values()).map(set => Array.from(set)).flat();
        vocabulary = await buildVocabulary(texts);
      }
      if (Array.isArray(vocabulary)) {
        datatype = { ...datatype, vocabulary };
      }
    }
    this._modelConsumer.value.saveToDisk(datatype).then(r => {      
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

      const event = new CustomEvent('change-algorithm', {
        bubbles: true,
        composed: true,
        detail: this._modelConsumer.value.constructor.name
      });
  
      this.dispatchEvent(event);

      Object.keys(inputData.data).forEach(key => {        
        let data = inputData.data[key];
        for (let d of data) {
          if (!this._datasetConsumer.value.has(key)){
            this._datasetConsumer.value.set(key, new Set());
          }  
          if(d == "") continue;

          if (this._dataTypeConsumer.value.type == 'numerical') {
              d = this.truncateNumbers(d);
              this._dataTypeConsumer.value.dimension = d.split(",").length;
          }
          
          if(this._dataTypeConsumer.value.type == 'audio'){
            console.log("load audio");
            let floatRawAudioData = new Float32Array(Object.values(d.rawAudio.data));
            let floatSpectrogramData = new Float32Array(Object.values(d.spectrogram.data));
            d = {
              rawAudio: {
                data: floatRawAudioData,
                sampleRateHz: d.rawAudio.sampleRateHz
              },
              spectrogram: {
                data: floatSpectrogramData,
                frameSize: d.spectrogram.frameSize
              }
            }
            //d = new Float32Array(Object.values(d));
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

    this.dispatchEvent(new CustomEvent('change-input-name', {
      bubbles: true,
      detail: inputDataName
    }));

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
          
          <a href="" class="navbar-item">${msg("New")}</a>
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
