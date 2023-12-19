import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class ModelCard extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    title: { type: String },
    description: { type: String },
    image: {type: String}
  }

  constructor() {
    super();
    this.title = "Mising title";
    this.description = "Missing description";
    this.image = "cabeza_genio.png"
    updateWhenLocaleChanges(this);
  }

  loadEditor(){
    const event = new CustomEvent('load-model-editor', {
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {

    console.log(this.title);
    return html`
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="/src/assets/images/${this.image}" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <h3 class="has-text-centered">${this.title}</h3>
        <p class="has-text-centered">${this.description}</p>
        <div class="buttons">
          <button @click=${this.loadEditor} class="button is-success is-fullwidth">${msg("Start!")}</button>
        </div>
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
