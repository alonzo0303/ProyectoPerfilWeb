# Restauración del diseño original

Se recuperó el diseño del commit b9d3e58, anterior al rediseño: encabezado, inicio con bloque de código, tarjetas, visual conceptual de AlshaFacturas, fotografía y secciones en sus posiciones originales.

La comparación programática confirmó que el DOM visual —excluyendo el script extraído y normalizando espacios— y las hojas frontend/input.css, site.css y cabecera.css coinciden con la versión anterior. Se extrajo el script original de animación a site.js para mantener la CSP; no se introdujo una nueva propuesta estética. Se conserva el formulario original y se retiraron los elementos añadidos por el rediseño.

El kit operativo, el generador de indicadores, la ruta correcta de recursos Maven, las cabeceras de seguridad y el workflow de GitHub permanecen. Las propuestas del kit no representan procesos ya activados ni resultados reales del negocio.

Verificación: npm run build aprobado; npm test, 8 pruebas aprobadas. mvnw verify con JDK 21: BUILD SUCCESS, 3 pruebas HTTP aprobadas y JAR empaquetado. No hay captura ni revisión visual nueva en navegador; se ha verificado la equivalencia con el código original. No se desplegó en producción ni se modificó el sitio independiente de Sites.
