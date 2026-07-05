# AVEND ASESOR — Arquitectura Técnica

**Versión:** 1.0  
**Fecha:** Julio 2026  
**Audiencia:** Claude Code, Desarrolladores  

---

## 1. PRINCIPIOS ARQUITECTÓNICOS

1. **Simplicidad escalable:** Máximo con mínimo (prefer serverless over complex orchestration)
2. **Mantenibilidad:** 1 persona debe entender y mantener todo el código
3. **Precisión sobre velocidad:** Respuestas correctas > respuestas rápidas
4. **Auditoría trail:** Cada respuesta guarda qué documentos usó, cuándo, versión
5. **Data minimalism:** Solo recopilar email + especialidad del docente, nada más invasivo

---

## 2. ARQUITECTURA DE CAPAS

```
┌────────────────────────────────────────────────────────────┐
│  TIER 1: FRONTEND (Cliente)                                │
│  - Next.js 14 (React + TypeScript)                         │
│  - Hosted on Vercel (gratuito)                             │
│  - Responsivo mobile-first                                  │
└────────────────┬─────────────────────────────────────────┘
                 │ HTTPS + REST API
┌────────────────▼─────────────────────────────────────────┐
│  TIER 2: BACKEND (API)                                    │
│  - Express.js + Node.js 20 LTS                            │
│  - Hosted on Railway/Render (S/5-7/mes)                   │
│  - Middleware: JWT auth, rate limiting, logging           │
├────────────────┬─────────────────────────────────────────┤
│  Servicios     │                                          │
│  - claudeService (llamadas a Claude API)                  │
│  - searchService (búsqueda en normativa)                  │
│  - dbService (queries Supabase)                           │
│  - normativaService (versionado de documentos)            │
└────────────────┬─────────────────────────────────────────┘
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
┌───▼──┐  ┌──────▼───┐  ┌─────▼──┐  ┌──────▼────┐
│ BD   │  │Normativa │  │ Cache  │  │IA API    │
│Supa  │  │(GitHub)  │  │(futura)│  │(Claude)  │
│base  │  │JSON      │  │        │  │          │
└──────┘  └──────────┘  └────────┘  └──────────┘
```

---

## 3. STACK TECNOLÓGICO DEFINITIVO

### Frontend
```
Framework:       Next.js 14 + TypeScript
UI Components:   ShadCN/UI + Tailwind CSS
State:           TanStack Query (React Query)
Auth:            NextAuth.js v5 (JWT + Credentials)
HTTP Client:     Axios + Interceptors
Deployment:      Vercel (gratuito)
Monitoring:      Sentry (free tier)
```

### Backend
```
Runtime:         Node.js 20 LTS
Framework:       Express.js v4 + TypeScript
Database:        Supabase (PostgreSQL) — gratuito tier
Auth:            jsonwebtoken (JWT)
Validation:      Zod (type-safe validation)
HTTP Client:     axios (para Claude API)
Rate Limiting:   express-rate-limit
Logging:         Winston (structured logging)
Deployment:      Railway o Render (S/5-7/mes después gratis)
Scheduler:       node-cron (para tareas periódicas)
```

### AI Integration
```
LLM Provider:    Anthropic Claude API (sonnet-4-6)
Pattern:         RAG (Retrieval-Augmented Generation)
Prompting:       System + Context injection
Cost:            Pago por uso (~S/50-100/mes a 2k users)
```

### Data & Storage
```
Primary DB:      Supabase PostgreSQL (gratuito: 500MB, 2M API calls/mes)
JSON Storage:    GitHub (versionado gratuito, público)
File Hosting:    Supabase Storage (gratuito: 1GB)
Backups:         Daily Supabase backup (automático)
```

### DevOps
```
Version Control: GitHub
CI/CD:           GitHub Actions (gratuito)
Container:       Docker (opcional, no requerido MVP)
Secrets:         GitHub Secrets + .env.local
Monitoring:      Vercel Analytics + Railway logs
```

---

## 4. ESTRUCTURA DE CARPETAS

```
avend-asesor/
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml       # Deploy Vercel en push main
│       └── deploy-backend.yml        # Deploy Railway en push main
│
├── frontend/                          # Next.js app
│   ├── app/
│   │   ├── layout.tsx                # Root layout + providers
│   │   ├── page.tsx                  # Landing page
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Panel principal del docente
│   │   │   ├── layout.tsx            # Layout protegido (requiere auth)
│   │   │   └── settings/
│   │   │       └── page.tsx          # Perfil + configuración
│   │   └── api/
│   │       └── auth/                 # NextAuth endpoints
│   │
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── Chat/
│   │   │   ├── ChatInterface.tsx     # Chatbox principal
│   │   │   ├── MessageList.tsx       # Historial
│   │   │   └── InputBox.tsx          # Input + botón enviar
│   │   ├── Common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorAlert.tsx
│   │   └── UI/
│   │       ├── Button.tsx (ShadCN)
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Dialog.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # Axios instance + interceptors
│   │   │   ├── auth.ts               # Login, register, logout
│   │   │   └── chat.ts               # sendMessage, getHistory
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Hook para verificar autenticación
│   │   │   └── useChat.ts            # Hook para manejar consultas
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   └── utils/
│   │       ├── formatDate.ts
│   │       └── validators.ts
│   │
│   ├── styles/
│   │   └── globals.css               # Estilos globales + Tailwind
│   │
│   ├── public/
│   │   ├── logo.svg
│   │   └── favicon.ico
│   │
│   ├── .env.local                    # Variables de entorno (NO commitear)
│   ├── .env.example                  # Template
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts        # POST /auth/register, /auth/login
│   │   │   ├── chat.routes.ts        # POST /chat/message, GET /chat/history
│   │   │   ├── normativa.routes.ts   # POST /normativa/upload (admin)
│   │   │   ├── user.routes.ts        # GET /user/profile
│   │   │   └── health.routes.ts      # GET /health (liveness check)
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts     # register, login logic
│   │   │   ├── chatController.ts     # sendMessage, getHistory
│   │   │   ├── normativaController.ts # uploadDocument
│   │   │   └── userController.ts     # getProfile, updateProfile
│   │   │
│   │   ├── services/
│   │   │   ├── claudeService.ts      # Llamadas a Claude API
│   │   │   │                         # - formatPrompt()
│   │   │   │                         # - callClaude()
│   │   │   │                         # - parseResponse()
│   │   │   │
│   │   │   ├── searchService.ts      # Búsqueda en normativa
│   │   │   │                         # - searchKeywords()
│   │   │   │                         # - retrieveDocuments()
│   │   │   │
│   │   │   ├── dbService.ts          # Queries Supabase
│   │   │   │                         # - saveChat()
│   │   │   │                         # - getUser()
│   │   │   │                         # - saveNormativa()
│   │   │   │
│   │   │   ├── normativaService.ts   # Gestión de versiones
│   │   │   │                         # - loadFromGitHub()
│   │   │   │                         # - markAsArchived()
│   │   │   │
│   │   │   └── authService.ts        # Hash + JWT
│   │   │       # - hashPassword()
│   │   │       # - verifyPassword()
│   │   │       # - generateToken()
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts     # Verifica JWT
│   │   │   ├── errorHandler.ts       # Catch all errors
│   │   │   ├── rateLimiter.ts        # Rate limiting
│   │   │   └── logger.ts             # Winston logging
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts           # Supabase client
│   │   │   ├── claude.ts             # Claude API key + config
│   │   │   └── env.ts                # Validar variables de entorno
│   │   │
│   │   ├── types/
│   │   │   └── index.ts              # Interfaces compartidas
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts             # Winston instance
│   │   │   ├── crypto.ts             # Encrypt/decrypt if needed
│   │   │   └── constants.ts          # Rate limits, timeouts, etc
│   │   │
│   │   └── index.ts                  # Entry point (app.listen)
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   └── searchService.test.ts
│   │   └── integration/
│   │       └── chat.test.ts          # Test flujo completo
│   │
│   ├── .env.local                    # NO commitear
│   ├── .env.example
│   ├── tsconfig.json
│   ├── Dockerfile                    # Si usas Railway/Docker
│   └── package.json
│
├── normativa/                         # Tú completas esto
│   ├── ascenso/
│   │   ├── 2026/
│   │   │   ├── cronograma.json       # VIGENTE
│   │   │   ├── requisitos.json       # VIGENTE
│   │   │   ├── evaluacion.json       # VIGENTE
│   │   │   ├── bases.json            # VIGENTE
│   │   │   └── metadata.json         # Info sobre los docs
│   │   │
│   │   └── 2025/
│   │       ├── cronograma.json       # ARCHIVADA (histórico)
│   │       └── requisitos.json       # ARCHIVADA
│   │
│   ├── nombramiento/
│   │   ├── 2026/
│   │   │   ├── requisitos.json
│   │   │   ├── cronograma.json
│   │   │   └── fases.json
│   │   └── metadata.json
│   │
│   ├── metadata.json                 # Índice maestro (actualizar cada vez)
│   │                                 # {
│   │                                 #   "ascenso": {
│   │                                 #     "2026": { 
│   │                                 #       "estado": "VIGENTE",
│   │                                 #       "publicado": "2026-04-10",
│   │                                 #       "documentos": ["cronograma", ...]
│   │                                 #     }
│   │                                 #   }
│   │                                 # }
│   │
│   └── README.md                     # GUÍA: Cómo agregar normativa
│
├── .gitignore
├── README.md                         # Documentación general del proyecto
├── AVEND_01_CONTEXTO_Y_VISION.md    # (este documento)
├── AVEND_02_ARQUITECTURA.md         # (este archivo)
├── AVEND_03_FLUJOS.md
├── AVEND_04_GUIA_INICIO.md
└── AVEND_05_ESPECIFICACIONES.md
```

---

## 5. BASE DE DATOS (Supabase PostgreSQL)

### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  especialidad VARCHAR(100),                    -- 'Matemáticas', 'Comunicación', etc
  escala_magisterial SMALLINT CHECK (escala_magisterial BETWEEN 1 AND 7),
  region VARCHAR(100),                         -- Optional: 'Lima', 'Ayacucho', etc
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);
```

### Tabla: `chats`
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  pregunta TEXT NOT NULL,
  respuesta TEXT NOT NULL,
  documentos_usados JSONB,                    -- Array de {doc_id, versión}
  tokens_entrada SMALLINT,                    -- Para tracking de costos
  tokens_salida SMALLINT,
  version_normativa VARCHAR(50),              -- 'ascenso_2026_v1'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

### Tabla: `normativa`
```sql
CREATE TABLE normativa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso VARCHAR(50) NOT NULL,                -- 'ascenso', 'nombramiento', etc
  anio SMALLINT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'VIGENTE',  -- VIGENTE, ARCHIVADA, PENDIENTE
  archivo_json_url VARCHAR(500) NOT NULL,    -- URL en GitHub
  fecha_publicacion DATE NOT NULL,
  fecha_vigencia_hasta DATE,
  tags TEXT[],                                -- ['ascenso', '2026', 'cronograma']
  version VARCHAR(20),                        -- v1, v2, v3
  checksum VARCHAR(64),                       -- SHA256 para detectar cambios
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE (proceso, anio, version),
  INDEX idx_estado (estado),
  INDEX idx_proceso_estado (proceso, estado)
);
```

### Tabla: `sesiones`
```sql
CREATE TABLE sesiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_jwt TEXT UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

---

## 6. API ENDPOINTS (Backend)

### Authentication
```
POST /api/auth/register
  Body: { email, password, especialidad, escala_magisterial }
  Response: { id, email, token }

POST /api/auth/login
  Body: { email, password }
  Response: { id, email, token, expires_in }

POST /api/auth/logout
  Headers: { Authorization: Bearer <JWT> }
  Response: { message: "ok" }
```

### Chat (Main functionality)
```
POST /api/chat/message
  Headers: { Authorization: Bearer <JWT> }
  Body: { pregunta: string }
  Response: {
    id: UUID,
    respuesta: string,
    documentos_usados: [{ id, versión, url }],
    tokens_usados: number,
    created_at: timestamp
  }

GET /api/chat/history
  Headers: { Authorization: Bearer <JWT> }
  Query: { limit: 20, offset: 0 }
  Response: [
    {
      id: UUID,
      pregunta: string,
      respuesta: string (primeros 200 chars),
      created_at: timestamp
    }
  ]

GET /api/chat/:id
  Headers: { Authorization: Bearer <JWT> }
  Response: {
    id, pregunta, respuesta, documentos_usados, created_at
  }
```

### User
```
GET /api/user/profile
  Headers: { Authorization: Bearer <JWT> }
  Response: { id, email, especialidad, escala_magisterial, created_at }

PUT /api/user/profile
  Headers: { Authorization: Bearer <JWT> }
  Body: { especialidad?, escala_magisterial? }
  Response: { id, email, especialidad, escala_magisterial }
```

### Normativa (Admin only)
```
POST /api/normativa/upload
  Headers: { Authorization: Bearer <JWT>, "X-Admin-Token": <SECRET> }
  Body: {
    proceso: 'ascenso',
    anio: 2026,
    version: 'v1',
    archivo_json_url: 'https://github.com/...',
    fecha_publicacion: '2026-04-10',
    tags: ['ascenso', '2026']
  }
  Response: { id, estado: 'VIGENTE' }

POST /api/normativa/archive/:id
  Headers: { Authorization, X-Admin-Token }
  Body: { motivo: "Nueva versión publicada" }
  Response: { id, estado: 'ARCHIVADA' }

GET /api/normativa/status
  Headers: { Authorization, X-Admin-Token }
  Response: {
    procesos: {
      ascenso: { 2026: { estado: 'VIGENTE', version: 'v2' } },
      nombramiento: { ... }
    }
  }
```

### Health
```
GET /api/health
  Response: { status: 'ok', uptime: 12345 }
```

---

## 7. FLUJO DE DATOS CORE: Chat

```
1. Frontend (user pregunta):
   POST /api/chat/message
   { pregunta: "¿Puedo ascender en 3 años?" }
   ↓
2. Backend - Auth:
   Verifica JWT válido
   ↓
3. Backend - Search:
   searchService.searchKeywords(["ascenso", "años", "requisitos"])
   → Trae JSONs vigentes de GitHub
   ↓
4. Backend - Format:
   claudeService.formatPrompt({
     sistema: "Responde SOLO citando documentos",
     documentos: [...],
     pregunta: "¿Puedo ascender en 3 años?"
   })
   ↓
5. Claude API:
   Procesa + genera respuesta con citas
   ↓
6. Backend - Save:
   dbService.saveChat({
     user_id, pregunta, respuesta, docs_usados, tokens
   })
   ↓
7. Frontend:
   Muestra respuesta + historial actualizado
```

---

## 8. DEPLOYMENT

### Frontend (Vercel)
```
1. Push a GitHub main
2. Vercel auto-detecta Next.js
3. Deploya en ~60s a avend.vercel.app
4. Env vars: NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET
```

### Backend (Railway)
```
1. Push a GitHub main
2. Railway se conecta a rama main
3. Lee Dockerfile (o detecta Node.js)
4. Deploya en ~2min a avend-backend.railway.app
5. Env vars: DATABASE_URL, CLAUDE_API_KEY, JWT_SECRET
```

### Normativa (GitHub)
```
1. Commiteas cambios en /normativa/*.json
2. GitHub guarda historial (versionado automático)
3. Backend lee via GitHub API (token personal)
4. Cambios detectados automáticamente en siguiente deploy
```

---

## 9. SEGURIDAD

### Autenticación
- JWT en HTTP-only cookie (no accesible desde JavaScript)
- Expira en 7 días (configurable)
- Refresh token logic: si > 24h expirante, regenera silenciosamente

### Rate Limiting
```
- 10 consultas/minuto por usuario (evita abuso IA)
- 5 intentos de login/10 min (previene fuerza bruta)
- 100 requests/minuto por IP (DDoS básico)
```

### Data Privacy
```
- Solo almacena: email + especialidad + escala (nada invasivo)
- Contraseñas: bcrypt con salt (nunca plain text)
- Chats privados: usuario solo ve sus propios chats
- HTTPS obligatorio (Vercel + Railway lo dan)
```

### API Security
```
- CORS: Solo tu frontend (no acepta requests desde cualquier lado)
- Input validation: Zod en cada ruta (no aceptar JSON inválido)
- SQL injection: Supabase + ORM maneja esto (prepared statements)
- Admin routes: Requieren X-Admin-Token extra (env var)
```

---

## 10. LOGGING Y MONITOREO

### Logs estructurados (Winston)
```
Backend genera logs con formato JSON:
{
  "timestamp": "2026-07-15T10:30:00Z",
  "level": "info",
  "service": "chatService",
  "user_id": "uuid-xxx",
  "action": "query_sent_to_claude",
  "tokens_in": 450,
  "tokens_out": 200,
  "latency_ms": 1230
}
→ Enviados a Railway logs (retención 7 días gratis)
```

### Errores
```
- Errores críticos: Email automático (usando SendGrid o similar)
- Errores API: Sentry (free tier, 5k errors/mes)
- Uptime: UptimeRobot (ping cada 5 min a /health)
```

---

## 11. TESTING

### Unit Tests (necesario)
```
- searchService: ¿busca correctamente en JSON?
- claudeService: ¿formatea bien el prompt?
- authService: ¿hashea passwords correctly?

Herramienta: Jest + Supertest (para HTTP)
Covertura mínima: 70%
```

### Integration Tests (nice-to-have)
```
- Flujo completo: registrar → preguntar → obtener respuesta
- Versionado: cambiar documento, verificar que respuesta es nueva
```

---

## 12. NOTAS PARA CLAUDE CODE

Cuando trabajemos juntos, recuerda:

1. **TypeScript obligatorio** — Evita bugs silenciosos
2. **Validación en cada entrada** — Zod en backend, validación básica en frontend
3. **Errores claros** — User facing messages vs internal logs (no stack traces en UI)
4. **Sin over-engineering** — MVP es MVP, no agregues "escalabilidad futura" innecesaria
5. **Tests mientras codificas** — No dejes todo para el final
6. **Documentar código complejo** — Especialmente lógica de RAG y búsqueda
