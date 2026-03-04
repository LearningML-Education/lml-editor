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
import { isSequentialModel as isSequentialModelUtil } from '../../utils/model-kind.js';


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
    percentageForValidation: { type: Number },
    learningTime: { type: Number },
    showMetricsModal: { type: Boolean },
    historyLegendItems: { type: Array },
    confusionScaleMin: { type: Number },
    confusionScaleMid: { type: Number },
    confusionScaleMax: { type: Number }
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
    this.percentageForValidation = 0;
    this.learningTime = 0;
    this.showMetricsModal = false;
    this.historyLegendItems = [];
    this.confusionScaleMin = 0;
    this.confusionScaleMid = 0;
    this.confusionScaleMax = 0;
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

    let type = this._dataTypeConsumer.value.type;
    let encode = this._encoderComsumer.value[type]
    this.showModalLearn = true;
    this.showMetricsModal = false;
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

    let learningHistoryPayload = null;
    let confusionMatrixPayload = null;

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
        if (this.advancedMode.enabled && this.isSequentialModel()) {
          learningHistoryPayload = this._modelConsumer.value.dataForHistoryPlotly();
          learningHistoryPayload.data = this.getReadableHistoryData(learningHistoryPayload.data || []);
          this.historyLegendItems = this.buildHistoryLegendItems(learningHistoryPayload.data);
        } else if (this.advancedMode.enabled) {
          learningHistoryPayload = null;
          this.historyLegendItems = [];
        }

        return r;
      }).then(r => {
        let dataForPlotly = confusionMatrix(r.validationDataset, this._modelConsumer.value)
        return dataForPlotly;
      }).then(d => {
        console.log(d);
        if (this.advancedMode.enabled && this.percentageForValidation != 0) {
          confusionMatrixPayload = {
            data: this.getReadableConfusionMatrixData(d.data || []),
            layout: this.getReadableConfusionMatrixLayout(d.layout || {})
          };
          this.extractConfusionScaleFromData(confusionMatrixPayload.data);
        } else if (this.advancedMode.enabled) {
          confusionMatrixPayload = null;
          this.confusionScaleMin = 0;
          this.confusionScaleMid = 0;
          this.confusionScaleMax = 0;
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
        if (this.advancedMode.enabled && (learningHistoryPayload || confusionMatrixPayload)) {
          this.showMetricsModal = true;
          this.requestUpdate();
          this.updateComplete.then(() => {
            if (learningHistoryPayload?.data?.length) {
              const learningHistoryFrame = this.querySelector("#learningHistoryModalFrame");
              if (learningHistoryFrame) {
                const historyLayout = this.applyLayoutSizeToContainer(
                  this.getResponsiveLearningHistoryLayout(learningHistoryPayload.layout || {}),
                  learningHistoryFrame,
                  300
                );
                this.renderPlotInIframe(
                  learningHistoryFrame,
                  learningHistoryPayload.data,
                  historyLayout
                );
              }
            }
            if (confusionMatrixPayload?.data?.length) {
              const confusionMatrixFrame = this.querySelector("#confusionMatrixModalFrame");
              if (confusionMatrixFrame) {
                const confusionLayout = this.applyLayoutSizeToContainer(
                  confusionMatrixPayload.layout,
                  confusionMatrixFrame,
                  340
                );
                this.renderPlotInIframe(
                  confusionMatrixFrame,
                  confusionMatrixPayload.data,
                  confusionLayout
                );
              }
            }
          });
        }
      }).catch(error => {
        console.error('Training failed', error);
        this.showModalLearn = false;
        this.showMetricsModal = false;
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
      this.showMetricsModal = false;
      this.modelHasBeenTrained = false;
      this.learningPercentage = 0;
      this.batch = 0;
      this.acc = 0;
      this.loss = 0;
      this.learningTime = 0;
      this.requestUpdate();
    });

  }

  getResponsiveLearningHistoryLayout(baseLayout = {}) {
    const layout = { ...baseLayout };
    delete layout.width;
    delete layout.height;
    delete layout.title;
    layout.autosize = false;
    layout.showlegend = false;
    layout.margin = { t: 24, r: 18, b: 52, l: 52 };
    layout.xaxis = { ...(layout.xaxis || {}), title: msg('Epoch'), automargin: true };
    layout.yaxis = { ...(layout.yaxis || {}), automargin: true };
    return layout;
  }

  getReadableHistoryData(data = []) {
    const colorByName = {
      acc: '#1f77b4',
      loss: '#ff7f0e',
      val_acc: '#2ca02c',
      val_loss: '#d62728'
    };
    return data.map((trace) => {
      const name = trace?.name || '';
      const color = colorByName[name] || trace?.line?.color;
      return {
        ...trace,
        line: {
          ...(trace.line || {}),
          color,
          width: 2
        }
      };
    });
  }

  buildHistoryLegendItems(data = []) {
    const labelByName = {
      acc: 'acc',
      loss: 'loss',
      val_acc: 'val_acc',
      val_loss: 'val_loss'
    };
    return data
      .filter((trace) => trace?.name)
      .map((trace) => ({
        key: trace.name,
        label: labelByName[trace.name] || trace.name,
        color: trace?.line?.color || '#64748b'
      }));
  }

  getReadableConfusionMatrixData(data = []) {
    return data.map((trace) => {
      if (trace?.type !== 'heatmap') return trace;
      const cleanedTrace = { ...trace };
      // Avoid global coloraxis behavior that can place colorbar below in some layouts.
      delete cleanedTrace.coloraxis;
      return {
        ...cleanedTrace,
        showscale: false,
        texttemplate: '%{z}',
        textfont: { size: 13, color: '#0f172a' },
        hovertemplate: '%{x} / %{y}: %{z}<extra></extra>',
        xgap: 1,
        ygap: 1
      };
    });
  }

  getReadableConfusionMatrixLayout(baseLayout = {}) {
    const layout = { ...baseLayout };
    for (const key of Object.keys(layout)) {
      if (/^(xaxis|yaxis)\d+$/.test(key)) {
        delete layout[key];
      }
    }
    delete layout.width;
    delete layout.height;
    delete layout.title;
    delete layout.grid;
    layout.autosize = false;
    layout.margin = { t: 12, r: 92, b: 48, l: 60 };
    layout.xaxis = {
      ...(layout.xaxis || {}),
      domain: [0, 0.9],
      automargin: true,
      constrain: 'domain'
    };
    layout.yaxis = {
      ...(layout.yaxis || {}),
      domain: [0, 1],
      automargin: true,
      constrain: 'domain'
    };
    delete layout.coloraxis;
    // We use heatmap texttemplate for in-cell values to avoid duplicated labels.
    layout.annotations = [];
    return layout;
  }

  extractConfusionScaleFromData(data = []) {
    const heatmap = data.find((trace) => trace?.type === 'heatmap');
    const z = heatmap?.z || [];
    const values = z
      .flat()
      .map((v) => Number(v))
      .filter((v) => Number.isFinite(v));
    if (!values.length) {
      this.confusionScaleMin = 0;
      this.confusionScaleMid = 0;
      this.confusionScaleMax = 0;
      return;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    this.confusionScaleMin = min;
    this.confusionScaleMax = max;
    this.confusionScaleMid = (min + max) / 2;
  }

  formatScaleValue(value) {
    if (!Number.isFinite(value)) return '0';
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(2).replace(/\.00$/, '');
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

  isSequentialModel() {
    return isSequentialModelUtil(this._modelConsumer.value);
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
    const algorithmName = this.currentAlgorithmName();
    return html`
      <div class="content">${unsafeHTML(renderedHtml)}</div>
      <p class="mt-4">
        <a href="#" @click=${this.openPlayground}>${msg(html`Learn about ${algorithmName} on ML playground`)}</a>
      </p>
    `;
  }

  currentAlgorithmName() {
    if (this.algorithm === 'knn') return msg("KNN");
    if (this.algorithm === 'nb') return msg("Naive-Bayes");
    return msg("Neural network");
  }

  openPlayground(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('open-playground', {
      bubbles: true,
      composed: true,
      detail: {
        algorithm: this.algorithm
      }
    }));
  }

  templatePill() {
    return html`
      <div class="has-text-centered" style="display:flex;justify-content:center;align-items:center;min-height:320px;">
        <img
          src="images/modern-times.gif"
          alt="Worker inside gears from Modern Times"
          style="max-width:100%;max-height:360px;width:auto;height:auto;object-fit:contain;"
        />
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
              
          ${(this.advancedMode.enabled && this.isSequentialModel())
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

          
          ${this.templatePill()}
        </section>        
      </div>
    </div>
    `
  }

  closeMetricsModal() {
    this.showMetricsModal = false;
  }

  serializeForIframeScript(value) {
    return JSON.stringify(value).replace(/</g, '\\u003c');
  }

  buildPlotIframeDoc(data, layout) {
    const dataJson = this.serializeForIframeScript(data);
    const layoutJson = this.serializeForIframeScript(layout);
    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff;
      }
      #plot {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="plot"></div>
    <script>
      (function () {
        const Plotly = parent.__lmlPlotly;
        const plot = document.getElementById('plot');
        const data = ${dataJson};
        const layout = ${layoutJson};
        if (!Plotly || !plot) return;

        function draw() {
          const width = Math.max(320, Math.floor(plot.clientWidth || 640));
          const height = Math.max(220, Math.floor(plot.clientHeight || 300));
          const sizedLayout = Object.assign({}, layout, { width, height, autosize: false });
          Plotly.newPlot(plot, data, sizedLayout, { responsive: true, displayModeBar: false });
        }

        draw();
        if (window.ResizeObserver) {
          const ro = new ResizeObserver(function () {
            Plotly.Plots.resize(plot);
          });
          ro.observe(document.body);
        } else {
          window.addEventListener('resize', function () { Plotly.Plots.resize(plot); });
        }
      })();
    </script>
  </body>
</html>`;
  }

  renderPlotInIframe(iframe, data, layout) {
    if (!iframe) return;
    window.__lmlPlotly = Plotly;
    iframe.srcdoc = this.buildPlotIframeDoc(data, layout);
  }

  applyLayoutSizeToContainer(layout, container, fallbackHeight = 260) {
    if (!container) return layout;
    const rect = container.getBoundingClientRect();
    const sizedLayout = { ...layout };
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    sizedLayout.width = width > 0 ? width : 640;
    sizedLayout.height = height > 0 ? height : fallbackHeight;
    sizedLayout.autosize = false;
    return sizedLayout;
  }

  templateMetricsModal() {
    return html`
      <div class=${classMap({ "modal": true, "is-active": this.showMetricsModal })}>
        <div class="modal-background" @click=${this.closeMetricsModal}></div>
        <div class="modal-card" style="width:min(1200px,96vw);max-width:min(1200px,96vw);">
          <header class="modal-card-head">
            <p class="modal-card-title">${msg("Training charts")}</p>
            <button class="delete" aria-label="close" @click=${this.closeMetricsModal}></button>
          </header>
          <section class="modal-card-body">
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              ${this.isSequentialModel() ? html`
                <div>
                  <h6 class="title is-6 mb-2">${msg("Learning curves")}</h6>
                  <iframe
                    id="learningHistoryModalFrame"
                    title="${msg("Learning curves")}"
                    style="width:100%;height:min(42vh,360px);border:0;background:#fff;"
                  ></iframe>
                  ${this.historyLegendItems.length
                    ? html`
                      <div style="display:flex;gap:0.9rem;flex-wrap:wrap;align-items:center;font-size:0.78rem;line-height:1.2;margin-top:0.35rem;">
                        ${this.historyLegendItems.map((item) => html`
                          <span style="display:inline-flex;align-items:center;gap:0.35rem;">
                            <span style="width:14px;height:3px;background:${item.color};border-radius:3px;"></span>
                            <span>${item.label}</span>
                          </span>
                        `)}
                      </div>
                    `
                    : html``}
                </div>
              ` : html``}
              ${this.percentageForValidation != 0 ? html`
                <div>
                  <h6 class="title is-6 mb-2">${msg("Confusion matrix")}</h6>
                  <div style="display:flex;align-items:flex-start;gap:0.65rem;">
                    <iframe
                      id="confusionMatrixModalFrame"
                      title="${msg("Confusion matrix")}"
                      style="flex:1;width:auto;height:min(44vh,400px);border:0;background:#fff;"
                    ></iframe>
                    <div style="width:34px;display:flex;align-items:flex-start;justify-content:center;gap:0.2rem;padding-top:12px;">
                      <div style="width:12px;height:calc(min(44vh,400px) - 88px);border:1px solid #9ca3af;background:linear-gradient(to top,#005a32 0%,#238b45 45%,#74c476 70%,#e5f5e0 100%);"></div>
                      <div style="height:calc(min(44vh,400px) - 88px);display:flex;flex-direction:column;justify-content:space-between;font-size:0.72rem;color:#374151;">
                        <span>${this.formatScaleValue(this.confusionScaleMax)}</span>
                        <span>${this.formatScaleValue(this.confusionScaleMid)}</span>
                        <span>${this.formatScaleValue(this.confusionScaleMin)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ` : html``}
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button" @click=${this.closeMetricsModal}>${msg("Close")}</button>
          </footer>
        </div>
      </div>
    `;
  }

  templateAdvanced() {
    return html`
    <style>
      .advanced-learn-section {
        margin-top: 1rem;
      }
      .advanced-chart {
        width: 100%;
        min-height: 320px;
      }
      .advanced-summary {
        margin-top: 1rem;
        padding-top: 0.75rem;
        border-top: 1px solid #e5e7eb;
      }
    </style>
    ${this.templateModalLearn()}
    ${this.templateMetricsModal()}

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

          <div class="field">
            <label class="label">${msg("Percentage of samples for validation:")}</label>
            <div class="control">
              <input
                id="percentageforvalidation"
                name="percentageforvalidation"
                type="range"
                min="0"
                max="100"
                step="1"
                .value=${String(this.percentageForValidation)}
                @input=${(e) => { this.percentageForValidation = e.target.valueAsNumber; }}
                style="width:100%;"
              />
            </div>
            <p class="help">${this.percentageForValidation}%</p>
          </div>

          <div class="block mt-2">
            <button @click=${this.learn} class=${classMap({ "button": true, "is-primary": true, "is-loading": this.showModalLearn })}>
              <span class="icon"><i class="fa-solid fa-gears"></i></span>
              <span>${this.learnButtonText(this._dataTypeConsumer.value.type)}</span>
            </button> 
          </div >  

          <hr />

          ${this.modelHasBeenTrained
            ? html`
              <div class="advanced-summary">
                <p>${msg(html`The model took <b>${this.learningTime}</b> seconds to build.`)}</p>
                <p>${msg("Now you can test it and use it in a Scratch program.")}</p>
                <div class="mt-3">
                  <button class="button is-light is-small" @click=${() => { this.showMetricsModal = true; }}>
                    ${msg("View training charts")}
                  </button>
                </div>
              </div>
            `
            : html``
          }
        </div>
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
    // Keep this component in Light DOM because Plotly autosize/legend/colorbar
    // rendering is significantly more stable outside Shadow DOM.
    return this;
  }
}

window.customElements.define('model-learn', ModelLearn);
