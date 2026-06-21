document.addEventListener('DOMContentLoaded', function () {
  const form             = document.getElementById('formGestor');
  const inputCertificado = document.getElementById('certificado');
  const inputRut         = document.getElementById('rut');
  const inputNombre      = document.getElementById('nombre');
  const inputTelefono    = document.getElementById('telefono');
  const inputPassword    = document.getElementById('password');
  const inputCorreo      = document.getElementById('correo');
  const inputFecha       = document.getElementById('fecha');
  const selectSexo       = document.getElementById('sexo');


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

  function archivoPdfValido(input) {
    if (!input) return { valido: false, motivo: 'No se encontró el campo de archivo.' };
    if (!input.files || input.files.length === 0) return { valido: false, motivo: 'Debes adjuntar el certificado de antecedentes.' };
    const archivo = input.files[0];
    if (archivo.size === 0) return { valido: false, motivo: 'El archivo adjuntado está vacío.' };
    const extensionValida = archivo.name.toLowerCase().endsWith('.pdf');
    const tipoValido      = archivo.type === 'application/pdf';
    if (!extensionValida || !tipoValido) return { valido: false, motivo: 'El archivo debe tener extensión .pdf' };
    return { valido: true, motivo: '' };
  }

  function esMayorDeEdad(fechaStr) {
    const hoy        = new Date();
    const nacimiento = new Date(fechaStr);
    const edad       = hoy.getFullYear() - nacimiento.getFullYear();
    const cumple     = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
    return edad > 18 || (edad === 18 && hoy >= cumple);
  }

 

  function restringirCampo(input, patronPermitido, limpiarFn) {
    input.addEventListener('beforeinput', function (e) {
      if (!e.data) return;
      for (let i = 0; i < e.data.length; i++) {
        if (!patronPermitido.test(e.data[i])) { e.preventDefault(); return; }
      }
    });
    if (limpiarFn) input.addEventListener('input', limpiarFn);
  }


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

  restringirCampo(inputNombre, /[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/, function () {
    const limpio = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    if (this.value !== limpio) this.value = limpio;
    limpiarError('nombre');
  });

  restringirCampo(inputTelefono, /[0-9]/, function () {
    const limpio = this.value.replace(/[^0-9]/g, '').slice(0, 9);
    if (this.value !== limpio) this.value = limpio;
    limpiarError('telefono');
  });


  const reEspecial = /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/;

  function passwordValido(pass) {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && reEspecial.test(pass);
  }

  inputPassword.addEventListener('input', function () {
    const pass = this.value;
    if (pass === '') { limpiarError('password'); return; }
    const fallas = [];
    if (pass.length < 8)          fallas.push('mínimo 8 caracteres');
    if (!/[A-Z]/.test(pass))      fallas.push('una mayúscula');
    if (!/[0-9]/.test(pass))      fallas.push('un número');
    if (!reEspecial.test(pass))   fallas.push('un carácter especial (!@#$%...)');
    if (fallas.length > 0) {
      mostrarError('password', 'Falta: ' + fallas.join(', ') + '.');
    } else {
      limpiarError('password');
    }
  });


  inputCorreo.addEventListener('input',  function () { limpiarError('correo'); });
  inputFecha.addEventListener('change',  function () { limpiarError('fecha'); });
  selectSexo.addEventListener('change',  function () { limpiarError('sexo'); });

//certificado

  inputCertificado.addEventListener('change', function () {
    const resultado = archivoPdfValido(inputCertificado);
    mostrarError('certificado', resultado.valido ? '' : resultado.motivo);
  });


  function validarFormulario() {
    limpiarErrores();
    const errores = [];

    const rut      = inputRut.value.trim();
    const nombre   = inputNombre.value.trim();
    const fecha    = inputFecha.value.trim();
    const correo   = inputCorreo.value.trim();
    const password = inputPassword.value;
    const sexo     = selectSexo.value.trim();
    const telefono = inputTelefono.value.trim();

    if (rut === '')      { mostrarError('rut',      'El RUT es obligatorio.');                 errores.push('RUT es obligatorio.'); }
    if (nombre === '')   { mostrarError('nombre',   'El nombre completo es obligatorio.');     errores.push('Nombre completo es obligatorio.'); }
    if (fecha === '')    { mostrarError('fecha',    'La fecha de nacimiento es obligatoria.'); errores.push('Fecha de nacimiento es obligatoria.'); }
    if (correo === '')   { mostrarError('correo',   'El correo electrónico es obligatorio.');  errores.push('Correo electrónico es obligatorio.'); }
    if (password === '') { mostrarError('password', 'La contraseña es obligatoria.');          errores.push('Contraseña es obligatoria.'); }
    if (sexo === '')     { mostrarError('sexo',     'Selecciona una opción.');                 errores.push('Sexo es obligatorio.'); }
    if (telefono === '') { mostrarError('telefono', 'El teléfono móvil es obligatorio.');      errores.push('Teléfono móvil es obligatorio.'); }

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

    if (telefono !== '' && !telefonoValido(telefono)) {
      mostrarError('telefono', 'El teléfono debe tener exactamente 9 dígitos numéricos.');
      errores.push('El teléfono móvil debe ser numérico y tener 9 dígitos.');
    }

    if (password !== '' && !passwordValido(password)) {
      mostrarError('password', 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.');
      errores.push('La contraseña no cumple el formato requerido.');
    }

    const resultadoArchivo = archivoPdfValido(inputCertificado);
    if (!resultadoArchivo.valido) {
      mostrarError('certificado', resultadoArchivo.motivo);
      errores.push(resultadoArchivo.motivo);
    }

    return errores;
  }


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

    Swal.fire({
      title: 'Enviando postulación...',
      text: 'Por favor espera mientras se procesa tu registro.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: function () { Swal.showLoading(); }
    });

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Postulación enviada',
            text: data.mensaje || 'Tus datos fueron registrados. Quedarás a la espera de revisión. Redirigiendo...',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(function () { window.location.href = 'login.html'; });
        } else {
          const listaErrores = data.errores && data.errores.length
            ? '<ul style="text-align:left;margin:0;padding-left:1.2rem;">' +
              data.errores.map(function (er) { return '<li>' + er + '</li>'; }).join('') +
              '</ul>'
            : (data.mensaje || 'No se pudo completar la postulación.');
          Swal.fire({
            icon: 'error',
            title: 'No se pudo completar la postulación',
            html: listaErrores,
            confirmButtonText: 'Cerrar'
          });
        }
      })
      .catch(function () {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No fue posible conectar con el servidor. Intenta nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      });
  });
});