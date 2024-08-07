import { ContextConsumer } from '@lit/context';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { confusionMatrix, buildVocabulary } from 'lml-algorithms';
import Plotly from 'plotly.js-dist-min';
import {
  dataTypeContext,
  datasetContext,
  encodingContext,
  featuresContext,
  modelContext
} from '../../contexts.js';

export class ModelLearn extends LitElement {

  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true });
  _featuresConsumer = new ContextConsumer(this, { context: featuresContext, subscribe: true });
  _encoderComsumer = new ContextConsumer(this, { context: encodingContext, subscribe: true });
  _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });

  bcEditor = new BroadcastChannel('lml-editor');


  static properties = {
    buttonLoading: { type: Boolean },
    algorithm: { type: String },
    advancedMode: { type: Object, attribute: 'advanced-mode' },
    showModalTrainedModel: { type: Boolean }
  }

  constructor() {
    super();
    this.buttonLoading = false;
    this.algorithm = "ann";
    this.showModalTrainedModel = false;
    updateWhenLocaleChanges(this);

    this.bc = new BroadcastChannel('lml-internal');
    this.bc.addEventListener('message', message => {
      if(message.data == 'requestUpdate'){
        this.requestUpdate();
      }
    });
  }

  learningText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Now it's time to learn to classify text");
      case 'image':
        return msg("Now it's time to learn to classify images");
      case 'numerical':
        return msg("Now it's time to learn to classify numbers");
    }
    return "";
  }

  learnButtonText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Learn to recognize texts");
      case 'image':
        return msg("Learn to recognize images");
      case 'numerical':
        return msg("Learn to recognize numbers");
    }
    return "";
  }

  getHyperParameters() {
    let params = {};
    switch (this.algorithm) {
      case "ann":
        params["learningRate"] = parseFloat(this.querySelector("#learningrate").value);
        params["batchSize"] = parseInt(this.querySelector("#batchsize").value);
        params["epochs"] = parseInt(this.querySelector("#epochs").value);
        break;
      case "knn":
        params['K'] = this.querySelector("#numofneighbours").value;
        break;
    }
    return params;
  }

  notEnoughDataToLearn() {
    let notEnoughData = false;
    this._datasetConsumer.value.forEach((element) => {
      if (element.size <= 2) {
        notEnoughData = true;
      }
    });

    return notEnoughData;
  }

  notEnoughClassesToLearn() {
    return this._datasetConsumer.value.size <= 1;
  }

  learn() {
    if(this.notEnoughClassesToLearn()){
      alert(msg('There are not enough classes to learn. Two classes are needed to learn'));
      return;
    }

    if (this.notEnoughDataToLearn()) {
      alert(msg('There are not enough data to learn. Add more example,please'));
      return;
    }
    if (this.advancedMode.enabled) {
      this._modelConsumer.value.setHyperParameters(this.getHyperParameters());
    }

    if (this.querySelector("#percentageforvalidation")) {
      this.percentageForValidation = parseInt(this.querySelector("#percentageforvalidation").value || 0);
    } else {
      this.percentageForValidation = 0;
    }

    let promises = [];
    let type = this._dataTypeConsumer.value.type;
    let encode = this._encoderComsumer.value[type]
    this.buttonLoading = true;
    this._featuresConsumer.value.clear();
    let vocabulary;
    if(type == 'text'){
      let texts = Array.from(this._datasetConsumer.value.values()).map(set => Array.from(set)).flat();
      vocabulary = buildVocabulary(texts);
    }
    this._datasetConsumer.value.forEach((element, key) => {
      promises.push(encode(Array.from(element)).then(features => {
        this._featuresConsumer.value.set(key, features);
      }));
    });

    console.log(this._featuresConsumer.value);

    Promise.all(promises).then(() => {
      this._modelConsumer.value.train(this._featuresConsumer.value, this.percentageForValidation).then(result => {
        this.buttonLoading = false;
        console.log(result);
        return result;
      }).then(r => {        
        let dataForPlotly = confusionMatrix(r.validationDataset, this._modelConsumer.value)
        return dataForPlotly;        
      }).then(d => {
        console.log(d);
        let confusionMatrixElem = this.querySelector("#confusionMatrix");
        if (this.advancedMode.enabled && this.percentageForValidation != 0) {
          Plotly.newPlot(confusionMatrixElem, d.data, d.layout);
        }
        let encoder = {
          name: this._encoderComsumer.value[this._dataTypeConsumer.value.type].name,
          vocabulary: vocabulary
        }
        return this._modelConsumer.value.saveToLocalstorage(this._dataTypeConsumer.value, encoder);
      }).then(lmlModel => {
        console.log("This model has been built right now:");
        console.log(lmlModel);  
        this.showModalTrainedModel = true;
        setTimeout(() => {this.showModalTrainedModel = false;}, 5000);
        this.bcEditor.postMessage('updateModel');     
      });
    });

  }

  chooseAlgorithm(e) {
    this.algorithm = e.target.value;

    const event = new CustomEvent('change-algorithm', {
      bubbles: true,
      composed: true,
      detail: this.algorithm
    });

    this.dispatchEvent(event);
  }

  templateANNParams() {
    return html`
<div class="columns">
  <div class="column">
    <div class="field">
      <label class="label">${msg("Epochs:")}</label>
      <div class="control">
        <input class="input" type="number" id="epochs" name="epochs" min="1" value="20" />            
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">${msg("Batch size:")}</label>
      <div class="control">
        <input class="input" type="number" id="batchsize" name="batchsize" min="1" value="10" />            
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">${msg("Learning rate:")}</label>
      <div class="control">
        <input class="input" type="number" id="learningrate" name="learningrate" value="0.001" />            
      </div>
    </div>          
  </div>  
</div>
    `;
  }

  templateKNNParams() {
    return html`
<div class="field">
  <label class="label">${msg("Number of neighbours:")}</label>
  <div class="control">
    <input class="input" type="number" id="numofneighbours" name="numofneighbours" min="1" value="5" />            
  </div>
</div>`
  }

  templateModalTrainedModel(){
    return html`
    <div class=${classMap({"modal": true, "is-active": this.showModalTrainedModel})} class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">${msg("Great!")}</p>
          <button @click=${() => { 
            this.showModalTrainedModel = false;}} class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column is-one-quarter ">
              <img width="100" src="${process.env.URL_BASE}/images/cabeza_genio.png" alt="LearningML Genius">
            </div>
            <div class="column">
              <p class="is-size-4"> ${msg('The model has been trained!, you can now test it and use it in LML-Scratch')}</p>
            </div>
          </div>
        </section>        
      </div>
    </div>
    `
  }

  templateAdvanced() {
    return html`
    <div class=${classMap({ "modal": true, "is-active": this.buttonLoading })}>
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image is-9by4">
          <img src="${process.env.URL_BASE}/images/modern-times.gif">
        </p>
      </div>
    </div>

 
    <h6 class="subtitle is-6">${this.learningText(this._dataTypeConsumer.value.type)}</h6>
        
    <div class="columns">
      <div class="column">
        <div class="box">
          <h5 class="title is-5">${msg("Algorithm")}</h5>
          <div class="field">
            <label class="label">${msg("Choose Machine Learning Algorithm:")}</label>
            <div class="control">
              <div @click=${this.chooseAlgorithm} class="select">
                <select>
                  <option value="ann">${msg("Neural network")}</option>
                  <option value="knn">${msg("KNN")}</option>
                </select>
              </div>
            </div>
          </div>
          
          ${this.algorithm == 'ann' ?
        this.templateANNParams()
        :
        this.templateKNNParams()}

        <div class="block mt-2">
          <button @click=${this.learn} class=${classMap({ "button": true, "is-primary": true, "is-loading": this.buttonLoading })}>
            <span class="icon"><i class="fa-solid fa-gears"></i></span>
            <span>${this.learnButtonText(this._dataTypeConsumer.value.type)}</span>
          </button> 
      </div >  
        </div>
      </div>
      <div class="column">
        <div class="box">
          <h5 class="title is-5">${msg("Validation")}</h5>
          <div class="field">
            <label class="label">${msg("Percentage of samples for validation:")}</label>
            <div class="control">
              <input class="input" type="number" id="percentageforvalidation" name="percentageforvalidation" min="0" value="0" />            
            </div>
          </div>
          <div id="confusionMatrix"></div>
        </div>
      </div>
      
    </div>

  </div>     
  
  ${this.templateModalTrainedModel()}
    `;
  }

  templateBasic() {
    return html`
<div class=${classMap({ "modal": true, "is-active": this.buttonLoading })}>
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image is-9by4">
          <img src="${process.env.URL_BASE}/images/modern-times.gif">
        </p>
      </div>
    </div>

    
    <h4 class="title is-4">${msg('Learn')}</h4>    
    <h6 class="subtitle is-6">${this.learningText(this._dataTypeConsumer.value.type)}</h6>
      

      <div class="block mt-2">
        <button @click=${this.learn} class=${classMap({ "button": true, "is-fullwidth": true, "is-primary": true, "is-loading": this.buttonLoading })}>
        <span class="icon"><i class="fa-solid fa-gears"></i></span>
        <span>${this.learnButtonText(this._dataTypeConsumer.value.type)}</span>
      </button> 
    </div >

    ${this.templateModalTrainedModel()}
    `;
  }

  render() {
    return html`
    ${this.advancedMode.enabled ?
        this.templateAdvanced()
        :
        this.templateBasic()}

      `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-learn', ModelLearn);
