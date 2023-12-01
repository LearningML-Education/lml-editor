import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import  './main-menu/main-menu';

// Configuration is loaded
const configLoaderPromise = configLoader();

configLoaderPromise.then(config => {
    // LearningML is initialized with the configuration

    class LMLApp extends LitElement {
        constructor() {
            super();
            this.config = config;
        }

        render() {
            return html`
                <main-menu .config=${this.config}></main-menu>
            `;
        }

        createRenderRoot(){
            return this;
        }

    }
    customElements.define('lml-app', LMLApp);
});
