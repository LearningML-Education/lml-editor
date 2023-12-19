import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));
const statusContext = createContext(Symbol('status-context'));


export { configContext, statusContext };
