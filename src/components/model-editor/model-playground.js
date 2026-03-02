import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import Plotly from 'plotly.js-dist-min';
import * as tf from '@tensorflow/tfjs';
import { LMLSequential, KNN, NaiveBayes } from '../../services/lml-algorithms-bridge.js';

const CLASS_LABELS = ['A', 'B', 'C'];
const CLASS_COLORS = ['#ef476f', '#06d6a0', '#118ab2'];

export class ModelPlayground extends LitElement {
  static properties = {
    initialAlgorithm: { type: String, attribute: 'initial-algorithm' },
    algorithm: { type: String },
    pattern: { type: String },
    samplesPerClass: { type: Number },
    noise: { type: Number },
    status: { type: String },
    isTraining: { type: Boolean }
  };

  constructor() {
    super();
    this.initialAlgorithm = 'ann';
    this.algorithm = 'ann';
    this.pattern = 'blobs';
    this.samplesPerClass = 60;
    this.noise = 0.12;
    this.status = '';
    this.isTraining = false;
    this.currentModel = null;
    this.datasetPoints = new Map();
    updateWhenLocaleChanges(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('initialAlgorithm') && this.initialAlgorithm) {
      this.algorithm = this.initialAlgorithm;
    }
  }

  randomNormal() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  generateBlobs() {
    const centers = [
      [-0.65, -0.5],
      [0.65, -0.5],
      [0, 0.65]
    ];
    const byLabel = new Map();
    CLASS_LABELS.forEach((label, index) => {
      const points = [];
      const [cx, cy] = centers[index];
      for (let i = 0; i < this.samplesPerClass; i++) {
        const x = cx + this.randomNormal() * this.noise;
        const y = cy + this.randomNormal() * this.noise;
        points.push([x, y]);
      }
      byLabel.set(label, points);
    });
    return byLabel;
  }

  generateCircles() {
    const radii = [
      [0.15, 0.4],
      [0.5, 0.75],
      [0.85, 1.1]
    ];
    const byLabel = new Map();
    CLASS_LABELS.forEach((label, index) => {
      const points = [];
      const [rMin, rMax] = radii[index];
      for (let i = 0; i < this.samplesPerClass; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = rMin + Math.random() * (rMax - rMin);
        const x = radius * Math.cos(angle) + this.randomNormal() * this.noise * 0.4;
        const y = radius * Math.sin(angle) + this.randomNormal() * this.noise * 0.4;
        points.push([x, y]);
      }
      byLabel.set(label, points);
    });
    return byLabel;
  }

  generateSpirals() {
    const byLabel = new Map();
    CLASS_LABELS.forEach((label, index) => {
      const points = [];
      for (let i = 0; i < this.samplesPerClass; i++) {
        const t = i / Math.max(this.samplesPerClass - 1, 1);
        const r = 0.1 + t * 1.0;
        const baseAngle = t * Math.PI * 4 + (index * 2 * Math.PI / CLASS_LABELS.length);
        const angle = baseAngle + this.randomNormal() * this.noise * 1.8;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        points.push([x, y]);
      }
      byLabel.set(label, points);
    });
    return byLabel;
  }

  generateDataset() {
    if (this.pattern === 'circles') {
      return this.generateCircles();
    }
    if (this.pattern === 'spirals') {
      return this.generateSpirals();
    }
    return this.generateBlobs();
  }

  createModelInstance() {
    if (this.algorithm === 'knn') {
      return new KNN();
    }
    if (this.algorithm === 'nb') {
      if (!NaiveBayes) {
        throw new Error('NaiveBayes export is missing from lml-algorithms.');
      }
      return new NaiveBayes();
    }
    return new LMLSequential();
  }

  applyHyperparameters(model) {
    if (this.algorithm === 'ann') {
      model.setHyperParameters({
        learningRate: parseFloat(this.querySelector('#pgLearningRate').value),
        batchSize: parseInt(this.querySelector('#pgBatchSize').value),
        epochs: parseInt(this.querySelector('#pgEpochs').value)
      });
      return;
    }
    if (this.algorithm === 'knn') {
      model.setHyperParameters({
        K: parseInt(this.querySelector('#pgK').value)
      });
      return;
    }
    model.setHyperParameters({
      varianceSmoothing: parseFloat(this.querySelector('#pgVarSmooth').value),
      classPriorSmoothing: parseFloat(this.querySelector('#pgPriorSmooth').value)
    });
  }

  async renderPlot() {
    const container = this.querySelector('#playgroundChart');
    if (!container || !this.currentModel) {
      return;
    }

    const gridSize = parseInt(this.querySelector('#pgGridSize').value);
    const min = -1.3;
    const max = 1.3;
    const step = (max - min) / (gridSize - 1);

    const gridX = [];
    const gridY = [];
    const gridClass = [];

    for (let yi = 0; yi < gridSize; yi++) {
      for (let xi = 0; xi < gridSize; xi++) {
        const x = min + (xi * step);
        const y = min + (yi * step);
        const prediction = await this.currentModel.classify(tf.tensor2d([[x, y]]));
        const topLabel = prediction[0]?.[0];
        const classIndex = Math.max(CLASS_LABELS.indexOf(topLabel), 0);
        gridX.push(x);
        gridY.push(y);
        gridClass.push(classIndex);
      }
    }

    const backgroundTrace = {
      x: gridX,
      y: gridY,
      mode: 'markers',
      type: 'scattergl',
      hoverinfo: 'skip',
      marker: {
        size: 9,
        opacity: 0.16,
        color: gridClass,
        colorscale: [
          [0, CLASS_COLORS[0]],
          [0.5, CLASS_COLORS[1]],
          [1, CLASS_COLORS[2]]
        ],
        cmin: 0,
        cmax: 2
      },
      showlegend: false
    };

    const dataTraces = CLASS_LABELS.map((label, index) => {
      const points = this.datasetPoints.get(label) || [];
      return {
        x: points.map((point) => point[0]),
        y: points.map((point) => point[1]),
        mode: 'markers',
        type: 'scattergl',
        name: label,
        marker: {
          size: 7,
          color: CLASS_COLORS[index],
          line: {
            width: 1,
            color: '#ffffff'
          }
        }
      };
    });

    const layout = {
      margin: { t: 16, r: 10, b: 40, l: 40 },
      xaxis: { range: [min, max], title: 'x' },
      yaxis: { range: [min, max], title: 'y', scaleanchor: 'x', scaleratio: 1 },
      legend: { orientation: 'h' }
    };

    await Plotly.newPlot(container, [backgroundTrace, ...dataTraces], layout, { responsive: true });
  }

  async trainPlaygroundModel() {
    this.isTraining = true;
    this.status = msg('Training model...');
    this.requestUpdate();

    try {
      this.datasetPoints = this.generateDataset();
      const features = new Map();
      this.datasetPoints.forEach((points, label) => {
        features.set(label, tf.tensor2d(points));
      });

      this.currentModel = this.createModelInstance();
      this.applyHyperparameters(this.currentModel);
      await this.currentModel.train(features, 0);
      await this.renderPlot();

      this.status = msg('Playground model trained');
    } catch (error) {
      console.error(error);
      this.status = msg('Could not train playground model');
    } finally {
      this.isTraining = false;
      this.requestUpdate();
    }
  }

  onAlgorithmChange(event) {
    this.algorithm = event.target.value;
  }

  onPatternChange(event) {
    this.pattern = event.target.value;
  }

  renderAlgorithmHyperparameters() {
    if (this.algorithm === 'ann') {
      return html`
        <div class="columns">
          <div class="column">
            <label class="label">${msg('Epochs')}</label>
            <input id="pgEpochs" class="input" type="number" min="1" value="35" />
          </div>
          <div class="column">
            <label class="label">${msg('Batch size')}</label>
            <input id="pgBatchSize" class="input" type="number" min="1" value="12" />
          </div>
          <div class="column">
            <label class="label">${msg('Learning rate')}</label>
            <input id="pgLearningRate" class="input" type="number" min="0.0001" step="0.0001" value="0.01" />
          </div>
        </div>
      `;
    }
    if (this.algorithm === 'knn') {
      return html`
        <div class="field">
          <label class="label">${msg('Number of neighbours')}</label>
          <input id="pgK" class="input" type="number" min="1" value="7" />
        </div>
      `;
    }
    return html`
      <div class="columns">
        <div class="column">
          <label class="label">${msg('Variance smoothing')}</label>
          <input id="pgVarSmooth" class="input" type="number" min="0" step="0.000000001" value="0.000000001" />
        </div>
        <div class="column">
          <label class="label">${msg('Class prior smoothing')}</label>
          <input id="pgPriorSmooth" class="input" type="number" min="0" step="0.1" value="1" />
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="columns">
        <div class="column is-4">
          <div class="box">
            <h5 class="title is-5">${msg('Playground')}</h5>
            <div class="field">
              <label class="label">${msg('Choose Machine Learning Algorithm:')}</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select .value=${this.algorithm} @change=${this.onAlgorithmChange}>
                    <option value="ann">${msg('Neural network')}</option>
                    <option value="knn">${msg('KNN')}</option>
                    <option value="nb">${msg('Naive-Bayes')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">${msg('Dataset pattern')}</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select .value=${this.pattern} @change=${this.onPatternChange}>
                    <option value="blobs">${msg('Blobs')}</option>
                    <option value="circles">${msg('Circles')}</option>
                    <option value="spirals">${msg('Spirals')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <label class="label">${msg('Samples per class')}</label>
                <input class="input" type="number" min="10" max="300" .value=${String(this.samplesPerClass)}
                  @input=${(e) => { this.samplesPerClass = parseInt(e.target.value || '60'); }} />
              </div>
              <div class="column">
                <label class="label">${msg('Noise')}</label>
                <input class="input" type="number" min="0" max="1" step="0.01" .value=${String(this.noise)}
                  @input=${(e) => { this.noise = parseFloat(e.target.value || '0.12'); }} />
              </div>
            </div>

            <div class="field">
              <label class="label">${msg('Grid resolution')}</label>
              <input id="pgGridSize" class="input" type="number" min="15" max="80" value="34" />
            </div>

            ${this.renderAlgorithmHyperparameters()}

            <div class="field mt-4">
              <button
                class=${classMap({ button: true, 'is-primary': true, 'is-loading': this.isTraining })}
                @click=${this.trainPlaygroundModel}
              >
                ${msg('Train playground model')}
              </button>
            </div>
            ${this.status ? html`<p class="is-size-7 mt-2">${this.status}</p>` : html``}
          </div>
        </div>

        <div class="column is-8">
          <div class="box">
            <div id="playgroundChart" style="min-height: 520px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-playground', ModelPlayground);
