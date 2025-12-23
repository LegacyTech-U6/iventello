// src/config.js

// Détecte si on est dans Electron
export function isElectron() {
  return typeof window !== 'undefined' &&
         typeof window.process === 'object' &&
         window.process.type === 'renderer';
}

// Détermine l'URL de l'API selon l'environnement
export const API_URL = isElectron()
  ? 'http://localhost:3001/api'              // backend local SQLite pour app installée
  : import.meta.env.VITE_API_URL;        // backend web
