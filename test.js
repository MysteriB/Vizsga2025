const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'Unknown';
}

const serverIP = getLocalIP();

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const clientIP = req.socket.remoteAddress.replace(/^.*:/, ''); // Strip IPv6 ::ffff:
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
      .replace('{{clientIP}}', clientIP)
      .replace('{{serverIP}}', serverIP);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
});

server.listen(3000, () => {
  console.log(`Server running at http://${serverIP}:3000`);
});