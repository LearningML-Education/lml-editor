async function configLoader() {    
    console.log(process.env.URL_BASE);
    const response = await fetch(`${process.env.URL_BASE}/config/config.json`);
    const config = await response.json();
    return config;
}

export default configLoader;
