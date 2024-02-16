/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REGION: string;
    readonly VITE_WS_API: string;
    readonly VITE_CONFIGURATION_API: string;
    readonly VITE_DATA_COLLECTOR_API: string;
    readonly VITE_COGNITO_USER_POOL_ID: string;
    readonly VITE_COGNITO_USER_POOL_CLIENT_ID: string;
    readonly VITE_COGNITO_IDENTITY_POOL_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
