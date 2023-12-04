import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider }  from '@lit/context';
import { configContext } from './contexts';
import './main-menu/main-menu';

// Configuration is loaded
const configLoaderPromise = configLoader();

class LMLApp extends LitElement {

    static properties = {
        loading: { type: Boolean },
    };

    constructor() {
        super();
        this.loading = true;
        this.configProvider = new ContextProvider(this, {context: configContext});
        
        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.loading = false;
                this.configProvider.setValue(config);
            }, 1000)

        });
    }

    render() {
        return html`
        ${this.loading ? 
            html`Cargando ...` 
            :
            html`<main-menu></main-menu>`}
        `;
    }

    createRenderRoot() {
        return this;
    }

}
customElements.define('lml-app', LMLApp);
