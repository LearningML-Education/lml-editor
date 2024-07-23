import { LitElement, html } from 'lit';
import { ContextProvider } from '@lit/context';
import {
    dataTypeContext,
    datasetContext,
    featuresContext,
    encodingContext,
    modelContext
} from '../contexts';
import { updateWhenLocaleChanges } from '@lit/localize';
import './main-menu/main-menu';
import './model-selector/model-selector';
import './footers/footer-copyright';
import './footers/footer-sponsors';
import './init-message/init-message';
import './model-editor/model-editor';
import './loading-message/loading-message';
import {
    useEncoder,
    getMobilenetEncoder,
    numericalEncoder,
    LMLSequential,
    KNN
} from 'lml-algorithms';


class LMLApp extends LitElement {

    static properties = {
        loading: { type: Boolean },
        page: { type: String }
    };

    constructor() {
        super();

        localStorage.clear();

        this.loading = true;
        this.page = 'home';
        this.advancedMode = false;
        //this.page = 'model-editor';
        this.dataTypeProvider = new ContextProvider(this, { context: dataTypeContext });
        this.datasetProvider = new ContextProvider(this, { context: datasetContext });
        this.featuresProvider = new ContextProvider(this, { context: featuresContext });
        this.encodingProvider = new ContextProvider(this, { context: encodingContext });
        this.modelProvider = new ContextProvider(this, { context: modelContext });

        this.bcInternal = new BroadcastChannel('lml-internal');
        this.bcInternal.addEventListener('message', message => {
            if (message.data == 'requestUpdate') {
                this.page = 'model-editor';
            }
        });

        this.dataTypeProvider.setValue({
            type: 'text',
            name: "Untitled",
            dimension: 0
        });

        this.modelProvider.setValue(new LMLSequential);

        /**
         * este proveedor contendrá un mapa en el que las claves son el nombre de las
         * clases y los valores asociados serán arrays de textos, imágenes o números.
         */
        this.datasetProvider.setValue(new Map());

        /**
         * este proveedor contendrá un mapa en el que las claves son el nombre de las
         * clases y los valores asociados serán Tensores con las características extraidas de
         * textos imágenes o números.
         */
        this.featuresProvider.setValue(new Map());

        updateWhenLocaleChanges(this);

        setTimeout(() => {
            this.loading = false;
         }, 1000)

        let mobilenetEncoder = getMobilenetEncoder(process.env.URL_BASE);
        this.encodingProvider.setValue({
            text: useEncoder,
            image: mobilenetEncoder,
            numerical: numericalEncoder
        });

    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener("load-model-editor", e => {
            this.page = 'model-editor';
        });

        this.addEventListener("toggle-advanced-mode", e => {
            this.advancedMode = !this.advancedMode;
            this.requestUpdate();
        });

        this.addEventListener("change-algorithm", e => {
            if (e.detail == 'ann' || e.detail == 'LMLSequential') {
                this.modelProvider.setValue(new LMLSequential);
            } else if (e.detail == 'knn' || e.detail == 'KNN') {
                this.modelProvider.setValue(new KNN);
            }
            this.requestUpdate();
        });
    }

    loadingTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <loading-message></loading-message>
        </div>
        `;
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
            <main-menu advanced-mode='{"enabled": ${this.advancedMode}}'></main-menu>
        </div>`;
    }

    modelSelectorTemplate() {
        return html`
        <div class="container is-fluid mb-5">
            <model-selector></model-selector>
        </div>
        `;
    }

    editorTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <model-editor advanced-mode='{"enabled": ${this.advancedMode}}'></model-editor>
        </div>`;
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

    kaka() {
        console.log(this.datasetProvider.value);
        console.log(this.dataTypeProvider.value);
        console.log(this.childNodes);
    }

    render() {
        if (this.loading) {
            return this.loadingTemplate();
        } else {
            return html`
            ${process.env.INIT_MESSAGE_SHOW
                    ? this.initMessageTemplate()
                    : html``
                }
            ${this.mainMenuTemplate()}
            ${this.page == 'home'
                    ? this.modelSelectorTemplate()
                    : html``
                }
            ${this.page == 'model-editor'
                    ? this.editorTemplate()
                    : html``
                }  
        
            ${this.footerCopyrigthTemplate()}
            ${this.footerSponsorsTemplate()}
            `;
        }
    }

    createRenderRoot() {
        return this;
    }

}
customElements.define('lml-app', LMLApp);
