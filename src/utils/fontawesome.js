import { config, dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  faCamera,
  faCheck,
  faCircleStop,
  faGears,
  faGlobe,
  faImages,
  faMicrophone,
  faPenToSquare,
  faPlay,
  faPlus,
  faToggleOff,
  faToggleOn,
  faTrash,
  faTrashCan,
  faUpload,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { faKeyboard, faTrashCan as faTrashCanRegular } from '@fortawesome/free-regular-svg-icons';

const FONT_AWESOME_CSS_TEXT = dom.css();

export { FONT_AWESOME_CSS_TEXT };

export function setupFontAwesome() {
  if (globalThis.__lmlFontAwesomeInitialized) {
    return;
  }

  config.autoAddCss = false;
  library.add(
    faCamera,
    faCheck,
    faCircleStop,
    faGears,
    faGlobe,
    faImages,
    faKeyboard,
    faMicrophone,
    faPenToSquare,
    faPlay,
    faPlus,
    faToggleOff,
    faToggleOn,
    faTrash,
    faTrashCan,
    faTrashCanRegular,
    faUpload,
    faXmark
  );

  globalThis.__lmlFontAwesomeInitialized = true;
}

export function appendFontAwesomeStyles(root, doc = globalThis.document) {
  if (!root || root.__lmlFontAwesomeStylesApplied || !doc?.createElement) {
    return;
  }

  const style = doc.createElement('style');
  style.textContent = FONT_AWESOME_CSS_TEXT;
  root.appendChild(style);
  root.__lmlFontAwesomeStylesApplied = true;
}

export function renderFontAwesomeIcons(root) {
  if (!root || typeof dom?.i2svg !== 'function') {
    return false;
  }

  dom.i2svg({ node: root });
  return true;
}
