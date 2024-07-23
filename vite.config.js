import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.URL_BASE': JSON.stringify(env.URL_BASE),            
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
    };
});
