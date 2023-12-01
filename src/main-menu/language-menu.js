import { LitElement, html } from 'lit'

export class LanguageMenu extends LitElement {
  
  render() {
    return html`
    <a class="navbar-item">
      Home
    </a>
    `
  }
  
  createRenderRoot(){
    return this;
  }
}

window.customElements.define('language-menu', LanguageMenu);
