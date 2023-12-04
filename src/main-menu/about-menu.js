import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { ContextConsumer } from '@lit/context';
import { configContext } from '../contexts.js';


export class AboutMenu extends LitElement {

  _configConsumer = new ContextConsumer(this, { context: configContext });

  static properties = {
    activeClass: { String }
  }

  constructor() {
    super();
    this.showAbout = false;
    this.activeClass = "";
    updateWhenLocaleChanges(this);
  }

  handleClick() {
    this.activeClass = "is-active";
  }

  handleHide() {
    this.activeClass = "";
  }

  render() {

    return html`
    <div class="navbar-item">
      <button class="button is-info" @click="${this.handleClick}">
        ${msg("About")}
      </button>
    </div>
    <div class="modal ${this.activeClass}">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="card">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">John Smith</p>
                        <p class="subtitle is-6">@johnsmith</p>
                    </div>
                </div>

                <div class="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                    <a href="#">#css</a> <a href="#">#responsive</a>
                    <br>
                    <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                </div>
            </div>
        </div>
    </div>
    <button @click=${this.handleHide} class="modal-close is-large" aria-label="close"></button>
</div> 
    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('about-menu', AboutMenu);
