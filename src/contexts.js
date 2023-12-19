import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));
const statusContext = createContext(Symbol('status-context'));
const datasetContext = createContext(Symbol('dataset-context'));

export { configContext, statusContext, datasetContext };
