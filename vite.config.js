import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const rawBaseUrl = env.BASE_URL || process.env.BASE_URL || '/';
    const normalizedBaseUrl = rawBaseUrl.startsWith('/')
        ? rawBaseUrl
        : `/${rawBaseUrl}`;
    const baseUrl = normalizedBaseUrl.endsWith('/')
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/`;
    return {
        base: baseUrl,
        define: {
            'process.env.INIT_MESSAGE_SHOW': env.INIT_MESSAGE_SHOW == "true",    
            'process.env.INIT_MESSAGE_TITLE': JSON.stringify(env.INIT_MESSAGE_TITLE),    
            'process.env.INIT_MESSAGE_DESCRIPTION': JSON.stringify(env.INIT_MESSAGE_DESCRIPTION),
            'process.env.INIT_MESSAGE_TIMEOUT': JSON.stringify(env.INIT_MESSAGE_TIMEOUT),
            'process.env.SHOW_FOOTER_SPONSORS': env.SHOW_FOOTER_SPONSORS == "true",
            'process.env.URL_SCRATCH': JSON.stringify(env.URL_SCRATCH || '/scratch/'),
            'process.env.LML_ALGO_MODE': JSON.stringify(env.LML_ALGO_MODE || 'client'),
            'process.env.LML_ALGO_BASE_URL': JSON.stringify(env.LML_ALGO_BASE_URL || ''),
            'process.env.FORCE_CPU_BACKEND_CHROME': env.FORCE_CPU_BACKEND_CHROME == "true",
                    
            // If you want to exposes all env variables, which is not recommended
            // 'process.env': env
        },
        server: {
            proxy: {
                '/scratch': {
                    target: 'http://localhost:8601',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/scratch/, '')
                }
            }
        },
        optimizeDeps: {
            // Force pre-bundling of CJS deps pulled by lml-algorithms/lml-speech-commands
            // to avoid runtime browser errors such as "module is not defined".
            include: [
                'lml-algorithms',
                'lml-speech-commands',
                'long',
                'jszip',
                'file-saver'
            ]
        }
    };
});
