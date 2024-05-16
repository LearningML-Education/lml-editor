import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext, modelContext, statusContext } from '../../contexts';
import './language-menu';
import './file-menu';
import './input-menu';
import './learn-menu';
import './mode-toggle-menu';
import './about-menu';

export class MainMenu extends LitElement {

    _configConsumer = new ContextConsumer(this, { context: configContext, subscribe: true });
    _modelConsumer = new ContextConsumer(this, { context: modelContext, subscribe: true });
    _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });

    static properties = {
        advancedMode: { type: Object, attribute: 'advanced-mode' },
        menu: { type: String }
    }

    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    initScratch() {

        let urlScratch = this._configConsumer.value.urlScratch +
            "?url_models=" + this._configConsumer.value.urlBase +
            "&loadModel=1";
        if (this.advancedMode.enabled) {
            urlScratch += '&advanced=1';
        }
        // if (this._modelConsumer.value.model) {
        //     urlScratch += '&loadModel=1';
        // }
        window.open(urlScratch);
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
            <file-menu showSave class="component"></file-menu>  
            <input-menu class="component"></input-menu>              
            <learn-menu class="component"></learn-menu>
            <mode-toggle-menu class="component"></mode-toggle-menu> 
            <div class="navbar-item">
                <a  @click="${this.initScratch}">                
                    <img src="/images/scratch_icon.svg"                
                </a>
            </div>
            `;
        }
    }

    render() {
        return html`
        <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="${this._configConsumer.value.urlBase}">
                <img src="/images/cabeza_genio.png" alt="LearningML, Artificial Intelligence made easy">
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>
            <div class="navbar-menu">
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
