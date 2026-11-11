# Diseño y validación de la mejora

GATE: ERROR — el paquete de la guía está disponible como referencia de texto, pero sus scripts y activos no están instalados en el entorno. La ejecución intentada de gate.mjs devuelve MODULE_NOT_FOUND. No hay PASS de consistencia, layout, perf ni capturas verificadas en navegador.

Tipo: servicio de desarrollo web/software. Objetivo principal: solicitar cotización. Voz: directa y descriptiva, con el vocabulario real de la oferta. Se conserva el logo, la paleta morada del cliente y el encabezado de los PR previos; se exceptúa la recomendación de la guía de evitar violeta porque eliminarlo cambiaría la identidad existente. No se ha ejecutado el sorteo visual de la guía ni se afirma una aprobación estética automática.

Hechos usados: fundador y contactos existentes en el repositorio, Lima/Perú, catálogo de la web y estado en desarrollo de AlshaFacturas. No se inventan precios, plazos, testimonios, clientes o resultados. El retrato procede del propio repositorio. Las imágenes existentes de los servicios no se presentan como entregas de clientes. La visualización conceptual de AlshaFacturas se sustituye por estado y alcance escrito, para no confundirla con un producto disponible.

Cambios verificables: anclajes, recursos, etiquetas, validación con espacios y límites, alternativas ante bloqueo de WhatsApp, invalidación de enlaces al editar, identificadores UTM filtrados y eventos sin datos personales. El generador comprueba datos vacíos, monedas separadas, importes y fechas inválidos. Java comprueba rutas reales, recursos y cabeceras. Los resultados finales de ejecución se adjuntan al PR.

Pendiente: evaluación visual en 1440, 1024, 768, 390 y 320 px; recorrido de teclado; contraste visual; recortes de imágenes; pruebas en teléfonos; envío manual en los canales; servidor y dominio oficiales; revisión de licencias de imágenes; validación comercial. No se enviaron mensajes durante las pruebas. No se ha modificado la publicación separada de Sites.

## Resultados ejecutados

- `npm run build`: aprobado; se reconstruyeron CSS e iconos locales.
- `npm test`: 11 pruebas aprobadas, sin fallos (8 de interfaz simulada y 3 de indicadores).
- `mvnw verify` con JDK 21.0.13: BUILD SUCCESS; 3 pruebas HTTP aprobadas, sin fallos; JAR empaquetado.
- `npm run indicadores -- operacion/seguimiento.plantilla.json`: aprobado; sin datos ficticios y con ratios no calculables como null.
- Analizador HTML parse5: cero errores de estructura.
- `node --check` en los scripts y `git diff --check`: aprobados.

En este entorno Maven necesitó configuración de proxy, caché en work/ y el almacén de certificados del sistema. No se desactivó TLS ni se guardó esa configuración local en el repositorio. Las comprobaciones HTTP verifican respuestas y cabeceras; no sustituyen una revisión visual del navegador.
