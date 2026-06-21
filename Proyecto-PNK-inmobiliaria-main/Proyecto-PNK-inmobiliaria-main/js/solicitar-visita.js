document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formSolicitudVisita');
  const mensaje = document.getElementById('mensajeSolicitudVisita');

  if (!form) return;

  function mostrarAviso(tipo, titulo, texto) {
    if (mensaje) {
      mensaje.hidden = false;
      mensaje.innerHTML = '<strong>' + titulo + '</strong><p>' + texto + '</p>';
      mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (window.Swal) {
      Swal.fire({
        icon: tipo,
        title: titulo,
        text: texto,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

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
            throw new Error(data.mensaje || 'No se pudo enviar la solicitud.');
          }

          return data;
        });
      })
      .then(function (data) {
        if (!data.ok) {
          const errores = data.errores && data.errores.length
            ? data.errores.join('\n')
            : data.mensaje;

          mostrarAviso('warning', 'Revisa la solicitud', errores || 'Hay datos pendientes.');
          return;
        }

        mostrarAviso('success', 'Solicitud registrada', data.mensaje);
        form.reset();
      })
      .catch(function (error) {
        mostrarAviso('error', 'Error del servidor', error.message || 'No fue posible enviar la solicitud.');
      });
  });
});
