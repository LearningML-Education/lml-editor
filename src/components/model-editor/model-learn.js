import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { confusionMatrix } from '../../algorithms/util.js';
import {
  statusContext,
  datasetContext,
  featuresContext,
  encodingContext,
  modelContext
} from '../../contexts.js';
import { classMap } from 'lit/directives/class-map.js';
import Plotly from 'plotly.js-dist-min'

export class ModelLearn extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });
  _datasetConsumer = new ContextConsumer(this, { context: datasetContext });
  _featuresConsumer = new ContextConsumer(this, { context: featuresContext });
  _encoderComsumer = new ContextConsumer(this, { context: encodingContext });
  _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });


  static properties = {
    buttonLoading: { type: Boolean },
    algorithm: { type: String },
    advancedMode: { type: Object, attribute: 'advanced-mode' }
  }

  firstUpdated() {

    let gd = this.querySelector("#gd");
  
    
    var trace1 = {
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      y: [20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
      type: 'bar',
      name: 'Primary Product',
      marker: {
        color: 'rgb(49,130,189)',
        opacity: 0.7,
      }
    };

    var trace2 = {
      x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      y: [19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
      type: 'bar',
      name: 'Secondary Product',
      marker: {
        color: 'rgb(204,204,204)',
        opacity: 0.5
      }
    };

    var data = [trace1, trace2];

    var layout = {
      title: '2013 Sales Report',
      xaxis: {
        tickangle: -45
      },
      barmode: 'group',
    };

    Plotly.newPlot(gd, data, layout);
  }

  constructor() {
    super();
    this.buttonLoading = false;
    this.algorithm = "ann";
    updateWhenLocaleChanges(this);
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

  learn() {
    console.log(this.algorithm);
    if (this.advancedMode.enabled) {
      this._modelConsumer.value.setHyperParameters(this.getHyperParameters());
    }

    this.percentageForValidation = parseInt(this.querySelector("#percentageforvalidation").value || 0);

    console.log(`porcentaje validación ${this.percentageForValidation}`)

    let promises = [];
    let modelEditor = this._statusConsumer.value.modelEditor;
    let encode = this._encoderComsumer.value[modelEditor]
    this.buttonLoading = true;
    this._datasetConsumer.value.forEach((element, key) => {
      promises.push(encode(Array.from(element)).then(features => {
        this._featuresConsumer.value.set(key, features);
      }));
    });

    console.log(this._featuresConsumer.value);

    Promise.all(promises).then(() => {
      this._modelConsumer.value.train(this._featuresConsumer.value, this.percentageForValidation).then(result => {
        this.buttonLoading = false;
        let cm;
        if (this.percentageForValidation != 0) {
          let text_labels = Array.from(this._featuresConsumer.value.keys());
          confusionMatrix(result.validationDataset, text_labels, this._modelConsumer.value)
        }
        console.log(result);
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

  render() {
    return html`

<div id="gd"></div>


    <div class=${classMap({ "modal": true, "is-active": this.buttonLoading })}>
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image is-9by4">
          <img src="/images/robot.gif">
        </p>
      </div>
    </div>

    
    <h4 class="title is-4">${msg('Learn')}</h4>    
    <h6 class="subtitle is-6">${this.learningText(this._statusConsumer.value.modelEditor)}</h6>
    
    <div ?hidden=${!this.advancedMode.enabled}>
      <h4 class="title is-4 mt-2">${msg("Advanced mode")}</h4>
      
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
        </div>
      
        <div class="box">
          <h5 class="title is-5">${msg("Validation")}</h5>
          <div class="field">
            <label class="label">${msg("Percentage of samples for validation:")}</label>
            <div class="control">
              <input class="input" type="number" id="percentageforvalidation" name="percentageforvalidation" min="0" value="0" />            
            </div>
          </div>
        </div>
              
    </div >

      <div class="block mt-2">
        <button @click=${this.learn} class=${classMap({ "button": true, "is-fullwidth": true, "is-primary": true, "is-loading": this.buttonLoading })}>
        <span class="icon"><i class="fa-solid fa-gears"></i></span>
        <span>${this.learnButtonText(this._statusConsumer.value.modelEditor)}</span>
      </button> 
    </div >

      `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-learn', ModelLearn);
