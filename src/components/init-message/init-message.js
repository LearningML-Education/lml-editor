import { LitElement, html } from 'lit';
import { updateWhenLocaleChanges } from '@lit/localize';

export class InitMessage extends LitElement {

    static properties = {
        title: { type: String },
        message: { type: String }
    };

    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    updated(){
        this.title = process.env.INIT_MESSAGE_TITLE;
        this.message = process.env.INIT_MESSAGE_DESCRIPTION;
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
