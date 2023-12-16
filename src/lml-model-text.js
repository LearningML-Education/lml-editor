import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider } from '@lit/context';
import { configContext } from './contexts';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './main-menu/main-menu';
import './footers/footer-copyright';
import './footers/footer-sponsors';

// Configuration is loaded
const configLoaderPromise = configLoader();

class LMLModelText extends LitElement {

    static properties = {
        loading: { type: Boolean },
    };

    constructor() {
        super();
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
        return html`${msg("Loading ModelText ...")}`;
    }


    mainMenuTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <main-menu></main-menu>
        </div>`;
    }

    modelEditorTemplate(){
        return html`
        <div class="container is-fluid mb-5">
            loadEditor
        </div>
        `;
    }

    footerCopyrigthTemplate(){
        return html`
        <div class="container is-fluid mb-2">
            <footer-copyright></footer-copyright>
        </div>
        `;
    }

    footerSponsorsTemplate(){
        return html`
        <div class="container is-fluid mb-2">
            <footer-sponsors></footer-sponsors>
        </div>
        `;
    }

    render() {
        if(this.loading){
            return this.loadingTemplate();
        } else {
            let app = html`
            ${this.mainMenuTemplate()}
            ${this.modelEditorTemplate()}
            ${this.footerCopyrigthTemplate()}
            ${this.footerSponsorsTemplate()}
            `;
            return app;
        }
    }

    createRenderRoot() {
        return this;
    }

}
customElements.define('lml-model-text', LMLModelText);
