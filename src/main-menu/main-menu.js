import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts';
import './language-menu';
import './file-menu';
import './input-menu';
import './learn-menu';
import './mode-toggle-menu';
import './about-menu';

export class MainMenu extends LitElement {

    _configConsumer = new ContextConsumer(this, { context: configContext });

    constructor(){
        super();
        updateWhenLocaleChanges(this);
    }

    render() {
        return html`
        <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="https://web.learningml.org">
                <img src="/src/assets/images/cabeza_genio.png" alt="LearningML, Artificial Intelligence made easy">
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>
            <div class="navbar-menu">
                <div class="navbar-start">                            
                    <language-menu class="component"></language-menu>                
                    <file-menu class="component"></file-menu>                
                    <input-menu class="component"></input-menu>
                    <learn-menu class="component"></learn-menu>
                    <mode-toggle-menu class="component"></mode-toggle-menu>                
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
