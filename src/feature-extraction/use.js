/**
 * Un extractor de características basado en Universal Sentence Encoder
 * 
 * https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder
 */

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

/**
 * 
 * @param {String[]} sentences 
 */
export function encode(sentences) {
    console.log(tf);
    console.log(use);

    console.log("HOLA");

    return use.load()
        .then(model => {
            console.log("ADIOS");
            
            return model.embed(sentences);
        });
}