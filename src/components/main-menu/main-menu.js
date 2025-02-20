import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { modelContext, dataTypeContext } from '../../contexts';
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
        navBarMenuActive: { type: Boolean }
    }

    constructor() {
        super();
        this.modelName = "";
        this.navBarMenuActive = false;
        this.scratchWindow;
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
            
                <a class="navbar-item" @click="${this.initScratch}">                
                <img src="/images/scratch_icon.svg">
                </a>
            
            `;
        }
    }

    render() {
        return html`
        <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="">
                    <img src="/images/cabeza_genio.png" alt="LearningML, Artificial Intelligence made easy">
                </a>

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
                    <about-menu class="component"></about-menu>
                </div>
            </div>
        </nav>
    `
    }

    createRenderRoot() {
        return this;
    }

}

window.customElements.define('main-menu', MainMenu);
