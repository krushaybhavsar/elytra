/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL_SERVER_BASE_URL: string;
  readonly VITE_LOCAL_SERVER_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
