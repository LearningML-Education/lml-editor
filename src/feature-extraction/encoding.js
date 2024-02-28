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
        let features = [];
        return encoder.then(model => {
            for (let imageB64 of items) {
                let image = document.createElement('img');
                image.src = imageB64;
                image.width = 227;
                image.height = 227;
                const t_image = tf.browser.fromPixels(image);
                const t_activation = model.infer(t_image, 'conv_preds');
                t_image.dispose();
                console.log(t_activation);
                features.push(t_activation);
            }
            return tf.reshape(tf.stack(features), [items.length ,1024]);
        });
    }
}