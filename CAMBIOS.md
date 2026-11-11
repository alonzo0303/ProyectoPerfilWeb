# Cambios de la entrega

1. Carpeta `resources` en minúsculas para su inclusión en Maven y compatibilidad con Linux.
2. Inicio disponible en `/` y `/alsha-inicio`; controlador renombrado a `InicioController`.
3. Catálogo y botones orientados a solicitudes comerciales. Botones de perfil, web y SaaS preseleccionan el servicio.
4. ALSHAFACTURAS identificado como producto en desarrollo, con solicitud de información/acceso anticipado y condiciones por confirmar.
5. Formulario anterior de FormSubmit reemplazado por preparación local de una solicitud en WhatsApp. Ya no necesita activación de un tercero ni una redirección a localhost. El correo sigue disponible por enlace directo.
6. Sin confirmaciones falsas: preparar el mensaje no equivale a enviarlo. No hay activación automática de suscripciones ni cobros.
7. Menú móvil con estado accesible y cierre por Escape o navegación.
8. Etiquetas asociadas, campos validados, consentimiento de contacto y aviso de privacidad.
9. FAQ reparada y respuestas comerciales más claras sobre plazos, hosting, dominio y mantenimiento.
10. Eliminado CSS antiguo sin uso. Tailwind compilado y Font Awesome local, con licencia incluida.
11. Imágenes convertidas a WebP, logo reducido y carga diferida fuera del encabezado.
12. Descripción y metadatos básicos; datos personales y texto de presentación corregidos.
13. Login y dashboard vacíos retirados. Se conserva el paquete Java para limitar cambios.
14. Pruebas JavaScript funcionales y pruebas HTTP Java; instrucciones de ejecución y despliegue.

No se añadieron base de datos, pasarela de pago ni cuentas de cliente. Se deberán integrar cuando se definan el proceso de venta y los planes reales del SaaS.

## Ajustes solicitados después de la primera entrega

- Un único botón «Enviar consulta por WhatsApp»: se retiró el paso intermedio «Preparar solicitud» y el segundo botón. Sigue siendo necesario enviar el mensaje dentro de WhatsApp.
- Aviso de privacidad desplegable debajo de Alsha Group, en la primera columna del pie. El enlace del consentimiento lo abre.


## Mejora comercial y kit de operación

Propuesta centrada en páginas web y software para negocios, servicios comparables, proceso de entrega, founder y referencias verificables. AlshaFacturas se mantiene explícitamente en desarrollo y se retira su visualización conceptual de producto. Formulario con validación accesible, plazo y presupuesto opcionales, alternativas por correo/WhatsApp e identificadores de campaña filtrados.

Ruta Maven corregida de Resources a resources; CSP y cabeceras de seguridad, JavaScript sin scripts embebidos y verificación automática de builds y pruebas. Se conserva la identidad y el encabezado existente con ajuste de foco y movimiento reducido.

Se entrega operacion/ con plantillas de ventas, soporte y costos, procedimientos, calendario, generador local de indicadores y matriz del estado de las quince áreas. Su uso con datos y responsables reales, los precios y la puesta en producción siguen pendientes. Validación: 11 pruebas Node y 3 pruebas HTTP Java aprobadas; mvnw verify genera el JAR. La revisión visual permanece pendiente por falta de scripts de diseño en el entorno.


## Restauración visual solicitada

Se descarta el rediseño comercial y se recupera la página del commit b9d3e58: estructura, estilos, tarjetas, bloque de código y fotografía originales. Se conservan las correcciones técnicas y el kit de operación. La documentación vigente describe esta restauración; la sección anterior registra el cambio que se reemplazó.
