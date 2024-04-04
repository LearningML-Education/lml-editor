import * as tf from '@tensorflow/tfjs';

function suffle(tensor_inputs, tensor_outputs) {
    let tensorInputArray = tensor_inputs.arraySync();
    let tensorLabelsArray = tensor_outputs.arraySync();
    tf.util.shuffleCombo(tensorInputArray, tensorLabelsArray);
    let _tensor_inputs = tf.tensor(tensorInputArray);
    let _tensor_outputs = tf.tensor(tensorLabelsArray);

    return [_tensor_inputs, _tensor_outputs];
}

export function splitData(inputTensor, outputTensor, splitFraction) {
    if (splitFraction <= 0 || splitFraction >= 1) return [features, null];

    let [tensor_inputs, tensor_outputs] = suffle(inputTensor, outputTensor);

    let totalNumberOfExamples = inputTensor.shape[0];
    let numberOfValidationExamples = Math.floor(totalNumberOfExamples * splitFraction);
    let numberOfDataExamples = totalNumberOfExamples - numberOfValidationExamples

    // take the  first numberOfValidationExamples for validation
    let tensor_inputs_data = tf.slice(tensor_inputs, 0, numberOfDataExamples);
    let tensor_outputs_data = tf.slice(tensor_outputs, 0, numberOfDataExamples);
    let tensor_inputs_validation = tf.slice(tensor_inputs, numberOfDataExamples, numberOfValidationExamples);
    let tensor_outputs_validation = tf.slice(tensor_outputs, numberOfDataExamples, numberOfValidationExamples);

    return [{
        tensor_inputs_data,
        tensor_outputs_data
    }, [
        tensor_inputs_validation,
        tensor_outputs_validation
    ]]
}

export function confusionMatrix(validationDataset, text_labels, model) {
    let resultsPromise = []
    let numberOfSamples = validationDataset.tensor_inputs.shape[0];
    let dimension = validationDataset.tensor_inputs.shape[1];
    for (let i = 0; i < numberOfSamples; i++) {
      resultsPromise.push(model.classify(validationDataset.tensor_inputs.gather([i])));
    }

    let classificationResults = []
    return Promise.all(resultsPromise).then(results => {
      classificationResults = results.map(r => r[0][0]);
      let realResults = validationDataset.tensor_outputs.arraySync()
        .map(r => text_labels[r.indexOf(1)]);

      validationDataset.tensor_inputs.dispose();
      validationDataset.tensor_outputs.dispose();
      let result = { text_labels: text_labels, classified: classificationResults, real: realResults };
      console.log(result);
      return result;
    });
  }
