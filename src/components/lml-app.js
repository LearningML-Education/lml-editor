import configLoader from '../config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider } from '@lit/context';
import {
    configContext,
    statusContext,
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
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { MobilenetService } from '../feature-extraction/mobilenet';
import { numericalEncoder } from '../feature-extraction/numerical';
import { LMLSequential } from '../algorithms/sequential';



// Configuration is loaded
const configLoaderPromise = configLoader();

class LMLApp extends LitElement {

    static properties = {
        loading: { type: Boolean },
        page: { type: String }
    };

    constructor() {
        super();

        this.loading = true;
        this.page = 'home';
        this.advancedMode = false;
        //this.page = 'model-editor';
        this.configProvider = new ContextProvider(this, { context: configContext });
        this.statusProvider = new ContextProvider(this, { context: statusContext });
        this.datasetProvider = new ContextProvider(this, { context: datasetContext });
        this.featuresProvider = new ContextProvider(this, { context: featuresContext });
        this.encodingContext = new ContextProvider(this, { context: encodingContext });
        this.modelContext = new ContextProvider(this, { context: modelContext });

        this.statusProvider.setValue({
            modelEditor: 'text',
            modelName: "Untitled",
            dimension: 0
        });

        this.modelContext.setValue(new LMLSequential);

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

        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.loading = false;
                this.configProvider.setValue(config);
            }, 1000)

            let mobilenet = new MobilenetService(config.urlMobilenetModels);

            this.encodingContext.setValue({
                text: use.load(),
                image: mobilenet.get(),
                numerical: numericalEncoder()
            });

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
        console.log(this.statusProvider.value);
        console.log(this.childNodes);
    }

    render() {
        if (this.loading) {
            return this.loadingTemplate();
        } else {
            return html`
            ${this.configProvider.value.initMessage.show
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
