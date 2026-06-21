//validar formulario y usar valor fijo de uf en caso que la API no funcione
let VALOR_UF = 39200; 
let ufCargada = false;

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formPublicacion');
  const inputPrecio = document.getElementById('precio');
  const inputPrecioUF = document.getElementById('precioUF');
  const inputFotos = document.getElementById('fotos');
  const ufInfo = document.getElementById('uf-info');

  // valor actualizado de la UF desde el backend consultando mindicador.cl
  function cargarValorUF() {
    fetch('obtener_uf.php')
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        VALOR_UF = data.valor;
        ufCargada = true;

        if (ufInfo) {
          if (data.ok) {
            ufInfo.textContent = 'UF actualizada al ' + data.fecha.substring(0, 10) +
              ': $' + Number(VALOR_UF).toLocaleString('es-CL');
          } else {
            ufInfo.textContent = 'No se pudo actualizar la UF, se usó un valor de referencia ($' +
              Number(VALOR_UF).toLocaleString('es-CL') + ').';
          }
        }

        calcularUF(); 
      })
      .catch(function () {
        ufCargada = true; 
        if (ufInfo) {
          ufInfo.textContent = 'No se pudo conectar para actualizar la UF, se usó un valor de referencia';
        }
      });
  }

  cargarValorUF();

  // Calculo automático del precio en UF segun peso chileno ingresado
  function calcularUF() {
    const precioCLP = parseFloat(inputPrecio.value);
    if (!isNaN(precioCLP) && precioCLP > 0) {
      const uf = precioCLP / VALOR_UF;
      inputPrecioUF.value = uf.toFixed(2);
    } else {
      inputPrecioUF.value = '';
    }
  }

  inputPrecio.addEventListener('input', calcularUF);

  // mensajes de error
  function mostrarError(idCampo, mensaje) {
    const span = document.getElementById('error-' + idCampo);
    if (span) span.textContent = mensaje;
  }

  function limpiarErrores() {
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }

  function esNumerico(valor) {
    return valor !== '' && !isNaN(valor) && isFinite(valor);
  }

  // validacion formulario
  function validarFormulario() {
    limpiarErrores();
    let errores = [];

    const tipo = document.getElementById('tipo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const banos = document.getElementById('banos').value;
    const dormitorios = document.getElementById('dormitorios').value;
    const areaTotal = document.getElementById('area-total').value;
    const areaConstruida = document.getElementById('area-construida').value;
    const precio = inputPrecio.value;
    const precioUF = inputPrecioUF.value;
    const fechaPublicacion = document.getElementById('fecha-publicacion').value;
    const visita = document.getElementById('visita').value;

    const bodega = document.getElementById('bodega').value;
    const estacionamiento = document.getElementById('estacionamiento').value;
    const logia = document.getElementById('logia').value;
    const cocinaAmoblada = document.getElementById('cocina-amoblada').value;
    const antejardin = document.getElementById('antejardin').value;
    const patioTrasero = document.getElementById('patio-trasero').value;
    const piscina = document.getElementById('piscina').value;

    // Tipo de propiedad
    if (tipo === '') {
      mostrarError('tipo', 'Selecciona el tipo de propiedad');
      errores.push('Tipo de propiedad es obligatorio');
    }

    // Descripción
    if (descripcion === '') {
      mostrarError('descripcion', 'La descripción es obligatoria ');
      errores.push('Descripción es obligatoria ');
    }

    // Baños
    if (banos === '' || !esNumerico(banos)) {
      mostrarError('banos', 'Ingresa una cantidad numérica de baños ');
      errores.push('Cantidad de baños debe ser un número');
    }

    // Dormitorios
    if (dormitorios === '' || !esNumerico(dormitorios)) {
      mostrarError('dormitorios', 'Ingresa una cantidad numérica de dormitorios ');
      errores.push('Cantidad de dormitorios debe ser un número');
    }

    // Area total del terreno
    if (areaTotal === '' || !esNumerico(areaTotal)) {
      mostrarError('area-total', 'Ingresa el área total en m² (numérico)');
      errores.push('Área total del terreno debe ser un número');
    }

    // Área construida
    if (areaConstruida === '' || !esNumerico(areaConstruida)) {
      mostrarError('area-construida', 'Ingresa el área construida en m² (numérico)');
      errores.push('Área construida debe ser un número');
    }

    // Precio en pesos chilenos
    if (precio === '' || !esNumerico(precio)) {
      mostrarError('precio', 'Ingresa el precio en pesos (numérico) ');
      errores.push('Precio en $ CLP debe ser en números');
    }

    // Precio en UF 
    if (precioUF === '' || !esNumerico(precioUF)) {
      mostrarError('precioUF', 'El precio en UF no pudo calcularse. Revisa el precio en $ CLP');
      errores.push('Precio en UF debe ser un número');
    }

    // Fecha de publicacin
    if (fechaPublicacion === '') {
      mostrarError('fecha-publicacion', 'Selecciona la fecha de publicación');
      errores.push('Fecha de publicación es obligatoria');
    } else {
      const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fechaPublicacion);
      if (!fechaValida) {
        mostrarError('fecha-publicacion', 'Formato de fecha inválido');
        errores.push('Formato de fecha de publicación es inválido');
      }
    }

    //solicitar visita
    if (visita === '') {
      mostrarError('visita', 'Debes indicar si la propiedad permite solicitar visita');
      errores.push('Opción de solicitar visita es obligatoria');
    }

    // Fotos 1-10
    if (!inputFotos.files || inputFotos.files.length < 1) {
      mostrarError('fotos', 'Debes adjuntar al menos 1 fotografía');
      errores.push('Debes adjuntar entre 1 y 10 fotografías');
    } else if (inputFotos.files.length > 10) {
      mostrarError('fotos', 'Máximo 10 fotografías permitidas');
      errores.push('Máximo 10 fotografías permitidas');
    }

    // cracteristicas
    if (bodega === '') {
      errores.push('Debes indicar si la propiedad cuenta con Bodega');
    }
    if (estacionamiento === '' || !esNumerico(estacionamiento)) {
      errores.push('Estacionamiento debe ser obligatorio y numérico');
    }
    if (logia === '' || !esNumerico(logia)) {
      errores.push('Logia debe ser obligatorio y numérico');
    }
    if (cocinaAmoblada === '' || !esNumerico(cocinaAmoblada)) {
      errores.push('Cocina amoblada debe ser obligatorio y numérico');
    }
    if (antejardin === '' || !esNumerico(antejardin)) {
      errores.push('Antejardín debe ser obligatorio y numérico');
    }
    if (patioTrasero === '' || !esNumerico(patioTrasero)) {
      errores.push('Patio trasero debe ser obligatorio y numérico');
    }
    if (piscina === '' || !esNumerico(piscina)) {
      errores.push('Piscina debe ser obligatorio y numérico');
    }

    return errores;
  }

  // envio de formulario
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    calcularUF();

    const errores = validarFormulario();

    if (errores.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Revisa el formulario',
        html: '<ul style="text-align:left;margin:0;padding-left:1.2rem;">' +
              errores.map(function (e) { return '<li>' + e + '</li>'; }).join('') +
              '</ul>',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Mostrar estado "enviando" mientras se procesa en el backend
    Swal.fire({
      title: 'Enviando publicación...',
      text: 'Por favor espera mientras se guarda la propiedad.',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: function () {
        Swal.showLoading();
      }
    });

    // Envío real al backend PHP procesar_propiedad
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (data.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Publicación enviada',
            text: data.mensaje || 'La propiedad fue publicada correctamente. Redirigiendo al inicio...',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(function () {
            window.location.href = 'index.html';
          });
        } else {
          // El backend devolvió errores de validación
          const listaErrores = data.errores && data.errores.length
            ? '<ul style="text-align:left;margin:0;padding-left:1.2rem;">' +
              data.errores.map(function (er) { return '<li>' + er + '</li>'; }).join('') +
              '</ul>'
            : (data.mensaje || 'No se pudo publicar la propiedad.');

          Swal.fire({
            icon: 'error',
            title: 'No se pudo publicar',
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