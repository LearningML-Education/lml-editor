import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { modelContext, dataTypeContext } from '../../contexts';
import { assetUrl } from '../../utils/assetPaths.js';
import packageJson from '../../../package.json';
import './language-menu';
import './file-menu';
import './input-menu';
import './learn-menu';
import './mode-toggle-menu';
import './about-menu';

export class MainMenu extends LitElement {

    _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });
    _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });

    static properties = {
        advancedMode: { type: Object, attribute: 'advanced-mode' },
        menu: { type: String },
        modelName: { type: String },
        navBarMenuActive: { type: Boolean },
        appVersion: { type: String }
    }

    constructor() {
        super();
        this.modelName = "";
        this.navBarMenuActive = false;
        this.scratchWindow;
        this.appVersion = packageJson.version;
        updateWhenLocaleChanges(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("change-input-name", e => {
            console.log("cambio nombre modelo");
            this.modelName = e.detail;
        });
    }

    initScratch() {

        const url = new URL(window.location.href);
        const locale = url.searchParams.get('locale');

        let urlScratch = process.env.URL_SCRATCH;
        
        if (locale != null) {
            urlScratch += '?locale=' + locale;
        }
        
        if (!this.scratchWindow || this.scratchWindow.closed) {            
            this.scratchWindow = window.open(urlScratch, 'scratch');           
        } else {
            this.scratchWindow.focus();
        }        
    }

    templateMenu() {
        if (this.menu == 'home') {
            return html`
                <language-menu class="component"></language-menu>                
                <file-menu class="component"></file-menu>                
                <learn-menu class="component"></learn-menu>   
            `;
        } else {
            return html`
            <language-menu class="component"></language-menu>                
            <file-menu showSaveDataset showSaveModel class="component"></file-menu>  
            <input-menu name="${this.modelName}" class="component"></input-menu>              
            <learn-menu class="component"></learn-menu>
            <mode-toggle-menu class="component"></mode-toggle-menu>
            ${this.advancedMode?.enabled ? html`
              <a class="navbar-item" @click=${this.openPlaygroundPage}>
                ${msg('Playground')}
              </a>
            ` : html``}
            
                <a class="navbar-item" @click="${this.initScratch}">                
                <img src="${assetUrl('images/scratch_icon.svg')}">
                </a>
            
            `;
        }
    }

    render() {
        return html`
        <style>
            .app-version {
                font-size: 0.85rem;
                opacity: 0.75;
                letter-spacing: 0.02em;
                font-style: italic;
            }

            .app-version--mobile {
                display: none;
            }

            @media screen and (max-width: 1023px) {
                .app-version--mobile {
                    display: inline-flex;
                    align-items: center;
                    margin-left: 0.5rem;
                }
                .app-version--desktop {
                    display: none;
                }

                .navbar-item.has-dropdown .navbar-dropdown {
                    display: none;
                }

                .navbar-item.has-dropdown.is-active .navbar-dropdown {
                    display: block;
                }
            }
        </style>
        <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="">
                    <img src="${assetUrl('images/cabeza_genio.png')}" alt="LearningML, Artificial Intelligence made easy">
                </a>
                <div class="navbar-item app-version app-version--mobile">
                    ${this.appVersion}
                </div>

                <a @click=${() => { this.navBarMenuActive = !this.navBarMenuActive; }} role="button" class=${classMap({ "navbar-burger": true, "is-active": this.navBarMenuActive })} aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div  class=${classMap({ "navbar-menu": true, "is-active": this.navBarMenuActive })}>
                <div class="navbar-start">                            
                    ${this.templateMenu()}               
                </div>
                <div class="navbar-end">                    
                    <div class="navbar-item app-version app-version--desktop">
                        ${this.appVersion}
                    </div>
                    <about-menu class="component"></about-menu>
                </div>
            </div>
        </nav>
    `
    }

    openPlaygroundPage() {
        this.dispatchEvent(new CustomEvent('open-playground-page', {
            bubbles: true,
            composed: true
        }));
    }

    createRenderRoot() {
        return this;
    }

}

window.customElements.define('main-menu', MainMenu);
