# AVEND ASESOR — Guía de Inicio (Setup + Roadmap de Desarrollo)

**Versión:** 1.0  
**Audiencia:** Tú + Claude Code  
**Duración estimada:** 4-6 semanas para MVP  

---

## PARTE 1: PREREQUISITOS Y SETUP LOCAL

### 1.1 Cuentas necesarias (todas gratuitas)

```
[ ] GitHub (crear cuenta si no tienes)
    - Para versionado de código + normativa JSON

[ ] Vercel (github.com/vercel/vercel)
    - Conectar cuenta GitHub
    - Vercel detecta Next.js automáticamente

[ ] Railway (railway.app)
    - Crear cuenta, conectar GitHub
    - Railway hosteará backend Node.js

[ ] Supabase (supabase.com)
    - Crear proyecto gratis (PostgreSQL 500MB)
    - Copiar DATABASE_URL y ANON_KEY

[ ] Anthropic (console.anthropic.com)
    - Crear API key para Claude
    - $5 crédito inicial (suficiente para 3-4 meses MVP)

[ ] SendGrid o Resend (opcional, para emails futuros)
    - Free tier: 100 emails/día
```

### 1.2 Instalación local (tu máquina)

```bash
# Prerequisitos
- Node.js 20 LTS (descargar de nodejs.org)
- Git (descargar de git-scm.com)
- Visual Studio Code (opcional pero recomendado)

# Clonar repo
git clone https://github.com/[tu-user]/avend-asesor.git
cd avend-asesor

# Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# Variables de entorno
# Frontend: crear archivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend: crear archivo .env
DATABASE_URL=postgresql://[tu-user]:[password]@[host]/[db]
CLAUDE_API_KEY=sk-ant-xxx
JWT_SECRET=tu-secret-super-seguro-aqui
NODE_ENV=development
PORT=3001

# Correr localmente
# Terminal 1 (Backend)
cd backend && npm run dev
# → Backend en localhost:3001

# Terminal 2 (Frontend)
cd frontend && npm run dev
# → Frontend en localhost:3000
# Abre http://localhost:3000 en navegador
```

---

## PARTE 2: ESTRUCTURA DE TRABAJO (TÚ + CLAUDE CODE)

### 2.1 Cómo colaborar con Claude Code

**Flujo típico:**
```
1. TÚ: "Crea las rutas de autenticación en Express"
   CLAUDE CODE:
   - Analiza AVEND_02_ARQUITECTURA.md
   - Crea backend/src/routes/auth.routes.ts
   - Crea backend/src/controllers/authController.ts
   - Crea backend/src/services/authService.ts
   - Resultado: código funcional + comentarios

2. TÚ: Revisas código, entiendes estructura
   - Preguntas si no comprendes
   - Pruebas localmente con npm run dev
   
3. TÚ: "Ahora crea el formulario de login en Next.js"
   CLAUDE CODE:
   - Crea frontend/components/Auth/LoginForm.tsx
   - Integra con API backend
   - Resultado: formulario funcional
   
4. TÚ: Testeas en navegador (localhost:3000)
   - Si funciona → push a GitHub
   - Si falla → Claude Code debuggea
   
5. Repite para siguiente feature
```

**Instrucciones para Claude Code (usar estas frases):**
```
"Según AVEND_02_ARQUITECTURA.md, crea [componente/ruta/servicio]"
"Asume que [variable X] ya existe en [archivo Y]"
"No añadas dependencias nuevas (usa solo las en package.json)"
"Incluye comentarios explicativos en funciones complejas"
"Haz que esto sea testeable (exporta funciones puras)"
```

---

## PARTE 3: ORDEN DE DESARROLLO RECOMENDADO

### Semana 1: Bases de Backend + BD

**Día 1-2: Setup + Conexión a Supabase**
```
HITO: Backend conectado a DB, salud OK

TÚ: "Configura Express con TypeScript, middleware básico, conexión Supabase"
CLAUDE CODE genera:
  - backend/src/index.ts (Express app)
  - backend/src/config/database.ts (Supabase client)
  - backend/src/middleware/ (auth, errors, logger)
  - backend/src/routes/health.routes.ts
  - .env.example con variables necesarias

Verificación:
  $ npm run dev
  $ curl http://localhost:3001/api/health
  # Esperado: { "status": "ok" }
```

**Día 3-4: Rutas de Autenticación**
```
HITO: Puedes registrar + login con JWT

TÚ: "Implementa rutas POST /auth/register y POST /auth/login"
CLAUDE CODE genera:
  - backend/src/routes/auth.routes.ts
  - backend/src/controllers/authController.ts
  - backend/src/services/authService.ts (hashPassword, comparePassword)
  - Tabla usuarios en Supabase (creada via SQL script)
  - Middleware JWT en backend/src/middleware/authMiddleware.ts

Verificación:
  $ curl -X POST http://localhost:3001/api/auth/register \
    -d '{"email":"test@test.com","password":"Pass123"}' \
    -H "Content-Type: application/json"
  # Esperado: JWT en respuesta
```

**Día 5: BD Schema**
```
HITO: Tablas de usuarios, normativa, chats creadas

TÚ: "Crea script SQL para Supabase (usuarios, normativa, chats, sesiones)"
CLAUDE CODE genera:
  - backend/src/config/schema.sql
  - Instrucciones: Copiar + pegar en Supabase SQL editor
  - Índices para optimización

Verificación:
  - Supabase Dashboard → SQL → ejecutar script
  - Tablas aparecen en Data Editor
```

---

### Semana 2: Frontend Base + Integración

**Día 1-2: Setup Next.js + UI Components**
```
HITO: Landing page + Login/Register formularios

TÚ: "Configura Next.js con NextAuth, ShadCN/UI, Tailwind"
CLAUDE CODE genera:
  - frontend/app/layout.tsx (providers + Tailwind)
  - frontend/app/page.tsx (landing page)
  - frontend/components/Auth/LoginForm.tsx
  - frontend/components/Auth/RegisterForm.tsx
  - frontend/lib/api/auth.ts (API calls)
  - Configuración NextAuth en app/api/auth/[...nextauth]/route.ts

Verificación:
  $ npm run dev
  - http://localhost:3000 → Landing visible
  - Click "Registrarme" → Formulario aparece
  - Submit → Conecta a backend
```

**Día 3: Dashboard Layout**
```
HITO: Panel post-login

TÚ: "Crea dashboard protegido (requiere auth)"
CLAUDE CODE genera:
  - frontend/app/dashboard/layout.tsx (sidebar, header)
  - frontend/app/dashboard/page.tsx (panel principal vacío)
  - frontend/components/Common/Header.tsx
  - frontend/lib/hooks/useAuth.ts
  - Middleware: redirecciona a login si no autenticado

Verificación:
  - Login → Redirect a /dashboard
  - Logout → Redirect a /login
```

**Día 4-5: Chat Interface**
```
HITO: Interfaz de chat lista (sin lógica IA aún)

TÚ: "Crea componente ChatInterface con input + display de mensajes"
CLAUDE CODE genera:
  - frontend/components/Chat/ChatInterface.tsx
  - frontend/components/Chat/MessageList.tsx
  - frontend/components/Chat/InputBox.tsx
  - frontend/lib/hooks/useChat.ts (estado local)
  - Estilos Tailwind + animaciones

Verificación:
  - /dashboard → Chat interface visible
  - Escribe en input, presiona Enter
  - Mensaje aparece en chat (aún no conecta a backend)
```

---

### Semana 3: Lógica de Búsqueda + Normativa

**Día 1-2: Estructura de Normativa JSON**
```
HITO: JSONs estructurados en GitHub, indexados en backend

TÚ: "Crea estructura carpetas /normativa y JSONs iniciales"

Tu responsabilidad (no Claude):
  - Crear normativa/ascenso/2026/cronograma.json
  - Crear normativa/ascenso/2026/requisitos.json
  - Crear normativa/nombramiento/2026/requisitos.json
  (Usa doc AVEND_04_ESPECIFICACIONES.md como template)

CLAUDE CODE genera:
  - backend/src/services/normativaService.ts
    (loadFromGitHub, getVigentes, buildIndex)
  - backend/src/config/normativaIndex.ts
    (metadata de documentos vigentes)
```

**Día 3: Servicio de Búsqueda**
```
HITO: Backend puede buscar en normativa

TÚ: "Implementa searchService con búsqueda por palabras clave"
CLAUDE CODE genera:
  - backend/src/services/searchService.ts
    (searchKeywords, rankByRelevance, formatForClaude)
  
Verificación (manual test):
  const results = await searchService.searchKeywords(['ascenso', 'años'])
  // Esperado: retorna top 3 documentos relevantes con contexto
```

**Día 4-5: Rutas de Normativa (Admin)**
```
HITO: Puedes subir/actualizar documentos (solo tú)

TÚ: "Crea rutas POST /normativa/upload y GET /normativa/status"
CLAUDE CODE genera:
  - backend/src/routes/normativa.routes.ts
  - backend/src/controllers/normativaController.ts
  - Protección: requiere X-Admin-Token (env var)
  - Versionado automático

Verificación:
  $ curl -X POST http://localhost:3001/api/normativa/upload \
    -H "X-Admin-Token: [tu-token]" \
    -H "Content-Type: application/json" \
    -d '{"proceso":"ascenso","anio":2026,"version":"v1",...}'
```

---

### Semana 4: Integración Claude API

**Día 1-2: Service de Claude**
```
HITO: Backend puede llamar a Claude API

TÚ: "Integra Claude API con RAG (documentos + pregunta)"
CLAUDE CODE genera:
  - backend/src/services/claudeService.ts
    (formatPrompt, callClaude, parseResponse, extractCitations)
  - Prompt system diseñado para precisión + citas
  - Error handling: timeout, rate limits, etc

Verificación (manual):
  const response = await claudeService.callClaude({
    pregunta: "¿Cuál es el requisito de años?",
    documentos: [...]
  })
  // Esperado: respuesta con citas + fuente
```

**Día 3: Ruta de Chat Backend**
```
HITO: POST /api/chat/message funciona

TÚ: "Crea ruta que integra search + Claude + DB"
CLAUDE CODE genera:
  - backend/src/routes/chat.routes.ts
  - backend/src/controllers/chatController.ts
  - Flujo: validar JWT → buscar docs → llamar Claude → guardar en BD
  - Respuesta: { respuesta, documentos_usados, tokens }

Verificación:
  $ curl -X POST http://localhost:3001/api/chat/message \
    -H "Authorization: Bearer [JWT]" \
    -d '{"pregunta":"¿Puedo ascender?"}' \
    -H "Content-Type: application/json"
  # Esperado: respuesta de Claude con citas
```

**Día 4-5: Conectar Frontend**
```
HITO: Chat funciona end-to-end

TÚ: "Conecta ChatInterface (frontend) con /api/chat/message (backend)"
CLAUDE CODE modifica:
  - frontend/lib/api/chat.ts (sendMessage function)
  - frontend/components/Chat/ChatInterface.tsx (maneja respuesta)
  - frontend/lib/hooks/useChat.ts (estado + manejo de loading)
  - Mostrar spinner mientras envía
  - Mostrar respuesta con fuentes

Verificación:
  - Chat en http://localhost:3000/dashboard
  - Escribe pregunta
  - Ves spinner 2-3 segundos
  - Aparece respuesta de Claude
```

---

### Semana 5: Features Secundarias + Pulido

**Día 1: Historial de Chats**
```
HITO: Usuario ve su historial

TÚ: "Crea ruta GET /api/chat/history y componente History"
CLAUDE CODE genera:
  - backend/src/routes/chat.routes.ts: GET /history
  - frontend/app/dashboard/history/page.tsx
  - frontend/components/Chat/HistoryList.tsx
```

**Día 2: Perfil de Usuario**
```
HITO: Usuario puede ver/editar su especialidad y escala

TÚ: "Crea rutas GET/PUT /api/user/profile"
CLAUDE CODE genera:
  - backend/src/routes/user.routes.ts
  - frontend/app/dashboard/settings/page.tsx
```

**Día 3: Manejo de Errores + Validación**
```
HITO: Aplicación maneja errores elegantemente

TÚ: "Añade validación Zod en todas las rutas + error handling"
CLAUDE CODE:
  - Revisa cada ruta
  - Añade Zod schemas
  - Error messages amigables
```

**Día 4: Tests básicos**
```
HITO: Coverage >70%

TÚ: "Escribe tests para searchService y claudeService"
CLAUDE CODE genera:
  - backend/tests/unit/searchService.test.ts
  - backend/tests/unit/claudeService.test.ts
```

**Día 5: Deploy**
```
HITO: App viva en internet

TÚ: "Deploy frontend a Vercel, backend a Railway"
CLAUDE CODE da instrucciones:
  1. Push a GitHub
  2. Vercel auto-detecta + deploya (5 min)
  3. Railway auto-detecta + deploya (10 min)
  4. Configurar env vars en ambas plataformas
  5. Test: https://avend.vercel.app
```

---

### Semana 6: QA + Launch

**Días 1-2: Testing completo**
```
- Login/register funciona
- Chats se guardan correctamente
- Respuestas citadas correctamente
- Error handling funciona
- Mobile responsive (probar en teléfono)
```

**Día 3: Feedback de usuarios beta**
```
- Invita a 10-20 docentes
- Recoge feedback
- Bugs urgentes se arreglan hoy
```

**Día 4-5: Launch**
```
- Documentación lista
- Landing page optimizada
- Comparte en redes/grupos docentes
```

---

## PARTE 4: CHECKLIST DIARIO

### Cada mañana (5 min)
```
[ ] Leer el punto donde dejaste ayer (README.md del proyecto)
[ ] Decidir qué feature construir hoy
[ ] Crear issue en GitHub con descripción
```

### Durante desarrollo (cuando usas Claude Code)
```
[ ] Leer doc AVEND_02_ARQUITECTURA.md para contexto
[ ] Dar instrucciones claras y específicas
[ ] Testear código generado localmente (npm run dev)
[ ] Hacer commit a GitHub con mensaje claro
```

### Cada viernes (fin de sprint)
```
[ ] ¿Cumplí el hito de la semana?
[ ] ¿Qué salió bien, qué no?
[ ] ¿Necesito ajustar roadmap?
```

---

## PARTE 5: TROUBLESHOOTING COMÚN

### Error: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Error: "EADDRINUSE: address already in use :::3001"
```bash
# Puerto 3001 ocupado, libéralo o cambia puerto en .env
# O mata el proceso:
lsof -ti:3001 | xargs kill -9
```

### Error: "Invalid DATABASE_URL"
```bash
# Verifica en Supabase Dashboard:
# Settings → Database → Connection String
# Copia y pega completo en .env
```

### Error: "Claude API returns rate limit"
```
Normal. Espera 1 minuto. 
El MVP no tiene suficiente traffic para saturar.
```

### Frontend conecta pero backend no responde
```bash
# Verifica que backend esté corriendo:
curl http://localhost:3001/api/health

# Si no funciona:
cd backend && npm run dev

# Verifica NEXT_PUBLIC_API_URL en frontend/.env.local
# Debe ser: http://localhost:3001 (desarrollo)
```

---

## PARTE 6: NOTAS FINALES

### Sobre timelines
- MVP: 4-6 semanas realista
- Si eres muy rápido: 3 semanas
- Si tienes imprevistos: 8 semanas
- No es una carrera, es iteración disciplinada

### Sobre cambios de scope
- Si surge "nueva idea genial": escríbela en ROADMAP.md
- Pero NO la agregues al MVP actual
- El MVP es ASCENSO + NOMBRAMIENTO, nada más
- Resten procesos vienen después

### Sobre depuración
- Si algo no funciona: describe el error exacto a Claude Code
- "No funciona" → Claude no puede ayudarte
- "Al hacer login, recibo error 500 en backend" → Claude puede debuggear

### Sobre aprendizaje
- Dedicar 15 min/día a entender el código que genera Claude
- Revisar un archivo cada día que no entiendas
- Preguntar: "Explícame línea 45 del archivo X ¿por qué hace eso?"
- Este entendimiento es más valioso que haber "escrito" todo

---

## Listo para empezar?

1. Crea las cuentas (GitHub, Vercel, Railway, Supabase, Anthropic)
2. Setup local (git clone + npm install)
3. Abre AVEND_02_ARQUITECTURA.md
4. Primer prompt a Claude Code:
   ```
   "Eres ingeniero senior. Basándote en AVEND_02_ARQUITECTURA.md,
    configura Express + TypeScript + Supabase en backend/.
    Incluye middleware, config de BD, y ruta /api/health.
    Código debe ser production-ready."
   ```
5. Revisa, entiendes, pusheas
6. Próximo feature: autenticación

¡Adelante! 🚀
