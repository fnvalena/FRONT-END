// validar formulario

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formLogin');
  const inputUsuario = document.getElementById('usuario');
  const inputPassword = document.getElementById('password');

  // ── Mensaje de cierre de sesión exitoso ──────────────────
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get('logout') === 'ok') {
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Tu sesión se cerró correctamente.',
      confirmButtonText: 'Aceptar'
    });
  }

  function mostrarError(idCampo, mensaje) {
    const span = document.getElementById('error-' + idCampo);
    if (span) span.textContent = mensaje;
  }

  function limpiarErrores() {
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  // Validar correo
  function correoValido(correo) {
    const cantidadArroba = (correo.match(/@/g) || []).length;
    if (cantidadArroba !== 1) return false;

    const partes = correo.split('@');
    const parteLocal = partes[0];
    const parteDominio = partes[1];

    if (parteLocal.length < 3) return false;
    if (!parteDominio || parteDominio.indexOf('.') === -1) return false;

    return true;
  }

  // Validar contraseña
  function passwordRobusta(password) {
    const tieneLongitud = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return tieneLongitud && tieneMayuscula && tieneMinuscula && tieneEspecial;
  }

  function validarFormulario() {
    limpiarErrores();
    const errores = [];

    const usuario = inputUsuario.value.trim();
    const password = inputPassword.value.trim();

    // Campos en blanco
    if (usuario === '') {
      mostrarError('usuario', 'El usuario o correo es obligatorio.');
      errores.push('El campo usuario no puede estar vacío.');
    }

    if (password === '') {
      mostrarError('password', 'La contraseña es obligatoria.');
      errores.push('El campo contraseña no puede estar vacío.');
    }

    // Validar correo
    if (usuario !== '' && !correoValido(usuario)) {
      mostrarError('usuario', 'Ingresa un correo válido (ej: nombre@correo.cl).');
      errores.push('El correo electrónico no tiene un formato válido.');
    }

    // Validar contraseña
    if (password !== '' && !passwordRobusta(password)) {
      mostrarError('password', 'La contraseña no cumple los requisitos mínimos de seguridad.');
      errores.push('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.');
    }

    return errores;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const errores = validarFormulario();

    if (errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Revisa tus datos',
        html: '<ul style="text-align:left;margin:0;padding-left:1.2rem;">' +
              errores.map(function (er) { return '<li>' + er + '</li>'; }).join('') +
              '</ul>',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Envio al backend PHP que valida credenciales contra la base de datos
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (respuesta) {
        return respuesta.text().then(function (texto) {
          let data;

          try {
            data = JSON.parse(texto);
          } catch (error) {
            throw new Error(texto || 'El servidor no devolvio una respuesta valida.');
          }

          if (!respuesta.ok) {
            throw new Error(data.mensaje || 'No fue posible validar el inicio de sesion.');
          }

          return data;
        });
      })
      .then(function (data) {
        if (data.ok) {
          const destino = 'dashboard.php';

          Swal.fire({
            icon: 'success',
            title: 'Acceso exitoso',
            text: 'Bienvenido/a. Seras redirigido a tu panel.',
            confirmButtonText: 'Continuar'
          }).then(function () {
            window.location.href = destino;
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: data.mensaje || 'Usuario o contraseña incorrectos.',
            confirmButtonText: 'Intentar nuevamente'
          });
        }
      })
      .catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: error.message || 'No fue posible conectar con el servidor. Intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      });
  });
});
