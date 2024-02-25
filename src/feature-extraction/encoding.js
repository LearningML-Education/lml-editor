/**
 * Un extractor de características basado en Universal Sentence Encoder
 * 
 * https://www.npmjs.com/package/@tensorflow-models/universal-sentence-encoder
 */

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';


export function loadUSE(){
    return use.load();
}

export function encode(encoder, items){
    return encoder.then(model => {
        return model.embed(items);
    })
}