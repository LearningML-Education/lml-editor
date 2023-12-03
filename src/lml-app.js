import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider }  from '@lit/context';
import { appContext } from './appContext';
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
        this.contextProvider = new ContextProvider(this, {context: appContext});

        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.loading = false;
                this.contextProvider.setValue(config);
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
