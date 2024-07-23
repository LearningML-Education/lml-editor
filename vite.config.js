import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.URL_BASE': JSON.stringify(env.URL_BASE),    
            'process.env.INIT_MESSAGE_SHOW': JSON.stringify(env.INIT_MESSAGE_SHOW),    
            'process.env.INIT_MESSAGE_TITLE': JSON.stringify(env.INIT_MESSAGE_TITLE),    
            'process.env.INIT_MESSAGE_DESCRIPTION': JSON.stringify(env.INIT_MESSAGE_DESCRIPTION),    
            'process.env.URL_SCRATCH': JSON.stringify(env.URL_SCRATCH),    
                    
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
    };
});
