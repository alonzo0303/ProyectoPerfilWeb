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
