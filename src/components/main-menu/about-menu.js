import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';

export class AboutMenu extends LitElement {

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
                <figure class="figure">
                    <img src="${process.env.URL_BASE}/images/genio_maquina.jpg" alt="LearningML Genius">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">                                    
                    <div class="media-content">
                        <p>LearningML® Copyright ©2024 Juan David Rodríguez García</p>
                        <p class="is-size-7">Todos los derechos reservados. "LearningML®" es una marca registrada de Juan David Rodríguez García.</p>
                    </div>
                </div>
                <div class="media">
                  <div class="media-content">
                        <p>Traducciones realizadas con chatGPT (sujetas a revisión).</p>
                        <p>Imágenes de portada generadas con DALL-E.</p>
                    </div>   
                  </div>
                <div class="content">
                  <p>Aprende Machine Learning de la manera más fácil y divertida</p>
                  <a target="_blank" href="https://web.learningml.org/agradecimientos/">Agradecimientos</a> |
                  <a target="_blank" href="https://web.learningml.org/patrocinadores-de-learningml/">Patrocinadores</a> |
                  <a target="_blank" href="https://web.learningml.org/acerca-de-learningml-y-su-autor/">El Proyecto</a>
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
