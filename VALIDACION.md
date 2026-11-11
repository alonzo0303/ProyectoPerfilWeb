# Validación de esta entrega

## Comprobaciones completadas

- `npm run build`: copia de iconos y compilación de Tailwind correctas.
- `npm test`: 5 pruebas aprobadas, sin fallos.
  - Menú móvil: apertura, estado accesible y cierre por Escape.
  - Botón SaaS: selección de producto y aviso de disponibilidad.
  - Formulario: bloqueo de solicitudes incompletas, consentimiento, codificación segura del mensaje y apertura directa de WhatsApp.
  - Aviso de privacidad integrado en el pie y apertura desde el formulario.
  - Anclajes existentes, recursos locales presentes y etiquetas asociadas.
- Maven `clean package` con JDK 21: **BUILD SUCCESS**.
- 2 pruebas Java aprobadas: servidor Spring real con respuestas HTTP correctas para `/`, `/alsha-inicio`, CSS, JavaScript, logo, imagen del SaaS e iconos.
- POM comprobado como XML válido.

## Límites

- No se enviaron mensajes reales, correos, pagos ni solicitudes a terceros.
- Las pruebas JavaScript usan un DOM simulado. No se pudo completar la inspección visual en un navegador gráfico porque la descarga del navegador no estuvo disponible en este entorno. Antes de publicar, revisar la apariencia en celular y escritorio y realizar personalmente un envío de prueba por WhatsApp.
- La entrega es el código fuente con recursos frontend compilados. El ZIP excluye `node_modules` y `target`; las dependencias y el ejecutable Java se regeneran con los comandos del README.


## Verificación de lectura, encuadres y visor

Versión basada en 3c82d99 (mejora/fotos-servicios), con cambios limitados a legibilidad y visualización de imágenes.

- `npm run build`: aprobado; CSS e iconos generados.
- `npm test`: 9 pruebas aprobadas, incluyendo apertura y cierre del visor, foco, recorrido de teclado, fallo de carga y restablecimiento del zoom.
- `mvnw verify` con JDK 21: BUILD SUCCESS, 2 pruebas HTTP aprobadas y JAR empaquetado. Una primera ejecución limpia evitó clases residuales de otras ramas.
- Chromium real: revisión a 1440, 1024, 768, 390 y 320 px. Se abren las cinco imágenes, se comprueban proporciones, cierre con Escape/botón/fondo, vuelta del foco, recorrido Tab, zoom a tamaño original y ausencia de desbordes de página.
- Se probaron la recuperación ante imagen inexistente y los enlaces cuando JavaScript está desactivado o no existe showModal.
- Se revisaron capturas de las tarjetas, visor y zoom en escritorio y móvil simulado. No se probó en un teléfono físico ni en otros motores de navegador.
- Comparación con la base: encabezado, títulos, campos del formulario y hashes de los archivos de imagen conservados.
- `node --check` y `git diff --check`: aprobados. No se enviaron consultas de WhatsApp ni se desplegó en producción.

Para reproducir manualmente: iniciar Spring Boot, abrir Servicios, pulsar una lupa, alternar «Ver al 100 %» y «Ajustar a pantalla», desplazarse por la imagen y cerrar. Repetir con Enter/Escape y en una pantalla estrecha. Tab debe permanecer dentro del visor; al cerrar, el enlace de imagen vuelve a recibir el foco.
