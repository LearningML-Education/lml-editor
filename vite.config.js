import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.INIT_MESSAGE_SHOW': env.INIT_MESSAGE_SHOW == "true",    
            'process.env.INIT_MESSAGE_TITLE': JSON.stringify(env.INIT_MESSAGE_TITLE),    
            'process.env.INIT_MESSAGE_DESCRIPTION': JSON.stringify(env.INIT_MESSAGE_DESCRIPTION),
            'process.env.INIT_MESSAGE_TIMEOUT': JSON.stringify(env.INIT_MESSAGE_TIMEOUT),
            'process.env.SHOW_FOOTER_SPONSORS': env.SHOW_FOOTER_SPONSORS == "true",
            'process.env.URL_SCRATCH': JSON.stringify(env.URL_SCRATCH),    
                    
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
    };
});
