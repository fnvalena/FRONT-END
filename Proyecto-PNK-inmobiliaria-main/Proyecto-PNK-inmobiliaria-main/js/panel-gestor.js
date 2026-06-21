document.addEventListener('DOMContentLoaded', function () {
  function mostrarError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo completar la accion',
      text: mensaje || 'Intenta nuevamente.',
      confirmButtonText: 'Cerrar'
    });
  }

  document.querySelectorAll('[data-estado-gestor-solicitud]').forEach(function (selector) {
    selector.addEventListener('change', function () {
      const datos = new FormData();
      datos.append('id', selector.dataset.estadoGestorSolicitud);
      datos.append('estado', selector.value);

      fetch('gestor_solicitudes_api.php', {
        method: 'POST',
        body: datos
      })
        .then(function (respuesta) { return respuesta.json(); })
        .then(function (data) {
          if (!data.ok) {
            mostrarError(data.mensaje);
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Solicitud actualizada',
            text: data.mensaje,
            timer: 1400,
            showConfirmButton: false
          });
        })
        .catch(function () {
          mostrarError('No fue posible actualizar la solicitud.');
        });
    });
  });
});
