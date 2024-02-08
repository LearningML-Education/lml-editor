import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class InitMessage extends LitElement {

    _configConsumer = new ContextConsumer(this, { context: configContext });

    static properties = {
        title: { type: String },
        message: { type: String }
    };

    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    updated(){
        this.title = this._configConsumer.value.initMessage.title;
        this.message = this._configConsumer.value.initMessage.message;
    }

    render() {

        return html`
<article class="message is-warning">
  <div class="message-header">
    <p>${this.title}</p>
    <button @click=${() => {this.parentElement.style.display='none'}} class="delete" aria-label="delete"></button>
  </div>
  <div class="message-body">
    ${this.message}
  </div>
</article>
    `
    }

    createRenderRoot() {
        return this;
    }
}

window.customElements.define('init-message', InitMessage);
