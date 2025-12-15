const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const https = require('https');
const selfsigned = require('selfsigned');
const os = require('os');

const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Capturar erros não tratados para diagnóstico
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});
// servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
const USE_HTTPS = process.env.HTTPS === 'true' || process.env.SSL === 'true';

function printAddresses(port) {
  const localUrl = `https://localhost:${port}`;
  console.log(`Open locally: ${localUrl}`);

  const nets = os.networkInterfaces();
  const addresses = [];
  Object.keys(nets).forEach((name) => {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) addresses.push(net.address);
    }
  });
  if (addresses.length > 0) addresses.forEach(ip => console.log(`Open on network: https://${ip}:${port}`));
  else console.log('No network IPv4 address found to show LAN URL.');
}

if (USE_HTTPS) {
  // generate a short-lived self-signed cert for development
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, { days: 365 });

  const server = https.createServer({ key: pems.private, cert: pems.cert }, app);
  server.listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
    printAddresses(PORT);
  });
  server.on('error', (err) => {
    console.error('HTTPS server failed to start:', err);
    process.exit(1);
  });
} else {
  const server = app.listen(PORT, () => {
    console.log(`HTTP server running on port ${PORT}`);
    // still print https-style addresses so user sees desired format, but note it's HTTP
    console.log(`Note: server is running over HTTP. To enable HTTPS set environment variable HTTPS=true`);
    const localUrl = `http://localhost:${PORT}`;
    console.log(`Open locally: ${localUrl}`);
  });
  server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });
}
