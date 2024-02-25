import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));
const statusContext = createContext(Symbol('status-context'));
const datasetContext = createContext(Symbol('dataset-context'));
const featuresContext = createContext(Symbol('features-context'));
const encodingContext = createContext(Symbol('text-embedding-context'));
const modelContext = createContext(Symbol('model-context'));

export { 
    configContext,
    statusContext,
    datasetContext,
    featuresContext,
    encodingContext, 
    modelContext
};
