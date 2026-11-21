// SellerBuz — GitHub push webhook → VPS auto-deploy listener
// No external dependencies (Node built-ins only).
// Env: WEBHOOK_SECRET (required), PORT, DEPLOY_BRANCH, DEPLOY_SCRIPT
"use strict";

const http = require("http");
const crypto = require("crypto");
const { execFile } = require("child_process");

const PORT = process.env.PORT || 9777;
const SECRET = process.env.WEBHOOK_SECRET || "";
const BRANCH = process.env.DEPLOY_BRANCH || "main";
const SCRIPT = process.env.DEPLOY_SCRIPT || "/opt/sellerbuz/deploy.sh";

if (!SECRET) {
  console.error("FATAL: WEBHOOK_SECRET is not set");
  process.exit(1);
}

let deploying = false;

function verify(sig, body) {
  if (!sig) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", SECRET).update(body).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/deploy") {
    res.writeHead(404);
    return res.end("not found");
  }

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks);

    if (!verify(req.headers["x-hub-signature-256"], body)) {
      res.writeHead(401);
      return res.end("bad signature");
    }

    const event = req.headers["x-github-event"];
    if (event === "ping") {
      res.writeHead(200);
      return res.end("pong");
    }
    if (event !== "push") {
      res.writeHead(204);
      return res.end();
    }

    let payload = {};
    try {
      payload = JSON.parse(body.toString("utf8"));
    } catch (_) {}

    if (payload.ref !== `refs/heads/${BRANCH}`) {
      res.writeHead(200);
      return res.end(`ignored ref: ${payload.ref}`);
    }

    res.writeHead(202);
    res.end("deploy started");

    if (deploying) {
      console.log("deploy already in progress — skipping overlap");
      return;
    }
    deploying = true;
    const commit = payload.head_commit ? payload.head_commit.id : "?";
    console.log(new Date().toISOString(), "deploy triggered, commit", commit);

    execFile("bash", [SCRIPT], { maxBuffer: 20 * 1024 * 1024 }, (err, out, serr) => {
      deploying = false;
      if (out) console.log(out);
      if (serr) console.error(serr);
      console.log(err ? "DEPLOY FAILED: " + err.message : "DEPLOY OK");
    });
  });
});

server.listen(PORT, () => console.log(`SellerBuz webhook listening on :${PORT}`));
