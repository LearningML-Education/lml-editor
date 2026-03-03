import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { datasetContext, dataTypeContext, modelContext } from '../../contexts.js';
import { saveAs } from 'file-saver-es';
import { buildVocabulary } from '../../services/lml-algorithms-bridge.js';

const exampleDatasetModules = import.meta.glob('/examples/datasets/*.json', {
  query: '?raw',
  import: 'default',
  eager: true
});
const formatDatasetLabel = (fileName) =>
  fileName
    .replace(/\.json$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
const exampleDatasets = Object.entries(exampleDatasetModules)
  .map(([path, contents]) => {
    const fileName = path.split('/').pop() || path;
    return {
      name: fileName.replace(/\.json$/i, ''),
      label: formatDatasetLabel(fileName),
      contents
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'es'));


export class FileMenu extends LitElement {
  static properties = {
    showSaveDataset: { type: Boolean },
    showSaveModel: { type: Boolean},
    dropdownOpen: { type: Boolean }
  }

  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true  });
  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });
  _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.dropdownOpen = false;
    this.handleExternalToggle = this.handleExternalToggle.bind(this);
    this.handleDocumentPointerDown = this.handleDocumentPointerDown.bind(this);
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('lml-menu-toggle', this.handleExternalToggle);
    document.addEventListener('pointerdown', this.handleDocumentPointerDown, true);
    document.addEventListener('keydown', this.handleDocumentKeydown);
  }

  disconnectedCallback() {
    window.removeEventListener('lml-menu-toggle', this.handleExternalToggle);
    document.removeEventListener('pointerdown', this.handleDocumentPointerDown, true);
    document.removeEventListener('keydown', this.handleDocumentKeydown);
    super.disconnectedCallback();
  }

  handleExternalToggle(event) {
    if (event?.detail?.menu !== 'file' && event?.detail?.open) {
      this.dropdownOpen = false;
    }
  }

  handleDocumentPointerDown(event) {
    if (!this.dropdownOpen) return;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const clickedInside = path.includes(this);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  handleDocumentKeydown(event) {
    if (event.key === 'Escape' && this.dropdownOpen) {
      this.closeDropdown();
    }
  }

  setDropdownOpen(nextOpen) {
    if (this.dropdownOpen === nextOpen) return;
    this.dropdownOpen = nextOpen;
    window.dispatchEvent(new CustomEvent('lml-menu-toggle', {
      detail: { menu: 'file', open: this.dropdownOpen }
    }));
  }

  closeDropdown() {
    this.setDropdownOpen(false);
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
    this.closeDropdown();
    this.querySelector('#fileInput')?.click();
  }

  loadExampleDataset(example) {
    if (!example) return;
    this.closeDropdown();
    const inputDataName = example.name;
    this._dataTypeConsumer.value.name = inputDataName;

    this.dispatchEvent(new CustomEvent('change-input-name', {
      bubbles: true,
      detail: inputDataName
    }));

    this.loadDataset(example.contents);
  }

  toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setDropdownOpen(!this.dropdownOpen);
  }

  render() {

    return html`
    <style>
      .navbar-dropdown .navbar-item.has-dropdown.is-submenu {
        position: relative;
      }

      .navbar-dropdown .navbar-item.has-dropdown.is-submenu > .navbar-link {
        padding-right: 2.25em;
      }

      .navbar-dropdown .navbar-item.has-dropdown.is-submenu > .navbar-link::after {
        border: 2px solid currentColor;
        border-top: 0;
        border-left: 0;
        content: "";
        display: block;
        height: 0.45em;
        width: 0.45em;
        transform: rotate(-45deg);
        position: absolute;
        right: 0.75em;
        top: 50%;
        margin-top: -0.2em;
      }

      .navbar-dropdown .navbar-item.has-dropdown.is-submenu > .navbar-link {
        color: hsla(171, 100%, 29%, 1);
      }

      .navbar-dropdown .navbar-item.has-dropdown.is-submenu > .navbar-dropdown {
        display: none;
        position: absolute;
        left: 100%;
        top: -0.5rem;
        min-width: 240px;
      }

      .navbar-dropdown .navbar-item.has-dropdown.is-submenu.is-hoverable:hover > .navbar-dropdown {
        display: block;
      }

      @media screen and (max-width: 1023px) {
        .navbar-dropdown .navbar-item.has-dropdown.is-submenu > .navbar-dropdown {
          position: static;
          min-width: auto;
          box-shadow: none;
        }
      }
    </style>
    <input id="fileInput" hidden="true" type="file" @change=${this.onLoaded}>

    <div class=${classMap({
      'navbar-item': true,
      'has-dropdown': true,
      'is-active': this.dropdownOpen
    })}>
        <a class="navbar-link" href="#" @click=${this.toggleDropdown}>
          ${msg("File")}
        </a>
    
        <div class="navbar-dropdown">
          
          <a href="" class="navbar-item" @click=${this.closeDropdown}>${msg("New")}</a>
          <a @click=${this.openFileBrowser} class="navbar-item">${msg("Upload dataset from your computer")}</a>
          ${this.showSaveDataset
        ? html`<a @click=${(e) => { this.closeDropdown(); this.saveDataset(e); }} class="navbar-item">${msg("Save dataset to your computer")}</a>`
        : html``
          }
          ${this.showSaveModel
        ? html`<a @click=${(e) => { this.closeDropdown(); this.saveModel(e); }} class="navbar-item">${msg("Save model to your computer")}</a>`
        : html``
          }

          <div class="navbar-item has-dropdown is-hoverable is-submenu">
            <a class="navbar-link">${msg("Sample datasets", { id: "sample-datasets" })}</a>
            <div class="navbar-dropdown">
              ${exampleDatasets.map(
                (example) =>
                  html`<a class="navbar-item" @click=${() => this.loadExampleDataset(example)}>
                    ${example.label}
                  </a>`
              )}
            </div>
          </div>
        </div>
    </div>
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

window.customElements.define('file-menu', FileMenu);
