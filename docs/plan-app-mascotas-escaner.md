# Plan A–Z: App escáner de comida para mascotas (piloto)

**Proyecto interno JEM / "Jem for You"** · Documento de trabajo para el equipo Fecha: 13 de julio de 2026 · Autora del brief: Emely Contreras

Cómo usar este documento: está pensado para que lo leas tú (sin conocimientos técnicos) y para que el equipo lo entienda completo. Al final hay un bloque en inglés listo para pegar en **Claude Code** y arrancar el desarrollo. Las explicaciones son en español; solo las instrucciones técnicas van en inglés porque funcionan mejor así.

**Esto es una propuesta (v1), aún no aprobada.** El objetivo es presentar algo que tenga sentido, sea posible de construir, y llegar a un **demo tangible** en Claude Code para sustentar la decisión. Nada aquí es definitivo; es la base para seguir respondiendo preguntas y avanzar.

**Cambio de enfoque importante (v1): analizar, no juzgar.** En vez de dar un veredicto "bueno/malo" (modelo Yuka), la app **explica qué esperar de un alimento** y deja que el dueño decida con criterio. Muestra, por capas: una orientación rápida factual, lo que dice la evidencia veterinaria, las creencias populares (y por qué), y —más adelante— la opinión de otros dueños. Esto es más honesto, mucho más seguro legalmente, y encaja con su ADN de marca de contenido (Favilist). El detalle está en la sección 3\.

---

## 0\. Lo más importante antes de empezar (léelo aunque no leas nada más)

Decidieron construir un escáner que califique qué tan buena es la comida de mascota. La parte difícil **no es el escáner ni la app**. La parte difícil es responder dos preguntas, y son las que hacen o rompen el producto:

1. **¿De dónde sale la información del producto** (ingredientes, análisis nutricional) cuando alguien escanea un código?  
2. **¿Contra qué criterio decidimos que es "buena" o "mala"**, de forma que podamos defenderlo si una marca reclama?

Investigué las dos. Esto es lo que encontré y lo que cambia el plan:

- La base de datos abierta más obvia, **Open Pet Food Facts**, existe y tiene API gratuita, pero solo tiene **\~10,000 productos**, es colaborativa (la llena la gente) y su cobertura es despareja — sobre todo fuera de Europa y en México/LatAm. Traducción: si dependemos solo de ella, el usuario va a escanear y ver **"sin datos"** la mayoría de las veces. Eso mata la primera impresión.  
- No existe un "sello bueno/malo" ya aceptado para comida de mascota. **AAFCO** (el estándar de referencia en EE. UU.) solo dice si un alimento es "completo y balanceado" — es un piso mínimo de seguridad, **no** una medida de calidad. No juzga si los ingredientes son buenos.

**Conclusión que cambia el plan:** en lugar de "escáner conectado a una base de datos mágica", el piloto debe ser **escáner \+ un catálogo curado por nosotros \+ una rúbrica de calidad propia y transparente**. Empezamos pequeños y defendibles, no grandes y vacíos. Esto está desarrollado en las secciones 3 y 4\.

Un punto que sí hay que cuidar (aunque más leve de lo que pensé al inicio): ustedes **no venden alimento** — venden diseños print-on-demand y productos personalizados inspirados en mascotas. Así que **no hay conflicto de interés directo** entre calificar comida y vender comida. Perfecto. El único punto de cuidado es a futuro: si algún día cobran por "marcas recomendadas" de alimento, hay que etiquetarlo con toda claridad como pagado y nunca alterar una calificación por dinero. Y como referencia general: Yuka, la app que los inspiró, ha sido fuertemente criticada por expertos en nutrición por sus calificaciones (ver sección 1b) — por eso la metodología pública y validada (sección 3\) importa desde el día uno.

**Nota rápida sobre el celular:** instalar el piloto en el teléfono es de lo fácil. Una PWA no pasa por App Store: en iPhone se abre en Safari → Compartir → "Agregar a inicio"; en Android, Chrome ofrece un botón "Instalar app". Queda como un ícono normal. Lo único que la cámara necesita es HTTPS, que Vercel da gratis. Para el piloto, web está perfecto.

---

## 1\. Qué vamos a construir (alcance del piloto, ya decidido)

Con base en tus respuestas, el piloto (MVP, "producto mínimo viable") es:

- **Formato:** una **Web App / PWA** — una aplicación web que abre en el navegador del celular y se puede "instalar" en la pantalla de inicio. No es app de App Store (eso viene después, si el piloto funciona).  
- **Función única del MVP:** escanear el código de barras con la cámara → mostrar un **análisis por capas** del alimento (no un veredicto): una **orientación rápida factual** arriba (datos objetivos, no un juicio) y, debajo, **qué esperar de ese alimento** — lo que dice la evidencia y las creencias comunes — en lenguaje de dueño de mascota, no de químico. La comunidad (opiniones de otros dueños) queda para la fase 2\.  
- **Bilingüe desde el inicio (prioridad):** la persona elige idioma (inglés / español). Público principal EE. UU., así que **inglés por defecto** con selector visible para cambiar a español. Esto sí va en el MVP porque es requisito suyo y es barato hacerlo bien desde el arranque.  
- **Perro y gato desde el inicio** (más especies a futuro). Ojo: perro y gato tienen perfiles nutricionales AAFCO distintos, así que hacer ambos bien casi duplica el trabajo de datos. Ver Decisión 3 del documento ejecutivo para la estrategia recomendada (diseñar para ambos, llenar datos de uno primero para el demo).  
- **Fuera del MVP (documentado para fases 2 y 3):** avatares/perfiles de mascota, trackers de vacunas y baño, directorio de veterinarias, marcas "recomendadas" pagadas.

Por qué así: es lo único que prueba tu hipótesis central ("la gente compra a ciegas y quiere claridad"). Todo lo demás es útil pero te distrae de saber si lo principal funciona. Si metes trackers y avatares al piloto, multiplicas el trabajo y las cosas que pueden fallar frente a Ricky.

**Un riesgo que quiero nombrar:** las notas de su reunión dicen "dejar el escaneo para después y empezar por lo más sencillo". Eso contradice este alcance. Están bien en posponer avatares y trackers — pero **el escaneo ES el producto**. Si lo posponen, el piloto queda como un tracker de mascotas más, en un mercado saturado donde no tienen ventaja. La ventaja de ustedes es el escaneo \+ su marca petlover existente. Recomiendo mantener el escaneo como el corazón del MVP.

---

## 1b. Competencia y en qué somos diferentes (Yuka y los demás)

**Corrección importante de premisa: Yuka no es su competencia.** Investigué y Yuka **no escanea comida de mascota y no tiene planes de hacerlo** — solo comida y cosméticos para humanos (4M de productos de comida, 2M de cosméticos, todos humanos). Es su *inspiración y analogía* ("el Yuka de las mascotas"), útil para explicar la idea, pero no su rival. Si alguien escanea croquetas con Yuka, le da un puntaje calculado con estándares **humanos** — inútil e incluso engañoso para un perro.

**Su competencia real ya existe (el mercado no está vacío).** Hay varias apps de escaneo de comida de mascota:

| App | Qué hace | Tamaño / estado |
| :---- | :---- | :---- |
| **Pawdi** | Escaneo de código \+ detección de aditivos "dañinos" (BHA, BHT, carragenina, propilenglicol), sistema de calificación | La más grande: 300,000+ productos, activa (actualizada 2026\) |
| **PetScans** | Analiza ingredientes buscando sustancias dañinas, alérgenos, aditivos | Gratis, en App Store |
| **Safe Pet Treats** | Escaneo para ver retiros (recalls) e ingredientes dañinos | Enfocada en seguridad/recalls |
| **NutriPet** | Escaneo por código, etiqueta y foto; perfiles de perro/gato | En desarrollo |
| **Nutika** | Marca aditivos y señales de correlación con DCM | Multi-especie |

**El pain point que comparten todas (y su oportunidad).** Casi todas heredaron el modelo de Yuka: **señalar "ingredientes tóxicos" y satanizar aditivos/subproductos** — justo lo que los veterinarios nutricionistas consideran pseudociencia. Los problemas documentados de Yuka, que estas copias arrastran, son:

- **Miedo sin evidencia:** demonizan conservadores e ingredientes procesados sin base; un nutricionista comparó a Yuka con "tener a un influencer alarmista de supermercado en el bolsillo".  
- **Puntaje único para todos:** no ajusta por necesidades individuales (etapa de vida, condición) — cada producto tiene un solo número.  
- **Penaliza cosas buenas:** el algoritmo castiga por reglas crudas (Yuka penaliza la grasa aunque sea nutritiva; da un bonus arbitrario a lo "orgánico").  
- **Errores de datos:** ingredientes faltantes, productos duplicados con calificaciones distintas.  
- **Salud mental:** clasificar en "bueno/malo" refuerza relaciones ansiosas con la comida.

**Cómo lo convertimos en nuestro diferenciador (esto es el pitch):**

1. **Explicar, no juzgar.** No damos un veredicto que asuste; explicamos qué esperar del alimento para que el dueño decida. Mensaje: *"No te decimos si es bueno o malo; te damos la información clara para que tú decidas con criterio."* Es el opuesto exacto del alarmismo de Yuka y sus clones.  
2. **Múltiples perspectivas, con jerarquía honesta:** qué dice la evidencia veterinaria, qué creen muchos dueños (y por qué), y la opinión de la comunidad — sin poner un mito al mismo nivel que la ciencia.  
3. **Personalización** (donde Yuka falla): analizar según la **etapa de vida** de la mascota (cachorro/adulto/senior). Conecta con los perfiles de la Fase 2 y es una debilidad directa de la competencia.  
4. **Distribución y comunidad:** ya tienen audiencia petlover (Jem4Life, Favilist, Etsy) y canales para promoverlo — algo que un competidor nuevo no tiene.  
5. **Bilingüe EN/ES** desde el inicio, mercado en EE. UU. con fuerte población hispana desatendida por las apps actuales.

**La contra honesta (para que entren con los ojos abiertos):** el modelo alarmista es más *viral* — "destapar ingredientes tóxicos" se comparte más que "aquí tienes la información equilibrada". El modelo de "analizar, no juzgar" es más honesto pero menos llamativo, y corre el riesgo de la **parálisis en el pasillo**: si das demasiado matiz, el dueño no sabe qué hacer frente al estante. Por eso el análisis siempre lleva una **orientación rápida arriba** (sección 3). Los competidores tienen ventaja de ser primeros y bases más grandes (Pawdi: 300k productos). Ustedes **no van a ganar por ser primeros ni por tamaño**, sino por credibilidad, educación honesta, personalización y su audiencia existente.

---

## 2\. Cómo funciona por dentro (en simple)

El flujo completo, sin tecnicismos:

1. El usuario abre la web app en su celular (un link, ej. `escanea.favilist.com`).  
2. Da permiso de cámara y apunta al código de barras del producto.  
3. La app **lee los números** del código de barras (esto lo hace el navegador, gratis).  
4. Con esos números, la app **busca el producto** en nuestro catálogo (y opcionalmente en la base abierta).  
5. La app arma el **análisis por capas** (ver sección 3): una orientación rápida factual \+ qué esperar del alimento.  
6. Muestra arriba unas **señales objetivas** (ej. "Completo y balanceado: sí", "Hecho por una marca con nutriólogo veterinario: sí", "Contiene colorantes artificiales: no") y, debajo, la explicación de qué aportan y qué preocupa de esos ingredientes.  
7. Si el producto **no está** en el catálogo: en vez de un error frío, le pedimos al usuario tomarle foto a la etiqueta para irlo agregando (así crecemos la base con uso real).

El paso 3 (leer el código con la cámara) hoy es un problema resuelto: los navegadores modernos traen una función nativa (`BarcodeDetector`) muy rápida, y para los que no la tienen usamos una librería gratuita de respaldo (`html5-qrcode` / ZXing). No hay que inventar nada aquí.

---

## 3\. El corazón del producto: el análisis (no un veredicto)

Esto es lo que realmente venden. Un escáner lo copia cualquiera; una **forma honesta de explicar qué esperar de un alimento** es el diferenciador. Yuka fue la inspiración, pero su método (dar un veredicto por la lista de ingredientes) **no aplica a mascotas** — y peor, los veterinarios nutricionistas lo consideran desinformación. Por eso el modelo v1 es **analizar, no juzgar**: mostramos la información por capas y el dueño decide.

**Por qué NO damos un veredicto al estilo Yuka.** La evidencia veterinaria es clara: la lista de ingredientes no indica calidad. Los subproductos son nutritivos y digeribles (vísceras, hígado); los granos aportan fibra y nutrientes; "grain-free" no está respaldado por la ciencia y hasta se ligó a enfermedad cardíaca (DCM). Un veredicto que premie esas cosas orientaría a los dueños a *peor* comida y nos haría indefendibles ante una marca. Y un número único ("82/100") esconde el matiz. Mejor: **explicar y dejar decidir.**

**La pantalla de resultado tiene cuatro capas (de arriba hacia abajo):**

**Capa 1 — Orientación rápida (factual, no un juicio).** Un puñado de **señales objetivas** tipo sí/no, para el que decide en 3 segundos en el pasillo. No dicen "bueno/malo", dicen hechos verificables:

- Completo y balanceado (AAFCO) para la etapa de vida: sí / no.  
- Hecho por una marca que cumple los criterios veterinarios (WSAVA): sí / parcial / no.  
- Sustentado por pruebas de alimentación reales (feeding trials): sí / no.  
- Contiene colorantes o saborizantes artificiales: sí / no.  
- Retiros (recalls) recientes: sí / no.

Estas señales se muestran con color solo como **ayuda visual** (verde \= presente/cumple, ámbar \= parcial, gris \= dato faltante), nunca como una nota moral. El dueño ve de un vistazo los hechos y, si quiere, baja a leer.

**Capa 2 — Qué dice la evidencia.** En lenguaje simple: qué aporta y qué preocupa de ese alimento según los veterinarios/AAFCO/WSAVA. Ej.: *"El primer ingrediente es pollo. Está hecho por una marca con nutriólogo veterinario y pruebas de alimentación, lo que la evidencia considera más importante que la lista de ingredientes."* Citamos fuentes.

**Capa 3 — Creencias comunes (con contexto, sin falsa equivalencia).** Aquí abordamos de frente lo que mucha gente cree, y aclaramos qué respalda la ciencia. Ej.: *"Mucha gente evita los subproductos y los granos. La evidencia veterinaria no los considera malos: los subproductos son nutritivos y los granos aportan fibra."* Clave: **no ponemos un mito al mismo nivel que la evidencia**; explicamos la creencia y luego lo que dice la ciencia.

**Capa 4 — La comunidad (FASE 2, no en el MVP).** Opiniones y experiencias de otros dueños. Es un gran diferenciador y encaja con su ADN de contenido, pero trae moderación, riesgo de reseñas difamatorias y de marcas que las manipulan (astroturfing), más el problema de arranque en frío. Por eso va **después**, con un plan de moderación, no en la primera versión.

**Importante — la voz de la app.** La app no da su opinión personal ("¿qué dices tú?"). Su voz es *"esto es lo que respalda la evidencia"*, separada de las creencias populares y de los comentarios. En el momento en que la app opina, vuelve a ser un veredicto y regresa el riesgo legal.

**El backbone de datos sigue siendo WSAVA \+ AAFCO** (lo investigado antes no se tira): esos criterios son los que alimentan las señales de la Capa 1 y el texto de la Capa 2\. La diferencia es la **presentación**: de "82/100, rojo" pasamos a "estos son los hechos \+ esto es lo que significan".

Reglas de oro para que sea defendible:

1. **Publicar la metodología** en la app ("cómo analizamos") citando WSAVA y AAFCO.  
2. **Validarla con un nutriólogo veterinario** antes de lanzar.  
3. **Presentar hechos, no juicios sobre la marca.** "Cumple 3 de 5 criterios WSAVA" es un hecho defendible; "mala marca" no.  
4. **Verificar cada marca** contra el cuestionario WSAVA real antes de publicar sus señales (no basta con que la marca lo diga).

---

## 4\. De dónde sacamos los datos (mi recomendación tras investigar)

Decisión del equipo: **tabla de marcas evaluadas \+ base abierta.** El truco para minimizar el trabajo manual es evaluar a nivel **marca**, no producto. En vez de analizar 150 productos a mano, evalúas \~20-25 marcas grandes **una sola vez** contra el checklist WSAVA/AAFCO, y cualquier producto escaneado hereda las señales de su marca (Capa 1 y 2 de la sección 3).

**Cómo funciona el flujo de datos:**

1. El usuario escanea → la app usa la **API de Open Pet Food Facts** (`https://world.openpetfoodfacts.org/api/v2/product/[código].json`) para identificar **la marca y el producto** (gratis).  
2. La app busca esa marca en **nuestra tabla de marcas** (un archivo que ustedes controlan) y arma las señales y el análisis de las Capas 1–3.  
3. Si el producto trae análisis nutricional en la base abierta, se usa para enriquecer el análisis. Si no, se basa en la marca \+ una nota de "datos de producto incompletos".  
4. Si la marca **no está** en nuestra tabla: en vez de un error, mostramos "marca aún no analizada" e invitamos a fotografiar la etiqueta para sumarla. Así crece con uso real.

Por qué así y no "solo base abierta": la base abierta te da *datos del producto*, pero **nunca el análisis** ni las señales veterinarias. Eso sale de tu tabla de marcas. Y como es por marca, con \~25 marcas cubres la enorme mayoría de lo que un usuario de EE. UU. va a escanear, con muy poco trabajo manual.

**Investigación entregada — punto de partida de la tabla de marcas (verificar contra el cuestionario WSAVA antes de publicar):**

| Marca | Estatus veterinario | Notas |
| :---- | :---- | :---- |
| Purina (Pro Plan, ONE) | Cumple criterios WSAVA | De las más respaldadas por veterinarios; nutriólogos en plantilla, feeding trials, fábricas propias, investigación publicada |
| Hill's Science Diet | Cumple criterios WSAVA | Igual; muy recomendada en clínicas |
| Royal Canin | Cumple criterios WSAVA | Igual; fuerte en dietas por raza/condición |
| Iams | Cumple criterios WSAVA | Cumple los cinco criterios |
| Eukanuba | Cumple criterios WSAVA | Cumple los cinco criterios |
| Just Food For Dogs | Frecuentemente recomendada por vets | Fresca; nutriólogos veterinarios involucrados |
| Blue Buffalo | Cumplimiento parcial / en debate | Declara cumplir nutrientes AAFCO/WSAVA, pero no todos los criterios de fabricante; ha tenido casos reportados de DCM |
| Wellness | Cumplimiento parcial / en debate | Aparece en algunas listas WSAVA, ausente en otras — verificar |
| Orijen / Acana | Cumplimiento parcial / en debate | Populares "premium", pero no cumplen todos los criterios de fabricante |
| Taste of the Wild | No cumple criterios clave | Grain-free/boutique; casos reportados de DCM; excluida por fuentes veterinarias |
| Merrick, Canidae, Nulo, Stella & Chewy's, Open Farm | Por evaluar | Marcas populares boutique — evaluar una por una |

Importante y honesto: las fuentes públicas **se contradicen** sobre qué marcas "cumplen WSAVA", en parte porque las marcas se autoproclaman. La lista de **cumplimiento claro** (las 5 primeras \+ Just Food For Dogs) es sólida; el resto hay que confirmarlo mandando a cada marca las preguntas oficiales de WSAVA. Esta tabla es un punto de partida para el piloto, no la verdad final.

---

## 5\. Las herramientas y cómo se conectan

Pensado para un equipo no técnico donde **Claude Code escribe el código** y ustedes lo dirigen. Todo tiene plan gratuito para el piloto.

| Pieza | Herramienta recomendada | Para qué sirve | Costo piloto |
| :---- | :---- | :---- | :---- |
| Dónde vive el código | **GitHub** | Guarda el proyecto y su historial | Gratis |
| Quién escribe el código | **Claude Code** | Construye la app siguiendo tus instrucciones | Tu plan actual |
| Con qué se construye la app | **React \+ Vite (PWA)** | El "esqueleto" de la web app | Gratis |
| Leer el código de barras | **BarcodeDetector \+ html5-qrcode** | La cámara lee el código | Gratis |
| Datos del producto (piloto) | **Un archivo JSON/CSV** (el catálogo curado) | La "base de datos" simple del inicio | Gratis |
| Datos extra | **API de Open Pet Food Facts** | Rellena productos que no tengamos | Gratis |
| Idiomas (EN/ES) | **i18next** (librería de traducción) | Textos en dos idiomas con selector | Gratis |
| Publicar la app en internet | **Vercel** (o Netlify) | Pone la app en línea con candado HTTPS (la cámara lo exige) | Gratis |
| Dirección web | **Subdominio suyo** (ej. `escanea.favilist.com`) | Que sea suya y conecte con su marca | Ya lo tienen |
| Base de datos real (fase 2\) | **Supabase** | Cuentas de usuario, perfiles de mascota, contribuciones | Gratis al inicio |

**Cómo se conectan (el diagrama en palabras):** Claude Code escribe el código y lo guarda en **GitHub** → **Vercel** toma lo que hay en GitHub y lo publica automáticamente en tu dirección web cada vez que hay cambios → el usuario abre esa dirección en su celular → la app usa la **cámara** para leer el código → busca en el **catálogo (archivo)** y, si no está, en la **API abierta** → aplica **tu rúbrica** → muestra el color. En la fase 2 se conecta **Supabase** para guardar usuarios y mascotas.

Cuentas: **GitHub ya lo tienen.** Falta crear **Vercel** (gratis, \~15 min; se conecta a su GitHub con un clic). Supabase, después.

---

## 5b. Dirección de diseño (según su marca)

Ustedes son print-on-demand *aesthetic* para petlovers: arte kawaii de gatos y perros, tono juguetón y cálido ("Designed for life. Styled by you."), y guiño de "joya" (JEM — el logo es un diamante con degradado rosa-naranja). La app debe verse como una extensión de esa marca, no como una app médica fría.

**Identidad de marca oficial (de su brand book en Pomelli):**

| Elemento | Valor | Uso sugerido en la app |
| :---- | :---- | :---- |
| Durazno / salmón | `#f6bda7` | Fondos suaves, tarjetas, estados vacíos |
| Magenta | `#9b046f` | Color de acento, botones principales, encabezados |
| Carbón oscuro | `#2e2a39` | Texto, modo oscuro, fondos profundos |
| Tipografía | **Poppins** | Toda la interfaz |
| Logo | Diamante con degradado rosa→naranja | Ícono de la app y pantalla de inicio |

Recomendaciones de aplicación:

- **Colores de las señales separados de la marca:** las señales de la Capa 1 usan verde/ámbar/gris **solo** como ayuda visual de un hecho (cumple / parcial / dato faltante), en tonos distintos del magenta y el durazno de la marca. El acento de marca (magenta) va en botones y navegación, no en las señales.  
- **Tono de voz:** cercano y claro, de petlover a petlover, no técnico. Igual que sus productos.  
- **Ilustración:** reutilizar su estilo kawaii de mascotas para los estados vacíos ("aún no escaneas nada", "sin datos").  
- **Nombre:** aprovechen la familia de marca (algo tipo "Jem4Pets" / "PetScan by Jem4Life"). Decisión de equipo.

**Colores de las señales (Capa 1 — son hechos, no un juicio moral):**

| Señal | Color sugerido | Ícono | Significa |
| :---- | :---- | :---- | :---- |
| Presente / cumple | Verde `#2e9e5b` | ✓ | El hecho se cumple (ej. "es completo y balanceado") |
| Parcial / con matiz | Ámbar `#f5a623` | \~ | Cumplimiento parcial o en debate |
| Dato faltante | Gris `#9aa0a6` | ? | No tenemos el dato verificado |

**Nota clave:** estas señales acompañan siempre a un **texto claro** (Capa 2), nunca van solas. La app no muestra un número global tipo "82/100" — eso sería volver al veredicto. Muestra hechos con su explicación. Cada señal lleva su etiqueta escrita (ej. "Completo y balanceado: sí"), así funciona también para personas con daltonismo (≈8% de los hombres).

---

## 6\. Hoja de ruta A–Z por fases

**Fase 0 — Fundaciones (antes de una sola línea de código). \~1 semana.** Aquí gana o pierde el proyecto. Salida esperada: (a) rúbrica v1 escrita y, si es posible, revisada por un nutriólogo veterinario; (b) tabla de \~20-25 marcas top de EE. UU. evaluadas contra los criterios WSAVA/AAFCO (partiendo de la tabla de la sección 4); (c) cuentas de GitHub y Vercel creadas. Sin esto, no arranquen el código.

**Fase 1 — Escáner que funciona. \~1–2 semanas con Claude Code.** La app abre la cámara, lee un código de barras real y muestra en pantalla el número. Meta: probar que la cámara funciona en los celulares del equipo.

**Fase 2 — Análisis con datos. \~1–2 semanas.** Conectar la tabla de marcas \+ la API de Open Pet Food Facts (para identificar la marca del producto escaneado). Escanear un producto real y ver el **análisis por capas**: señales objetivas arriba \+ qué esperar del alimento debajo. Este es el momento "ajá" para enseñarle a Ricky.

**Fase 3 — Pulido y flujo de "sin datos". \~1 semana.** Diseño con la identidad de la marca, pantalla de "cómo analizamos", la capa de "creencias comunes", flujo de foto de etiqueta cuando el producto no está.

**Fase 4 — Prueba real. \~1–2 semanas.** Publicar en el subdominio y probarlo con 10–20 dueños de mascota reales (empiecen por el equipo y clientes cercanos). Recoger qué escanean, qué falla, si entienden el análisis.

**Fase 5 y más allá — Comunidad, retención y monetización (post-piloto).** Solo si el piloto valida la hipótesis: **la capa de comunidad** (opiniones y experiencias de dueños, con moderación), perfiles/avatares de mascota, trackers de vacunas y baño, directorio de servicios, marcas recomendadas (con etiqueta de "pagado"). Aquí entra Supabase y probablemente una app nativa.

---

## 7\. Riesgos y cómo cuidarnos

- **Legal (mucho menor con el modelo "analizar, no juzgar").** Al presentar hechos y no un veredicto, el riesgo de difamación baja bastante. Se mantiene la mitigación: metodología pública, validación por experto, presentar hechos (no juicios sobre la marca), y deslinde ("información orientativa, no consejo veterinario; consulta a tu veterinario").  
- **Parálisis en el pasillo.** El riesgo nuevo del modelo informativo: demasiado matiz y el dueño no decide. Mitigación: la orientación rápida (Capa 1\) siempre arriba, en 3 segundos.  
- **Falsa equivalencia.** Al mostrar "creencias comunes" junto a la evidencia, se puede dar a entender que un mito pesa igual que la ciencia. Mitigación: jerarquía clara — primero la evidencia, luego "esto cree la gente y esto dice la ciencia".  
- **Comunidad (fase 2): moderación y manipulación.** Las reseñas pueden ser difamatorias, médicamente erróneas o manipuladas por marcas (astroturfing), y arrancan en frío. Por eso van en fase 2 con un plan de moderación, no en el MVP.  
- **Conflicto de interés (bajo).** No venden alimento; el riesgo solo aparece si a futuro cobran por "marcas recomendadas". Mitigación: nunca alterar el análisis por dinero y etiquetar clarísimo lo pagado.  
- **"Sin datos" mata la confianza.** Mitigado con la tabla de marcas \+ flujo de foto de etiqueta.  
- **Alcance que se infla.** El mayor riesgo de ejecución. Cada "y también podríamos..." va a la fase 5, no al MVP.

---

## 8\. Cómo presentárselo a Ricky (según sus notas)

Su acuerdo fue presentar propuestas terminadas para evitar rechazo. Lo que hace "terminada" a esta propuesta no es tener toda la app, es tener: (1) este plan, (2) el análisis v1 definido (secciones 3 y rúbrica de datos), (3) un demo de Fase 2 que él pueda tocar — escanear un producto real y ver el análisis por capas. Un demo tangible convence más que veinte diapositivas. Apunten a llegar a Fase 2 antes de presentar. Recuerden: es una propuesta; el demo es lo que sostiene la conversación para avanzar.

---

## 9\. Decisiones que faltan (para que el equipo defina)

Estas decisiones ahora viven en el **documento ejecutivo** (`Decisiones-ejecutivas-app-mascotas.docx`) para llevarlas a la junta. Resumen:

1. **Especies:** decidido — perro y gato desde el inicio (Decisión 3).  
2. **Responsable y fecha** de la evaluación de las \~20-25 marcas (Decisión 5).  
3. **Validación** con nutriólogo veterinario (Decisión 6).  
4. **Nombre y subdominio** de la app (Decisión 7; ej. `escanea.jem4life.com`).  
5. **Posicionamiento, go/no-go, datos del demo, presupuesto** (Decisiones 1, 2, 4, 8).

---

## 10\. Prompt inicial para Claude Code (en inglés — copiar y pegar)

Pega esto en Claude Code para arrancar la Fase 1\. Está en inglés a propósito: Claude Code trabaja mejor con instrucciones técnicas en inglés. Ajusta los nombres si cambian decisiones de la sección 9\.

```
I'm building a Progressive Web App (PWA) for pet owners. I am NOT a developer, so please
explain each step in plain language, keep the stack as simple as possible, and tell me
exactly what to do on my side (accounts, buttons, copy-paste) whenever you need me.

## Product
A mobile web app where a pet owner points their phone camera at a pet-food barcode and
gets a LAYERED ANALYSIS (not a good/bad verdict): a quick set of factual signals at the top
(e.g. "Complete & balanced: yes", "Made by a brand meeting vet criteria: yes", "Contains
artificial dyes: no") and, below, a plain-language explanation of what to expect from the
food. Philosophy: "explain, don't judge" — give owners the facts so they decide.

## Audience & brand
- Primary market: United States. Default language English.
- Bilingual is a REQUIREMENT: user can switch between English and Spanish with a visible
  toggle. Set this up from the start with i18next; keep all UI strings in translation files.
- Brand vibe: playful, aesthetic, pet-lover (sister brand Jem4Life / JEM4YOU, kawaii pet art).
- Official brand colors: peach #f6bda7, magenta #9b046f, dark charcoal #2e2a39.
- Font: Poppins (use for all UI).
- Use magenta (#9b046f) as the primary accent for buttons/nav. Reserve green/amber/grey ONLY
  for the factual signal badges (met / partial / missing data), never as a moral score, so
  they never clash with the brand magenta/peach. Every badge always has a written label.

## Scope for THIS milestone (Phase 1 only)
Do ONLY this now:
1. Scaffold a React + Vite PWA that installs to the home screen.
2. Set up i18next with English + Spanish and a language toggle in the UI.
3. Open the device camera and scan a 1D product barcode (EAN/UPC), using the native
   BarcodeDetector API when available and falling back to html5-qrcode / ZXing otherwise.
4. Display the scanned barcode number on screen.
Do NOT build scoring, database, or accounts yet — those are later phases.

## Constraints
- Must run over HTTPS (camera requires it). Assume deploy on Vercel.
- No paid services. Free tiers only.
- Keep everything in one repo, simple folder structure, well commented.
- Mobile-first UI, works on iOS Safari and Android Chrome.
- Installable as a PWA (home-screen icon, manifest, offline shell).

## What I need from you
- Set up the project and explain how to run it and how to deploy to Vercel step by step.
- Tell me every account I need to create and walk me through it.
- After Phase 1 works, we'll add: (Phase 2) a brand-evaluation table as a JSON file (each
  brand assessed against WSAVA/AAFCO criteria) + the Open Pet Food Facts API to map a scanned
  barcode to its brand + a LAYERED ANALYSIS view: Layer 1 = factual signal badges
  (complete & balanced, brand meets WSAVA criteria, feeding trials, artificial dyes, recent
  recalls) each with a written label; Layer 2 = plain-language "what the evidence says". It
  must NOT output a single 0–100 score and must NOT penalize by-products or grains.
  (Phase 3) a "common beliefs vs. evidence" layer and a "scan the label" flow when a brand
  isn't found. (Community reviews are a later phase, not now.)

Start by asking me any blocking question, then scaffold Phase 1.
```

---

*Documento vivo. Actualízalo conforme el equipo tome las decisiones de la sección 9\.*  
