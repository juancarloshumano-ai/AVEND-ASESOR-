# 🎓 AVEND ASESOR — Sistema de Asesoría IA para la Carrera Pública Magisterial

**Versión MVP:** 1.0  
**Estado:** En desarrollo  
**Objetivo:** Ser la plataforma referente para docentes peruanos respecto a procesos de CPM  

---

## 📚 DOCUMENTACIÓN COMPLETA

Este proyecto está documentado de forma exhaustiva. **Lee PRIMERO el documento que aplique a ti:**

### Si eres TÚ (Product Manager + Founder):
→ **[AVEND_01_CONTEXTO_Y_VISION.md](AVEND_01_CONTEXTO_Y_VISION.md)**
- Qué es AVEND, por qué existe, problema que resuelve
- Usuarios, procesos cubiertos, modelo de negocio
- Restricciones y garantías

### Si eres Claude Code (Implementación):
→ **[AVEND_02_ARQUITECTURA.md](AVEND_02_ARQUITECTURA.md)**
- Arquitectura de capas, stack tecnológico, estructura carpetas
- Schema de BD, endpoints API
- Deployment en Vercel + Railway

→ **[AVEND_05_ESPECIFICACIONES.md](AVEND_05_ESPECIFICACIONES.md)**
- Tipos TypeScript exactos, interfaces
- Estructura de normativa JSON
- Especificaciones de cada endpoint (request/response)
- Configuración de rate limits, error handling

### Si eres TÚ siguiendo el desarrollo:
→ **[AVEND_03_FLUJOS.md](AVEND_03_FLUJOS.md)**
- Flujos principales de usuario (registro, consultas, historial)
- Step-by-step de cada interacción
- Estados de interfaz, errores manejados

→ **[AVEND_04_GUIA_INICIO.md](AVEND_04_GUIA_INICIO.md)**
- Setup local (cuentas, instalación, .env)
- Cómo colaborar con Claude Code
- **Roadmap de desarrollo semana por semana**
- Checklist diario y troubleshooting

---

## 🚀 QUICKSTART (5 MINUTOS)

### Opción A: Leer solo lo esencial
1. Leer este README hasta "Features"
2. Saltar a AVEND_04_GUIA_INICIO.md → Parte 1 (Setup)
3. Cuando escribas a Claude Code, referenciar AVEND_02_ARQUITECTURA.md

### Opción B: Entendimiento completo (recomendado)
1. AVEND_01_CONTEXTO_Y_VISION.md (30 min)
2. AVEND_02_ARQUITECTURA.md (30 min)
3. AVEND_03_FLUJOS.md (20 min)
4. AVEND_04_GUIA_INICIO.md (leer Parte 2-4)
5. Empezar desarrollo siguiendo roadmap semana 1

---

## ⚡ FEATURES MVP (Semana 1-6)

### ✅ Completadas (Este planning)
- [ ] Análisis de contexto
- [ ] Definición de arquitectura
- [ ] Documentación completa

### 🔄 En desarrollo (Siguiendo roadmap)
- [ ] Backend: Express + Supabase
- [ ] Frontend: Next.js + Chat UI
- [ ] Autenticación: NextAuth + JWT
- [ ] Búsqueda: Keywords en normativa JSON
- [ ] IA: Claude API con RAG
- [ ] Deploy: Vercel + Railway
- [ ] QA: Testing + usuarios beta

### 📅 Roadmap (6 semanas)
```
Semana 1: Backend base + Supabase ✓ (Día 5)
Semana 2: Frontend + Autenticación ✓ (Día 5)
Semana 3: Búsqueda en normativa ✓ (Día 5)
Semana 4: Integración Claude API ✓ (Día 5)
Semana 5: Features secundarias ✓ (Día 5)
Semana 6: QA + Launch ✓ (Día 5)
```

---

## 👥 USUARIOS OBJETIVO

**Usuario Ancla (MVP):** Docente de EBR nombrado en CPM
- Necesita: Saber si puede ascender, requisitos, cronograma
- Pain point: Desconocimiento normativo + falta de asesoría confiable
- Precio: S/25/año (validación inicial)

**Usuarios secundarios (Fase 2+):**
- Directivos de IE
- Auxiliares de educación
- Instituciones educativas (B2B)
- UGELs/DREs (B2B)

---

## 🎯 PROCESOS DE CPM CUBIERTOS

### MVP (Fase 1)
1. **Concurso de Ascenso de Escala Magisterial** (~135k docentes/año)
   - RVM 044-2026-MINEDU + resoluciones modificatorias
   - Requisitos, cronograma, evaluación, escalas, remuneraciones

2. **Nombramiento y Contrato** (~50k docentes/año)
   - Requisitos, fases del proceso

### Roadmap (Fase 2+)
- Reasignación, Destaque, Permuta, Cambio de grupo, Concurso directivos

---

## 🏗️ STACK TECNOLÓGICO

| Componente | Tecnología | Costo |
|---|---|---|
| **Frontend** | Next.js 14 + React + TypeScript | $0 (Vercel gratis) |
| **Backend** | Node.js 20 + Express.js + TypeScript | $5-7/mes (Railway) |
| **Database** | Supabase (PostgreSQL) | $0 (500MB gratis) |
| **Auth** | NextAuth.js + JWT | $0 |
| **IA** | Claude API (Sonnet 4.6) | $50-100/mes (2k users) |
| **Versionado** | GitHub | $0 (público) |
| **Hosting** | Vercel + Railway | $5-7/mes |
| **Total mes 1-3** | Principalmente gratis | **$0-50** |
| **Total mes 6** | Scaled up | **$150-300** |

---

## 📖 CÓMO USAR LA DOCUMENTACIÓN CON CLAUDE CODE

### Prompt típico:
```
Basándote en AVEND_02_ARQUITECTURA.md y AVEND_05_ESPECIFICACIONES.md,
implementa las rutas de autenticación (register + login) en Express.

Requisitos:
- TypeScript
- Validación Zod
- Bcrypt para contraseñas
- JWT para tokens
- Intégrate con Supabase

Referencia: Backend de AVEND_05 y flujos de AVEND_03_FLUJOS.md
```

### Qué esperar:
- Claude Code genera código production-ready
- Incluye tipos TypeScript, validación, error handling
- Tú lo revisas, pruebas localmente, commiteas
- Próximo feature: formularios en Next.js

---

## 🛠️ SETUP LOCAL (30 MINUTOS)

```bash
# 1. Clonar
git clone https://github.com/[tu-user]/avend-asesor.git
cd avend-asesor

# 2. Backend
cd backend
npm install
echo "DATABASE_URL=..." > .env.local
echo "CLAUDE_API_KEY=..." >> .env.local
echo "JWT_SECRET=..." >> .env.local
npm run dev
# → Corriendo en http://localhost:3001

# 3. Frontend (nuevo terminal)
cd ../frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
# → Corriendo en http://localhost:3000

# 4. Browser
# Abre http://localhost:3000
```

**Full setup en AVEND_04_GUIA_INICIO.md → Parte 1**

---

## 📋 CHECKLIST DE CUENTAS

- [ ] GitHub (para versionado + normativa JSON)
- [ ] Vercel (frontend auto-deploy)
- [ ] Railway (backend auto-deploy)
- [ ] Supabase (PostgreSQL gratis)
- [ ] Anthropic (Claude API)
- [ ] SendGrid (opcional, para emails)

**Setup detallado en AVEND_04 → Parte 1.1**

---

## 🎬 PRIMER COMMIT

Después de leer la documentación y hacer setup local:

```bash
# Backend listo
git add backend/
git commit -m "Initial backend setup: Express + Supabase config"
git push origin main

# Frontend listo
git add frontend/
git commit -m "Initial frontend setup: Next.js + NextAuth"
git push

# Normativa inicial
git add normativa/
git commit -m "Initial normativa JSON: Ascenso 2026"
git push

# Documentación
git add AVEND_*.md README.md
git commit -m "Initial project documentation"
git push
```

**→ Vercel + Railway auto-detectan y despliegan**

---

## 📊 MÉTRICAS DE ÉXITO

### Mes 1-2
- 200-500 usuarios registrados
- 500-1000 consultas
- Funcionalidad core (chat) estable
- Tasa retención D7 > 30%

### Mes 3-6
- 1000-5000 usuarios
- 10000-15000 consultas/mes
- 2+ procesos de CPM cubiertos
- NPS > 50

### Año 1
- 50000+ usuarios
- Plataforma referente en Perú
- Primeras alianzas B2B
- Sostenible operacionalmente

---

## ⚠️ RIESGOS CRÍTICOS

### 1. Normativa desactualizada
**Mitigación:** Sistema de versionado + revisión semanal de MINEDU
(Ver AVEND_02 → Ciclo de vida de normativa)

### 2. IA genera respuestas incorrectas
**Mitigación:** RAG cerrado (IA SOLO cita tu BD, nunca inventa)
(Ver AVEND_05 → Prompting para Claude API)

### 3. Escala rápida rompe sistema
**Mitigación:** Arquitectura preparada para 100k users sin reescribir
(Ver AVEND_02 → Escalabilidad)

---

## 🤝 COLABORACIÓN CON CLAUDE CODE

### Workflow recomendado

```
TÚ (Plan)
  ↓
CLAUDE CODE (Implementar)
  ↓
TÚ (Revisar + Probar local)
  ↓
TÚ (Commit + Push)
  ↓
Vercel/Railway (Deploy automático)
  ↓
Usuarios Beta (Testing real)
  ↓
Iterate
```

### Lenguaje recomendado:
```
✅ "Según AVEND_02_ARQUITECTURA.md, crea [X]"
✅ "Referencia de tipos en AVEND_05_ESPECIFICACIONES.md"
✅ "El flujo completo está en AVEND_03_FLUJOS.md → Flujo 2"

❌ "Crea una pantalla de login"
❌ "Integra Claude"
❌ "Hazlo escalable"
```

---

## 📞 PREGUNTAS FRECUENTES

### ¿Cuánto tiempo toma MVP?
**4-6 semanas** dedicando 10h/semana. (Ver AVEND_04 → Roadmap)

### ¿Necesito saber programación?
**No.** Claude Code genera todo. Tú aprendes mientras revisos.

### ¿Qué pasa si me equivoco en normativa?
**Versioning automático.** Archivas vieja, subes nueva. Chats antiguos guardaron qué documento usaron.
(Ver AVEND_02 → Ciclo de normativa)

### ¿Cuánto cuesta a escala?
**Mes 1-3:** Principalmente gratis ($0-50)
**Mes 6:** $150-300 (BD, hosting, API Claude)
**Año 1:** ~$500-1000 (pero monetizas a S/25/año × 50k users = S/1.25M)

### ¿Y si MINEDU cambia normativa?
**Tú subes JSON v2, sistema auto-archiva v1, docentes ven info nueva.** 3 minutos de trabajo.

### ¿Puedo vender después?
**Sí.** Modelo es B2C inicial (S/25/año) + B2B luego (UGELs, colegios).

---

## 🔗 NAVEGACIÓN RÁPIDA

| Necesito... | Leer... |
|---|---|
| Entender qué es AVEND | AVEND_01 |
| Arquitectura + stack | AVEND_02 |
| Flujos de usuario | AVEND_03 |
| Guía de inicio + roadmap | AVEND_04 |
| Especificaciones técnicas | AVEND_05 |
| Setup local | AVEND_04 → Parte 1 |
| Primeros pasos código | AVEND_04 → Parte 3 |
| Tipos TypeScript | AVEND_05 → Sección 1 |
| Estructura JSON normativa | AVEND_05 → Sección 2 |
| Error codes | AVEND_05 → Sección 5 |

---

## 🎓 APRENDIZAJE

Este proyecto es una oportunidad para aprender:
- **Arquitectura:** Cómo se diseña un sistema escalable
- **Stack moderno:** Next.js, TypeScript, Supabase, Claude API
- **Product thinking:** De idea a usuarios reales
- **DevOps:** Deployment automático (Vercel, Railway)

**Dedicar 15 min/día a entender el código es más valioso que "haber escrito todo".**

---

## 📄 LICENCIA Y PROPIEDAD INTELECTUAL

Este proyecto es **100% tuyo**. 
- Código generado por Claude Code → Tuyo
- Documentación → Tuya
- Usuarios y datos → Tuyos
- Negocio → Tuyo

---

## 🚀 SIGUIENTE PASO

**Ahora mismo:**
1. Leer AVEND_01_CONTEXTO_Y_VISION.md (30 min)
2. Leer AVEND_02_ARQUITECTURA.md (30 min)
3. Setup cuentas (AVEND_04 → Parte 1.1)
4. Setup local (AVEND_04 → Parte 1.2)

**Mañana:**
- Primer prompt a Claude Code (backend setup)
- Seguir roadmap AVEND_04 → Parte 3

---

## 📝 NOTAS FINALES

- **Este documento es versionable.** Si cambia la arquitectura, edítalo.
- **Los documentos son para humanos Y máquinas.** Claude Code los leerá completos.
- **Prefiere claridad sobre brevedad.** Si algo no está claro, escríbelo.
- **Presencia de la verdad única.** La fuente de verdad es ESTE repositorio, no emails ni notas.

---

**¿Listo? Adelante. 🚀**

*Documentación versión 1.0 — Julio 2026*
*Next update: Cuando se agreguen nuevos procesos de CPM o features importantes*
