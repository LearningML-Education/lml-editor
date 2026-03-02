import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import Plotly from 'plotly.js-dist-min';
import * as tf from '@tensorflow/tfjs';
import { LMLSequential, KNN, NaiveBayes } from '../../services/lml-algorithms-bridge.js';

const BASE_CLASS_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const BASE_CLASS_COLORS = ['#ef476f', '#06d6a0', '#118ab2', '#ffd166', '#073b4c', '#f78c6b', '#8ecae6', '#95d5b2'];

export class ModelPlayground extends LitElement {
  static properties = {
    initialAlgorithm: { type: String, attribute: 'initial-algorithm' },
    algorithm: { type: String },
    datasetMode: { type: String },
    pattern: { type: String },
    classCount: { type: Number },
    selectedDrawClass: { type: Number },
    samplesPerClass: { type: Number },
    noise: { type: Number },
    status: { type: String },
    isTraining: { type: Boolean }
  };

  constructor() {
    super();
    this.initialAlgorithm = 'ann';
    this.algorithm = 'ann';
    this.datasetMode = 'auto';
    this.pattern = 'blobs';
    this.classCount = 3;
    this.selectedDrawClass = 0;
    this.samplesPerClass = 60;
    this.noise = 0.12;
    this.status = '';
    this.isTraining = false;
    this.currentModel = null;
    this.datasetPoints = new Map();
    this.modelVersion = 0;
    this.plotClickListener = this.onPlotClick.bind(this);
    updateWhenLocaleChanges(this);
  }

  updated(changedProperties) {
    if (changedProperties.has('initialAlgorithm') && this.initialAlgorithm) {
      this.algorithm = this.initialAlgorithm;
    }
  }

  firstUpdated() {
    this.updateDatasetPreview();
  }

  randomNormal() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  getActiveClassLabels() {
    const count = Math.min(Math.max(this.classCount || 3, 2), BASE_CLASS_LABELS.length);
    return BASE_CLASS_LABELS.slice(0, count);
  }

  getClassColor(index) {
    return BASE_CLASS_COLORS[index % BASE_CLASS_COLORS.length];
  }

  getEmptyDataset() {
    const byLabel = new Map();
    this.getActiveClassLabels().forEach((label) => byLabel.set(label, []));
    return byLabel;
  }

  getDiscreteColorscale(classLabels) {
    if (classLabels.length === 1) {
      const color = this.getClassColor(0);
      return [[0, color], [1, color]];
    }

    const scale = [];
    classLabels.forEach((_, index) => {
      const color = this.getClassColor(index);
      const start = index / classLabels.length;
      const end = (index + 1) / classLabels.length;
      scale.push([start, color]);
      scale.push([Math.max(start, end - Number.EPSILON), color]);
    });
    return scale;
  }

  generateBlobs() {
    const classLabels = this.getActiveClassLabels();
    const centers = classLabels.map((_, index) => {
      const angle = (index * 2 * Math.PI) / classLabels.length;
      const radius = 0.75;
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    });
    const byLabel = new Map();
    classLabels.forEach((label, index) => {
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
    const classLabels = this.getActiveClassLabels();
    const minRadius = 0.15;
    const maxRadius = 1.1;
    const radiusStep = (maxRadius - minRadius) / classLabels.length;
    const byLabel = new Map();
    classLabels.forEach((label, index) => {
      const points = [];
      const rMin = minRadius + (radiusStep * index);
      const rMax = rMin + radiusStep;
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
    const classLabels = this.getActiveClassLabels();
    const byLabel = new Map();
    classLabels.forEach((label, index) => {
      const points = [];
      for (let i = 0; i < this.samplesPerClass; i++) {
        const t = i / Math.max(this.samplesPerClass - 1, 1);
        const r = 0.1 + t * 1.0;
        const baseAngle = t * Math.PI * 4 + (index * 2 * Math.PI / classLabels.length);
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

  getPointTraces() {
    const classLabels = this.getActiveClassLabels();
    return classLabels.map((label, index) => {
      const points = this.datasetPoints.get(label) || [];
      return {
        x: points.map((point) => point[0]),
        y: points.map((point) => point[1]),
        mode: 'markers',
        type: 'scattergl',
        name: label,
        marker: {
          size: 7,
          color: this.getClassColor(index),
          line: {
            width: 1,
            color: '#ffffff'
          }
        }
      };
    });
  }

  getBaseLayout(min = -1.3, max = 1.3) {
    return {
      margin: { t: 16, r: 10, b: 40, l: 40 },
      xaxis: { range: [min, max], title: 'x' },
      yaxis: { range: [min, max], title: 'y', scaleanchor: 'x', scaleratio: 1 },
      legend: { orientation: 'h' }
    };
  }

  async renderDatasetPreview() {
    const container = this.querySelector('#playgroundChart');
    if (!container) {
      return;
    }
    const layout = this.getBaseLayout();
    layout.dragmode = false;
    await Plotly.newPlot(container, this.getPointTraces(), layout, { responsive: true, displayModeBar: false });
    this.bindDrawingEvents(container);
  }

  async updateDatasetPreview() {
    this.currentModel = null;
    if (this.datasetMode === 'draw') {
      this.datasetPoints = this.getEmptyDataset();
    } else {
      this.datasetPoints = this.generateDataset();
    }
    await this.renderDatasetPreview();
  }

  bindDrawingEvents(container) {
    container.removeEventListener('click', this.plotClickListener);
    if (this.datasetMode === 'draw') {
      container.addEventListener('click', this.plotClickListener);
    }
  }

  onPlotClick(event) {
    if (this.datasetMode !== 'draw') {
      return;
    }

    const container = this.querySelector('#playgroundChart');
    const fullLayout = container?._fullLayout;
    const xAxis = fullLayout?.xaxis;
    const yAxis = fullLayout?.yaxis;
    if (!container || !xAxis || !yAxis) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const left = xAxis._offset;
    const right = left + xAxis._length;
    const top = yAxis._offset;
    const bottom = top + yAxis._length;
    if (px < left || px > right || py < top || py > bottom) {
      return;
    }

    const x = xAxis.p2l(px - xAxis._offset);
    const y = yAxis.p2l(py - yAxis._offset);
    const labels = this.getActiveClassLabels();
    const selectedIndex = Math.min(Math.max(this.selectedDrawClass, 0), labels.length - 1);
    const selectedLabel = labels[selectedIndex];
    if (!selectedLabel) {
      return;
    }

    const nextDataset = new Map(this.datasetPoints);
    const currentPoints = nextDataset.get(selectedLabel) || [];
    nextDataset.set(selectedLabel, [...currentPoints, [x, y]]);
    this.datasetPoints = nextDataset;
    this.currentModel = null;
    this.renderDatasetPreview();
  }

  async renderPlot() {
    const container = this.querySelector('#playgroundChart');
    if (!container || !this.currentModel) {
      return;
    }
    const classLabels = this.currentModel?.labels || this.getActiveClassLabels();
    const colorscale = this.getDiscreteColorscale(classLabels);

    const gridSize = this.algorithm === 'knn' ? 50 : 72;
    const min = -1.3;
    const max = 1.3;
    const step = (max - min) / (gridSize - 1);
    const axisValues = Array.from({ length: gridSize }, (_, i) => min + (i * step));
    const gridPoints = [];
    for (let yi = 0; yi < gridSize; yi++) {
      for (let xi = 0; xi < gridSize; xi++) {
        const x = min + (xi * step);
        const y = min + (yi * step);
        gridPoints.push([x, y]);
      }
    }
    const flatDecisionZones = await this.predictGridClassIndexes(gridPoints);
    const decisionZones = [];
    for (let yi = 0; yi < gridSize; yi++) {
      const start = yi * gridSize;
      decisionZones.push(flatDecisionZones.slice(start, start + gridSize));
    }

    const zoneTrace = {
      x: axisValues,
      y: axisValues,
      z: decisionZones,
      type: 'heatmap',
      hoverinfo: 'skip',
      zmin: 0,
      zmax: classLabels.length - 1,
      opacity: 0.35,
      showscale: false,
      colorscale
    };

    const boundaryTrace = {
      x: axisValues,
      y: axisValues,
      z: decisionZones,
      type: 'contour',
      hoverinfo: 'skip',
      showscale: false,
      contours: {
        coloring: 'none',
        showlines: true,
        start: 0.5,
        end: classLabels.length - 1.5,
        size: 1
      },
      line: {
        width: 2,
        color: '#073b4c'
      }
    };

    await Plotly.newPlot(container, [zoneTrace, boundaryTrace, ...this.getPointTraces()], this.getBaseLayout(min, max), { responsive: true });
  }

  predictNaiveBayesClassIndex(point) {
    const modelData = this.currentModel?.model;
    if (!modelData) return 0;
    const labels = this.currentModel?.labels || this.getActiveClassLabels();
    const classCount = labels.length;
    const varianceSmoothing = Number(this.currentModel?.hyperparams?.varianceSmoothing) || 0;
    const classPriorSmoothing = Number(this.currentModel?.hyperparams?.classPriorSmoothing) || 0;
    const denominatorPrior = modelData.totalExamples + (classPriorSmoothing * classCount);
    const logScores = new Array(classCount).fill(0);

    for (let c = 0; c < classCount; c++) {
      const priorNumerator = modelData.counts[c] + classPriorSmoothing;
      const prior = denominatorPrior > 0 ? priorNumerator / denominatorPrior : 0;
      let logScore = Math.log(prior || Number.EPSILON);
      for (let d = 0; d < modelData.featureDim; d++) {
        const mean = modelData.means[c][d];
        const variance = modelData.variances[c][d] + varianceSmoothing + Number.EPSILON;
        const diff = point[d] - mean;
        logScore += -0.5 * Math.log(2 * Math.PI * variance) - ((diff * diff) / (2 * variance));
      }
      logScores[c] = logScore;
    }

    let bestIndex = 0;
    let bestScore = logScores[0];
    for (let i = 1; i < logScores.length; i++) {
      if (logScores[i] > bestScore) {
        bestScore = logScores[i];
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  async predictGridClassIndexes(gridPoints) {
    const labelSet = this.currentModel?.labels || this.getActiveClassLabels();
    const labelToIndex = new Map(labelSet.map((label, index) => [label, index]));

    if (this.currentModel?.getAlgorithmName?.() === 'LMLSequential' && this.currentModel?.model?.predict) {
      return tf.tidy(() => {
        const input = tf.tensor2d(gridPoints);
        const prediction = this.currentModel.model.predict(input);
        return Array.from(prediction.argMax(-1).dataSync());
      });
    }

    if (this.currentModel?.getAlgorithmName?.() === 'NaiveBayes') {
      return gridPoints.map((point) => this.predictNaiveBayesClassIndex(point));
    }

    const results = new Array(gridPoints.length).fill(0);
    const chunkSize = 120;
    for (let offset = 0; offset < gridPoints.length; offset += chunkSize) {
      const chunk = gridPoints.slice(offset, offset + chunkSize);
      const chunkPromises = chunk.map(async (point) => {
        const prediction = await this.currentModel.classify(tf.tensor2d([point]));
        const topLabel = prediction[0]?.[0];
        return labelToIndex.has(topLabel) ? labelToIndex.get(topLabel) : 0;
      });
      const chunkResults = await Promise.all(chunkPromises);
      for (let i = 0; i < chunkResults.length; i++) {
        results[offset + i] = chunkResults[i];
      }
    }
    return results;
  }

  async trainPlaygroundModel() {
    this.isTraining = true;
    this.status = msg('Training model...');
    this.requestUpdate();

    try {
      if (this.datasetMode === 'draw') {
        const missingClass = this.getActiveClassLabels().find((label) => (this.datasetPoints.get(label) || []).length === 0);
        if (missingClass) {
          throw new Error(`Class ${missingClass} has no samples`);
        }
      }

      const features = new Map();
      this.datasetPoints.forEach((points, label) => {
        features.set(label, tf.tensor2d(points));
      });

      this.currentModel = this.createModelInstance();
      this.applyHyperparameters(this.currentModel);
      await this.currentModel.train(features, 0);
      this.modelVersion += 1;
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
    this.updateDatasetPreview();
  }

  onDatasetModeChange(event) {
    this.datasetMode = event.target.value;
    this.selectedDrawClass = 0;
    this.updateDatasetPreview();
  }

  onSamplesPerClassInput(event) {
    this.samplesPerClass = parseInt(event.target.value || '60');
    if (this.datasetMode === 'auto') {
      this.updateDatasetPreview();
    }
  }

  onNoiseInput(event) {
    this.noise = parseFloat(event.target.value || '0.12');
    if (this.datasetMode === 'auto') {
      this.updateDatasetPreview();
    }
  }

  onClassCountInput(event) {
    this.classCount = parseInt(event.target.value || '3');
    this.selectedDrawClass = 0;
    this.updateDatasetPreview();
  }

  onDrawClassSelect(event) {
    this.selectedDrawClass = parseInt(event.target.value);
  }

  onClearDrawPoints() {
    this.datasetPoints = this.getEmptyDataset();
    this.currentModel = null;
    this.renderDatasetPreview();
  }

  renderDrawClassButtons() {
    const classLabels = this.getActiveClassLabels();
    return html`
      <div class="field">
        <label class="label">${msg('Active class')}</label>
        <div class="buttons">
          ${classLabels.map((label, index) => {
            const isSelected = this.selectedDrawClass === index;
            const bgColor = this.getClassColor(index);
            const selectedStyle = isSelected
              ? 'box-shadow: 0 0 0 3px rgba(7,59,76,0.35); transform: translateY(-1px);'
              : 'opacity: 0.9;';
            return html`
            <button
              class=${classMap({ button: true })}
              style=${`background:${bgColor};color:#ffffff;border:2px solid ${isSelected ? '#073b4c' : bgColor};${selectedStyle}`}
              value=${index}
              @click=${this.onDrawClassSelect}
              type="button"
              aria-pressed=${isSelected ? 'true' : 'false'}
            >
              ${isSelected ? `✓ ${label}` : label}
            </button>
            `;
          })}
        </div>
        <button class="button is-light mt-2" type="button" @click=${this.onClearDrawPoints}>
          ${msg('Clear')}
        </button>
      </div>
    `;
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
            <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
              <h5 class="title is-5 mb-0">${msg('Playground')}</h5>
              <button class="button is-light is-small" type="button" @click=${this.onBackToEditor}>
                ${msg('Back')}
              </button>
            </div>
            <div class="field">
              <label class="label">${msg('Dataset source')}</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select .value=${this.datasetMode} @change=${this.onDatasetModeChange}>
                    <option value="auto">${msg('Generate automatically')}</option>
                    <option value="draw">${msg('Draw data')}</option>
                  </select>
                </div>
              </div>
            </div>

            ${this.datasetMode === 'auto' ? html`
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
            ` : html``}

            <div class="columns">
              <div class="column">
                <label class="label">${msg('Number of classes')}</label>
                <input class="input" type="number" min="2" max="8" .value=${String(this.classCount)} @input=${this.onClassCountInput} />
              </div>
              ${this.datasetMode === 'auto' ? html`
              <div class="column">
                <label class="label">${msg('Samples per class')}</label>
                <input class="input" type="number" min="10" max="300" .value=${String(this.samplesPerClass)} @input=${this.onSamplesPerClassInput} />
              </div>
              <div class="column">
                <label class="label">${msg('Noise')}</label>
                <input class="input" type="number" min="0" max="1" step="0.01" .value=${String(this.noise)} @input=${this.onNoiseInput} />
              </div>
              ` : html``}
            </div>

            ${this.datasetMode === 'draw' ? this.renderDrawClassButtons() : html``}

            <div class="field mt-3">
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

  onBackToEditor() {
    this.dispatchEvent(new CustomEvent('back-to-editor', {
      bubbles: true,
      composed: true
    }));
  }
}

window.customElements.define('model-playground', ModelPlayground);
