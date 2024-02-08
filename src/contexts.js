import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));
const statusContext = createContext(Symbol('status-context'));
const datasetContext = createContext(Symbol('dataset-context'));
const featuresContext = createContext(Symbol('features-context'));


export { configContext, statusContext, datasetContext, featuresContext };
