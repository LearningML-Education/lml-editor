export const installDomShim = ({ href = 'http://localhost/' } = {}) => {
  if (!globalThis.HTMLElement) {
    globalThis.HTMLElement = class HTMLElement extends EventTarget {
      constructor() {
        super();
        this.shadowRoot = null;
      }

      attachShadow() {
        const root = {
          adoptedStyleSheets: [],
          insertBefore() {},
          appendChild() {},
          removeChild() {},
          querySelector() { return null; },
          querySelectorAll() { return []; }
        };
        this.shadowRoot = root;
        return root;
      }
    };
  }

  if (!globalThis.customElements) {
    const registry = new Map();
    globalThis.customElements = {
      define(name, ctor) {
        if (!registry.has(name)) registry.set(name, ctor);
      },
      get(name) {
        return registry.get(name);
      }
    };
  }

  const win = new EventTarget();
  win.location = { href };
  win.customElements = globalThis.customElements;
  win.HTMLElement = globalThis.HTMLElement;
  win.dispatchEvent = EventTarget.prototype.dispatchEvent.bind(win);
  win.addEventListener = EventTarget.prototype.addEventListener.bind(win);
  win.removeEventListener = EventTarget.prototype.removeEventListener.bind(win);

  if (!globalThis.document) {
    globalThis.document = {
      createComment() {
        return {};
      },
      createTreeWalker() {
        return {};
      },
      createElement() {
        return {
          setAttribute() {},
          removeAttribute() {},
          appendChild() {},
          content: { cloneNode() { return {}; } }
        };
      },
      importNode(node) {
        return node;
      }
    };
  }

  globalThis.window = win;
  return win;
};
