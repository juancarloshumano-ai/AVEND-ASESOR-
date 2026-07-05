# AVEND ASESOR — Especificaciones Técnicas Detalladas

**Versión:** 1.0  
**Fecha:** Julio 2026  
**Audiencia:** Claude Code (implementación)  

---

## 1. TIPOS DE DATOS Y INTERFACES (TypeScript)

### User
```typescript
interface Usuario {
  id: string;                    // UUID
  email: string;                 // email@ejemplo.com
  password_hash: string;         // bcrypt encrypted
  especialidad: string;          // 'Matemáticas', 'Comunicación', etc
  escala_magisterial: number;    // 1-7
  region?: string;               // 'Lima', 'Ayacucho', null
  created_at: Date;
  last_login?: Date;
  updated_at: Date;
}

// Validación Zod
import { z } from 'zod';

export const usuarioSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  especialidad: z.string().min(1, 'Selecciona especialidad'),
  escala_magisterial: z.number().min(1).max(7),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;
```

### Chat
```typescript
interface Chat {
  id: string;                        // UUID
  user_id: string;                   // FK usuarios.id
  pregunta: string;                  // User input
  respuesta: string;                 // Claude response
  documentos_usados: DocumentoUsado[];
  tokens_entrada: number;            // Input tokens
  tokens_salida: number;             // Output tokens
  version_normativa: string;         // 'ascenso_2026_v1'
  created_at: Date;
}

interface DocumentoUsado {
  id: string;                        // UUID de normativa
  titulo: string;                    // 'RVM 044-2026'
  version: string;                   // 'v1', 'v2'
  url: string;                       // Link a GitHub JSON
  seccion?: string;                  // Sección específica citada
}

// Validación
export const chatMessageSchema = z.object({
  pregunta: z.string()
    .min(5, 'Pregunta muy breve')
    .max(1000, 'Pregunta muy larga')
    .refine(
      (val) => !val.includes('{') && !val.includes('}'),
      'Caracteres inválidos'
    ),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
```

### Normativa
```typescript
interface Normativa {
  id: string;                        // UUID
  proceso: 'ascenso' | 'nombramiento' | 'reasignacion' | 'destaque' | 'permuta';
  anio: number;                      // 2024, 2025, 2026...
  estado: 'VIGENTE' | 'ARCHIVADA' | 'PENDIENTE';
  archivo_json_url: string;          // URL GitHub raw content
  fecha_publicacion: Date;           // Cuándo salió el documento
  fecha_vigencia_hasta?: Date;       // Cuándo deja de ser vigente
  tags: string[];                    // ['ascenso', '2026', 'cronograma']
  version: string;                   // 'v1', 'v2'
  checksum: string;                  // SHA256 del JSON para detectar cambios
  created_at: Date;
  updated_at: Date;
}

// Validación
export const normativaSchema = z.object({
  proceso: z.enum(['ascenso', 'nombramiento', 'reasignacion', 'destaque', 'permuta']),
  anio: z.number().min(2020).max(2100),
  estado: z.enum(['VIGENTE', 'ARCHIVADA', 'PENDIENTE']),
  archivo_json_url: z.string().url(),
  fecha_publicacion: z.coerce.date(),
  tags: z.array(z.string()),
  version: z.string().regex(/^v\d+$/, 'Formato: v1, v2, etc'),
});
```

### Response API
```typescript
// Success response
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: Date;
}

// Error response
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;        // 'AUTH_FAILED', 'RATE_LIMIT', etc
    message: string;     // Amigable al usuario
    details?: string;    // Técnico (solo dev)
  };
  timestamp: Date;
}

// Auth response
interface AuthResponse {
  id: string;
  email: string;
  token: string;
  expires_in: number;   // segundos
}

// Chat response
interface ChatResponse {
  id: string;
  respuesta: string;
  documentos_usados: DocumentoUsado[];
  tokens_usados: number;
  created_at: Date;
}
```

---

## 2. ESTRUCTURA DE NORMATIVA JSON

### Template: Ascenso 2026

```json
{
  "titulo": "Concurso Público para Ascenso de Escala Magisterial 2026",
  "resolucion": "RVM 044-2026-MINEDU",
  "fecha_publicacion": "2026-04-10",
  "vigente_desde": "2026-04-10",
  "vigente_hasta": "2027-03-31",
  "ley_base": "Ley N° 29944 (Ley de Reforma Magisterial)",
  "aplica_a": "Docentes de Educación Básica en CPM",
  
  "cronograma": {
    "publicacion_resolucion": {
      "fecha": "2026-04-10",
      "descripcion": "Resolución publicada en El Peruano"
    },
    "inscripcion": {
      "fecha_inicio": "2026-04-16",
      "fecha_fin": "2026-05-04",
      "duracion_dias": 19,
      "plataforma": "https://evaluaciondocente.perueduca.pe/ascenso26/",
      "descripcion": "Registro de postulantes en aplicativo MINEDU"
    },
    "prueba_nacional": {
      "fecha": "2026-07-19",
      "hora": "09:00",
      "duracion_minutos": 120,
      "descripcion": "Prueba de conocimientos pedagógicos"
    },
    "resultados": {
      "fecha": "2026-08-30",
      "descripcion": "Publicación de resultados"
    }
  },
  
  "requisitos": {
    "generales": [
      {
        "id": "req_001",
        "titulo": "Permanencia mínima en escala",
        "texto": "Docente debe tener mínimo 5 años en escala actual",
        "escala_aplicable": [1, 2, 3, 4, 5, 6],
        "excepciones": "No aplica para ascenso de 6ª a 7ª (3 años)"
      },
      {
        "id": "req_002",
        "titulo": "Idoneidad ética y profesional",
        "texto": "No tener procesos disciplinarios activos",
        "referencia": "Artículo 51 del Reglamento"
      }
    ],
    "por_escala": {
      "primera_a_segunda": {
        "anos_minimos": 5,
        "puntaje_minimo": 60
      },
      "segunda_a_tercera": {
        "anos_minimos": 5,
        "puntaje_minimo": 70
      }
    }
  },
  
  "evaluacion": {
    "componentes": [
      {
        "nombre": "Prueba Nacional",
        "peso": 60,
        "descripcion": "Examen sobre dominio pedagógico"
      },
      {
        "nombre": "Trayectoria profesional",
        "peso": 20,
        "descripcion": "Años de servicio, cursos completados"
      },
      {
        "nombre": "Desempeño en aula",
        "peso": 20,
        "descripcion": "Evaluación del docente"
      }
    ]
  },
  
  "escalas_magisteriales": [
    {
      "numero": 1,
      "nombre": "Docente I",
      "sueldo_minimo": 2135,
      "sueldo_maximo": 3110
    },
    {
      "numero": 2,
      "nombre": "Docente II",
      "sueldo_minimo": 2444,
      "sueldo_maximo": 3564
    }
  ],
  
  "enlaces": {
    "resolucion_completa": "https://www.elperuano.pe/...",
    "cronograma": "https://evaluaciondocente.perueduca.pe/ascenso26/cronograma/",
    "bases": "https://evaluaciondocente.perueduca.pe/ascenso26/bases/",
    "inscripcion": "https://evaluaciondocente.perueduca.pe/ascenso26/inscripcion/"
  },
  
  "notas": {
    "importante": "Esta información es vigente al 10 de abril de 2026 y puede cambiar",
    "fuente_oficial": "MINEDU - Resolución Viceministerial"
  }
}
```

### Archivo de Metadata (índice maestro)

```json
{
  "version_metadata": "1.0",
  "ultima_actualizacion": "2026-07-15T10:00:00Z",
  "procesos": {
    "ascenso": {
      "2026": {
        "estado": "VIGENTE",
        "version": "v2",
        "fecha_publicacion": "2026-04-10",
        "fecha_ultima_modificacion": "2026-05-15",
        "documentos": [
          {
            "titulo": "Cronograma",
            "archivo": "cronograma.json",
            "checksum": "sha256_xxx",
            "fecha_cambio": "2026-05-15",
            "motivo_cambio": "RVM 100-2026 actualiza fechas"
          },
          {
            "titulo": "Requisitos",
            "archivo": "requisitos.json",
            "checksum": "sha256_yyy"
          }
        ]
      },
      "2025": {
        "estado": "ARCHIVADA",
        "version": "v1",
        "fecha_publicacion": "2025-04-01"
      }
    },
    "nombramiento": {
      "2026": {
        "estado": "VIGENTE",
        "version": "v1",
        "documentos": [...]
      }
    }
  }
}
```

---

## 3. ENDPOINT SPECIFICATIONS

### POST /api/auth/register
```typescript
// Request
{
  "email": "docente@ejemplo.com",
  "password": "SecurePass123",
  "especialidad": "Matemáticas",
  "escala_magisterial": 3
}

// Success Response (201)
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "email": "docente@ejemplo.com",
    "especialidad": "Matemáticas",
    "token": "eyJhbGc...",
    "expires_in": 604800
  },
  "timestamp": "2026-07-15T10:00:00Z"
}

// Error Response (400)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email ya registrado",
    "details": "Usa otro email o recupera tu contraseña"
  },
  "timestamp": "2026-07-15T10:00:00Z"
}

// Posibles errores:
// - 400: Email duplicado, password débil, especialidad inválida
// - 500: Error interno servidor
```

### POST /api/auth/login
```typescript
// Request
{
  "email": "docente@ejemplo.com",
  "password": "SecurePass123"
}

// Success Response (200)
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "email": "docente@ejemplo.com",
    "especialidad": "Matemáticas",
    "token": "eyJhbGc...",
    "expires_in": 604800
  },
  "timestamp": "2026-07-15T10:00:00Z"
}

// Error Response (401)
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Email o contraseña incorrectos"
  },
  "timestamp": "2026-07-15T10:00:00Z"
}

// Headers response:
// Set-Cookie: jwt=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

### POST /api/chat/message
```typescript
// Request
{
  "pregunta": "¿Puedo ascender si tengo 3 años en tercera escala?"
}

// Headers:
// Authorization: Bearer eyJhbGc...

// Success Response (200)
{
  "success": true,
  "data": {
    "id": "chat-uuid",
    "respuesta": "No, según la RVM 044-2026-MINEDU (vigente 10/04/26)...",
    "documentos_usados": [
      {
        "id": "doc-uuid",
        "titulo": "RVM 044-2026-MINEDU",
        "version": "v1",
        "url": "https://github.com/raw/...",
        "seccion": "Requisitos de Permanencia"
      }
    ],
    "tokens_usados": 550,
    "created_at": "2026-07-15T10:05:00Z"
  },
  "timestamp": "2026-07-15T10:05:00Z"
}

// Error Response (400 - Validación)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Pregunta muy breve (mínimo 5 caracteres)"
  },
  "timestamp": "2026-07-15T10:05:00Z"
}

// Error Response (429 - Rate limit)
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Máximo 10 consultas por minuto. Espera 30 segundos."
  },
  "timestamp": "2026-07-15T10:05:00Z"
}

// Error Response (401 - Auth)
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token expirado o inválido"
  },
  "timestamp": "2026-07-15T10:05:00Z"
}

// Error Response (503 - Claude API caída)
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Servicio de IA temporalmente indisponible. Intenta en 1 minuto."
  },
  "timestamp": "2026-07-15T10:05:00Z"
}
```

### GET /api/chat/history
```typescript
// Request
GET /api/chat/history?limit=20&offset=0

// Headers:
// Authorization: Bearer eyJhbGc...

// Success Response (200)
{
  "success": true,
  "data": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "chats": [
      {
        "id": "chat-uuid-1",
        "pregunta": "¿Puedo ascender en 3 años?",
        "respuesta": "No, necesitas 5 años mínimo...",
        "created_at": "2026-07-15T10:05:00Z",
        "documentos_usados": [...]
      },
      {
        "id": "chat-uuid-2",
        "pregunta": "Requisitos para nombramiento",
        "respuesta": "Para nombramiento necesitas...",
        "created_at": "2026-07-14T15:30:00Z",
        "documentos_usados": [...]
      }
    ]
  },
  "timestamp": "2026-07-15T10:10:00Z"
}
```

---

## 4. PROMPTING PARA CLAUDE API

### System Prompt (CRÍTICO - NO MODIFICAR SIN JUSTIFICACIÓN)

```
Eres un asesor experto en la Carrera Pública Magisterial (CPM) de Perú.

TU ROL:
- Responder preguntas de docentes sobre procesos de CPM
- Usar ÚNICAMENTE la normativa provista en DOCUMENTOS
- NUNCA inventar información

INSTRUCCIONES CRÍTICAS:
1. Si la respuesta está en los documentos, cítala exactamente
2. SIEMPRE incluir:
   - La Resolución (ej: "RVM 044-2026-MINEDU")
   - La fecha de vigencia (ej: "vigente desde 10 de abril de 2026")
   - El artículo/numeral específico si es posible
3. Si hay varias respuestas, listalas todas
4. Si la información NO está en los documentos, responder:
   "Esta información no está disponible en la normativa actual.
    Te recomendamos verificar directamente con tu UGEL o MINEDU."
5. Si la pregunta es ambigua, pedir clarificación

FORMATO DE RESPUESTA:
- Párrafos claros y concisos
- Números o viñetas para listar requisitos
- Destacar información crítica (fechas, años, puntajes)
- Incluir fuente al final

PROHIBIDO:
- Opinar sobre la justicia o calidad de la norma
- Dar consejos legales
- Especular sobre futuras convocatorias
- Interpretar más allá de lo escrito en la norma

DOCUMENTOS DISPONIBLES:
[Los documentos vigentes se inyectarán aquí]
```

### Example Prompt Injection (Backend)

```typescript
async function buildClaudePrompt(pregunta: string, documentos: NormativaContent[]): string {
  const systemPrompt = `[System prompt de arriba]`;
  
  const documentosText = documentos.map((doc, i) => `
[DOCUMENTO ${i + 1}]
Título: ${doc.titulo}
Resolución: ${doc.resolucion}
Publicado: ${doc.fecha_publicacion}
Vigente hasta: ${doc.vigente_hasta}

Contenido:
${doc.contenido_completo}
`).join('\n---\n');
  
  const userPrompt = `
PREGUNTA DEL USUARIO:
"${pregunta}"

Por favor responde basándote ÚNICAMENTE en los documentos.
Incluye referencias exactas (resolución, artículo, fecha).
Si no sabes, di "No disponible en normativa actual".
  `;
  
  return `${systemPrompt}\n\n${documentosText}\n\n${userPrompt}`;
}
```

---

## 5. MANEJO DE ERRORES

### Backend Error Codes
```typescript
enum ErrorCode {
  // Auth (40x)
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation (422)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Rate limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Chat (40x)
  CHAT_NOT_FOUND = 'CHAT_NOT_FOUND',
  NO_DOCUMENTS_FOUND = 'NO_DOCUMENTS_FOUND',
  CLAUDE_API_ERROR = 'CLAUDE_API_ERROR',
  
  // Server (50x)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

// Logging de errores
interface ErrorLog {
  timestamp: Date;
  code: ErrorCode;
  message: string;
  details?: any;
  user_id?: string;
  request_id: string;  // Para tracking
}
```

---

## 6. CÁLCULO DE TOKENS (Para tracking)

```typescript
// Claude API retorna token usage en response metadata
interface TokenUsage {
  input_tokens: number;    // Tokens en pregunta + documentos
  output_tokens: number;   // Tokens en respuesta
  total_tokens: number;
}

// Pricing (Sonnet 4.6):
// - Input: $3/1M tokens
// - Output: $15/1M tokens

function calculateCost(usage: TokenUsage): number {
  const inputCost = (usage.input_tokens / 1_000_000) * 3;
  const outputCost = (usage.output_tokens / 1_000_000) * 15;
  return inputCost + outputCost;
}

// Guardamos en BD para tracking:
// tokens_entrada: 450
// tokens_salida: 280
// costo_estimado: $0.0057
```

---

## 7. RATE LIMITING CONFIGURATION

```typescript
// Rate limits recomendados (ajustables)
export const RATE_LIMITS = {
  // Por usuario
  chatMessages: {
    windowMs: 60 * 1000,      // 1 minuto
    max: 10,                   // máximo 10 preguntas/min
  },
  
  // Login attempts
  login: {
    windowMs: 10 * 60 * 1000,  // 10 minutos
    max: 5,                     // máximo 5 intentos
  },
  
  // Por IP (DDoS básico)
  global: {
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 100,                   // máximo 100 requests/IP
  },
};

// Implementación (express-rate-limit)
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Máximo 10 consultas por minuto',
  standardHeaders: true,  // Retorna info en headers
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,  // Por usuario, no por IP
});

router.post('/chat/message', authMiddleware, chatLimiter, chatController.sendMessage);
```

---

## 8. TESTING

### Unit Test Example (searchService)
```typescript
describe('searchService', () => {
  it('debe encontrar documentos relevantes por palabras clave', async () => {
    const query = ['ascenso', 'años', 'escala'];
    const results = await searchService.searchKeywords(query);
    
    expect(results).toHaveLength(3);
    expect(results[0].score).toBeGreaterThan(results[1].score);
    expect(results[0].documento.titulo).toContain('Ascenso');
  });
  
  it('debe retornar solo documentos VIGENTES', async () => {
    const results = await searchService.searchKeywords(['cualquier']);
    
    results.forEach(r => {
      expect(r.documento.estado).toBe('VIGENTE');
    });
  });
});
```

---

## 9. DEPLOYMENT CHECKLIST

### Variables de entorno requeridas (Backend)
```
DATABASE_URL=postgresql://[user]:[pass]@[host]:[port]/[db]
CLAUDE_API_KEY=sk-ant-xxx
JWT_SECRET=tu-super-secreto-min-32-chars
ADMIN_TOKEN=tu-admin-token-seguro
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
GITHUB_TOKEN=ghp_xxx (para leer JSONs privados, opcional)
```

### Variables de entorno (Frontend)
```
NEXT_PUBLIC_API_URL=https://api.avend-asesor.com
NEXT_PUBLIC_APP_NAME=AVEND ASESOR
NEXTAUTH_SECRET=tu-nextauth-secret
NEXTAUTH_URL=https://avend-asesor.vercel.app
```

---

## 10. MONITORING Y ALERTAS

### Métricas clave (a implementar mes 3+)
```
- Latencia promedio de respuesta (objetivo: <3s)
- Tasa de error de Claude API (alert si >1%)
- Uso de tokens (alert si >80% del presupuesto)
- Nuevos usuarios por día
- Retención D7 (7 días después de registro)
```

---

Listo. Este documento es tu "verdad fuente" para cualquier pregunta técnica.
Si Claude Code pregunta "¿cuál es el schema de X?", viene aquí.
