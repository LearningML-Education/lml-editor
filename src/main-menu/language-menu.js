import { LitElement, html } from 'lit'

export class LanguageMenu extends LitElement {

  static properties = {
    config: { type: Object }
  }

  render() {
    console.log(this.config);

    return html`
<div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link">
      <i class="fa-solid fa-globe"></i>
    </a>

    <div class="navbar-dropdown">
        <a class="navbar-item">
            Español
        </a>
        <a class="navbar-item">
            English
        </a>
        <a class="navbar-item">
            Galego
        </a>
    </div>
</div>
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('language-menu', LanguageMenu);
