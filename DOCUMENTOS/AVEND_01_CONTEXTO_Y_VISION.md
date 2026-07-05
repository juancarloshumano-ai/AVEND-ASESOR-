# AVEND ASESOR — Documento de Contexto y Visión

**Versión:** 1.0  
**Fecha:** Julio 2026  
**Estado:** MVP Development  

---

## 1. ¿QUÉ ES AVEND ASESOR?

AVEND ASESOR es una plataforma digital SaaS (Software as a Service) diseñada para resolver el desconocimiento normativo de docentes peruanos respecto a los procesos de la Carrera Pública Magisterial (CPM).

**Propuesta de valor en una línea:**
> Una plataforma de asesoría digital impulsada por IA que traduce la complejidad normativa de la CPM en respuestas personalizadas, contextuales y 100% confiables para docentes.

---

## 2. EL PROBLEMA

### Situación actual (SIN AVEND)
Los docentes de EBR (Educación Básica Regular) del Perú enfrentan:

1. **Desconocimiento normativo:** La Ley 29944 (Reforma Magisterial) y sus 50+ resoluciones viceministeriales son complejas, técnicas y actualizadas anualmente.
2. **Falta de canales confiables:** Buscan información en:
   - Asesorías 1:1 pagadas (S/50-100 por consulta, no escalable)
   - Redes sociales informativas (dispersas, frecuentemente inexactas)
   - Páginas del MINEDU (desorganizadas, sin guía de lectura)
3. **Riesgo de decisiones erróneas:** Un docente que postula a ascenso sin entender los requisitos pierde tiempo, dinero (traslados, trámites) y confianza en el sistema.
4. **Procesos de CPM críticos pero opacos:**
   - Nombramiento, Ascenso de escala, Reasignación, Destaque, Permuta, Contrato docente

### Alcance del problema (TAM — Total Addressable Market)
- **Docentes en CPM Perú:** ~400,000 (MINEDU 2026)
- **Docentes que postularán a ascenso 2026:** ~135,000 (solo ascenso)
- **Docentes que necesitan asesoría sobre CPM:** ~300,000 (70-80% del total)

---

## 3. SOLUCIÓN: AVEND ASESOR

### Cómo funciona (user journey simplificado)

```
Docente
  ↓
[Se registra con email + especialidad + escala magisterial actual]
  ↓
[Pregunta: "¿Puedo ascender si tengo 3 años en tercera escala?"]
  ↓
AVEND busca en normativa vigente (JSON estructurado)
  ↓
Claude API (IA) responde: "Según RVM 044-2026, necesitas mínimo 5 años. [ENLACE DOCUMENTO]"
  ↓
Docente obtiene respuesta confiable + citada + con fuente verificable
  ↓
Historial guardado (puede revisar más tarde)
```

### Diferenciador clave
A diferencia de Google, ChatGPT o asesorías, AVEND **NUNCA opina**:
- Solo cita normativa verificada
- Todas las respuestas tienen fuente + fecha de vigencia
- Si la información está desactualizada, lo indica explícitamente
- RAG (Retrieval-Augmented Generation): la IA busca en documentos oficiales, no inventa

---

## 4. USUARIOS OBJETIVO

### Usuario Ancla (Prioridad 1): Docente EBR Individual
- **Perfil:** Docente nombrado, 25-55 años, en zonas urbanas y rurales
- **Motivación:** Entender procesos de CPM para tomar decisiones informadas
- **Frecuencia:** 1-10 consultas al año (especialmente meses de convocatoria)
- **Disposición de pago:** S/25/año (inicial — muy bajo, validación de mercado)
- **Dispositivos:** Smartphone + navegador (baja conectividad en zonas rurales)

### Usuarios secundarios (Fase 2+)
- **Directivos de IE:** Necesitan asesorar a su plana docente
- **Auxiliares de educación:** Mismos procesos que docentes EBR
- **Instituciones educativas:** Compran licencias para beneficio a docentes (B2B)
- **UGELs/DREs:** Dashboards de gestión, reducción de carga en mesa de partes

---

## 5. PROCESOS DE LA CPM CUBIERTOS (Prioridad de MVP)

### FASE 1 (MVP — Lanzamiento)
1. **Concurso de Ascenso de Escala Magisterial (2026, 2027...)**
   - RVM 044-2026-MINEDU
   - Requisitos, cronograma, evaluación, escalas
   - Volumen: ~135,000 docentes por convocatoria

2. **Procesos de Nombramiento y Contrato**
   - Requisitos, fases, plazas disponibles
   - Volumen: ~50,000 docentes/año

### FASE 2+ (Roadmap futuro)
- Reasignación, Destaque, Permuta, Cambio de grupo, Concurso de Directivos

---

## 6. MODELO DE NEGOCIO (Híbrido)

### B2C (Direct to Docentes) — MVP
- **Precio:** S/25/año (validación inicial)
- **Objetivo:** Adquirir 2,000-5,000 usuarios en mes 1-6
- **Monetización:** Baja inicial, proof of concept

### B2B (Colegios, UGELs) — Fase 2
- **Target:** Colegios privados + redes de colegios (S/500-1,000/colegio/año)
- **Objetivo:** Escalabilidad a través de volumen institucional

---

## 7. RESTRICCIONES Y GARANTÍAS

### Lo que AVEND HACE
✅ Traduce normativa compleja en lenguaje claro  
✅ Cita exactamente la fuente (con enlace + fecha)  
✅ Mantiene historial de consultas del docente  
✅ Personaliza respuestas según escala/especialidad del usuario  
✅ Alerta sobre cambios normativos  

### Lo que AVEND NO HACE (y nunca lo hará)
❌ No interpreta ni opina sobre la normativa  
❌ No genera contenido que no esté en documentos oficiales  
❌ No reemplaza asesoría legal profesional  
❌ No automatiza trámites ante MINEDU (solo informa)  
❌ No accede a datos personales del docente más allá de email + especialidad  

---

## 8. SOSTENIBILIDAD OPERACIONAL

### Riesgo crítico: Mantener normativa actualizada
**Realidad:** La normativa cambia constantemente.
- **Solución:** Sistema de versionado + tú revisas resoluciones cada semana
- **Esfuerzo:** 3-5 horas/semana (monitorear MINEDU, actualizar JSONs)
- **Automatización futura:** Scraping de MINEDU (fase 2+)

### Confiabilidad de la IA
**Realidad:** Si la normativa en tu BD es incorrecta, la IA generará respuestas incorrectas con confianza.
- **Solución:** RAG cerrado (IA SOLO cita tu BD, no busca en internet)
- **Validación:** Tú estructuras correctamente los JSONs antes de subir

---

## 9. MÉTRICAS DE ÉXITO (MVP)

| Métrica | Mes 1 | Mes 3 | Mes 6 |
|---|---|---|---|
| Usuarios registrados | 200-500 | 1,000-1,500 | 2,000-5,000 |
| Consultas/mes | 500-1,000 | 3,000-5,000 | 10,000-15,000 |
| Tasa retención (D7) | 30% | 40% | 50%+ |
| NPS (Net Promoter Score) | 40+ | 50+ | 60+ |
| Procesos actualizados | 2 (ascenso, nominamiento) | 2 | 3+ |
| Costo por usuario adquirido | <S/20 | <S/15 | <S/10 |

---

## 10. DEPENDENCIAS EXTERNAS

### MINEDU
- Resoluciones y normas técnicas (acceso público)
- Cronogramas de procesos
- Cambios normativos (esperado 1-2 por mes)

### Usuarios
- Feedback sobre claridad de respuestas
- Casos de uso que descubren limitaciones

### Tecnología
- Claude API (disponibilidad, costo)
- Supabase (disponibilidad BD)
- Vercel (disponibilidad hosting)

---

## 11. VISIÓN A 18 MESES

**Mes 6:** MVP funcional, 5,000 usuarios, 2 procesos, validación de product-market fit  
**Mes 12:** 20,000 usuarios, 4 procesos, primeras alianzas B2B (5-10 colegios)  
**Mes 18:** 50,000+ usuarios, 6 procesos, plataforma referente en Perú, sostenible operacionalmente  

---

## 12. NOTAS PARA CLAUDE CODE

Cuando generador de código lea este documento, entienda que:

1. **Precisión normativa es crítica** — No es una app de productividad. Es un servicio legal-informativo. Errores = reputación destruida.
2. **Usuarios en zonas rurales son parte del target** — No asumir conectividad permanente ni dispositivos de alta capacidad.
3. **Mantenimiento de normativa es el 40% del trabajo** — La arquitectura debe hacer fácil actualizar JSONs sin romper consultas existentes.
4. **Escalabilidad tranquila** — No necesitas soportar 100k QPS en mes 1. Crece gradualmente.
5. **Seguridad data:** Docente solo ve sus propios chats. No hay comparación con otros.
