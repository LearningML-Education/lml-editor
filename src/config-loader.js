// configLoader.js
async function configLoader() {
    const response = await fetch('/config/config.json');
    const config = await response.json();
    return config;
}

export default configLoader;
