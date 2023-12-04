import { createContext } from '@lit/context';

const configContext = createContext(Symbol('config-context'));

const langContext = createContext(Symbol('lang-context'));

export { configContext, langContext };
