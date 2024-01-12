import configLoader from './config-loader';
import { LitElement, html } from 'lit';
import { ContextProvider } from '@lit/context';
import { configContext, statusContext, datasetContext } from './contexts';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './main-menu/main-menu';
import './model-selector/model-selector';
import './footers/footer-copyright';
import './footers/footer-sponsors';
import './init-message/init-message';
import './model-editor/model-editor';


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
        //this.page = 'home';
        this.page = 'model-editor';
        this.configProvider = new ContextProvider(this, { context: configContext });
        this.statusProvider = new ContextProvider(this, { context: statusContext });
        this.datasetProvider = new ContextProvider(this, { context: datasetContext });

        this.statusProvider.setValue({
            //modelEditor: 'text'
            //modelEditor: 'image'
            modelEditor: 'number'
        });

        /**
         * este proveedor contendrá un mapa en el que las claves son el nombre de las
         * clases y los valores asociados serán arrays de textos, imágenes o números.
         */
        // let kk = new Map();
        // let ll = new Set();
        // ll.add("1.5,3.2,3.3,6.5,4.7,3.5,2.4,6.4");
        // ll.add("4.3,2.4,4.3,6.5,4.7,3.5,2.4,6.4");
        // ll.add("1.5,3.7,3.3,6.5,4.7,3.5,2.4,6.4");
        // ll.add("4.3,2.5,4.3,6.5,4.7,3.5,2.4,6.4");
        // ll.add("1.5,3.2,3.3,6.5,4.7,3.5,2.4,6.4");
        // ll.add("4.3,3.4,4.3,6.5,4.7,3.5,2.4,6.4");
        // kk.set('kaka', ll);
        this.datasetProvider.setValue(new Map());
        //this.datasetProvider.setValue(kk);

        updateWhenLocaleChanges(this);

        configLoaderPromise.then(config => {
            setTimeout(() => {
                this.loading = false;
                this.configProvider.setValue(config);
            }, 1000)

        });
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener("load-model-editor", e => {
            this.page = 'model-editor';
            this.statusProvider.setValue({
                modelEditor: e.detail
            })
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

    editorTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <model-editor></model-editor>
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
