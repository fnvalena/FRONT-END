# PNK Inmobiliaria

Proyecto web académico para la gestión, publicación y búsqueda de propiedades inmobiliarias en la Región de Coquimbo. El sistema integra formularios con validación JavaScript, backend PHP, base de datos MySQL, manejo de sesiones, paneles por rol, CRUD de propiedades, solicitudes de visita, trazabilidad con gestores inmobiliarios y preparación para despliegue en AWS.

## Objetivo del proyecto

Desarrollar una plataforma inmobiliaria funcional que permita:

- Registrar propietarios y gestores inmobiliarios.
- Validar cuentas desde un panel administrativo.
- Iniciar sesión con control de roles.
- Publicar, listar, buscar, editar y eliminar propiedades.
- Buscar propiedades dinámicamente con AJAX.
- Solicitar visitas a propiedades.
- Derivar propiedades y solicitudes a gestores aprobados.
- Mantener trazabilidad de estados entre administrador, gestor y usuario.
- Preparar el proyecto para ejecución local y despliegue en AWS.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- PHP
- MySQL
- AJAX / Fetch API
- SweetAlert2
- WAMP / XAMPP para entorno local
- AWS como plataforma de despliegue objetivo

## Estructura principal

```text
FRONT END/
├── README.md
├── pnk_inmobiliaria.sql
└── Proyecto-PNK-inmobiliaria-main/
    └── Proyecto-PNK-inmobiliaria-main/
        ├── index.html
        ├── login.html
        ├── administracion.php
        ├── panel_propietario.php
        ├── panel_gestor.php
        ├── propiedades_api.php
        ├── propietarios_api.php
        ├── gestores_api.php
        ├── solicitudes_visita_api.php
        ├── procesar_login.php
        ├── procesar_propietario.php
        ├── procesar_gestor.php
        ├── procesar_solicitud_visita.php
        ├── css/
        ├── js/
        ├── img/
        └── uploads/
```

## Módulos desarrollados

### Inicio y navegación

La página principal `index.html` presenta el sitio, accesos principales, propiedades destacadas y navegación hacia registro, login, búsqueda, publicación, dashboard y contacto.

Se estandarizó el footer global en todas las ventanas, incluyendo:

- Logo PNK.
- Datos de contacto.
- Accesos rápidos.
- Copyright.
- Corrección para evitar espacios blancos bajo el footer en páginas cortas.

### Registro de propietarios

Archivo principal:

- `registro-propietario.html`
- `procesar_propietario.php`
- `js/registro_propietario.js`

El propietario registra:

- RUT.
- Nombre completo.
- Fecha de nacimiento.
- Correo electrónico.
- Contraseña.
- Sexo.
- Teléfono móvil.
- Número de propiedad según Bienes Raíces.

La cuenta queda en estado `pendiente` hasta que el administrador la active.

### Registro de gestores

Archivos principales:

- `registro-gestor.html`
- `procesar_gestor.php`
- `js/registro-gestor.js`

El gestor registra:

- RUT.
- Nombre completo.
- Fecha de nacimiento.
- Correo electrónico.
- Contraseña.
- Sexo.
- Teléfono móvil.
- Certificado de antecedentes en PDF.

El gestor queda en estado `pendiente` hasta revisión del administrador.

## Validaciones JavaScript

### Validación de contraseña robusta

Se implementó validación para:

- Mínimo 8 caracteres.
- Al menos una letra mayúscula.
- Al menos una letra minúscula.
- Al menos un carácter especial.

Además, los formularios de registro muestran un bloque fijo con los requisitos de contraseña para mejorar la experiencia del usuario.

### Validación de correo electrónico

Se implementó una función JavaScript que valida:

- Solo un símbolo `@`.
- Mínimo 3 caracteres antes del `@`.
- Al menos un punto después del `@`.

Esta validación se encuentra aplicada en login, registro de propietario y registro de gestor.

## Seguridad de contraseñas

Las contraseñas no se almacenan en texto plano.

En los registros de propietario y gestor se usa:

```php
password_hash($password, PASSWORD_BCRYPT)
```

En el login se valida usando:

```php
password_verify($password, $fila['password'])
```

Por seguridad, no se incluye una clave administrativa escrita en el código fuente. El usuario administrador debe crearse directamente en la base de datos o mediante un proceso seguro fuera del repositorio público.

## Login y sesiones

Archivos principales:

- `login.html`
- `procesar_login.php`
- `dashboard.php`
- `verificar_sesion.php`
- `verificar_admin.php`
- `verificar_propietario.php`
- `verificar_gestor.php`
- `cerrar_sesion.php`

El login:

- Recibe correo y contraseña.
- Busca el usuario en las tablas `usuarios`, `propietarios` y `gestores`.
- Valida contraseña con `password_verify`.
- Verifica estado activo o aprobado.
- Crea variables de sesión PHP:
  - `id`
  - `nombre`
  - `correo`
  - `rol`
  - `activo`

El sistema redirige según rol:

- Administrador → `administracion.php`
- Propietario → `panel_propietario.php`
- Gestor → `panel_gestor.php`

El cierre de sesión se realiza con `cerrar_sesion.php`, usando:

```php
session_unset();
session_destroy();
```

Luego redirige al login con mensaje de cierre exitoso.

## Panel administrador

Archivo principal:

- `administracion.php`
- `js/admin-propiedades.js`

El administrador puede:

- Ver propietarios registrados.
- Activar propietarios pendientes.
- Eliminar propietarios.
- Ver gestores registrados.
- Aprobar, rechazar o eliminar gestores.
- Ver propiedades registradas.
- Crear propiedades.
- Editar propiedades.
- Eliminar propiedades.
- Revisar solicitudes de visita.
- Actualizar estados de solicitudes.
- Derivar propiedades a gestores aprobados.
- Derivar solicitudes de visita a gestores aprobados.

## Panel propietario

Archivo principal:

- `panel_propietario.php`

El propietario puede:

- Ver sus datos.
- Ver estado de cuenta.
- Acceder a publicación de propiedad.
- Acceder a búsqueda de propiedades.
- Ver solicitudes de visita asociadas a su correo.

## Panel gestor

Archivo principal:

- `panel_gestor.php`
- `gestor_solicitudes_api.php`
- `js/panel-gestor.js`

El gestor inmobiliario aprobado puede:

- Ver sus datos.
- Ver propiedades asignadas por el administrador.
- Ver solicitudes de visita derivadas por el administrador.
- Cambiar el estado de sus solicitudes asignadas.

Estados disponibles para solicitudes gestionadas:

- Asignada.
- Contactado.
- Coordinada.
- Cerrada.
- Rechazada.

## Trazabilidad administrador-gestor

Se implementó trazabilidad para que el administrador conserve control sobre el flujo operativo.

Flujo recomendado:

1. Un usuario solicita una visita.
2. La solicitud queda registrada en base de datos.
3. El administrador revisa la solicitud.
4. El administrador puede derivarla a un gestor aprobado.
5. El gestor ve la solicitud en su panel.
6. El gestor actualiza el estado.
7. El administrador puede seguir viendo el estado actualizado.

También se permite asignar propiedades a gestores para que cada gestor vea únicamente las propiedades derivadas a su cuenta.

## CRUD de propiedades

Archivos principales:

- `administracion.php`
- `propiedades_api.php`
- `procesar_propiedad.php`
- `js/admin-propiedades.js`

El sistema permite:

- Crear propiedad.
- Listar propiedades.
- Editar propiedad.
- Eliminar propiedad.
- Subir fotografías.
- Asociar galería de imágenes.
- Asignar gestor.
- Mantener estado de gestión.

## Búsqueda AJAX

Archivos principales:

- `buscador-propiedad.html`
- `buscar_propiedades.php`
- `js/buscar-propiedades.js`

La búsqueda permite filtrar propiedades por:

- Operación.
- Tipo de inmueble.
- Provincia.
- Comuna.
- Sector.

Los resultados se cargan dinámicamente desde MySQL usando AJAX.

## Solicitudes de visita

Archivos principales:

- `solicitar_visita.php`
- `procesar_solicitud_visita.php`
- `solicitudes_visita_api.php`

El usuario puede solicitar una visita desde el detalle de una propiedad.

La solicitud registra:

- Propiedad.
- Nombre del interesado.
- Correo.
- Teléfono.
- Mensaje.
- Estado.
- Fecha de solicitud.
- Gestor asignado, si corresponde.

## Carrusel de imágenes

Archivo principal:

- `js/galeria-propiedad.js`

En los detalles de propiedad se implementó visualización tipo carrusel/lightbox:

- Al presionar una imagen se abre en pantalla.
- Permite navegar entre imágenes.
- Incluye controles laterales.
- Mejora la experiencia visual sin cambiar el diseño base.

## Base de datos

Archivo:

- `pnk_inmobiliaria.sql`

Base de datos esperada:

```text
pnk_inmobiliaria
```

Tablas principales:

- `usuarios`
- `propietarios`
- `gestores`
- `propiedades`
- `galeria_propiedad`
- `solicitudes_visita`

El archivo SQL incluye estructura para:

- Usuarios y roles.
- Propietarios.
- Gestores.
- Propiedades.
- Galería de propiedades.
- Solicitudes de visita.
- Asignación de gestores.
- Estado de gestión.

## Instalación local con WAMP

1. Copiar la carpeta del proyecto en:

```text
C:\wamp64\www\
```

2. Iniciar servicios de WAMP:

- Apache.
- MySQL.

3. Crear la base de datos en phpMyAdmin:

```text
pnk_inmobiliaria
```

4. Importar:

```text
pnk_inmobiliaria.sql
```

5. Revisar conexión en:

```php
conexion.php
```

Configuración local esperada:

```php
$server = 'localhost';
$bd     = 'pnk_inmobiliaria';
$user   = 'root';
$pass   = '';
```

6. Abrir el proyecto en el navegador:

```text
http://localhost/Proyecto-PNK-inmobiliaria-main/Proyecto-PNK-inmobiliaria-main/
```

## Despliegue en AWS

El proyecto puede desplegarse en AWS usando una instancia EC2 con Apache, PHP y MySQL/MariaDB.

### Opción recomendada: EC2

1. Crear una instancia EC2.
2. Instalar Apache.
3. Instalar PHP.
4. Instalar MySQL o MariaDB.
5. Subir los archivos del proyecto al directorio web del servidor.
6. Importar `pnk_inmobiliaria.sql`.
7. Configurar `conexion.php` con los datos reales del servidor.
8. Configurar reglas de seguridad del Security Group:
   - HTTP puerto 80.
   - HTTPS puerto 443, si se configura SSL.
   - SSH puerto 22 solo para administración.
9. Probar la URL pública de la instancia.

### Consideraciones para AWS

- No subir claves reales al repositorio.
- No dejar archivos de creación de usuarios administrativos con contraseña escrita.
- Configurar correctamente permisos de carpetas de subida:
  - `uploads/`
  - `img/propiedades/`
- Configurar HTTPS si el proyecto se publica en internet.
- Cambiar credenciales de base de datos en `conexion.php`.
- Crear el usuario administrador de forma segura en la base de datos.

## Credenciales y seguridad

Por seguridad, este repositorio no debe contener:

- Contraseñas reales.
- Claves administrativas.
- Archivos temporales para crear administradores con clave fija.
- Datos personales reales.

Si se trabaja en un repositorio público, se recomienda:

- Usar datos ficticios.
- Cambiar cualquier contraseña que haya sido expuesta.
- Evitar subir respaldos con información sensible.

## Estado actual del proyecto

El proyecto cuenta con:

- Registro de propietarios.
- Registro de gestores.
- Login con sesiones PHP.
- Protección por roles.
- Logout funcional.
- Panel administrador.
- Panel propietario.
- Panel gestor.
- CRUD de propiedades.
- Búsqueda AJAX.
- Solicitudes de visita.
- Trazabilidad de derivación a gestor.
- Carrusel de imágenes en detalle de propiedad.
- Footer global estandarizado.
- Preparación para despliegue en AWS.

## Autores

Proyecto académico desarrollado por:

- Maricel Videla.
- Valentina Ferreira.

Institución:

- INACAP.

Año:

- 2026.

Desarrollo realizado para evaluación de frontend/backend con PHP, MySQL y despliegue web.
