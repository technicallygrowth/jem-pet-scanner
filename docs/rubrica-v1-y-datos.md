# Análisis v1 (no veredicto) \+ plantilla de marcas \+ paso a paso hacia datos reales

Documento de trabajo · Proyecto app escáner de comida para mascotas Complemento del plan principal · Julio 2026

**Enfoque v1: analizar, no juzgar.** En vez de un número "82/100" o un semáforo bueno/malo, la app muestra **hechos \+ explicación por capas** y el dueño decide. Este documento define qué hechos mostramos, cómo se presentan, la plantilla para evaluar marcas, y cómo pasar de un demo con datos de muestra a datos reales.

**Importante:** los criterios de abajo son una propuesta de arranque; deben ser validados por un nutriólogo veterinario antes de lanzar (Decisión 6 del documento ejecutivo). Todo esto es propuesta, aún no aprobada.

---

## 1\. Cómo se arma el análisis (las 4 capas)

La pantalla de resultado, de arriba hacia abajo:

### Capa 1 — Orientación rápida: señales factuales (para decidir en 3 segundos)

Un puñado de hechos verificables tipo sí / no / parcial. **No dicen "bueno o malo", dicen hechos.** Cada señal lleva su etiqueta escrita y un color de apoyo (verde \= se cumple, ámbar \= parcial/en debate, gris \= dato faltante).

| Señal (Capa 1\) | De dónde sale | Ejemplo |
| :---- | :---- | :---- |
| ¿Completo y balanceado (AAFCO) para la etapa de vida? | Etiqueta / base abierta | Sí |
| ¿Marca cumple los criterios veterinarios (WSAVA)? | Tabla de marcas | Sí / Parcial / No |
| ¿Sustentado por pruebas de alimentación reales (feeding trials)? | Tabla de marcas | Sí |
| ¿Contiene colorantes o saborizantes artificiales? | Ingredientes | No |
| ¿Retiros (recalls) recientes? | Historial de la marca | No |

Los cinco criterios WSAVA (nutriólogo veterinario en plantilla, feeding trials, fábricas propias con control de calidad, investigación publicada, buen historial de recalls) alimentan la señal "cumple criterios veterinarios". Se muestran desglosados si el usuario toca para ver más.

### Capa 2 — Qué dice la evidencia (texto simple)

Explica qué aporta y qué preocupa del alimento, según AAFCO/WSAVA, en lenguaje de dueño. Ejemplo:

*"El primer ingrediente es pollo. Está hecho por una marca que emplea a un nutriólogo veterinario y hace pruebas de alimentación reales — que es lo que la evidencia considera más importante que el orden de los ingredientes. Es un alimento completo y balanceado para perros adultos."*

Siempre citando la fuente ("según WSAVA/AAFCO").

### Capa 3 — Creencias comunes (con contexto, sin falsa equivalencia)

Aborda de frente lo que mucha gente cree, y aclara qué respalda la ciencia. Ejemplo:

*"Mucha gente evita los subproductos y los granos. La evidencia veterinaria no los considera malos: los subproductos (vísceras, hígado) son nutritivos y digeribles, y los granos aportan fibra y nutrientes. El 'grain-free' incluso se ligó a problemas cardíacos (DCM)."*

**Regla:** primero la evidencia, luego la creencia — nunca al mismo nivel.

### Capa 4 — La comunidad (FASE 2, no en el MVP)

Opiniones y experiencias de otros dueños. Gran diferenciador, pero trae moderación, riesgo de reseñas difamatorias/manipuladas y arranque en frío. Va después, con plan de moderación.

**La voz de la app** es "esto es lo que respalda la evidencia", no una opinión personal. Si la app opina, vuelve a ser un veredicto y regresa el riesgo legal.

---

## 2\. Plantilla de evaluación de marcas

Una fila por marca. El análisis es a nivel **marca/línea**; cada producto escaneado hereda las señales de su marca. Copien esta tabla a una hoja de cálculo para llenarla. Las señales son **sí / parcial / no**, no puntos.

| Campo | Ejemplo |
| :---- | :---- |
| Marca / línea | Purina Pro Plan |
| Especie | Perro / Gato / Ambos |
| ¿Nutriólogo veterinario certificado? | Sí |
| ¿Feeding trials (AAFCO)? | Sí |
| ¿Fábricas propias \+ control de calidad? | Sí |
| ¿Investigación publicada (peer-reviewed)? | Sí |
| ¿Buen historial de recalls? | Sí |
| Señal WSAVA global (Sí / Parcial / No) | Sí |
| ¿Colorantes/saborizantes artificiales? | No |
| Etapas de vida cubiertas | Cachorro / Adulto / Senior |
| Texto de evidencia (Capa 2\) | (redactar 1-2 frases) |
| Fuente / evidencia (link) | (cuestionario WSAVA, sitio de la marca) |
| Verificado por | (nombre) / fecha |

**Datos de muestra para el demo** (punto de partida — verificar antes de publicar; marcar como "ilustrativo" en el demo):

| Marca | Especie | Señal WSAVA | Nota |
| :---- | :---- | :---- | :---- |
| Purina (Pro Plan, ONE) | Ambos | Sí | Cumple los 5 criterios |
| Hill's Science Diet | Ambos | Sí | Muy recomendada en clínicas |
| Royal Canin | Ambos | Sí | Fuerte en dietas por raza/condición |
| Iams | Ambos | Sí | Cumple los 5 criterios |
| Eukanuba | Perro | Sí | Cumple los 5 criterios |
| Just Food For Dogs | Perro | Sí (verificar) | Nutriólogos veterinarios involucrados |
| Blue Buffalo | Ambos | Parcial | Cumple nutrientes AAFCO, no todos los criterios de fabricante; casos de DCM |
| Wellness | Ambos | Parcial | En algunas listas WSAVA, ausente en otras — verificar |
| Orijen / Acana | Ambos | Parcial | "Premium" boutique; no todos los criterios de fabricante |
| Taste of the Wild | Ambos | No | Grain-free/boutique; casos de DCM; excluida por fuentes veterinarias |
| Merrick, Canidae, Nulo, Stella & Chewy's, Open Farm | Ambos | Por evaluar | Boutique — evaluar 1 a 1 |

Para gato, agregar marcas fuertes en felinos (líneas felinas de Royal Canin, Hill's, Purina Pro Plan, y opciones húmedas). Los gatos son carnívoros obligados (más proteína, taurina, ácido araquidónico) y necesitan su propia lista.

---

## 3\. Cómo se conecta con la base abierta (menos trabajo manual)

1. Usuario escanea → la app consulta **Open Pet Food Facts** (`https://world.openpetfoodfacts.org/api/v2/product/[código].json`) para obtener **marca, producto y (si hay) ingredientes/análisis nutricional**.  
2. La app busca esa **marca** en la tabla de arriba y arma las señales (Capa 1\) y el texto (Capa 2).  
3. Si la base trae ingredientes, se usan para las señales de colorantes/primer ingrediente. Si no, se muestra con nota "datos de producto incompletos".  
4. Si la marca no está en la tabla → "marca aún no analizada" \+ invitar a fotografiar la etiqueta.

Ventaja: evaluando \~25 marcas cubren la mayoría de lo que un usuario de EE. UU. escanea, sin capturar producto por producto.

---

## 4\. Paso a paso: de datos de muestra a datos reales

**Fase de demo (rápida, para mostrar a Ricky):**

1. Llenar la tabla con las 5-6 marcas de señal WSAVA clara (datos reales, verificables).  
2. Para el resto, usar los "datos de muestra" de arriba, **etiquetados en la app como "ilustrativo / en verificación"**.  
3. Exportar la tabla a un archivo JSON que la app lee. Con eso ya hay un demo funcional y honesto (nunca presentar datos de muestra como reales).

**Fase de datos reales (para lanzar):** 4\. Cerrar la lista final de \~20-25 marcas (perro y gato) más vendidas en EE. UU. 5\. Por cada marca: revisar sus respuestas públicas al cuestionario WSAVA, su declaración AAFCO y sus ingredientes. Si falta info, enviar las preguntas WSAVA directo a la marca. 6\. Llenar cada fila (señales \+ texto de evidencia \+ link de evidencia \+ quién verificó). 7\. **Validación veterinaria:** un nutriólogo veterinario revisa los criterios y una muestra del análisis. 8\. Quitar las etiquetas de "ilustrativo" solo de las marcas ya verificadas. 9\. Publicar la metodología ("cómo analizamos") dentro de la app, citando WSAVA y AAFCO.

**Regla de oro:** la app informa, no juzga; y nunca presenta datos de muestra como si fueran reales. La credibilidad es el producto.  
