import { ContextConsumer } from '@lit/context';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import * as tf from '@tensorflow/tfjs';
import { marked } from 'marked';
import { confusionMatrix, buildVocabulary } from '../../services/lml-algorithms-bridge.js';
import Plotly from 'plotly.js-dist-min';
import {
  dataTypeContext,
  datasetContext,
  encodingContext,
  featuresContext,
  modelContext
} from '../../contexts.js';

import * as pills from './pills/pills.json';

const algorithmHelpMdModules = import.meta.glob('./algorithm-help/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const DEFAULT_HELP_LOCALE = 'en';
const SUPPORTED_HELP_LOCALES = ['ca', 'de', 'el', 'en', 'es', 'eu', 'gl', 'it', 'nl', 'pt'];
const HELP_ALGORITHM_KEYS = {
  ann: 'neural-network',
  knn: 'knn',
  nb: 'naive-bayes'
};

marked.setOptions({
  gfm: true,
  breaks: false
});

export class ModelLearn extends LitElement {

  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext, subscribe: true });
  _featuresConsumer = new ContextConsumer(this, { context: featuresContext, subscribe: true });
  _encoderComsumer = new ContextConsumer(this, { context: encodingContext, subscribe: true });
  _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });

  bcEditor = new BroadcastChannel('lml-editor');


  static properties = {
    showModalLearn: { type: Boolean },
    algorithm: { type: String },
    advancedMode: { type: Object, attribute: 'advanced-mode' },
    modelHasBeenTrained: { type: Boolean },
    batch: { type: Number },
    acc: { type: Number },
    loss: { type: Number },
    learningPercentage: { type: Number },
    learningTime: { type: Number }
  }

  constructor() {
    super();
    this.showModalLearn = false;
    this.algorithm = "ann";
    this.modelHasBeenTrained = false;
    this.batch = 0;
    this.acc = 0;
    this.loss = 0;
    this.learningPercentage = 0;
    this.learningTime = 0;
    this.pill = null;
    updateWhenLocaleChanges(this);

    this.bc = new BroadcastChannel('lml-internal');
    this.bc.addEventListener('message', message => {
      if (message.data == 'requestUpdate') {
        this.requestUpdate();
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.handleApiError = () => {
      if (this.showModalLearn) {
        this.showModalLearn = false;
        this.modelHasBeenTrained = false;
        this.requestUpdate();
      }
    };
    window.addEventListener('lml-api-error', this.handleApiError);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.handleApiError) {
      window.removeEventListener('lml-api-error', this.handleApiError);
    }
  }

  learningText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Now it's time to learn to classify text");
      case 'image':
        return msg("Now it's time to learn to classify images");
      case 'numerical':
        return msg("Now it's time to learn to classify numbers");
      case 'audio':
        return msg("Now it's time to learn to classify sounds");
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
      case 'audio':
        return msg("Learn to recognize sounds");
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
        params['K'] = parseInt(this.querySelector("#numofneighbours").value);
        break;
      case "nb":
        params['varianceSmoothing'] = parseFloat(this.querySelector("#variancesmoothing").value);
        params['classPriorSmoothing'] = parseFloat(this.querySelector("#classpriorsmoothing").value);
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

  async learn() {
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

    this.generateNewPill();
    let type = this._dataTypeConsumer.value.type;
    let encode = this._encoderComsumer.value[type]
    this.showModalLearn = true;
    this.modelHasBeenTrained = false;
    this._featuresConsumer.value.clear();
    let vocabulary;
    if (type == 'text') {
      let texts = Array.from(this._datasetConsumer.value.values()).map(set => Array.from(set)).flat();
      vocabulary = await buildVocabulary(texts);
    }
    const extractFeatures = () => {
      const promises = [];
      this._featuresConsumer.value.clear();
      this._datasetConsumer.value.forEach((element, key) => {
        promises.push(encode(Array.from(element)).then(features => {
          console.log(features.arraySync());
          this._featuresConsumer.value.set(key, features);
        }));
      });
      return Promise.all(promises);
    };

    const isWebglError = (error) => {
      const message = (error?.message || '').toLowerCase();
      return message.includes('failed to link vertex and fragment shaders') || message.includes('context_lost_webgl');
    };

    const extractWithFallback = async () => {
      try {
        return await extractFeatures();
      } catch (error) {
        if (!isWebglError(error) || tf.getBackend?.() !== 'webgl') {
          throw error;
        }
        await tf.setBackend('cpu');
        await tf.ready();
        return extractFeatures();
      }
    };

    console.log(this._featuresConsumer.value);

    const startTime = new Date().getTime();

    extractWithFallback().then(() => {
      function totalElementsInDataset(map) {
        let total = 0;
        for (let set of map.values()) {
          total += set.size;
        }
        return total;
      }

      let onBatchEnd = null;
      if (this._modelConsumer.value.getAlgorithmName() === 'LMLSequential') {
        let batchPerEpoch = totalElementsInDataset(this._datasetConsumer.value) / this._modelConsumer.value.hyperparams.batchSize;
        let totalIterations = batchPerEpoch * this._modelConsumer.value.hyperparams.epochs;
        let iteration = 0;
        onBatchEnd = (batch, logs) => {
          iteration++;
          this.learningPercentage = parseInt(100 * (iteration / totalIterations));
          this.batch = batch;
          this.loss = Math.trunc(logs.loss * 1000) / 1000;
          this.acc = Math.trunc(logs.acc * 1000) / 1000;

          console.log('Batch:', batch);
          console.log('logs', logs);
        };
      }

      this._modelConsumer.value.train(this._featuresConsumer.value, this.percentageForValidation, onBatchEnd).then(result => {
        console.log(result);
        return result;
      }).then(r => {
        if (this.advancedMode.enabled && this._modelConsumer.value.constructor.name == 'LMLSequential') {
          let learningHistory = this.querySelector("#learningHistory");
          learningHistory.style.display = 'block';
          let d = this._modelConsumer.value.dataForHistoryPlotly();
          Plotly.newPlot(learningHistory, d.data, d.layout);
        } else if (this.advancedMode.enabled) {
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
        this.modelHasBeenTrained = true;
        this.bcEditor.postMessage('updateModel');

        // Capturar el tiempo de finalización
        const endTime = new Date().getTime();

        // Calcular la duración del entrenamiento en milisegundos
        const duration = endTime - startTime;

        // Convertir la duración a un formato más legible (por ejemplo, en segundos)
        this.learningTime = (duration / 1000).toFixed(2);
        console.log(`Training completed in ${this.learningTime} seconds.`);
        this.showModalLearn = false;
        this.requestUpdate();
      }).catch(error => {
        console.error('Training failed', error);
        this.showModalLearn = false;
        this.modelHasBeenTrained = false;
        this.learningPercentage = 0;
        this.batch = 0;
        this.acc = 0;
        this.loss = 0;
        this.learningTime = 0;
        this.requestUpdate();
      });
    }).catch(error => {
      console.error('Feature extraction failed', error);
      this.showModalLearn = false;
      this.modelHasBeenTrained = false;
      this.learningPercentage = 0;
      this.batch = 0;
      this.acc = 0;
      this.loss = 0;
      this.learningTime = 0;
      this.requestUpdate();
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

  templateNaiveBayesParams() {
    return html`
<div class="columns">
  <div class="column">
    <div class="field">
      <label class="label">${msg("Variance smoothing:")}</label>
      <div class="control">
        <input class="input" type="number" id="variancesmoothing" name="variancesmoothing" min="0" step="0.000000001" value="0.000000001" />
      </div>
    </div>
  </div>
  <div class="column">
    <div class="field">
      <label class="label">${msg("Class prior smoothing:")}</label>
      <div class="control">
        <input class="input" type="number" id="classpriorsmoothing" name="classpriorsmoothing" min="0" step="0.1" value="1" />
      </div>
    </div>
  </div>
</div>`;
  }

  getCurrentHelpLocale() {
    const url = new URL(window.location.href);
    const locale = (url.searchParams.get('locale') || DEFAULT_HELP_LOCALE).toLowerCase();
    return SUPPORTED_HELP_LOCALES.includes(locale) ? locale : DEFAULT_HELP_LOCALE;
  }

  getHelpMarkdownSource() {
    const algorithmKey = HELP_ALGORITHM_KEYS[this.algorithm] || HELP_ALGORITHM_KEYS.ann;
    const locale = this.getCurrentHelpLocale();
    const localizedPath = `./algorithm-help/${algorithmKey}.${locale}.md`;
    const defaultPath = `./algorithm-help/${algorithmKey}.${DEFAULT_HELP_LOCALE}.md`;
    return algorithmHelpMdModules[localizedPath] || algorithmHelpMdModules[defaultPath] || '';
  }

  templateAlgorithmExplanation() {
    const markdownText = this.getHelpMarkdownSource();
    const renderedHtml = marked.parse(markdownText);
    return html`<div class="content">${unsafeHTML(renderedHtml)}</div>`;
  }

  generateNewPill() {
    const url = new URL(window.location.href);
    let locale = url.searchParams.get('locale');

    locale = (locale == null) ? 'en' : locale;

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const tipIndex = getRandomInt(1, 100);

    this.pill = (locale in pills)
      ? pills[locale]['machine_learning_tips'][tipIndex]['description']
      : pills['en']['machine_learning_tips'][tipIndex]['description'];
  }

  templatePill() {

    return html`
      <div class="notification">
        <p class="is-size-5"> ${msg('Did you know that...?')}</p>
        <p>${this.pill}</p>
      </div>
      `;

  }

  templateModalLearn() {
    return html`

    <div class=${classMap({ "modal": true, "is-active": this.showModalLearn })} class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            ${this.modelHasBeenTrained
        ? html`
                ${msg("Great! The model has been trained!")}
              `
        : html`${msg("Running ML algorithm to build the model.")}`
      }
            
          </p>          
          ${this.modelHasBeenTrained
        ? html`<button @click=${() => { this.showModalLearn = false; }} class="delete" aria-label="close"></button>`
        : html``
      }
          
        </header>
        <section class="modal-card-body">
              
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

          
          ${this._modelConsumer.value.getAlgorithmName() == 'LMLSequential'
        ? html`
              <div class="has-text-centered">
                <img src="images/modern-times.gif" alt="Procesando modelo" />
              </div>
              `
        : html``
      }    
          
          ${this.templatePill()}
        </section>        
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
                <select .value=${this.algorithm}>
                  <option value="ann">${msg("Neural network")}</option>
                  <option value="knn">${msg("KNN")}</option>
                  <option value="nb">${msg("Naive-Bayes")}</option>
                </select>
              </div>
            </div>
          </div>
          
          ${this.algorithm == 'ann'
        ? this.templateANNParams()
        : this.algorithm == 'knn'
          ? this.templateKNNParams()
          : this.templateNaiveBayesParams()}

          <div class="block mt-2">
            <button @click=${this.learn} class=${classMap({ "button": true, "is-primary": true, "is-loading": this.showModalLearn })}>
              <span class="icon"><i class="fa-solid fa-gears"></i></span>
              <span>${this.learnButtonText(this._dataTypeConsumer.value.type)}</span>
            </button> 
          </div >  

          <hr />
          <h5 class="title is-5">${msg("Validation")}</h5>
          <div class="field">
            <label class="label">${msg("Percentage of samples for validation:")}</label>
            <div class="control">
              <input class="input" type="number" id="percentageforvalidation" name="percentageforvalidation" min="0" value="0" />            
            </div>
          </div>
          <div id="confusionMatrix"></div>

          ${this.modelHasBeenTrained
        ? html`
              <p class="mt-3">${msg(html`The model took <b>${this.learningTime}</b> seconds to build.`)}</p>
              <p>${msg("Now you can test it and use it in a Scratch program.")}</p>
            `
        : html``
      }
        </div>
        <div id="learningHistory"></div>
      </div>
      <div class="column">
        <div class="box">
          <h5 class="title is-5">${msg("Algorithm help")}</h5>
          ${this.templateAlgorithmExplanation()}
        </div>
      </div>
      
    </div>

  </div>     
  
    `;
  }

  templateBasic() {
    return html`

    ${this.templateModalLearn()}
    
    <h4 class="title is-4">${msg('Learn')}</h4>    
    <h6 class="subtitle is-6">${this.learningText(this._dataTypeConsumer.value.type)}</h6>
    <hr/>

      <div class="block mt-2">
        <button @click=${this.learn} class=${classMap({ "button": true, "is-fullwidth": true, "is-primary": true, "is-loading": this.showModalLearn })}>
        <span class="icon"><i class="fa-solid fa-gears"></i></span>
        <span>${this.learnButtonText(this._dataTypeConsumer.value.type)}</span>
      </button> 
    </div >
    ${this.modelHasBeenTrained
        ? html`
          <p class="mt-3">${msg(html`The model took <b>${this.learningTime}</b> seconds to build.`)}</p>
          <p>${msg("Now you can test it and use it in a Scratch program.")}</p>
        `
        : html``
    }

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
