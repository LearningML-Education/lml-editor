import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));

export { configContext };
