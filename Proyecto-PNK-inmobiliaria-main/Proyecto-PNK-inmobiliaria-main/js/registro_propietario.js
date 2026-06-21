document.addEventListener('DOMContentLoaded', function () {
  const form          = document.getElementById('formPropietario');
  const inputFecha    = document.getElementById('fecha');
  const inputRut      = document.getElementById('rut');
  const inputNombre   = document.getElementById('nombre');
  const inputTelefono = document.getElementById('telefono');
  const inputCorreo   = document.getElementById('correo');
  const inputPassword = document.getElementById('password');
  const inputProp     = document.getElementById('propiedad');
  const selectSexo    = document.getElementById('sexo');

  //limite fecha max 18 años
  const hoy      = new Date();
  const maxFecha = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
  inputFecha.setAttribute('max', maxFecha.toISOString().split('T')[0]);

  function mostrarError(idCampo, mensaje) {
    const span = document.getElementById('error-' + idCampo);
    if (span) span.textContent = mensaje;
  }

  function limpiarError(idCampo) {
    const span = document.getElementById('error-' + idCampo);
    if (span) span.textContent = '';
  }

  function limpiarErrores() {
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  function correoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  }

  function telefonoValido(telefono) {
    return /^\d{9}$/.test(telefono);
  }

  function passwordRobusta(pass) {
    return pass.length >= 8 &&
           /[A-Z]/.test(pass) &&
           /[a-z]/.test(pass) &&
           /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
  }

  function numeroPropiedadValido(numero) {
    return /^\d{4}-\d{3}-\d{4}$/.test(numero);
  }

  function esMayorDeEdad(fechaStr) {
    const hoy        = new Date();
    const nacimiento = new Date(fechaStr);
    const edad       = hoy.getFullYear() - nacimiento.getFullYear();
    const cumple     = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
    return edad > 18 || (edad === 18 && hoy >= cumple);
  }

  // Bloqueador universal 

  function restringirCampo(input, patronPermitido, limpiarFn) {
    input.addEventListener('beforeinput', function (e) {
      if (!e.data) return;
      for (let i = 0; i < e.data.length; i++) {
        if (!patronPermitido.test(e.data[i])) { e.preventDefault(); return; }
      }
    });
    if (limpiarFn) {
      input.addEventListener('input', limpiarFn);
    }
  }

  // rut

  restringirCampo(inputRut, /[0-9kK]/, function () {
    let valor = this.value.replace(/[^0-9kK]/gi, '').toUpperCase();
    if (valor.length > 9) valor = valor.slice(0, 9);

    if (valor.length <= 1) { this.value = valor; limpiarError('rut'); return; }

    const dv     = valor.slice(-1);
    const cuerpo = valor.slice(0, -1);
    let fmt = '';

    if (cuerpo.length <= 3) {
      fmt = cuerpo;
    } else if (cuerpo.length <= 6) {
      fmt = cuerpo.slice(0, -3) + '.' + cuerpo.slice(-3);
    } else {
      fmt = cuerpo.slice(0, -6) + '.' + cuerpo.slice(-6, -3) + '.' + cuerpo.slice(-3);
    }

    this.value = fmt + '-' + dv;
    limpiarError('rut');
  });

  // nombre

  restringirCampo(inputNombre, /[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/, function () {
    const limpio = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    if (this.value !== limpio) this.value = limpio;
    limpiarError('nombre');
  });

  // tlf

  restringirCampo(inputTelefono, /[0-9]/, function () {
    const limpio = this.value.replace(/[^0-9]/g, '').slice(0, 9);
    if (this.value !== limpio) this.value = limpio;
    limpiarError('telefono');
  });

  // nro propiedad
 
  restringirCampo(inputProp, /[0-9]/, function () {
    let digitos = this.value.replace(/[^0-9]/g, '');
    if (digitos.length > 11) digitos = digitos.slice(0, 11);
 
    // Armar el valor con guiones automáticos según la cantidad de dígitos escritos
    let fmt = '';
    if (digitos.length <= 4) {
      fmt = digitos;
    } else if (digitos.length <= 7) {
      fmt = digitos.slice(0, 4) + '-' + digitos.slice(4);
    } else {
      fmt = digitos.slice(0, 4) + '-' + digitos.slice(4, 7) + '-' + digitos.slice(7);
    }
 
    this.value = fmt;
    limpiarError('propiedad');
  });



  // correo

  inputCorreo.addEventListener('input', function () { limpiarError('correo'); });

  // conytaseña

  inputPassword.addEventListener('input', function () {
    const pass = this.value;
    if (pass === '') { limpiarError('password'); return; }
    const fallas = [];
    if (pass.length < 8)              fallas.push('mínimo 8 caracteres');
    if (!/[A-Z]/.test(pass))          fallas.push('una mayúscula');
    if (!/[a-z]/.test(pass))          fallas.push('una minúscula');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) fallas.push('un carácter especial');
    if (fallas.length > 0) {
      mostrarError('password', 'Falta: ' + fallas.join(', ') + '.');
    } else {
      limpiarError('password');
    }
  });

  //fecha y sexo

  inputFecha.addEventListener('change', function () { limpiarError('fecha'); });
  selectSexo.addEventListener('change', function () { limpiarError('sexo'); });

  // Validacion completa al enviar

  function validarFormulario() {
    limpiarErrores();
    const errores = [];

    const rut       = inputRut.value.trim();
    const nombre    = inputNombre.value.trim();
    const fecha     = inputFecha.value.trim();
    const correo    = inputCorreo.value.trim();
    const password  = inputPassword.value;
    const sexo      = selectSexo.value.trim();
    const telefono  = inputTelefono.value.trim();
    const propiedad = inputProp.value.trim();

    if (rut === '')       { mostrarError('rut',       'El RUT es obligatorio.');                 errores.push('RUT es obligatorio.'); }
    if (nombre === '')    { mostrarError('nombre',    'El nombre completo es obligatorio.');     errores.push('Nombre completo es obligatorio.'); }
    if (fecha === '')     { mostrarError('fecha',     'La fecha de nacimiento es obligatoria.'); errores.push('Fecha de nacimiento es obligatoria.'); }
    if (correo === '')    { mostrarError('correo',    'El correo electrónico es obligatorio.');  errores.push('Correo electrónico es obligatorio.'); }
    if (password === '')  { mostrarError('password',  'La contraseña es obligatoria.');          errores.push('Contraseña es obligatoria.'); }
    if (sexo === '')      { mostrarError('sexo',      'Selecciona una opción.');                 errores.push('Sexo es obligatorio.'); }
    if (telefono === '')  { mostrarError('telefono',  'El teléfono móvil es obligatorio.');      errores.push('Teléfono móvil es obligatorio.'); }
    if (propiedad === '') { mostrarError('propiedad', 'El N° de propiedad es obligatorio.');     errores.push('N° de propiedad según Bienes Raíces es obligatorio.'); }

    if (fecha !== '' && !esMayorDeEdad(fecha)) {
      mostrarError('fecha', 'Debes ser mayor de 18 años para registrarte.');
      errores.push('Debes ser mayor de 18 años para registrarte.');
    }

    if (typeof validarRutChileno !== 'function') {
      errores.push('Error interno: función de validación RUT no disponible.');
    } else if (rut !== '' && !validarRutChileno(rut)) {
      mostrarError('rut', 'Formato inválido. Usa XX.XXX.XXX-X con dígito verificador correcto.');
      errores.push('El RUT ingresado no es válido.');
    }

    if (correo !== '' && !correoValido(correo)) {
      mostrarError('correo', 'Ingresa un correo con formato válido (ej: nombre@correo.cl).');
      errores.push('El correo electrónico no tiene una estructura válida.');
    }

    if (password !== '' && !passwordRobusta(password)) {
      mostrarError('password', 'La contraseña no cumple los requisitos mínimos de seguridad.');
      errores.push('La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.');
    }

    if (telefono !== '' && !telefonoValido(telefono)) {
      mostrarError('telefono', 'El teléfono debe tener exactamente 9 dígitos numéricos.');
      errores.push('El teléfono móvil debe ser numérico y tener 9 dígitos.');
    }

    if (propiedad !== '' && !numeroPropiedadValido(propiedad)) {
      mostrarError('propiedad', 'Formato esperado: ####-###-#### (ej: 1234-567-8901).');
      errores.push('El N° de propiedad debe tener el formato ####-###-####.');
    }

    return errores;
  }

  // ssubmit

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let errores = [];
    try {
      errores = validarFormulario();
    } catch (err) {
      console.error('Error en validación:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error interno',
        text: 'Ocurrió un error al validar el formulario. Recarga la página.',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    if (errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Revisa el formulario',
        html: '<ul style="text-align:left;margin:0;padding-left:1.2rem;">' +
              errores.map(function (er) { return '<li>' + er + '</li>'; }).join('') +
              '</ul>',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (r) {
        return r.text().then(function (texto) {
          try {
            return JSON.parse(texto);
          } catch (error) {
            throw new Error(texto.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || 'Respuesta no valida del servidor.');
          }
        });
      })
      .then(function (data) {
        if (data.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Cuenta creada exitosamente',
            text: data.mensaje || 'Tu cuenta quedará en estado pendiente hasta que el administrador verifique tus antecedentes.',
            confirmButtonText: 'Entendido'
          }).then(function () { window.location.href = 'login.html'; });
        } else {
          const listaErrores = data.errores && data.errores.length
            ? '<ul style="text-align:left;margin:0;padding-left:1.2rem;">' +
              data.errores.map(function (er) { return '<li>' + er + '</li>'; }).join('') +
              '</ul>'
            : (data.mensaje || 'No se pudo completar el registro.');
          Swal.fire({
            icon: 'error',
            title: 'No se pudo crear la cuenta',
            html: listaErrores,
            confirmButtonText: 'Cerrar'
          });
        }
      })
      .catch(function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: error.message || 'No fue posible conectar con el servidor. Intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      });
  });
});