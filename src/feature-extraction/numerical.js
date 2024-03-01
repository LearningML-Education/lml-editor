import * as tf from '@tensorflow/tfjs';

export function numericalEncoder() {
    return Promise.resolve({
        embed: (items) => new Promise((resolve, reject) => {
            let features = [];
            for (let csv of items) {
                features.push(csv.split(",").map(v => parseFloat(v)));
            }
            resolve(tf.stack(features));
        })
    });
} 