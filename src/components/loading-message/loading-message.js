import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';


export class LoadingMessage extends LitElement {

    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    render() {
      return  html`
      <div class="notification is-primary">        
         ${msg("Loading ...")}
         <progress class="progress is-small is-primary" max="100"></progress>
      </div>
        
        `;
    }

    createRenderRoot() {
        return this;
    }
}

window.customElements.define('loading-message', LoadingMessage);
