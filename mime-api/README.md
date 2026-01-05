# MIME API (Contacto)

API para recibir el formulario de contacto del frontend (Vercel) y guardar en PostgreSQL (Render).

## Endpoints
- POST /api/contact  -> guarda un lead
- GET  /health       -> healthcheck
- GET  /api/admin/contacts -> lista contactos (requiere Basic Auth)

## Variables de entorno (.env)
PORT=3000
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://TU-FRONTEND.vercel.app
ADMIN_USER=admin
ADMIN_PASS=tu_clave_segura

## Desarrollo local
npm install
npm start
