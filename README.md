# Portfolio 2026 · Enrique Gómez Díaz

Portfolio personal de **Enrique Gómez Díaz**, ingeniero informático (Universidad de La Laguna) especializado en desarrollo Full Stack, inteligencia artificial y análisis de datos.

**Ver en vivo:** https://enriquegd08.github.io/enrique-portfolio/

Es un sitio **estático**: HTML, CSS y JavaScript sin frameworks ni pasos de compilación. La única dependencia externa es la tipografía [Manrope](https://fonts.google.com/specimen/Manrope) de Google Fonts.

## Contenido de la página

| Sección | Qué muestra |
|---|---|
| Inicio | Titular, retrato y llamadas a la acción |
| 01 · Sobre mí | Presentación y áreas de especialización |
| 02 · Experiencia | Línea de tiempo (Jornadas Técnicas de Ingeniería, Hunger4Innovation, arbitraje…) |
| 03 · Proyectos | Transformers Roguelite, TFG con IA, AppComida (iOS) |
| 04 · Formación | Ingeniería Informática, ULL |
| 05 · Capacidades | Habilidades e idiomas |
| 06 · Contacto | Correo, GitHub y LinkedIn |

## Estructura

```
portfolio-2026/
├── index.html   # Contenido y estructura semántica
├── styles.css   # Diseño: tema oscuro, acento morado, adaptable a móvil
├── script.js    # Comportamiento: menú móvil, progreso de scroll, animaciones
└── assets/      # Imágenes, logotipo y flecha (SVG)
```

## Cómo verlo en local

No necesita instalación. Dos opciones:

1. Abrir `index.html` directamente en el navegador.
2. Servirlo con un servidor local (recomendado, se comporta como en producción):

   ```bash
   python3 -m http.server 8000
   # y abrir http://localhost:8000
   ```

## Decisiones de diseño

- **Separación de responsabilidades (SRP):** el HTML contiene el contenido, el CSS el aspecto y el JS la interacción. Dentro de `script.js`, cada funcionalidad es una función `init...` independiente.
- **Abierto/cerrado (OCP):** para añadir una mejora al JS se escribe una nueva función `init...` y se registra en `init()`, sin tocar las existentes. En el CSS, la capa de «refinamiento visual» amplía la base sin modificarla.
- **Sin repetición (DRY):** colores, easing y tipografía son variables CSS; selectores, clases y umbrales del JS están en un único objeto `CONFIG`.
- **Accesibilidad:** HTML semántico, textos alternativos, `aria-expanded` en el menú, foco visible y respeto a `prefers-reduced-motion`.
- **Degradación elegante:** sin JavaScript (o sin `IntersectionObserver`) todo el contenido sigue visible.
- **Adaptable:** diseño en una columna con menú hamburguesa por debajo de 760 px.

## Autor

**Enrique Gómez Díaz** · [enriquegd2004@gmail.com](mailto:enriquegd2004@gmail.com) · [GitHub](https://github.com/EnriqueGD08) · [LinkedIn](https://www.linkedin.com/in/enrique-gómez-ba4969245/)
