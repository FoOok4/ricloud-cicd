const http = require('http');
const app = require('./app');

let server;
let baseUrl;

beforeAll((done) => {
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
    }).on('error', reject);
  });
}

describe('Hello World App', () => {
  test('GET / returns Hello, World! message', async () => {
    const response = await get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, World!' });
  });

  test('GET /health returns healthy status', async () => {
    const response = await get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'healthy' });
  });
});
