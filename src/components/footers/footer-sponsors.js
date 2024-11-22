import { LitElement, html } from 'lit';
import {msg,  updateWhenLocaleChanges } from '@lit/localize';

export class FooterSponsors extends LitElement {

  constructor() {
    super();
    updateWhenLocaleChanges(this);
  }

  render() {

    return html`

    <footer class="footer has-background-light">
      <div class="container">
        <div class="content has-text-centered">
          <h2 class="title is-4">${msg("Our Premium Sponsors")}</h2>
        </div>

        <div class="columns is-multiline is-centered">
          
          <!-- Patrocinador Oro -->
          <div class="column is-3 has-text-centered">
            <a href="https://www.aprendemaniadocente.com" target="_blank">
              <figure class="image">
                <img src="/images/logo-aprendemania.svg" alt="Logo Aprendemanía docente">
              </figure>
              <p class="has-text-warning">Patrocinador Oro</p>
            </a>
          </div>
          
          <!-- Patrocinador Plata -->
          <div class="column is-3 has-text-centered">
            <a href="https://web.learningml.org/patrocinio-premium/" target="_blank">
              
              <p class="has-text-grey-light">${msg("Click here if you like your logo to appear here")}</p>
            </a>
          </div>

          <!-- Patrocinador Bronce -->
        <!--<div class="column is-3 has-text-centered">
          <a href="https://patrocinadorbronce.com" target="_blank">
            <figure class="image is-64x64 is-centered">
              <img src="logo_bronce.png" alt="Logo Patrocinador Bronce">
            </figure>
            <p class="has-text-brown">Bronce</p>
          </a>
        </div>-->
          
          

          <!-- Puedes añadir más patrocinadores siguiendo esta misma estructura -->

        </div>
      </div>
    </footer>

    `
  }

  createRenderRoot() {
    return this;
  }
}

window.customElements.define('footer-sponsors', FooterSponsors);
