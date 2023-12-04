import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts';
import '../locale-picker';
import './language-menu';

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
                <a class="navbar-item" href="https://bulma.io">
                <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: Free, open source, and modern CSS framework based on Flexbox" width="112" height="28">
                </a>

                <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>
            <div class="navbar-menu">
            <a class="navbar-item">
                ${msg('Home')}
            </a>
                <language-menu class="navbar-item"></language-menu>
            </div>
        </nav>

        <locale-picker></locale-picker>

    `
    }

    createRenderRoot() {
        return this;
    }

}

window.customElements.define('main-menu', MainMenu);
