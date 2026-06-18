const http = require("node:http");

const PORT = process.env.PORT || 3000;

function handleRequest(req, res) {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy" }));
    return;
  }

  if (req.method === "POST" && req.url === "/pay") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { amount, currency } = JSON.parse(body);
        if (!amount || amount <= 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid amount" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            id: `pay_${Date.now()}`,
            amount,
            currency: currency || "USD",
            status: "processed",
          })
        );
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => console.log(`Listening on :${PORT}`));
}

module.exports = { handleRequest, server };
