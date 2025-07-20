/// <reference types="vite/client" />

// Global type declarations for the application
declare global {
  interface Window {
    ENV: {
      NODE_ENV: string;
    };
  }
}

export {};
