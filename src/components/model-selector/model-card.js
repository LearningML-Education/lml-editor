import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext } from '../../contexts.js';


export class ModelCard extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });


  static properties = {
    title: { type: String },
    description: { type: String },
    image: { type: String },
    type: { type: String }
  }

  constructor() {
    super();
    this.title = "Mising title";
    this.description = "Missing description";
    this.image = "cabeza_genio.png";
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("load-model-editor", e => {
      this._statusConsumer.value.modelDataType = e.detail;
    });
  }

  loadEditor() {
    const event = new CustomEvent('load-model-editor', {
      bubbles: true,
      composed: true,
      detail: this.type
    });

    this.dispatchEvent(event);
  }

  render() {

    console.log(this.title);
    return html`
  <div class="card">
    <div class="card-image">
      <figure @click=${this.loadEditor} class="image is-4by3 is-clickable">
        <img src="/images/${this.image}" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <h3 class="has-text-centered">${this.title}</h3>
        <p class="has-text-centered">${this.description}</p>
        
      </div>
    </div>
  </div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-card', ModelCard);
