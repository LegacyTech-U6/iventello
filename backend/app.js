// index.js
require('dotenv').config();
const app = require('./index');
const http = require('http');
const PORT = process.env.PORT ;
const { initSocket } = require("./src/config/socket");

const server = http.createServer(app);
initSocket(server); // initialise Socket.io

// Initialise les sockets sur ce serveur

// Utilise le même serveur pour écouter le port
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
