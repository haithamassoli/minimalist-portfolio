/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
  readonly PUBLIC_INDEXABLE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
