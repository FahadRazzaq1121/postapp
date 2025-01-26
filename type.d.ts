interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_OTHER_ENV_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export type UserType = {
  _id: string
  name: string
  email: string
  role: string
}