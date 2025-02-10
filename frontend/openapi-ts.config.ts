import {defineConfig} from '@hey-api/openapi-ts';

export default defineConfig({
    input:
        '../openapi.yaml',
    output: {
        format: 'prettier',
        lint: 'eslint',
        path: './src/gen/openapi',
    },
    plugins: [
        {
            name: '@hey-api/client-next',
            runtimeConfigPath: './src/hey-api.ts',
        },
        '@hey-api/sdk',
        {
            enums: 'javascript',
            name: '@hey-api/typescript',
        },
    ],
});