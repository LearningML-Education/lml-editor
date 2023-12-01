// configLoader.js
async function configLoader() {
    const response = await fetch('/src/assets/config/config.json');
    const config = await response.json();
    return config;
}

export default configLoader;
