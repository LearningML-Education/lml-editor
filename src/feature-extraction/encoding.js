/**
 * Extractor de características basado en Universal Sentence Encoder
 * 
 * https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder
 */

import * as tf from '@tensorflow/tfjs';

export function encode(modelEditor, encoder, items) {

    if (modelEditor == 'text') {
        return encoder.then(model => {
            return model.embed(items);
        })

    } else if (modelEditor == 'image') {
        let promises = [];
        return encoder.then(model => {
            for (let imageB64 of items) {
                promises.push(new Promise((resolve, reject) => {
                    let image = document.createElement('img');
                    image.src = imageB64;
                    image.width = 227;
                    image.height = 227;
                    image.onload = () => {
                        const t_image = tf.browser.fromPixels(image);
                        const t_activation = model.infer(t_image, 'conv_preds');
                        t_image.dispose();
                        console.log(t_activation);
                        resolve(t_activation);
                    }
                }));
            }

            return Promise.all(promises).then( features => {
                return tf.reshape(tf.stack(features), [items.length, 1024]);
            });
        });
    }
}