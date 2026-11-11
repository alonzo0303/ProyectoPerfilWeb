# Soporte y continuidad

## Atención propuesta

Usar el canal existente de WhatsApp o correo y registrar cada incidente en un archivo privado. Confirmar servicio contratado y alcance. Registrar hora de recepción, impacto, pantalla, pasos, responsable, próxima actualización, solución y confirmación del cliente. Pedir capturas sin datos sensibles. No pedir credenciales ni datos bancarios.

Prioridades: bloqueo o pérdida de información; función principal con alternativa; problema menor; solicitud de mejora. Las mejoras no son incidentes y pueden necesitar una cotización. Definir horarios, tiempos de primera respuesta y responsables con capacidad real antes de anunciarlos. El registro conserva los tiempos observados, no tiempos prometidos.

Una consulta repetida debe producir una guía de ayuda o una corrección. Antes de cerrar, reproducir el flujo afectado y registrar la causa. Revisar semanalmente incidencias abiertas y problemas recurrentes.

## Publicar y volver a una versión anterior

Mantener rama y PR con verificaciones aprobadas. Construir con `npm ci`, `npm run build`, `npm test` y `sh mvnw verify` usando JDK 21. El CI ejecuta estas comprobaciones. Desplegar en un servidor Java 21 con HTTPS; Sites y el repositorio GitHub son alojamientos distintos y no se sincronizan automáticamente.

Conservar el JAR y commit de la versión anterior. Registrar alojamiento, versión instalada y fecha de publicación. Tras desplegar, comprobar `/`, `/alsha-inicio`, estilos, imágenes, navegación, formulario y cabeceras. En un fallo bloqueante, restaurar el JAR anterior y verificar otra vez. Si en el futuro hay migraciones de datos, se necesita un procedimiento de rollback compatible antes de desplegarlas.

## Copias y recuperación

Esta web no guarda consultas en una base de datos. Los mensajes de contacto quedan bajo las condiciones del canal que use el cliente. Los registros de ventas y soporte son datos privados: mantenerlos fuera de GitHub y del directorio público del servidor.

El responsable debe inventariar registros, archivos subidos, bases de datos y configuración del alojamiento real. Elegir ubicación de copias cifradas, permisos mínimos, frecuencia y retención según el volumen y requisitos del negocio. Usar MFA donde el proveedor lo admita. Los secretos se configuran en el alojamiento, no en el repositorio.

Probar restauración en un entorno aislado: restaurar una copia, verificar integridad y acceso, medir tiempo de recuperación, registrar fecha y evidencia y corregir fallos. Una copia no probada no equivale a recuperación verificada. Estas acciones no se han ejecutado porque no hay infraestructura de producción conectada a este repositorio.

## Protección técnica entregada

Recursos bajo `src/main/resources` para compatibilidad con Linux y Maven. Sin JavaScript embebido: CSP permite scripts, estilos y recursos del mismo origen; bloquea objetos, iframes de terceros y envíos nativos de formularios. WhatsApp/correo son navegación explícita del visitante. `nosniff`, política de referente y permisos restringidos complementan esta protección. Esto no constituye una auditoría del hosting ni de AlshaFacturas.
