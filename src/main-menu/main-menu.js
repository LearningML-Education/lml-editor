import { LitElement, html } from 'lit';
import { ContextConsumer }  from '@lit/context';
import { appContext } from '../contexts';
import './language-menu';

export class MainMenu extends LitElement {

  _consumer = new ContextConsumer(this, { context: appContext });

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
                Home
            </a>
                <language-menu class="navbar-item"></language-menu>
            </div>
        </nav>
    `
    }

    createRenderRoot() {
        return this;
    }

}

window.customElements.define('main-menu', MainMenu);
