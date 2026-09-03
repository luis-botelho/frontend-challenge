import fs from 'fs';
import http from 'http';

const data = fs.readFileSync('./fields.json', 'utf8');
const home = fs.readFileSync('./web/index.html', 'utf8');
const css = fs.readFileSync('./web/style.css', 'utf8');
const js = fs.readFileSync('./web/script.js', 'utf8');  

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(home);

  } else if (req.url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(css);

  } else if (req.url === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(js);

  } else if (req.url === '/api/fields') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});


server.listen(3000);