import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pool } from "./src/db.js";
import { contactSchema } from "./src/validate.js";
import { requireBasicAuth } from "./src/basicAuth.js";
import { sendLeadEmail } from "./src/mailer.js";

const app = express();
app.set("trust proxy", 1);


app.use(helmet());
app.use(express.json({ limit: "200kb" }));

// CORS: solo tu frontend (Vercel)
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Anti-spam: 10/minuto por IP
app.use("/api/contact", rateLimit({ windowMs: 60_000, max: 10 }));

app.post("/api/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Datos inválidos",
      details: parsed.error.flatten(),
    });
  }

  const data = parsed.data;
  if (!data.acepta) return res.status(400).json({ error: "Debe aceptar términos" });

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    null;

  const ua = req.headers["user-agent"] || null;

  try {
    // 1) Guardar en BD
    await pool.query(
      `INSERT INTO contacts
        (nombre, apellido, email, telefono, empresa, cargo, mensaje, ip, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        data.nombre.trim(),
        data.apellido.trim(),
        data.email.trim().toLowerCase(),
        data.telefono.trim(),
        (data.empresa || "").trim() || null,
        (data.cargo || "").trim() || null,
        data.mensaje.trim(),
        ip,
        ua,
      ]
    );

    // 2) Enviar correo (si falla, NO rompe)
    let emailSent = false;
    try {
      await sendLeadEmail(data);
      emailSent = true;
    } catch (e) {
      console.error("Email error:", e);
    }

    return res.status(200).json({ ok: true, emailSent });
  } catch (e) {
    console.error("DB error:", e);
    return res.status(500).json({ error: "Error guardando en BD" });
  }
});

// Admin: listar contactos (Basic Auth)
app.get("/api/admin/contacts", requireBasicAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "50", 10) || 50, 200);
  const offset = Math.max(parseInt(req.query.offset || "0", 10) || 0, 0);

  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, apellido, email, telefono, empresa, cargo, mensaje, created_at
       FROM contacts
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({ ok: true, items: rows, limit, offset });
  } catch (e) {
    console.error("DB error:", e);
    res.status(500).json({ error: "Error leyendo BD" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("MIME API listening on", port));
