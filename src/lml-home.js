import { LitElement, html } from 'lit';
import { ContextConsumer } from '@lit/context';
import { configContext } from './contexts';
import { updateWhenLocaleChanges } from '@lit/localize';
import './main-menu/main-menu';
import './model-selector/model-selector';
import './footers/footer-copyright';
import './footers/footer-sponsors';
import './init-message/init-message';

class LMLHome extends LitElement {

    constructor() {
        super();
        this._configConsumer = new ContextConsumer(this, { context: configContext });
        updateWhenLocaleChanges(this);
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

        return html`
            ${this._configConsumer.value.initMessage.show
                ? this.initMessageTemplate()
                : html``
            }
            ${this.mainMenuTemplate()}
            ${this.modelSelectorTemplate()}
            ${this.footerCopyrigthTemplate()}
            ${this.footerSponsorsTemplate()}
            `;

    }

    createRenderRoot() {
        return this;
    }

}
customElements.define('lml-home', LMLHome);
