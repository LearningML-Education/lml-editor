import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));
const statusContext = createContext(Symbol('status-context'));
const datasetContext = createContext(Symbol('dataset-context'));
const featuresContext = createContext(Symbol('features-context'));
const textEmbeddingContext = createContext(Symbol('text-embedding'));


export { 
    configContext,
    statusContext,
    datasetContext,
    featuresContext,
    textEmbeddingContext
};
