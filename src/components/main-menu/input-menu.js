import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext, statusContext } from '../../contexts.js';


export class InputMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext, subscribe: true });
  _statusConsumer = new ContextConsumer(this, { context: statusContext, subscribe: true });

  static properties = {
    name: { type:String }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  changeFileName(e){
    console.log(e);
    this._statusConsumer.value.modelName = e.target.value;
  }

  render() {

    return html`
    <div class="navbar-item">
      <input class="input" @change=${this.changeFileName} type="text" .value="${msg(this._statusConsumer.value.modelName)}">
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('input-menu', InputMenu);
