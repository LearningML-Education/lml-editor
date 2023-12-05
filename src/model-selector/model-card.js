import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class ModelCard extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    title: { String }
  }

  constructor() {
    super();
    this.title = "sjlkjsdf";
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="/src/assets/images/dalle-text.png" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <h3>${msg(this.title)}</h3>
        <p>${msg("Teach the computer to recognize text")}</p>
        <div class="buttons">
          <button class="button is-success is-fullwidth">${msg("Start!")}</button>
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
