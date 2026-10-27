# Alsha Group — Web comercial

Página de presentación y captación de solicitudes para perfiles profesionales, páginas web, software a medida y ALSHAFACTURAS SaaS. Mantiene Spring Boot, Thymeleaf y el diseño morado.

## Qué hace esta versión

- Inicio en `/` y `/alsha-inicio`.
- Catálogo de servicios, presentación del proyecto SaaS, preguntas frecuentes y contacto.
- Botones comerciales que seleccionan el servicio correspondiente.
- Formulario con validación: abre WhatsApp directamente con el mensaje completado, usando un solo botón. El visitante debe pulsar **Enviar en WhatsApp**. La web no afirma que un mensaje ya fue enviado.
- Alternativas de contacto por correo y teléfono.
- Menú móvil, etiquetas accesibles, foco visible, movimiento reducido y anclajes adaptados al encabezado.
- CSS compilado, iconos alojados con el proyecto e imágenes optimizadas. No requiere CDN para mostrarse.

## Alcance comercial

Esta versión sirve para cotizar y captar interesados. No procesa pagos, no crea usuarios, no registra pedidos ni activa suscripciones. ALSHAFACTURAS se presenta como **en desarrollo**: una solicitud no garantiza acceso. No se han inventado precios, planes ni fechas.

Se retiraron login y dashboard porque eran plantillas sin funcionalidad. Un futuro panel requiere autenticación y autorización reales del lado del servidor. La separación de pantallas por sí sola no brinda seguridad.

## Requisitos y ejecución en Windows

Necesitas JDK 21 y acceso a los repositorios de Maven durante la primera instalación. El ZIP ya incluye CSS e iconos compilados; Node.js no es necesario para arrancar Java.

```powershell
java -version
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Abre `http://localhost:8080/`. La página debe abrirse desde Spring Boot; abrir el HTML con doble clic no procesa Thymeleaf ni sus recursos.

Para generar el ejecutable:

```powershell
.\mvnw.cmd clean package
java -jar target/alsha-group-0.0.1-SNAPSHOT.jar
```

En Linux/macOS: `sh mvnw test`, `sh mvnw spring-boot:run` o `sh mvnw clean package`.

## Editar estilos e iconos

Instala Node.js compatible con las dependencias. Desde la raíz:

```powershell
npm ci
npm run build
npm test
```

`npm run build` copia Font Awesome y compila Tailwind. Ejecútalo después de cambiar clases en HTML o JavaScript. Para trabajar estilos continuamente: `npm run watch:css`.

Se fijan las versiones de dependencias y se incluye `package-lock.json`. Los recursos generados se entregan y deben conservarse al empaquetar.

## Estructura

- `src/main/java/com/gnew/tienda/`: arranque y controlador de inicio. Se conserva el paquete Java para evitar cambios innecesarios.
- `src/main/resources/templates/index.html`: contenido y estructura comercial, organizados mediante comentarios de sección.
- `src/main/resources/static/js/site.js`: menú y apertura directa de consultas en WhatsApp; no usa almacenamiento local ni hace peticiones de red.
- `src/main/resources/static/css/site.css`: resultado generado; editar `frontend/input.css` para reglas propias.
- `src/main/resources/static/imagenes/`: imágenes WebP.
- `src/main/resources/static/vendor/`: iconos, fuentes y licencia de Font Awesome.
- `frontend/input.css` y `tailwind.config.cjs`: estilos fuente y configuración de compilación.
- `scripts/`: copia de recursos y pruebas funcionales del navegador simulado.
- `src/test/`: prueba de arranque de Spring.

## Antes de publicar

1. Ejecuta las pruebas Java con JDK 21 y comprueba el JAR generado.
2. Configura el dominio y HTTPS en un alojamiento que ejecute Java 21; un hosting exclusivo para PHP o HTML no ejecutará este JAR.
3. Revisa desde un celular la navegación y envía tú mismo una solicitud de prueba a WhatsApp. Las pruebas automatizadas no envían mensajes.
4. Revisa la información comercial, el aviso de privacidad y la titularidad de las imágenes antes de usar la web públicamente.
5. Cuando tengas el dominio final, añade URL canónica y metadatos de URL/imagen social usando esa dirección real.

El puerto admite la variable `PORT`; por defecto utiliza 8080. No incluye claves ni contraseñas.

## Evolución para vender SaaS directamente

Cuando ALSHAFACTURAS esté disponible, definir planes, condiciones y precios reales. Después integrar pagos y confirmación verificable en servidor, registro de empresas, acceso autenticado y activación de suscripciones en el SaaS. Un botón o una redirección de pago no bastan para activar una cuenta de forma segura.

Consulta `CAMBIOS.md` y `VALIDACION.md` para las correcciones y comprobaciones de esta entrega.
