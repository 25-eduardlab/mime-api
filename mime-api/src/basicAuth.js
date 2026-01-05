export function requireBasicAuth(req, res, next) {
  const u = process.env.ADMIN_USER;
  const p = process.env.ADMIN_PASS;
  if (!u || !p) {
    return res.status(500).json({ error: "ADMIN_USER/ADMIN_PASS no configurados" });
  }

  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ error: "Auth requerida" });
  }

  const b64 = header.slice("Basic ".length);
  let decoded = "";
  try { decoded = Buffer.from(b64, "base64").toString("utf8"); } catch {}
  const [user, pass] = decoded.split(":");

  if (user != u || pass != p) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  next();
}
