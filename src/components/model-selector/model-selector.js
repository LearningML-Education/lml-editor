import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import './model-card.js';


export class ModelSelector extends LitElement {

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
      image="dalle-text-min.png",
      type="text">
    </model-card>
  </div>
  <div class="column">
    <model-card 
      title="${msg('Image recognition')}"
      description="${msg('Teach the computer to recognize images')}"
      image="dalle-images-min.png"
      type="image">
    </model-card>
  </div>
  <div class="column">
    <model-card 
      title="${msg('Number recognition')}"
      description="${msg('Teach the computer to recognize number sets')}"
      image="dalle-numbers-min.png"
      type="numerical">
    </model-card>
  </div>
  <div class="column">
    <model-card 
      title="${msg('Sound recognition')}"
      description="${msg('Teach the computer to recognize sounds')}"
      image="dalle-audio-min.png"
      type="audio">
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