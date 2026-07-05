# AVEND ASESOR — Flujos Principales de Usuario

**Versión:** 1.0  
**Fecha:** Julio 2026  
**Descripción:** Detalle de los 5 flujos principales del MVP  

---

## FLUJO 1: REGISTRO E INGRESO DE DOCENTE

### Pre-condiciones
- Usuario nunca ha usado AVEND
- Tiene acceso a navegador web
- Conoce su especialidad y escala magisterial

### Paso a Paso

```
1. Usuario llega a avend.com
   → Ve landing page con descripción
   → Botón "Registrarme gratis"

2. Click → Formulario de registro
   Campos:
   - Email (obligatorio)
   - Contraseña (mín 8 caracteres)
   - Especialidad (dropdown: Matemáticas, Comunicación, etc)
   - Escala magisterial (dropdown: 1-7)
   - Checkbox: Acepto términos

3. Usuario completa + click "Registrarme"
   → Backend valida email no exista
   → Backend hashea contraseña (bcrypt)
   → Backend guarda en tabla usuarios
   → Sistema genera JWT + cookie

4. Redirect automático a Dashboard
   → Usuario ve mensaje: "¡Bienvenido, [nombre]!"
   → Panel principal listo

5. Post-registro (opcional):
   → Sistema ofrece tutorial de 2 min (skip disponible)
   → Muestra ejemplo: "Pregunta sobre tu escala magisterial"
```

### Errores manejados
- Email ya existe → "Este email ya está registrado. ¿Olvidaste contraseña?"
- Password débil → "Usa mínimo 8 caracteres, 1 número, 1 mayúscula"
- Servidor caído → "Error temporal. Intenta en 1 minuto"

### Data guardada
```javascript
{
  id: "uuid-xxx",
  email: "docente@gmail.com",
  password_hash: "bcrypt_encrypted_xxx",
  especialidad: "Matemáticas",
  escala_magisterial: 3,
  region: null,
  created_at: "2026-07-15T10:00:00Z",
  last_login: "2026-07-15T10:00:00Z"
}
```

---

## FLUJO 2: HACER UNA CONSULTA (CORE FLOW)

### Pre-condiciones
- Usuario registrado + autenticado
- Está en Dashboard
- Tiene conectividad (o espera reconexión)

### Paso a Paso

```
1. Usuario ve chat interface
   Campos visibles:
   - Título: "¿Qué necesitas saber sobre la CPM?"
   - Input box: "Escribe tu pregunta aquí..."
   - Botón: "Enviar"
   - Historial abajo (preguntas anteriores)

2. Usuario escribe pregunta
   Ejemplos válidos:
   - "¿Puedo ascender en 3 años?"
   - "Requisitos para nombramiento 2026"
   - "Cronograma de inscripciones ascenso"
   - "¿Qué cambió este año en los requisitos?"

3. Click "Enviar"
   → Validación frontend (mínimo 5 caracteres)
   → Input desaparece, muestra spinner "Buscando..."

4. Backend procesa:
   a) Verifica JWT (si no válido, redirige a login)
   b) searchService busca documentos relevantes
      - Extrae palabras clave de pregunta
      - Busca en normativa VIGENTE
      - Retorna top 3 documentos + secciones relevantes
   c) claudeService formatea prompt:
      ```
      SISTEMA:
      Eres un asesor experto en Carrera Pública Magisterial (CPM).
      Tu rol es responder preguntas usando ÚNICAMENTE la normativa provista.
      NUNCA inventes información.
      SIEMPRE cita la fuente exacta + fecha de vigencia.
      Si la respuesta NO está en documentos, di: "Esta información no está en normativa actual"
      
      DOCUMENTOS DISPONIBLES:
      [RVM 044-2026-MINEDU]
      [Cronograma Ascenso 2026]
      [Requisitos Idoneidad]
      
      PREGUNTA USUARIO:
      ¿Puedo ascender en 3 años?
      ```
   d) Claude API procesa y responde:
      ```
      "No, según la Resolución Viceministerial N° 044-2026-MINEDU 
       (publicada 10 de abril de 2026, vigente hasta convocatoria 2027):
       
       Requisito mínimo de permanencia:
       - Primera escala: 5 años
       - Segunda escala: 5 años
       - Tercera+ escalas: 5 años
       
       Por tanto, necesitas un mínimo de 5 años en tu escala actual,
       no 3 años.
       
       Puedes revisar cronograma completo aquí: [ENLACE A DOCUMENTO EN GITHUB]"
      ```
   e) dbService guarda chat:
      ```javascript
      {
        id: "uuid-yyy",
        user_id: "uuid-xxx",
        pregunta: "¿Puedo ascender en 3 años?",
        respuesta: "[texto completo]",
        documentos_usados: [
          { id: "rvm044-2026", version: "v1", url: "..." }
        ],
        tokens_entrada: 450,
        tokens_salida: 280,
        version_normativa: "ascenso_2026_v1",
        created_at: "2026-07-15T10:05:00Z"
      }
      ```

5. Frontend recibe respuesta
   → Spinner desaparece
   → Muestra respuesta de Claude en chat bubble
   → Respuesta aparece con animación suave (fade-in)
   → Abajo: "Fuente: [documento + enlace] | Publicado: 10/04/26"

6. Usuario puede:
   a) Hacer otra pregunta (input box reaparece)
   b) Copiar respuesta (botón clipboard)
   c) Ver más detalles (click en enlace de fuente)
   d) Guardar respuesta en PDF (futuro)
```

### Estados de la interfaz

```
ESTADO 1: Esperando entrada
┌─────────────────────────────┐
│ ¿Qué necesitas saber?       │
│ [input box]         [ENVIAR]│
├─────────────────────────────┤
│ < Pregunta anterior         │
│ < Respuesta anterior        │
└─────────────────────────────┘

ESTADO 2: Enviando
┌─────────────────────────────┐
│ ⏳ Buscando información...   │
├─────────────────────────────┤
│ < Preguntas anteriores      │
└─────────────────────────────┘

ESTADO 3: Respuesta obtenida
┌─────────────────────────────┐
│ > Tu pregunta...            │
│ < Respuesta completa        │
│   [📋 Copiar] [🔗 Fuente]   │
├─────────────────────────────┤
│ [input box]         [ENVIAR]│
└─────────────────────────────┘

ESTADO 4: Error (API caída)
┌─────────────────────────────┐
│ ❌ Error temporal           │
│ No pudimos procesar tu      │
│ pregunta. Intenta en 1 min  │
│ [🔄 Reintentar]            │
└─────────────────────────────┘
```

### Errores manejados
- Pregunta vacía → "Por favor escribe una pregunta"
- Pregunta muy corta → "Pregunta muy breve (mín 5 caracteres)"
- Network timeout → "Perdimos conexión. Reintentando..."
- Claude API caída → "Servicio temporalmente indisponible"
- Rate limit → "Máximo 10 consultas/minuto. Espera 1 minuto"
- Token expirado → "Tu sesión expiró. Por favor inicia sesión"

---

## FLUJO 3: VER HISTORIAL DE CONSULTAS

### Pre-condiciones
- Usuario autenticado
- Ha hecho al menos 1 consulta

### Paso a Paso

```
1. Usuario hace click en "Mi historial" (sidebar/menu)
   → Navegación a /dashboard/history

2. Página muestra lista de consultas anteriores
   Cada item muestra:
   - Pregunta (primeros 80 caracteres)
   - Fecha (formato: "hace 2 días" o "15 Jul 2026")
   - Miniatura de respuesta (primeros 150 caracteres)
   - Botón "Ver completo"

3. Usuario hace scroll/busca una consulta anterior
   → Frontend soporta búsqueda por texto (client-side)
   → O servidor pagina: 20 items por página

4. Click en una consulta
   → Expande para mostrar:
      - Pregunta completa
      - Respuesta completa
      - Documentos usados + versión
      - Fecha exacta + hora
      - Botones: [Copiar] [Compartir (futuro)] [Eliminar]

5. Usuario puede eliminar consulta
   → Confirmación: "¿Eliminar esta consulta?"
   → Si "Sí" → dbService.deleteChat(chat_id)
   → Chat desaparece del historial
```

### Data presentada
```
Pregunta: "¿Requisitos para ascender 2026?"
Respuesta: "[primera 200 chars]... [VER MÁS]"
Fecha: "Hace 3 días"
Versión normativa usada: "ascenso_2026_v1"
```

---

## FLUJO 4: ACTUALIZAR PERFIL

### Pre-condiciones
- Usuario autenticado

### Paso a Paso

```
1. Usuario hace click "Mi perfil" (sidebar)
   → Navegación a /dashboard/settings

2. Formulario muestra campos precargados:
   - Email (read-only)
   - Especialidad (dropdown, editable)
   - Escala magisterial (dropdown 1-7, editable)
   - Región (optional, futuro)

3. Usuario edita (ej: cambiar de escala 3 → 4)
   → Click "Guardar cambios"
   → Frontend valida
   → Backend: PUT /api/user/profile
   → Supabase actualiza usuario
   → Toast: "Perfil actualizado ✓"

4. Próximas consultas usarán datos nuevos
   (ej: Claude podrá personalizar respuestas)

5. Usuario también ve:
   - Total de consultas (lifetime)
   - Fecha de registro
   - Última consulta (timestamp)
```

---

## FLUJO 5: CAMBIO DE NORMATIVA (ADMIN - TÚ)

### Pre-condiciones
- MINEDU publica nueva resolución
- Tú estructuras como JSON
- Acceso a endpoint admin

### Paso a Paso

```
1. MINEDU publica cambio (ej: Cronograma ascenso modificado)
   Ejemplo: RVM 100-2026-MINEDU (15 de mayo de 2026)

2. Tú descargas PDF de MINEDU

3. Estructuras como JSON:
   normativa/ascenso/2026/cronograma-v2.json
   {
     "titulo": "Cronograma Ascenso 2026 (Modificado)",
     "resolucion": "RVM 044-2026-MINEDU",
     "modificacion": "RVM 100-2026-MINEDU",
     "publicado": "2026-05-15",
     "vigente_desde": "2026-05-15",
     "inscripcion_inicio": "2026-06-01",
     "inscripcion_fin": "2026-06-30",
     ...
   }

4. Commiteas a GitHub
   $ git add normativa/ascenso/2026/cronograma-v2.json
   $ git commit -m "Actualizar cronograma ascenso (RVM 100-2026)"
   $ git push

5. Backend detecta cambio (via GitHub Webhook o polling)
   → Ejecuta proceso automático:
   a) Marca versión vieja como ARCHIVADA
      UPDATE normativa SET estado='ARCHIVADA'
      WHERE proceso='ascenso' AND version='v1'
   
   b) Marca nueva como VIGENTE
      INSERT INTO normativa (proceso, anio, estado, ...)
      VALUES ('ascenso', 2026, 'VIGENTE', ...)
   
   c) Recompila índice de búsqueda
      searchService.rebuildIndex()

6. Próximas consultas usan cronograma nuevo
   → Docentes que pregunten después ven información actualizada
   → Consultas antiguas mantienen timestamp + versión que usaron
      (auditoría: puedes verificar qué información tenía el docente)

7. Opcional: Enviar notificación a usuarios
   "⚠️ Cronograma ascenso modificado. Revisa los cambios."
```

### Versionado automático
```
Old version:
  estado: ARCHIVADA
  version: v1
  fecha_vigencia_hasta: 2026-05-15

New version:
  estado: VIGENTE
  version: v2
  fecha_vigencia_hasta: 2027 (next process)
  checksum: SHA256 del JSON (para detectar cambios)
```

---

## FLUJO 6: LOGOUT

### Paso a Paso

```
1. Usuario hace click en "Cerrar sesión" (menu/avatar)

2. Frontend:
   - Elimina JWT cookie
   - Limpia estado global
   - POST /api/auth/logout (opcional, backend lo marca)

3. Redirect a página de login
   → Mensaje: "Sesión cerrada ✓"
```

---

## CASOS ESPECIALES / EDGE CASES

### Caso: "¿Qué pasa si subo normativa incorrecta?"
- Docentes verán respuestas incorrectas
- Solución: Valida JSON antes de subir, archiva y publica corrección
- Auditoría: Todos los chats guardaron qué documento usaron
- Comunicación: Alerta a docentes afectados (futura)

### Caso: "¿Qué pasa si un docente está offline (zona rural)?"
- No puede hacer consultas
- Solución futura: Descargar normativa offline, consultas se sincronizan luego
- MVP: Dialogo amable: "Necesitas conexión para consultar"

### Caso: "Docente pregunta algo fuera de CPM"
```
Pregunta: "¿Cuánto gana un docente en Chile?"
Claude responde: "No tengo información sobre sistemas educativos de otros países.
Soy especialista en normativa de la Carrera Pública Magisterial (CPM) de Perú.
¿Tienes preguntas sobre CPM?"
```

### Caso: "Docente pregunta algo que NO está en normativa"
```
Pregunta: "¿Cuándo será el ascenso 2027?"
Claude responde: "No hay información sobre convocatoria 2027 en normativa vigente.
La última convocatoria es 2026 (RVM 044-2026-MINEDU).
Probablemente se convoque 2027 a mitad de año, pero esto no está confirmado."
```

---

## FLUJOS FUTUROS (NO EN MVP)

### Compartir consulta
- Docente puede generar link: "avend.com/share/abc123"
- Link público muestra respuesta (sin datos del usuario)

### Descarga PDF
- Usuario descarga respuesta + fuente como PDF

### Notificaciones
- Alerta cuando normativa se actualiza
- Resumen semanal: "Cambios en CPM esta semana"

### Multi-idioma
- Cambiar a Quechua (futuro para zonas rurales)

### Integración MINEDU
- Sistema sincroniza automáticamente resoluciones de MINEDU (vs manual)

---

## NOTAS PARA CLAUDE CODE

Cuando implemente estos flujos:

1. **Validación en dos capas:** Frontend (UX) + Backend (seguridad)
2. **Estados de carga:** Siempre mostrar spinner, no dejar usuario confundido
3. **Errores amigables:** "❌ No pudimos procesar tu pregunta" > error técnico
4. **Accesibilidad:** Asegurar que mensajes de error sean legibles en mobile
5. **Testing:** Cada flujo debe tener al menos 1 test (happy path + error case)
