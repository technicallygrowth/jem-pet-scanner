# App escáner de comida para mascotas — decisiones, límites y próximos pasos

**Para compartir con el equipo · Julio 2026**

Hola. Este documento es un resumen de **por qué se ha trabajado como se ha trabajado** hasta ahora, dónde están los límites reales del producto, y qué sigue. La idea es que puedan probarlo y darnos feedback con contexto — no solo ver "ah, es un escáner que a veces reconoce marcas".

---

## Cómo probarlo (5 minutos, en el celular)

**Link:** https://jem-pet-scanner.vercel.app

Abrir directo en el celular (no en la computadora — sin cámara no hay nada que ver). Funciona en iPhone (Safari o Chrome) y Android (Chrome). Arriba a la derecha hay un toggle para cambiar entre inglés y español; cambia todo el texto.

- **Con Hill's, Purina, Royal Canin, Iams, Blue Buffalo y ~10 marcas más:** verás un análisis por capas con señales objetivas y un texto explicando qué dice la evidencia.
- **Con marcas latinoamericanas o menos conocidas (ej. Agility):** verás "no tenemos datos" y un botón para ayudarnos tomando foto de la etiqueta.

Tip práctico: sostener el código plano a unos 15–25 cm, con buena luz. Muy cerca la cámara no enfoca.

---

## Las decisiones que tomamos y por qué

Cada una de estas se tomó a propósito, con un trade-off claro. Vale la pena entenderlas antes de sugerir cambios.

### 1. "Explicar, no juzgar" en lugar de dar un veredicto tipo Yuka/Pawdi

**Qué significa:** la app **no da un puntaje 0–100 ni un veredicto "bueno/malo"**. Muestra hechos objetivos (cumple criterios veterinarios, tiene pruebas de alimentación, contiene colorantes artificiales, etc.) y un texto que explica qué significan esos hechos según la evidencia veterinaria. El dueño decide.

**Por qué:** la lista de ingredientes **no indica calidad** en comida de mascotas — esto lo dicen los nutriólogos veterinarios (WSAVA, la referencia mundial). Los subproductos son nutritivos, los granos aportan fibra, "grain-free" incluso se ligó a enfermedad cardíaca (DCM). Un puntaje como el de Yuka penaliza precisamente lo que la ciencia respalda. Además: dar un veredicto sobre una marca es indefendible legalmente si nos reclaman.

**Trade-off honesto:** el modelo alarmista ("¡esta comida tiene ingredientes tóxicos!") es más viral. El nuestro es más honesto pero menos llamativo. Ganamos por credibilidad, no por escándalo.

### 2. Empezar por el escáner y los datos, no por los avatares y trackers

**Qué significa:** el piloto de hoy solo hace una cosa — escanear un código de barras y mostrar el análisis. **No hay** perfiles de mascota, avatares personalizables, trackers de vacunas, ni directorio de veterinarias todavía.

**Por qué:** el escaneo **es el producto**. Es lo único que valida la hipótesis central ("los dueños compran a ciegas y quieren claridad"). Si lo posponíamos para hacer primero avatares y trackers, terminábamos como otro tracker de mascotas más — mercado saturado donde ustedes no tienen ventaja. La ventaja de este proyecto es escáner + audiencia petlover existente (Jem4Life, Favilist). Sin escáner, la ventaja desaparece.

**Buena noticia:** los agregados creativos (avatares kawaii con el estilo de Jem4Life, personalización por mascota, filtros por especie/etapa de vida) son técnicamente más fáciles que el escáner. Se pueden ir sumando sin volver a resolver nada difícil, **siempre que se queden en el celular del dueño**. Si en algún momento queremos que un perfil de mascota sincronice entre el iPhone y el iPad del mismo dueño, ahí sí necesitamos backend (Supabase, cuentas, etc.) y deja de ser barato.

### 3. Evaluar a nivel marca, no producto

**Qué significa:** en vez de analizar 500 alimentos uno por uno, tenemos una tabla de ~15 marcas (Purina, Hill's, Royal Canin, Blue Buffalo, Taste of the Wild, etc.). Cualquier producto escaneado hereda las señales de su marca.

**Por qué:** analizar producto por producto es imposible sin un equipo grande. Evaluar 15–25 marcas contra los criterios de WSAVA cubre la enorme mayoría de lo que un dueño escanea, con trabajo humano razonable.

### 4. Marcar TODAS las marcas como "ilustrativo" hasta que un nutriólogo veterinario las valide

**Qué significa:** cuando la app reconoce una marca, muestra un banner que dice "ilustrativo — esta marca todavía no ha sido confirmada con un nutriólogo veterinario". El texto de evidencia se muestra, pero **con esa advertencia siempre visible**.

**Por qué:** hoy nadie del equipo ha mandado el cuestionario oficial de WSAVA a las marcas ni ha pedido una revisión veterinaria de la rúbrica. Las evaluaciones vienen de documentación pública que se contradice entre fuentes. Mostrarlo como definitivo antes de validarlo sería exactamente el tipo de cosa por la que Yuka ha sido criticada por expertos en nutrición.

**Trade-off:** el banner "ilustrativo" resta pulido visual y baja la sensación de "app terminada". Pero quitarlo antes de validar sería mentira. Prefiero mentira menos que pulido más.

### 5. Bilingüe (inglés/español) desde el día uno

**Qué significa:** toda la interfaz se puede cambiar entre inglés y español con un toggle visible.

**Por qué:** mercado principal EE. UU. (donde por defecto es inglés), pero con una audiencia hispana grande y desatendida por las apps actuales. Hacerlo desde el arranque cuesta poco; agregarlo después es reingeniería.

### 6. Web app (PWA), no app de App Store

**Qué significa:** funciona en el navegador del celular, no hay que descargar nada de App Store/Google Play. Se puede "instalar" como ícono en la pantalla de inicio (falta probarlo — ya está la parte técnica).

**Por qué:** no pasa por revisión de Apple/Google, no requiere cuentas de developer pagadas ni sus procesos, y podemos actualizarla instantáneamente. Ideal para un piloto. Cuando sepamos si funciona la idea, se puede considerar app nativa. Por ahora sería desperdicio.

---

## Las dos limitaciones que sí importan

Ninguna es "un bug que se arregla la semana que viene". Son restricciones estructurales, y hay que entenderlas.

### Limitación 1: El escáner en sí

Lo que funciona: probado en iPhone 16 Pro (Safari y Chrome) y tablet Android (Honor Pad 9). Detecta códigos UPC-A y EAN-13, que son los estándares de EE. UU. y Europa.

Lo que **no** funciona / requiere condiciones específicas:

- La cámara del celular necesita **enfocar** — muy cerca no puede, muy lejos tampoco. La app da una guía visible en pantalla (15–25 cm), pero en escritorio muchas webcams no enfocan a esa distancia y fallan. En celular funciona bien.
- Al inicio, tuvimos un problema donde iPhone entregaba video a muy baja resolución y no lograba leer las barras. Ya está resuelto pidiendo resolución alta explícita, pero es un ejemplo de por qué esto **no es "instalar una librería y ya".**
- Códigos rotos, arrugados, con brillos, o con muy poca luz: no detecta. Esto es una limitación física, no de código.

### Limitación 2: De dónde vienen los datos (esto es lo verdaderamente difícil)

La única base pública gratis de comida para mascotas es **Open Pet Food Facts**, y tiene **~10,000 productos** (comparado con Pawdi que dice tener 300,000). Además:

- Es colaborativa (la llena la gente), así que la información es despareja. En pruebas reales, un producto Hill's común apareció **con el campo "marca" vacío** — nuestro código lo reconoció buscando la palabra "Hill's" en el texto libre del nombre, pero es un parche, no una solución.
- Cobertura fuera de Europa: débil. Marcas latinoamericanas populares (Agility Gold, otras marcas colombianas/mexicanas) simplemente no están.

**Sobre Pawdi y sus 300,000 productos:** investigamos y no publican cómo armaron esa base. Con muy alta probabilidad es **scraping** (raspado automático de sitios como Chewy, Amazon, PetSmart) — no un acuerdo comercial ni una base mágica. Scraping funciona pero está prohibido por los términos de servicio de esos sitios; **es un riesgo legal que Pawdi asumió y nosotros no**. No es un atajo mágico, es una decisión.

Alternativas revisadas:

- APIs comerciales tipo Go-UPC o UPCitemdb: identifican el producto (nombre, imagen), pero **rara vez traen ingredientes** — que es lo único que aporta valor a este análisis. Además cuestan entre USD $10 y $100+/mes.
- Bases regulatorias (FDA, AAFCO): tienen recalls y definiciones de ingredientes, pero **no un catálogo de productos**.
- Kaggle/scrapers de terceros: existen datasets viejos, pero se desactualizan rápido y arrastran el mismo problema legal.

**Traducción para el equipo:** la menor cobertura de la app no es un defecto de programación. Es una decisión pendiente sobre cuánto riesgo legal queremos asumir y cuánto queremos gastar en datos. Es la conversación más importante que este proyecto tiene por delante.

---

## Próximos pasos

Separando lo difícil de lo fácil, como sugeriste.

### Lo difícil que hay que resolver antes de escalar

1. Mandarle el cuestionario oficial de WSAVA a las marcas de nuestra tabla y validar la rúbrica con un nutriólogo veterinario. Sin esto, el banner "ilustrativo" no se puede quitar.
2. Decidir cómo enfrentamos el problema de cobertura de datos: seguir con Open Pet Food Facts + crecimiento por fotos de usuarios (lento, honesto), o considerar scraping/API paga (rápido, con riesgo o costo).
3. Conectar el flujo de "toma foto de la etiqueta" a algún destino real. Hoy la foto se toma y llega a una pantalla de "gracias", pero **no se envía a ningún lado** (la app lo dice explícitamente). Opciones: correo con Formspree (~15 min de setup) o base real con Supabase (~1 día).
4. Agregar marcas latinoamericanas comunes a la tabla — trabajo manual pero directo.

### Lo fácil/creativo que se puede ir sumando

Esto es lo que aporta pulido y sensación de "app real". Es menos riesgoso técnicamente y se puede hacer sin volver a tocar la parte difícil.

- Perfil de mascota (nombre, foto, especie, edad) guardado en el celular. Fácil.
- Avatar personalizable con el estilo kawaii de Jem4Life. Fácil (es diseño + assets).
- Filtro por especie (perro/gato) y por etapa de vida (cachorro/adulto/senior) en el análisis. Ya está la estructura, solo hay que aplicarlo.
- Historial de escaneos guardado en el celular (que la usuaria vea qué escaneó antes).
- Capa 3 del análisis: "creencias comunes vs. evidencia" (por qué grain-free no es lo que la gente cree, subproductos, etc.).
- Instalación como ícono en pantalla de inicio (técnicamente ya está, falta verificar en dispositivos).

**Punto importante para no sobreprometerle a nadie:** todo lo de arriba es fácil **si se queda en el celular de la persona**. En el momento en que alguien pida "quiero que el perfil de Firulais me siga entre mis dispositivos" o "quiero que otros dueños vean mi historial", entramos a necesitar backend (Supabase, cuentas de usuario) y ya no es fácil ni barato.

### Post-piloto (si validamos que la idea funciona)

- Comunidad (opiniones de otros dueños, con moderación). Diferenciador grande pero trae problemas de reseñas manipuladas y moderación.
- App nativa en las tiendas, si la PWA prueba que hay tracción.
- Directorio de veterinarias, marcas recomendadas (con etiqueta clara de "pagado" si aplica).

---

## Feedback que nos serviría

Si pueden probarla, lo más útil sería:

1. Escaneen 3 o 4 alimentos que tengan a la mano. Anoten cuáles reconoce y cuáles no.
2. El banner "ilustrativo" — ¿es claro, o queda como estorbo?
3. Cuando el producto no está y aparece el botón de "tomar foto de la etiqueta" — ¿lo usarían, o les da flojera?
4. Si han probado Pawdi u otra app similar, ¿en qué momento se sentirían cómodas con la nuestra en vez de esa? ¿Qué falta específicamente?

Nada de esto está aprobado ni en producción. Es un piloto para validar la idea antes de decidir si sigue adelante. Los comentarios ayudan a decidir en qué invertir el próximo esfuerzo — sobre todo en la parte de "los datos", que es donde realmente se juega el producto.
