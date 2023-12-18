import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider } from '@lit/context';
import { configContext } from './contexts';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { Router } from '@lit-labs/router';
import './lml-home';
import './lml-model';

// Configuration is loaded
const configLoaderPromise = configLoader();

class LMLApp extends LitElement {
   
    static properties = {
        loading: { type: Boolean },
    };

    constructor() {
        super();
        this._routes = new Router(this, [
            { path: '/', render: () => html`<lml-home></lml-home>` },
            { path: '/projects', render: () => html`<h1>Projects</h1>` },
            { path: '/model', render: () => html`<lml-model></lml-model>` },
        ]);
        
        this.loading = true;
        this.configProvider = new ContextProvider(this, { context: configContext });
        updateWhenLocaleChanges(this);

        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.loading = false;
                this.configProvider.setValue(config);
            }, 1000)

        });
    }

    loadingTemplate() {
        return html`${msg("Loading ...")}`;
    }    

    render() {
        if (this.loading) {
            return this.loadingTemplate();
        } else {
            return html`${this._routes.outlet()}`;
        }
    }

    createRenderRoot() {
        return this;
    }

}
customElements.define('lml-app', LMLApp);
