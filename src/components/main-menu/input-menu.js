import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext, dataTypeContext } from '../../contexts.js';


export class InputMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext, subscribe: true });
  _dataTypeConsumer = new ContextConsumer(this, { context: dataTypeContext, subscribe: true });

  static properties = {
    name: { type:String }
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  changeFileName(e){
    console.log(e);
    this._dataTypeConsumer.value.name = e.target.value;
  }

  render() {

    return html`
    <div class="navbar-item">
      <input class="input" @change=${this.changeFileName} type="text" .value="${msg(this._dataTypeConsumer.value.name)}">
    </div>
        `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('input-menu', InputMenu);
