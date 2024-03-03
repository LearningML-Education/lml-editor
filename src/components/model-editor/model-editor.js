import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { statusContext } from '../../contexts.js';
import './model-train.js';
import './model-learn.js';
import './model-eval.js';

export class ModelEditor extends LitElement {

  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });

  static properties = {
    advancedMode: { type: Object, attribute: 'advanced-mode' }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  learningText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Now it's time to learn to classify text");
      case 'image':
        return msg("Now it's time to learn to classify images");
      case 'numerical':
        return msg("Now it's time to learn to classify numbers");
    }
    return "";
  }

  learnButtonText(editorType) {
    switch (editorType) {
      case 'text':
        return msg("Learn to recognize texts");
      case 'image':
        return msg("Learn to recognize images");
      case 'numerical':
        return msg("Learn to recognize numbers");
    }
    return "";
  }

  render() {

    return html`
    ${this.advancedMode.enabled? html`advanced on` : html`advanced off`}

<div class="columns">
  <div class="column">
    <model-train id="model-train"></model-train>
  </div>

  <div class="column">
    <model-learn></model-learn>
  </div>


  <div class="column">
    <model-eval></model-eval>
  </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-editor', ModelEditor);
