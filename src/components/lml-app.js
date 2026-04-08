import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ContextProvider } from '@lit/context';
import {
    dataTypeContext,
    datasetContext,
    featuresContext,
    encodingContext,
    modelContext
} from '../contexts';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { setLocaleFromUrl } from './main-menu/localization';
import './main-menu/main-menu';
import './model-selector/model-selector';
import './footers/footer-copyright';
import './footers/footer-sponsors';
import './init-message/init-message';
import './model-editor/model-editor';
import './model-editor/model-playground';
import './loading-message/loading-message';
import {
    bowEncoder,
    getMobilenetEncoder,
    numericalEncoder,
    audioEncoder,
    LMLSequential,
    KNN,
    NaiveBayes
} from '../services/lml-algorithms-bridge.js';
import * as tf from '@tensorflow/tfjs';
import {
    appendFontAwesomeStyles,
    renderFontAwesomeIcons,
    setupFontAwesome
} from '../utils/fontawesome.js';

setupFontAwesome();

const SHARED_SHADOW_STYLES = `
  .is-clickable {
    cursor: pointer;
  }
  .component {
    display: flex;
    align-items: center;
    position: relative;
  }
  .navbar-item {
    height: 100%;
  }
  .truncate {
    display: inline-block;
    vertical-align: middle;
    width: 350px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex: 1;
  }
  .itemdata {
    max-height: 300px;
    overflow: auto;
  }
  .image-item {
    height: 75px;
  }
  .audio-container {
    position: relative;
    display: inline-block;
  }
  .sample-text {
    position: absolute;
    top: 5px;
    left: 5px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 12px;
  }
  .play-button {
    position: absolute;
    bottom: 10px;
    left: 5px;
    font-size: 10px;
    padding: 5px;
    width: 25px;
    height: 25px;
  }
  .delete-button {
    position: absolute;
    bottom: 10px;
    right: 5px;
    font-size: 10px;
    padding: 5px;
    width: 25px;
    height: 25px;
  }
`;

if (typeof globalThis.__lmlInitShadowRoot !== 'function') {
    globalThis.__lmlInitShadowRoot = (host, root) => {
        if (!root || root.__lmlSharedStylesApplied) return;
        root.__lmlSharedStylesApplied = true;

        const links = [
            'https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css'
        ];

        for (const href of links) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            root.appendChild(link);
        }

        const style = document.createElement('style');
        style.textContent = SHARED_SHADOW_STYLES;
        root.appendChild(style);

        appendFontAwesomeStyles(root);

        const renderShadowIcons = () => {
            return renderFontAwesomeIcons(root);
        };

        if (!renderShadowIcons()) {
            let retries = 20;
            const retryTimer = setInterval(() => {
                retries -= 1;
                if (renderShadowIcons() || retries <= 0) {
                    clearInterval(retryTimer);
                }
            }, 250);
        }

        if (!root.__lmlFaObserver && typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                renderShadowIcons();
            });
            observer.observe(root, { childList: true, subtree: true });
            root.__lmlFaObserver = observer;
        }

        if (!host.__lmlPatchedQueries) {
            host.__lmlPatchedQueries = true;
            host.querySelector = (selector) => root.querySelector(selector);
            host.querySelectorAll = (selector) => root.querySelectorAll(selector);
        }
    };
}

window.__lmlV2BundleLoaded = true;


class LMLApp extends LitElement {

    static properties = {
        loading: { type: Boolean },
        page: { type: String },
        apiErrorMessage: { type: String },
        playgroundAlgorithm: { type: String }
    };

    constructor() {
        super();

        console.log(process.env);
        this.forceCpuBackendForChrome();
        setLocaleFromUrl();

        localStorage.removeItem('lmlModel');

        this.loading = true;
        this.page = 'home';
        this.apiErrorMessage = '';
        this.playgroundAlgorithm = 'ann';
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
        }, 0)

        const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
        let mobilenetEncoder = getMobilenetEncoder(baseUrl);
        this.encodingProvider.setValue({
            text: bowEncoder,
            image: mobilenetEncoder,
            numerical: numericalEncoder,
            audio: audioEncoder            
        });

    }

    connectedCallback() {
        super.connectedCallback();

        this.handleApiError = (event) => {
            const message = event?.detail?.message;
            if (typeof message === 'string' && message.trim()) {
                this.apiErrorMessage = message.trim();
            } else {
                this.apiErrorMessage = 'No podemos usar los algoritmos en este momento.';
            }
            this.requestUpdate();
        };
        window.addEventListener('lml-api-error', this.handleApiError);

        this.addEventListener("load-model-editor", e => {
            this.page = 'model-editor';
        });

        this.addEventListener("toggle-advanced-mode", e => {
            this.advancedMode = !this.advancedMode;
            if (!this.advancedMode && this.page === 'playground') {
                this.page = 'model-editor';
            }
            this.requestUpdate();
        });

        this.addEventListener('open-playground-page', () => {
            if (this.advancedMode) {
                this.page = 'playground';
                this.requestUpdate();
            }
        });

        this.addEventListener('open-playground', (event) => {
            if (this.advancedMode) {
                this.playgroundAlgorithm = event?.detail?.algorithm || 'ann';
                this.page = 'playground';
                this.requestUpdate();
            }
        });

        this.addEventListener("change-algorithm", e => {
            if (e.detail == 'ann' || e.detail == 'LMLSequential') {
                this.modelProvider.setValue(new LMLSequential);
            } else if (e.detail == 'knn' || e.detail == 'KNN') {
                this.modelProvider.setValue(new KNN);
            } else if (e.detail == 'naive-bayes' || e.detail == 'nb' || e.detail == 'NaiveBayes') {
                if (!NaiveBayes) {
                    window.dispatchEvent(new CustomEvent('lml-api-error', {
                        detail: { message: 'No se puede usar Naive Bayes: la version de lml-algorithms instalada no lo incluye.' }
                    }));
                    throw new Error('NaiveBayes export is missing from lml-algorithms');
                }
                this.modelProvider.setValue(new NaiveBayes);
            }
            this.requestUpdate();
        });
    }

    forceCpuBackendForChrome() {
        if (!process.env.FORCE_CPU_BACKEND_CHROME) {
            return;
        }
        if (typeof navigator === 'undefined') {
            return;
        }
        const ua = navigator.userAgent || '';
        const isChrome = /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua);
        if (!isChrome) {
            return;
        }
        tf.setBackend('cpu').then(() => tf.ready());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.handleApiError) {
            window.removeEventListener('lml-api-error', this.handleApiError);
        }
    }

    apiErrorModalTemplate() {
        return html`
        <div class=${classMap({ "modal": true, "is-active": Boolean(this.apiErrorMessage) })}>
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">No se pueden usar los algoritmos</p>
                    <button @click=${() => { this.apiErrorMessage = ''; }} class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <p>${this.apiErrorMessage}</p>
                </section>
                <footer class="modal-card-foot">
                    <button @click=${() => { this.apiErrorMessage = ''; }} class="button is-primary">Cerrar</button>
                </footer>
            </div>
        </div>
        `;
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

    playgroundTemplate() {
        return html`
        <div class="container is-fluid mb-2">
            <model-playground
                .initialAlgorithm=${this.playgroundAlgorithm}
                @back-to-editor=${this.backToEditorFromPlayground}
            ></model-playground>
        </div>`;
    }

    backToEditorFromPlayground() {
        this.page = 'model-editor';
        this.requestUpdate();
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
            ${this.page == 'playground'
                    ? this.playgroundTemplate()
                    : html``
                }
            ${this.apiErrorMessage
                    ? this.apiErrorModalTemplate()
                    : html``
                }
                    
            ${process.env.SHOW_FOOTER_SPONSORS
                    ? this.footerSponsorsTemplate()
                    : html``
                }
            ${this.footerCopyrigthTemplate()}
            `;
        }
    }

    createRenderRoot() {
    const root = super.createRenderRoot();
    const initShadow = globalThis.__lmlInitShadowRoot;
    if (typeof initShadow === 'function') {
      initShadow(this, root);
    }
    return root;
  }

}
customElements.define('lml-app', LMLApp);
window.__lmlV2Defined = true;
