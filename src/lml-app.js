import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider } from '@lit/context';
import { configContext } from './contexts';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './main-menu/main-menu';
import './model-selector/model-selector';
import './footers/footer-copyright';
import './footers/footer-sponsors';
import './init-message/init-message';

// Configuration is loaded
const configLoaderPromise = configLoader();

class LMLApp extends LitElement {

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
        return html`${msg("Loading ...")}`;
    }

    initMessageTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <init-message></init-message>
        </div>
        `;
    }

    mainMenuTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <main-menu></main-menu>
        </div>`;
    }

    modelSelectorTemplate() {
        return html`
        <div class="container is-fluid mb-5">
            <model-selector></model-selector>
        </div>
        `;
    }

    footerCopyrigthTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <footer-copyright></footer-copyright>
        </div>
        `;
    }

    footerSponsorsTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <footer-sponsors></footer-sponsors>
        </div>
        `;
    }

    render() {
        if (this.loading) {
            return this.loadingTemplate();
        } else  {
            let app = html`
            ${this.configProvider.value.initMessage.show
                ? this.initMessageTemplate()
                : html``
            }
            ${this.mainMenuTemplate()}
            ${this.modelSelectorTemplate()}
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
customElements.define('lml-app', LMLApp);
