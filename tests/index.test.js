const { describe, it, after, before } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { handleRequest } = require("../src/index");

let server;
let baseUrl;

before(async () => {
  server = http.createServer(handleRequest);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () =>
        resolve({ status: res.statusCode, body: JSON.parse(body) })
      );
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

describe("Health check", () => {
  it("returns healthy status", async () => {
    const res = await request("/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "healthy");
  });
});

describe("POST /pay", () => {
  it("processes a valid payment", async () => {
    const res = await request("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 50, currency: "EUR" }),
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "processed");
    assert.equal(res.body.amount, 50);
    assert.equal(res.body.currency, "EUR");
  });

  it("rejects invalid amount", async () => {
    const res = await request("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: -10 }),
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Invalid amount");
  });

  it("rejects malformed JSON", async () => {
    const res = await request("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Invalid JSON");
  });
});

describe("Unknown route", () => {
  it("returns 404", async () => {
    const res = await request("/unknown");
    assert.equal(res.status, 404);
  });
});
