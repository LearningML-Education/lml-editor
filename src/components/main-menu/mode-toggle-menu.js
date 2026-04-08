import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { classMap } from 'lit/directives/class-map.js';


export class ModeToggleMenu extends LitElement {

  static properties = {
    advanced: { type: Boolean },
  }

  constructor() {
    super();
    this.advanced = false;
    updateWhenLocaleChanges(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  setAdvancedMode(advanced) {
    if (this.advanced === advanced) {
      return;
    }

    this.advanced = advanced;

    this.dispatchEvent(new CustomEvent('toggle-advanced-mode', {
      bubbles: true,
      composed: true,
      detail: { advanced: this.advanced }
    }));
  }

  render() {
    return html`
    <style>
      .mode-toggle-menu {
        display: flex;
        align-items: center;
      }

      .mode-switch {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.14);
        border-radius: 999px;
        padding: 0.2rem;
        gap: 0.2rem;
      }

      .mode-switch__option {
        border: 0;
        border-radius: 999px;
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
        font-weight: 600;
        background: transparent;
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        transition: background-color 120ms ease, color 120ms ease, transform 120ms ease;
      }

      .mode-switch__option.is-active {
        background: white;
        color: #363636;
      }

      .mode-switch__option:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.85);
        outline-offset: 2px;
      }

      @media screen and (max-width: 1023px) {
        .mode-toggle-menu {
          width: 100%;
        }

        .mode-switch {
          width: 100%;
        }

        .mode-switch__option {
          flex: 1;
          justify-content: center;
        }
      }
    </style>

    <div class="navbar-item">
      <div class="mode-toggle-menu">
        <div class="mode-switch" role="group" aria-label=${msg('Mode')}>
          <button
            class=${classMap({
              'mode-switch__option': true,
              'is-active': !this.advanced
            })}
            aria-pressed=${String(!this.advanced)}
            @click=${() => this.setAdvancedMode(false)}
          >
            <span>${msg('Basic')}</span>
          </button>

          <button
            class=${classMap({
              'mode-switch__option': true,
              'is-active': this.advanced
            })}
            aria-pressed=${String(this.advanced)}
            @click=${() => this.setAdvancedMode(true)}
          >
            <span>${msg('Advanced')}</span>
          </button>
        </div>
      </div>
    </div>
        `
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    const initShadow = globalThis.__lmlInitShadowRoot;
    if (typeof initShadow === 'function') {
      initShadow(this, root);
    }
    return root;
  }
}

window.customElements.define('mode-toggle-menu', ModeToggleMenu);
