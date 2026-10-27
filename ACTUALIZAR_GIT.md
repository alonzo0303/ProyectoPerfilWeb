# Aplicar esta versión en el repositorio existente

No crees otro repositorio ni ejecutes `git init`. Trabaja en la carpeta local que ya está vinculada con GitHub.

## 1. Guarda tu trabajo actual

Abre la terminal en la carpeta donde está tu `pom.xml` y ejecuta:

```powershell
git status
```

Si tienes cambios pendientes, revísalos y guárdalos con un commit antes de reemplazar archivos. No publiques contraseñas ni archivos de configuración privados. Si la rama actual tiene trabajo sin terminar, completa ese trabajo antes de seguir.

## 2. Crea una rama para esta actualización

```powershell
git switch -c mejora/web-comercial
```

La rama parte de tu versión actual. Si ya existe una rama con ese nombre, usa otro nombre o continúa en ella si corresponde a este trabajo.

## 3. Copia el contenido del ZIP

Extrae el ZIP en una ubicación separada. Dentro está la carpeta `AlshaGroup`.

- Conserva la carpeta `.git` de tu repositorio: contiene la conexión y el historial.
- Una vez que tu versión anterior esté guardada en un commit, elimina el `src` antiguo y copia el `src` nuevo completo. Copiar encima puede dejar archivos retirados o conservar `Resources` con mayúscula en Windows.
- Copia los demás archivos de `AlshaGroup` a la raíz del repositorio: `pom.xml`, scripts Maven, `.mvn`, archivos frontend, documentos, `.gitignore` y `.gitattributes`.
- No copies la carpeta `AlshaGroup` como una subcarpeta dentro del proyecto. El nuevo `pom.xml` debe reemplazar el anterior en la raíz.
- Conserva cualquier archivo propio que no forme parte de este cambio, como tu licencia. No sobrescribas credenciales ni configuraciones privadas.
- No subas `node_modules`, `target` ni el ZIP. Los estilos e iconos dentro de `src` sí se incluyen.

## 4. Revisa y prueba

```powershell
git status
git diff --stat
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Con Java 21, abre `http://localhost:8080/`. Prueba botones de servicios, menú móvil, formulario y aviso de privacidad. Detén la aplicación con Ctrl+C.

Si modificas clases de Tailwind o sus estilos fuente, ejecuta `npm ci`, `npm run build` y `npm test`.

## 5. Guarda y sube la rama

Después de revisar todos los cambios:

```powershell
git add -A
git diff --cached --stat
git commit -m "Mejora web comercial y solicitudes de servicios SaaS"
git push -u origin mejora/web-comercial
```

`git add -A` incluye archivos agregados, modificados y eliminados. Revisa lo preparado antes del commit.

## 6. Abre un Pull Request

En GitHub, crea un Pull Request desde `mejora/web-comercial` hacia tu rama principal (normalmente `main`). Revisa las diferencias antes de fusionar.

El historial anterior se conserva. Cada retoque semanal puede seguir el mismo flujo con una rama y un commit descriptivo.
