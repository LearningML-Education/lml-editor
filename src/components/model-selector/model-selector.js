import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';
import './model-card.js';


export class ModelSelector extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
<div class="columns">
  <div class="column">
    <model-card 
      title="${msg('Text recognition')}"
      description="${msg('Teach the computer to recognize text')}"
      image="dalle-text.png",
      type="text">
    </model-card>
  </div>
  <div class="column">
    <model-card 
      title="${msg('Image recognition')}"
      description="${msg('Teach the computer to recognize images')}"
      image="dalle-images.png"
      type="image">
    </model-card>
  </div>
  <div class="column">
    <model-card 
      title="${msg('Number recognition')}"
      description="${msg('Teach the computer to recognize number sets')}"
      image="dalle-numbers.png"
      type="number">
    </model-card>
  </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-selector', ModelSelector);
