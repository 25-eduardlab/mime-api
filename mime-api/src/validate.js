import { z } from "zod";

export const contactSchema = z.object({
  nombre: z.string().min(1).max(80),
  apellido: z.string().min(1).max(80),
  email: z.string().email().max(120),
  telefono: z.string().min(3).max(30),
  empresa: z.string().max(120).optional().nullable(),
  cargo: z.string().max(120).optional().nullable(),
  mensaje: z.string().min(10).max(4000),
  acepta: z.boolean(),
});
