import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider }  from '@lit/context';
import { configContext, langContext } from './contexts';
import { LangController } from './main-menu/langController';
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
        this.langProvider = new ContextProvider(this, { context: langContext});
        
        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.loading = false;
                this.configProvider.setValue(config);
                this.langProvider.setValue(new LangController(config.defaultLanguage));
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
