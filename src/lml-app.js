import configLoader from './config-loader';
import { LitElement, html } from 'lit';
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
        this.config = null;

        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.config = config;
                this.loading = false;
            }, 1000)

        });
    }

    render() {
        return html`
        ${this.loading ? 
            html`Cargando ...` 
            :
            html`<main-menu .config=${this.config}></main-menu>`}
        `;
    }

    createRenderRoot() {
        return this;
    }

}
customElements.define('lml-app', LMLApp);
