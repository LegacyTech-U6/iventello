// utils/imageHelper.js
require('dotenv').config();
const BASE_URL = process.env.BASE_URL; // ton backend

export function getImageUrl(path) {
  if (!path) return null;          // pas d'image
  if (path.startsWith("http")) return path; // déjà une URL complète
  return `${BASE_URL}${path}`;     // concatène le backend
}
