import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createApp } from '../api/server.js';
import { validationMessage } from '../web/form.js';

const data = JSON.parse(readFileSync(new URL('../fields.json', import.meta.url)));

test('API entrega o JSON original e serve os arquivos da interface', async (t) => {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(`${base}/api/fields`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await response.json(), data);
  for (const [path, type] of [['/', 'text/html'], ['/style.css', 'text/css'], ['/script.js', 'application/javascript'], ['/form.js', 'application/javascript']]) {
    const asset = await fetch(`${base}${path}`);
    assert.equal(asset.status, 200);
    assert.ok(asset.headers.get('content-type').includes(type));
    assert.ok((await asset.text()).length > 0);
  }
  for (const [path, type] of [['/assets/logo.svg', 'image/svg+xml'], ['/assets/cabeleireiro.png', 'image/png']]) {
    const asset = await fetch(`${base}${path}`);
    assert.equal(asset.status, 200);
    assert.ok(asset.headers.get('content-type').includes(type));
    assert.ok((await asset.arrayBuffer()).byteLength > 0);
  }
  assert.equal((await fetch(`${base}/missing`)).status, 404);
  const post = await fetch(`${base}/api/fields`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');
  const head = await fetch(`${base}/api/fields`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.deepEqual(await (await fetch(`${base}/api/fields?v=1`)).json(), data);
});

test('obrigatoriedade respeita todos os campos do JSON e ignora espaços', () => {
  for (const field of [...data._embedded.request_fields, ...data._embedded.user_fields]) {
    assert.equal(validationMessage(field, '   '), field.required ? 'este campo é requerido' : '');
  }
});

test('selects aceitam valores originais e rejeitam opções inexistentes', () => {
  for (const field of data._embedded.request_fields.filter((field) => field.type === 'enumerable')) {
    for (const value of Object.keys(field.values)) assert.equal(validationMessage(field, value), '');
    assert.equal(validationMessage(field, 'inexistente'), 'Selecione uma opção válida');
  }
});

test('valida email, CEP e celular com e sem pontuação', () => {
  for (const [type, valid, invalid] of [
    ['email', ['pessoa@example.com'], ['pessoa', 'a@', 'a b@c.com']],
    ['cep', ['01234567', '01234-567'], ['123', 'abcdefgh', '12-345678']],
    ['phone', ['11987654321', '(11) 98765-4321'], ['119876', 'abcdefghijk', '(00) 98765-4321']],
  ]) {
    for (const value of valid) assert.equal(validationMessage({ type, required: true }, value), '');
    for (const value of invalid) assert.notEqual(validationMessage({ type, required: true }, value), '');
  }
});
