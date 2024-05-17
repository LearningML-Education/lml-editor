import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../../contexts.js';


export class FooterCopyRight extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext, subscribe: true });


  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`
  <div class="notification is-primary is-light">
    <div class="content has-text-centered">
      <p>
        <strong>LearningML® </strong> Copyright ©2024 by <a href="https://juandarodriguez.es">Juan David Rodríguez García</a>. 
        <p class="is-size-7"><strong>LearningML®</strong> es propiedad intelectual de Juan David Rodríguez y está protegido por las leyes de derechos de autor. Queda estrictamente prohibida cualquier reproducción, distribución o modificación sin la autorización previa y por escrito de Juan David Rodríguez.</p>
      </p>
    </div>
  </div>
    `
  }
  
  createRenderRoot() {
    return this;
  }
}

window.customElements.define('footer-copyright', FooterCopyRight);
