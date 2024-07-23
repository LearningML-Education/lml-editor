// configLoader.js
async function configLoader() {
    const baseElement = document.querySelector('base');
    const baseHref = baseElement ? baseElement.getAttribute('href') : '';
    const response = await fetch(`${baseHref}/config/config.json`);
    const config = await response.json();
    return config;
}

export default configLoader;
