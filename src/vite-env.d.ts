/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_GEMINI_MAX_OUTPUT_TOKENS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
