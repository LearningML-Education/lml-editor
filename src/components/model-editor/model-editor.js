import { LitElement, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { dataTypeContext } from '../../contexts.js';
import './model-train.js';
import './model-learn.js';
import './model-eval.js';

export class ModelEditor extends LitElement {

  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });

  static properties = {
    advancedMode: { type: Object, attribute: 'advanced-mode' },
    showTrain: { type: Boolean},
    showLearn: { type: Boolean},
    showEval: { type: Boolean},
  }

  constructor() {
    super();
    this.showTrain = true;
    this.showLearn = false;
    this.showEval = false;
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

  showTag(e){
    console.log(e.target.id);
    this.showTrain = e.target.id ==  "trainTab";
    this.showLearn = e.target.id ==  "learnTab";
    this.showEval = e.target.id ==  "evalTab";
  }


  templateBasic(){
    return html`
    <div class="columns">
      <div class="column">
        <model-train id="model-train"></model-train>
      </div>

      <div class="column">
        <model-learn advanced-mode='{"enabled": ${this.advancedMode.enabled}}'></model-learn>
      </div>


      <div class="column">
        <model-eval advanced-mode='{"enabled": ${this.advancedMode.enabled}}'></model-eval>
      </div>
    </div>
    `
  }

  templateAdvanced(){
    return html`
      <div class="tabs is-left is-boxed">
        <ul>
          <li class=${classMap({ "is-active": this.showTrain})}>
            <a id="trainTab" @click=${this.showTag}>
              ${msg("Training")}
            </a>
          
          </li>
          <li class=${classMap({ "is-active": this.showLearn})}>
            <a id="learnTab" @click=${this.showTag}>
              ${msg("Learn")}
            </a>
        </li>
          <li class=${classMap({ "is-active": this.showEval})}>
            <a id="evalTab" @click=${this.showTag}>
              ${msg("Try")}
            </a>
          </li>
        </ul>
      </div>

      <div ?hidden=${!this.showTrain}>
        <model-train advanced-mode='{"enabled": ${this.advancedMode.enabled}}' id="model-train"></model-train>
      </div>

      <div ?hidden=${!this.showLearn}>
        <model-learn advanced-mode='{"enabled": ${this.advancedMode.enabled}}'></model-learn>
      </div>

      <div ?hidden=${!this.showEval}>
        <model-eval advanced-mode='{"enabled": ${this.advancedMode.enabled}}'></model-eval>
      </div>
    `;
  }

  render() {

    return html`
      ${this.advancedMode.enabled ?
        this.templateAdvanced()
        :
        this.templateBasic()}
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('model-editor', ModelEditor);
