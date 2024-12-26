/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_URL: string
    readonly VITE_BASE_URL: string
    readonly VITE_IMAGE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}