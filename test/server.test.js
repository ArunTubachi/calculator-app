const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('home page loads and contains the calculator', async () => {
  const server = app.listen(0); // port 0 = pick any free port
  try {
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/`);
    const body = await res.text();

    assert.strictEqual(res.status, 200);
    assert.ok(body.includes('calculator'));
  } finally {
    server.close();
  }
});