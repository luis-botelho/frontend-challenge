import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

export function createApp() {
  const routes = new Map([
    ['/', ['../web/index.html', 'text/html']],
    ['/style.css', ['../web/style.css', 'text/css']],
    ['/script.js', ['../web/script.js', 'application/javascript']],
    ['/form.js', ['../web/form.js', 'application/javascript']],
    ['/assets/logo.svg', ['../web/assets/logo.svg', 'image/svg+xml']],
    ['/assets/cabeleireiro.png', ['../web/assets/cabeleireiro.png', 'image/png']],
    ['/api/fields', ['../fields.json', 'application/json']],
  ]);

  return createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }

    const route = routes.get(new URL(req.url, 'http://localhost').pathname);
    if (!route) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(req.method === 'HEAD' ? undefined : 'Página não encontrada');
    }

    try {
      const body = readFileSync(new URL(route[0], import.meta.url));
      res.writeHead(200, {
        'Content-Type': `${route[1]}; charset=utf-8`,
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : 'Não foi possível carregar o recurso');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(process.env.PORT || 3000);
}
