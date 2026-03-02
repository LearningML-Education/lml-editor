import * as tf from '@tensorflow/tfjs';
import * as client from 'lml-algorithms';

const mode = process.env.LML_ALGO_MODE || 'client';
const apiBase = process.env.LML_ALGO_BASE_URL || '';
let cachedVocabulary = null;
let webglFallbackAttempted = false;

const shouldFallbackFromWebgl = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    message.includes('failed to link vertex and fragment shaders') ||
    message.includes('context_lost_webgl') ||
    message.includes('webgl')
  );
};

const withWebglFallback = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    if (!webglFallbackAttempted && shouldFallbackFromWebgl(error)) {
      webglFallbackAttempted = true;
      try {
        await tf.setBackend('cpu');
        await tf.ready();
        console.warn('WebGL backend failed. Falling back to CPU backend.');
      } catch (backendError) {
        throw error;
      }
      return operation();
    }
    throw error;
  }
};

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage?.getItem('qr_token') || null;
};

const getStudentHeaders = () => {
  if (typeof window === 'undefined') return {};
  const studentToken = window.localStorage?.getItem('student_token');
  const sessionId = window.localStorage?.getItem('student_session_id');
  if (!studentToken || !sessionId) return {};
  return {
    'X-Student-Token': studentToken,
    'X-Student-Session': sessionId
  };
};

const notifyApiError = (message) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('lml-api-error', {
      detail: { message }
    })
  );
};

const parseErrorPayload = (text) => {
  if (!text) return { message: '' };
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed.error === 'string') {
      return { message: parsed.error };
    }
  } catch {}
  return { message: text };
};

const getUserMessageForStatus = (status, rawMessage) => {
  if (status === 429) {
    return 'Ahora mismo todos los accesos de estudiantes estan ocupados. Espera un momento y vuelve a intentarlo.';
  }
  if (status === 503) {
    return 'El servicio de algoritmos no esta disponible en este momento. Intentalo mas tarde.';
  }
  if (status === 401 || status === 403) {
    return 'Tu acceso a los algoritmos no esta activo. Inicia sesion o revisa tu suscripcion.';
  }
  if (status >= 500) {
    return 'Tenemos un problema temporal con los algoritmos. Intentalo de nuevo mas tarde.';
  }
  if (rawMessage) {
    return 'No podemos usar los algoritmos ahora mismo. Intentalo de nuevo mas tarde.';
  }
  return 'No podemos usar los algoritmos porque no hay conexion. Revisa tu red e intentalo de nuevo.';
};

const requestJson = async (path, payload) => {
  const token = getToken();
  const studentHeaders = getStudentHeaders();
  let response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!token ? studentHeaders : {})
      },
      body: JSON.stringify(payload ?? {})
    });
  } catch (error) {
    notifyApiError('No podemos conectar con los algoritmos. Revisa tu conexion e intentalo de nuevo.');
    throw error;
  }

  if (!response.ok) {
    const text = await response.text();
    const { message } = parseErrorPayload(text);
    const userMessage = getUserMessageForStatus(response.status, message);
    notifyApiError(userMessage);
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json();
};

export const buildVocabulary = async (texts) => {
  if (mode !== 'server') {
    cachedVocabulary = client.buildVocabulary(texts);
    return cachedVocabulary;
  }
  const result = await requestJson('/api/lml/v2/bow/vocabulary', { texts });
  cachedVocabulary = result.vocabulary || [];
  return cachedVocabulary;
};

export const setVocabulary = (vocabulary) => {
  cachedVocabulary = vocabulary;
  if (mode !== 'server') {
    client.setVocabulary?.(vocabulary);
  }
};

export const bowEncoder = async (texts) => {
  if (mode !== 'server') {
    return withWebglFallback(() => client.bowEncoder(texts));
  }
  const result = await requestJson('/api/lml/v2/encode/bow', {
    texts,
    vocabulary: cachedVocabulary || []
  });
  return tf.tensor(result.features);
};

export const numericalEncoder = async (items) => {
  if (mode !== 'server') {
    return withWebglFallback(() => client.numericalEncoder(items));
  }
  const result = await requestJson('/api/lml/v2/encode/numerical', { items });
  return tf.tensor(result.features);
};

export const getMobilenetEncoder = (baseUrl) => {
  if (mode !== 'server') {
    const encoder = client.getMobilenetEncoder(baseUrl);
    return async (images) => withWebglFallback(() => encoder(images));
  }
  return async (images) => {
    const result = await requestJson('/api/lml/v2/encode/image', { images });
    return tf.tensor(result.features);
  };
};

export const audioEncoder = async (samples) => {
  return withWebglFallback(() => client.audioEncoder(samples));
};

export const collectExample = (...args) => client.collectExample(...args);
export const playRawAudio = (...args) => client.playRawAudio(...args);

export const confusionMatrix = async (validationDataset, model) => {
  if (model?.getAlgorithmName?.() === 'NaiveBayes') {
    return client.confusionMatrix(validationDataset, model);
  }
  if (mode !== 'server') {
    return client.confusionMatrix(validationDataset, model);
  }
  if (!validationDataset) {
    return {};
  }
  const tensorInputs = await validationDataset.tensor_inputs.array();
  const tensorOutputs = await validationDataset.tensor_outputs.array();
  const result = await requestJson('/api/lml/v2/model/confusion-matrix', {
    algorithm: model?.getAlgorithmName?.() === 'KNN' ? 'knn' : 'sequential',
    labels: model?.labels || [],
    model: model?.serializedModel || null,
    validationDataset: {
      tensor_inputs: tensorInputs,
      tensor_outputs: tensorOutputs
    }
  });
  return result || {};
};

class ServerSequential {
  constructor() {
    this.labels = [];
    this.hyperparams = {
      learningRate: 0.001,
      batchSize: 10,
      epochs: 20
    };
    this.info = null;
    this.serializedModel = null;
    this.percentageForValidation = 0;
    this.isTrained = false;
  }

  getAlgorithmName() {
    return 'LMLSequential';
  }

  setHyperParameters(params) {
    this.hyperparams = params;
  }

  async train(features, percentageForValidation = 0, onBatchEnd = null) {
    this.percentageForValidation = percentageForValidation;
    const featuresByLabel = {};
    for (const [label, tensor] of features.entries()) {
      featuresByLabel[label] = await tensor.array();
    }

    const result = await requestJson('/api/lml/v2/model/train', {
      algorithm: 'sequential',
      featuresByLabel,
      hyperparams: this.hyperparams,
      percentageForValidation
    });

    this.labels = result.labels || [];
    this.info = result.info || null;
    this.serializedModel = result.model || null;
    this.isTrained = true;

    if (onBatchEnd && this.info?.history) {
      const epochs = this.info.epoch?.length || 1;
      const last = epochs - 1;
      onBatchEnd(epochs, {
        acc: this.info.history.acc?.[last] ?? 0,
        loss: this.info.history.loss?.[last] ?? 0
      });
    }

    let validationDataset = null;
    if (result.validationDataset) {
      validationDataset = {
        tensor_inputs: tf.tensor(result.validationDataset.tensor_inputs),
        tensor_outputs: tf.tensor(result.validationDataset.tensor_outputs)
      };
    }

    return {
      model: this,
      info: this.info,
      validationDataset
    };
  }

  async classify(inputTensor) {
    const input = await inputTensor.array();
    const result = await requestJson('/api/lml/v2/model/classify', {
      algorithm: 'sequential',
      labels: this.labels,
      model: this.serializedModel,
      input
    });
    inputTensor.dispose();
    return result.results || [];
  }

  dataForHistoryPlotly() {
    const data = [];
    if (!this.info?.epoch || !this.info?.history) {
      return { data: [], layout: {} };
    }
    const filters = this.percentageForValidation == 0 ? [true, true] : [true, true, true, true];
    const traces = ['acc', 'loss', 'val_acc', 'val_loss'];
    const activeTraces = traces.filter((_, index) => filters[index]);

    for (const trace of activeTraces) {
      const xs = [];
      const ys = [];
      for (const indexEpoch in this.info.epoch) {
        xs.push(this.info.epoch[indexEpoch]);
        ys.push(this.info.history[trace][indexEpoch]);
      }
      data.push({
        x: xs,
        y: ys,
        type: 'scatter',
        name: trace
      });
    }

    return {
      data,
      layout: {
        width: 600,
        height: 400,
        title: 'Learning evolution',
        xaxis: { title: 'Epoch' },
        yaxis: { title: 'Acc. / Loss/' }
      }
    };
  }

  async serialize() {
    return this.serializedModel;
  }

  async saveToLocalstorage(datatype, encoder) {
    const lmlModel = {
      model: this.serializedModel,
      data: datatype,
      encoder
    };
    localStorage.setItem('lmlModel', JSON.stringify(lmlModel));
    return lmlModel;
  }
}

class ServerKNN {
  constructor() {
    this.labels = [];
    this.hyperparams = { K: 3 };
    this.serializedModel = null;
    this.isTrained = false;
  }

  getAlgorithmName() {
    return 'KNN';
  }

  setHyperParameters(params) {
    this.hyperparams = params;
  }

  async train(features, percentageForValidation = 0) {
    const featuresByLabel = {};
    for (const [label, tensor] of features.entries()) {
      featuresByLabel[label] = await tensor.array();
    }

    const result = await requestJson('/api/lml/v2/model/train', {
      algorithm: 'knn',
      featuresByLabel,
      hyperparams: this.hyperparams,
      percentageForValidation
    });

    this.labels = result.labels || [];
    this.serializedModel = result.model || null;
    this.isTrained = true;

    let validationDataset = null;
    if (result.validationDataset) {
      validationDataset = {
        tensor_inputs: tf.tensor(result.validationDataset.tensor_inputs),
        tensor_outputs: tf.tensor(result.validationDataset.tensor_outputs)
      };
    }

    return {
      model: this,
      info: null,
      validationDataset
    };
  }

  async classify(inputTensor) {
    const input = await inputTensor.array();
    const result = await requestJson('/api/lml/v2/model/classify', {
      algorithm: 'knn',
      labels: this.labels,
      model: this.serializedModel,
      input
    });
    inputTensor.dispose();
    return result.results || [];
  }

  async serialize() {
    return this.serializedModel;
  }

  async saveToLocalstorage(datatype, encoder) {
    const lmlModel = {
      model: this.serializedModel,
      data: datatype,
      encoder
    };
    localStorage.setItem('lmlModel', JSON.stringify(lmlModel));
    return lmlModel;
  }
}

export const LMLSequential = mode === 'server' ? ServerSequential : client.LMLSequential;
export const KNN = mode === 'server' ? ServerKNN : client.KNN;
export const NaiveBayes = client.NaiveBayes;
