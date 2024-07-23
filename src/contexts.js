import { createContext } from '@lit/context';

const dataTypeContext = createContext(Symbol('datatype-context'));
const datasetContext = createContext(Symbol('dataset-context'));
const featuresContext = createContext(Symbol('features-context'));
const encodingContext = createContext(Symbol('text-embedding-context'));
const modelContext = createContext(Symbol('model-context'));

export { 
    dataTypeContext,
    datasetContext,
    featuresContext,
    encodingContext, 
    modelContext
};
