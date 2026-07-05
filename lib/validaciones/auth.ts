import { z } from 'zod';

export const esquemaRegistro = z.object({
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(8, 'Mínimo 8 caracteres'),
  modalidad: z.enum(['EBR', 'EBA', 'EBE']),
  nivel: z.enum(['Inicial', 'Primaria', 'Secundaria']).optional(),
  especialidad: z.string().optional(),
});

export const esquemaInicioSesion = z.object({
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
});