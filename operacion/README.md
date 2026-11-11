# Operación de Alsha Group

Este kit acompaña la mejora de la web. Contiene herramientas y procedimientos propuestos; no demuestra que exista un CRM conectado ni que estos procesos ya estén operando con clientes.

## Empezar

1. Gustavo revisa el catálogo, asigna quién atiende cada consulta y decide qué segmento priorizar con datos de ventas. La web se dirige a profesionales y negocios; AlshaFacturas conserva su público de pequeños comercios.
2. Copia `oportunidades.csv`, `soporte.csv` y `costos.csv` a una carpeta privada fuera de este repositorio. Los archivos entregados están vacíos a propósito. Pueden abrirse en Excel o importarse en un CRM.
3. Registra solo consultas que realmente recibas. Abrir WhatsApp desde la web no demuestra que el visitante envió el mensaje.
4. Usa `ventas-y-entrega.md` desde la primera consulta hasta la entrega. Cada oportunidad debe tener responsable, próxima acción y fecha.
5. Usa `soporte-y-continuidad.md` para incidencias y publicación. Los horarios, tiempos de atención, presupuesto de infraestructura y retención de datos deben acordarse antes de prometerlos.
6. Completa los registros reales y revisa indicadores semanalmente. El generador descrito abajo funciona localmente, no recoge datos de la web.

## Generar indicadores

Copia `seguimiento.plantilla.json` a una carpeta privada y completa las listas. Desde la raíz del proyecto ejecuta:

```text
npm run indicadores -- ruta-al-archivo-privado.json
```

Formato de una oportunidad: `id` (referencia interna única), `estado` (`nueva`, `contactada`, `propuesta`, `ganada`, `perdida`). Las ganadas requieren `moneda` (PEN, USD u otro código de tres letras), `ingreso` y `costo` numéricos no negativos. Usa un criterio contable consistente: ingreso reconocido y costos atribuibles al mismo trabajo, en la misma moneda; no mezcles cotizaciones con cobros.

Formato de un ticket: `id`, `creado` en fecha ISO con zona horaria, `resuelto` en el mismo formato o `null`. No uses datos personales como identificador. Los CSV son plantillas para trabajo manual: el generador lee JSON y no sincroniza los CSV.

El informe calcula etapas comerciales, ganadas / (ganadas + perdidas), importes y margen por moneda, tickets abiertos y horas promedio de resolución de los cerrados. No mezcla monedas. Devuelve `null` si falta el denominador; cero consultas no equivale a una tasa de conversión del 0 %. El resultado cubre todos los registros suministrados: filtra una cohorte consistente antes de comparar periodos. No calcula retención, cancelaciones, CAC o MRR sin sus registros respectivos.

## Registro de las 15 áreas

| Área | Entregado | Qué falta para operar o validar |
| --- | --- | --- |
| 1. Propuesta | Titular concreto, oferta y diferenciación empresa/producto en la web | Contrastar el mensaje con clientes reales |
| 2. Cliente prioritario | Públicos por oferta y preguntas de calificación | Elegir segmento con ventas, entrevistas y margen |
| 3. Catálogo | Comparación de servicios y alcance sujeto a propuesta | Aprobar precios, exclusiones y capacidades de cada proyecto |
| 4. Identidad | Marca existente conservada, textos y nuevos bloques consistentes | Validación visual en dispositivos y derechos de imágenes |
| 5. Web comercial | CTA a cotización, proceso, formulario y alternativas | Desplegar el PR en el alojamiento oficial y probar canales |
| 6. Confianza | Fundador real y repositorios comprobables; se retira la imagen conceptual del producto | Casos y testimonios autorizados con resultados verificables |
| 7. Contenido | Calendario de cuatro semanas y guiones en `contenido.md` | Material real, revisión y publicación desde cuentas oficiales |
| 8. Ventas | Plantilla de oportunidades y proceso de seguimiento | Importar en CRM privado, asignar responsables y registrar consultas |
| 9. Inicio del cliente | Procedimiento y lista de aceptación | Aplicarlo en proyectos reales y medir activación |
| 10. Producto | Estado de AlshaFacturas honesto y prioridades de validación | Acceso al código real: el repositorio localizado solo contiene README |
| 11. Soporte | Formulario contextual, CSV y clasificación de incidentes | Horarios, responsables y condiciones aprobados |
| 12. Rentabilidad | Plantilla de costos y cálculo de margen por moneda | Costos, horas, precios y criterios contables reales |
| 13. Operación | Procedimientos y verificaciones automáticas en GitHub | Asignar y ejecutar las tareas internas |
| 14. Seguridad | CSP, cabeceras, scripts propios y ruta Maven corregida | HTTPS, accesos del hosting, copias y prueba real de restauración |
| 15. Medición | Identificadores UTM permitidos, evento sin PII y generador local | Registros reales y conexión a CRM/analítica si se decide usarla |

No se han cambiado precios, comprado herramientas, activado publicidad, enviado mensajes a clientes, publicado en redes ni configurado copias de infraestructura inaccesible.
