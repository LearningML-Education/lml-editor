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
  if(!validationDataset){
    return Promise.resolve({});
  }

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
    
    let validationData = { text_labels: text_labels, classified: classificationResults, real: realResults };
    console.log(validationData);

    let multi = [];
    for (let label of validationData.text_labels) {

      let series = [];

      for (let label2 of validationData.text_labels) {

        let numberOfLabel1ClassifiedAsLabel2 = validationData
          .real.map((v, i) => v == label && label2 == validationData.classified[i])
          .reduce((previous, current) => previous + current)

        series.push(numberOfLabel1ClassifiedAsLabel2);

      }
      multi.push(series);
    }

    let annotations = [];
    for (let i = 0; i < validationData.text_labels.length; i++) {
      for (let j = 0; j < validationData.text_labels.length; j++) {
        var textColor = 'red';

        var result = {
          xref: 'real',
          yref: 'classified',
          x: validationData.text_labels[i],
          y: validationData.text_labels[j],
          text: multi[i][j],
          font: {
            family: 'Arial',
            size: 12,
            color: textColor
          },
          showarrow: false,

        };
        annotations.push(result);
      }
    }

    let transpose = m => m[0].map((x,i) => m.map(x => x[i]));

    let data = [
      {
        //z: [[1, 20, 30], [20, 1, 60], [30, 60, 1]],
        z: transpose(multi),
        x: validationData.text_labels,
        // para que no se haga el reverse in place
        y: validationData.text_labels,
        type: 'heatmap',
        colorscale: 'Greens'
      }
    ];

    let dataForPlotly = {
      data: data,
      layout: {
        width: 600,
        height: 400,
        title: 'Confusion matrix',
        annotations: annotations
      }
    };

    console.log(dataForPlotly);

    return dataForPlotly;
  });
}
