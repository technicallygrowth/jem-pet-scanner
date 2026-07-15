# Sistema de avatares kawaii de mascota — spec para el equipo creativo

**Julio 2026 · Documento de trabajo para el equipo creativo de Jem4Life**

Este documento describe cómo diseñar y entregar las ilustraciones de mascota que van a vivir dentro de la app escáner. La idea es que el usuario pueda armar un avatar parecido a su mascota real, tipo Duolingo: opciones limitadas y curadas, pero suficientes para que se sienta personal.

**Estado hoy:** en el demo hay una ilustración temporal muy básica hecha por mí (Claude Code). Esa se reemplaza cuando el equipo creativo entregue las variantes reales. La app está preparada para intercambiar los assets sin volver a tocar nada del código.

---

## 1. La lógica del sistema (por capas)

En vez de dibujar todos los avatares posibles (que serían cientos de combinaciones), dibujamos **capas separadas** que se apilan una sobre otra:

```
Capa 4 — Accesorios       (moño, bandana, sin nada)
Capa 3 — Ojos              (color y forma)
Capa 2 — Orejas            (tipo)
Capa 1 — Cuerpo/pelaje     (silueta base + color de pelaje)
```

Cuando el usuario elige "perro naranja con orejas caídas y ojos verdes", el código toma esas 4 piezas y las apila. Todas encajan porque todas están dibujadas sobre la misma cuadrícula.

**Beneficio:** con 6 pelajes × 3 orejas × 4 ojos × 3 accesorios = **216 combinaciones únicas** con solo ~16 ilustraciones dibujadas.

---

## 2. Los atributos y opciones (propuesta v1)

Estas son las opciones que le mostramos al usuario al crear el avatar. Son una **propuesta** para que el equipo creativo las revise. Menos opciones = producto más manejable; más opciones = personalización más rica pero más trabajo.

### Especie (obligatorio, primera pregunta)
- Perro
- Gato

### Silueta / raza aproximada (opcional en v1)
Podemos empezar con **una silueta genérica por especie** (un perrito genérico kawaii, un gatito genérico kawaii). Más adelante, si vale la pena, agregar razas populares:
- Perro: chico (chihuahua/poodle), mediano (labrador/mestizo), grande (pastor alemán/golden)
- Gato: pelo corto, pelo largo (persa)

**Recomendación:** para el piloto, **una silueta por especie**. Simplifica el trabajo y el usuario diferencia su mascota más por color que por silueta.

### Color de pelaje (6 opciones)
Cubren el ~90% de mascotas reales:
1. Negro
2. Café / chocolate
3. Naranja / crema (ginger)
4. Blanco
5. Gris
6. Mestizo / bicolor (blanco con manchas negras o café)

### Patrón del pelaje (3 opciones, se combina con el color base)
1. Sólido (sin patrón)
2. Manchado (spots — típico de perros pinto o vacas)
3. Atigrado (tabby — solo relevante para gatos, opcional para perros)

**Recomendación:** empezar sin patrón (todos sólidos) y agregar patrón en v2 si sobra tiempo.

### Orejas (3 opciones para perro, 2 para gato)
- **Perro:** paradas / caídas / semi-caídas
- **Gato:** paradas / dobladas (scottish fold)

### Ojos (color · 4 opciones)
- Café oscuro
- Café miel
- Azul
- Verde

### Ojos (forma · 2 opciones)
- Redondos y grandes (más "cachorro")
- Almendrados (más "adulto/felino")

**Recomendación:** para v1, **un solo estilo de forma de ojos** (redondos, más kawaii). Agregar la forma almendrada solo si el equipo la quiere de entrada.

### Accesorios (3 opciones)
1. Sin nada
2. Moño en la cabeza (colores de marca: durazno, magenta)
3. Bandana en el cuello (colores de marca)

---

## 3. Total de assets a producir (v1 mínimo viable)

Bajo la propuesta anterior con las recomendaciones aplicadas:

| Capa | Perro | Gato | Total |
| :---- | :---- | :---- | :---- |
| Cuerpo (silueta base) | 1 | 1 | 2 |
| Pelaje: los 6 colores aplicados al cuerpo | 6 | 6 | 12 |
| Orejas | 3 | 2 | 5 |
| Ojos (redondos, en 4 colores) | 4 | 4 | 4 (reutilizables) |
| Accesorios | 3 | 3 | 3 (reutilizables) |

**Total mínimo: ~26 ilustraciones** para tener perro y gato completamente personalizables.

Si además hacemos 2 tamaños de perro (chico y grande) o agregamos patrón atigrado, sube a ~40. Manejable.

---

## 4. Cómo tienen que estar hechos los archivos

**Formato obligatorio: SVG.**

- Vector, no pixeles. Nada de JPG/PNG.
- Se escala bonito en cualquier tamaño (avatar chico en historial, avatar grande en dashboard).
- Pesa poquísimo → la app carga rápido.

**Especificaciones técnicas:**

1. **Cuadrícula fija: 400 × 400 píxeles.** Todas las capas tienen que estar dibujadas exactamente en este cuadrado, aunque el elemento (por ejemplo unas orejas) solo ocupe una parte. El resto del cuadro queda transparente.
2. **Anclas comunes:** todas las orejas se dibujan como si estuvieran pegadas a un cuerpo posicionado en un punto fijo (que yo definiré en el archivo `.svg` base). Cuando el equipo entregue las orejas, tienen que quedar en las coordenadas exactas donde encajarían con el cuerpo. Recomendación: **trabajar todos los archivos sobre el mismo template** de 400×400 que trae el cuerpo dibujado en gris tenue como referencia. La capa gris se borra antes de entregar; sirve solo para alinear.
3. **Colores hardcodeados donde apliquen, o dejados como capa editable donde el color va a cambiar.** Ejemplo: el cuerpo de "perro naranja" ya viene con el naranja aplicado; los ojos vienen con el color aplicado; los moños vienen con el color de marca aplicado.
4. **Nombres de archivo estrictos** (así el código los encuentra automático):

```
cuerpo-perro-negro.svg
cuerpo-perro-cafe.svg
cuerpo-perro-naranja.svg
cuerpo-perro-blanco.svg
cuerpo-perro-gris.svg
cuerpo-perro-mestizo.svg

cuerpo-gato-negro.svg
cuerpo-gato-cafe.svg
...

orejas-perro-paradas.svg
orejas-perro-caidas.svg
orejas-perro-semicaidas.svg

orejas-gato-paradas.svg
orejas-gato-dobladas.svg

ojos-redondos-cafe-oscuro.svg
ojos-redondos-cafe-miel.svg
ojos-redondos-azul.svg
ojos-redondos-verde.svg

accesorio-mono.svg
accesorio-bandana.svg
```

Todo en minúsculas, sin acentos, con guiones. **Sin espacios, sin ñ, sin mayúsculas**, o el código no los va a encontrar.

5. **Compatibilidad con la paleta de marca.** Los detalles que no son "pelaje" (contornos, moños, bandanas, sombras) tienen que usar los colores oficiales: durazno `#f6bda7`, magenta `#9b046f`, carbón `#2e2a39`. El contorno principal en carbón, no negro puro.

---

## 5. Proceso de entrega e integración

1. **El equipo creativo** hace las ilustraciones siguiendo la spec de arriba.
2. **Se entregan** por Drive/carpeta compartida — todos los `.svg` en una sola carpeta.
3. **Emely las revisa** contra la spec (nombres, cuadrícula, colores de marca).
4. **Se pasan a la app.** Yo (Claude Code) las coloco en `src/assets/avatares/` con los nombres correctos.
5. **La app las usa automático:** el código está preparado para recibir cualquier archivo que respete la nomenclatura, sin ajustes manuales por asset.

Tiempo esperado de integración una vez entregadas: ~30 minutos, sin diseño de por medio.

---

## 6. Consideraciones adicionales para el equipo creativo

- **Kawaii, no realismo.** Ojos grandes, líneas suaves, expresión amigable. Igual que las mascotas de Jem4Life.
- **Legibilidad a tamaño pequeño.** El avatar se muestra en 64px en el historial de escaneos. Detalles muy finos se pierden. Preferir siluetas fuertes.
- **Consistencia entre variantes.** Todas las opciones de "orejas" deben verse dibujadas por la misma mano — mismo grosor de línea, mismo nivel de detalle.
- **Diversidad respetuosa.** Las 6 opciones de pelaje deben cubrir mascotas comunes; **no** hace falta representar razas específicas por país en v1.
- **Los ojos hacen la mitad del carácter.** Vale la pena invertir tiempo ahí.

---

## 7. Qué se hará después del piloto

Ideas para v2 (fuera del alcance ahora, pero vale pensarlas al diseñar):

- Fondos de color detrás del avatar (para el dashboard).
- Expresiones (dormido, feliz, hambriento) según acciones del usuario.
- Prendas estacionales (gorrito de Navidad, etc.).
- Segundas mascotas (multi-perfil).

---

**Preguntas o cambios a esta propuesta: sugiero conversarlas antes de que el equipo creativo empiece a dibujar, para no rehacer trabajo.**
