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

import * as pills from './pills/pills.json';

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
    showModalTrainedModel: { type: Boolean },
    batch: { type: Number },
    acc: { type: Number },
    loss: { type: Number },
    learningPercentage: { type: Number },
    learningTime: { type: Number}
  }

  constructor() {
    super();
    this.buttonLoading = false;
    this.algorithm = "ann";
    this.showModalTrainedModel = false;
    this.batch = 0;
    this.acc = 0;
    this.loss = 0;
    this.learningPercentage = 0;
    this.learningTime = 0;
    updateWhenLocaleChanges(this);

    this.bc = new BroadcastChannel('lml-internal');
    this.bc.addEventListener('message', message => {
      if (message.data == 'requestUpdate') {
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
    if (this.notEnoughClassesToLearn()) {
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
    if (type == 'text') {
      let texts = Array.from(this._datasetConsumer.value.values()).map(set => Array.from(set)).flat();
      vocabulary = buildVocabulary(texts);
    }
    this._datasetConsumer.value.forEach((element, key) => {
      promises.push(encode(Array.from(element)).then(features => {
        this._featuresConsumer.value.set(key, features);
      }));
    });

    console.log(this._featuresConsumer.value);

    const startTime = new Date().getTime();

    Promise.all(promises).then(() => {
      function totalElementsInDataset(map) {
        let total = 0;
        for (let set of map.values()) {
          total += set.size;
        }
        return total;
      }

      let batchPerEpoch = totalElementsInDataset(this._datasetConsumer.value) / this._modelConsumer.value.hyperparams.batchSize;
      let totalIterations = batchPerEpoch * this._modelConsumer.value.hyperparams.epochs;
      let iteration = 0;
      let onBatchEnd = (batch, logs) => {
        iteration++;
        this.learningPercentage = parseInt(100 * (iteration / totalIterations));
        this.batch = batch;
        this.loss = Math.trunc(logs.loss * 1000) / 1000;
        this.acc = Math.trunc(logs.acc * 1000) / 1000;

        console.log('Batch:', batch);
        console.log('logs', logs);
      }      

      this._modelConsumer.value.train(this._featuresConsumer.value, this.percentageForValidation, onBatchEnd).then(result => {
        this.buttonLoading = false;
        console.log(result);
        return result;
      }).then(r => {
        if (this.advancedMode.enabled && this._modelConsumer.value.constructor.name == 'LMLSequential') {
          let learningHistory = this.querySelector("#learningHistory");
          learningHistory.style.display = 'block';
          let d = this._modelConsumer.value.dataForHistoryPlotly();
          Plotly.newPlot(learningHistory, d.data, d.layout);
        } else if(this.advancedMode.enabled) {
          this.querySelector("#learningHistory").style.display = 'none';
        }

        return r;
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
        setTimeout(() => { this.showModalTrainedModel = false; }, 10000);
        this.bcEditor.postMessage('updateModel');

        // Capturar el tiempo de finalización
        const endTime = new Date().getTime();

        // Calcular la duración del entrenamiento en milisegundos
        const duration = endTime - startTime;

        // Convertir la duración a un formato más legible (por ejemplo, en segundos)
        this.learningTime = (duration / 1000).toFixed(2);
        console.log(`Training completed in ${this.learningTime} seconds.`);
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

  templateModalTrainedModel() {
    const url = new URL(window.location.href);
    let locale = url.searchParams.get('locale');

    locale = (locale == null) ? 'en' : locale;

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const tipIndex = getRandomInt(1, 100);

    let pill = (locale in pills)
      ? pills[locale]['machine_learning_tips'][tipIndex]['description']
      : pills['en']['machine_learning_tips'][tipIndex]['description'];


    return html`
    <div class=${classMap({ "modal": true, "is-active": this.showModalTrainedModel })} class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">${msg("Great! The model has been trained!")}</p>
          <button @click=${() => {
        this.showModalTrainedModel = false;
      }} class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column is-one-quarter ">
              <img width="100" src="${process.env.URL_BASE}/images/cabeza_genio.png" alt="LearningML Genius">
            </div>
            <div class="column">
              <p>${msg(html`The model took <b>${this.learningTime}</b> seconds to build.`)}</p>
              <p>${msg("Now you can test it and use it in a Scratch program.")}</p>
              <hr/>
              <div class="notification">
                <p class="is-size-5"> ${msg('Did you know that...?')}</p>
                <p>${pill}</p>
              </div>              
            </div>
          </div>
        </section>        
      </div>
    </div>
    `
  }

  templateModalLearn() {
    return html`
    <div class=${classMap({ "modal": true, "is-active": this.buttonLoading })}>
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="notification">   
          ${(this.advancedMode.enabled && this._modelConsumer.value.constructor.name == 'LMLSequential')
        ? html`
            <div class="columns">
              <div class="column">
                <span class="tag is-info">Batch</span> ${this.batch}
              </div>
              <div class="column">
                <span class="tag is-info">Accuracy</span> ${this.acc}
              </div>
              <div class="column">
                <span class="tag is-info">Loss</span> ${this.loss}
              </div>
            </div> 
            `
        : html``

      }
          
          ${this._modelConsumer.value.constructor.name == 'LMLSequential'
        ? html`
            <progress class="progress is-primary" value="${this.learningPercentage}" max="100">
              ${this.learningPercentage}%
            </progress> 
            `
        : html``
      }           
          <p class="image is-9by4">
            <img src="${process.env.URL_BASE}/images/modern-times.gif">
          </p> 
        </div>
                 
      </div>
    </div>
    `
  }

  templateAdvanced() {
    return html`
    ${this.templateModalLearn()}

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
        <div id="learningHistory"></div>
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

    ${this.templateModalLearn()}
    
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
