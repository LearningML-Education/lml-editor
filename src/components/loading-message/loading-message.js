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
    const root = super.createRenderRoot();
    const initShadow = globalThis.__lmlInitShadowRoot;
    if (typeof initShadow === 'function') {
      initShadow(this, root);
    }
    return root;
  }
}

window.customElements.define('loading-message', LoadingMessage);
