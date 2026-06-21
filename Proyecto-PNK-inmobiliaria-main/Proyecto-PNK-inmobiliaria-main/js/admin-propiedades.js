document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formCrudPropiedad');
  const tabla = document.getElementById('tabla-propiedades');
  const tablaPropietarios = document.getElementById('tabla-propietarios-pendientes');
  const totalPropiedades = document.getElementById('total-propiedades');
  const totalPropietariosPendientes = document.getElementById('total-propietarios-pendientes');
  const tituloFormulario = document.getElementById('titulo-formulario');
  const inputAccion = document.getElementById('accion');
  const inputId = document.getElementById('id');
  const btnLimpiar = document.getElementById('btn-limpiar');

  function formatoCLP(valor) {
    return '$' + Number(valor || 0).toLocaleString('es-CL');
  }

  function escapeHtml(texto) {
    return String(texto || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function mostrarError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'No se pudo completar la accion',
      text: mensaje || 'Intenta nuevamente.',
      confirmButtonText: 'Cerrar'
    });
  }

  function resetFormulario() {
    form.reset();
    inputId.value = '';
    inputAccion.value = 'crear';
    tituloFormulario.textContent = 'Ingresar propiedad';
    document.getElementById('fotos').required = false;
  }

  function renderTabla(propiedades) {
    totalPropiedades.textContent = propiedades.length;

    if (propiedades.length === 0) {
      tabla.innerHTML = '<tr><td colspan="8">No hay propiedades registradas.</td></tr>';
      return;
    }

    tabla.innerHTML = propiedades.map(function (propiedad) {
      const foto = propiedad.foto
        ? '<img class="table-photo" src="' + escapeHtml(propiedad.foto) + '" alt="Foto de propiedad">'
        : '<span class="badge">Sin foto</span>';

      return '<tr>' +
        '<td>' + foto + '</td>' +
        '<td>' + escapeHtml(propiedad.tipo) + '</td>' +
        '<td>' + escapeHtml(propiedad.descripcion).slice(0, 80) + '</td>' +
        '<td>' + escapeHtml(propiedad.banos) + '</td>' +
        '<td>' + escapeHtml(propiedad.dormitorios) + '</td>' +
        '<td>' + escapeHtml(propiedad.area_total) + ' m2</td>' +
        '<td>' + formatoCLP(propiedad.precio_clp) + '</td>' +
        '<td><div class="table-actions">' +
          '<button type="button" class="btn-outline" data-editar="' + propiedad.id + '">Editar</button>' +
          '<button type="button" data-eliminar="' + propiedad.id + '">Eliminar</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderPropietariosPendientes(propietarios) {
    const pendientes = propietarios.filter(function (propietario) {
      return propietario.estado === 'pendiente';
    }).length;

    totalPropietariosPendientes.textContent = pendientes;

    if (propietarios.length === 0) {
      tablaPropietarios.innerHTML = '<tr><td colspan="8">No hay propietarios registrados.</td></tr>';
      return;
    }

    tablaPropietarios.innerHTML = propietarios.map(function (propietario) {
      const botonActivar = propietario.estado === 'pendiente'
        ? '<button type="button" data-activar-propietario="' + propietario.id + '">Activar</button>'
        : '';

      return '<tr>' +
        '<td>' + escapeHtml(propietario.rut) + '</td>' +
        '<td>' + escapeHtml(propietario.nombre) + '</td>' +
        '<td>' + escapeHtml(propietario.correo) + '</td>' +
        '<td>' + escapeHtml(propietario.telefono) + '</td>' +
        '<td>' + escapeHtml(propietario.numero_propiedad) + '</td>' +
        '<td>' + escapeHtml(propietario.fecha_registro) + '</td>' +
        '<td><span class="badge">' + escapeHtml(propietario.estado) + '</span></td>' +
        '<td><div class="table-actions">' +
          botonActivar +
          '<button type="button" class="btn-outline" data-eliminar-propietario="' + propietario.id + '">Eliminar</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function cargarPropietariosPendientes() {
    fetch('propietarios_api.php?accion=listar')
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          return;
        }

        renderPropietariosPendientes(data.propietarios || []);
      })
      .catch(function () {
        mostrarError('No fue posible cargar los propietarios pendientes.');
      });
  }

  function cargarPropiedades() {
    fetch('propiedades_api.php?accion=listar')
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          return;
        }

        renderTabla(data.propiedades || []);
      })
      .catch(function () {
        mostrarError('No fue posible cargar las propiedades.');
      });
  }

  function setValor(idCampo, valor) {
    const campo = document.getElementById(idCampo);
    if (campo) campo.value = valor == null ? '' : valor;
  }

  function llenarFormulario(propiedad) {
    setValor('id', propiedad.id);
    setValor('tipo', propiedad.tipo);
    setValor('fecha-publicacion', propiedad.fecha_publicacion);
    setValor('provincia', propiedad.provincia);
    setValor('comuna', propiedad.comuna);
    setValor('sector', propiedad.sector);
    setValor('dormitorios', propiedad.dormitorios);
    setValor('banos', propiedad.banos);
    setValor('area-total', propiedad.area_total);
    setValor('area-construida', propiedad.area_construida);
    setValor('precio', propiedad.precio_clp);
    setValor('precioUF', propiedad.precio_uf);
    setValor('descripcion', propiedad.descripcion);
    setValor('visita', propiedad.visita);
    setValor('bodega', propiedad.bodega);
    setValor('estacionamiento', propiedad.estacionamiento);
    setValor('logia', propiedad.logia);
    setValor('cocina-amoblada', propiedad.cocina_amoblada);
    setValor('antejardin', propiedad.antejardin);
    setValor('patio-trasero', propiedad.patio_trasero);
    setValor('piscina', propiedad.piscina);

    inputAccion.value = 'actualizar';
    tituloFormulario.textContent = 'Modificar propiedad #' + propiedad.id;
    document.getElementById('fotos').required = false;
    document.getElementById('crud-propiedades').scrollIntoView({ behavior: 'smooth' });
  }

  function editarPropiedad(id) {
    fetch('propiedades_api.php?accion=obtener&id=' + encodeURIComponent(id))
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          return;
        }

        llenarFormulario(data.propiedad);
      })
      .catch(function () {
        mostrarError('No fue posible obtener la propiedad.');
      });
  }

  function eliminarPropiedad(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar propiedad',
      text: 'Esta accion eliminara la propiedad seleccionada.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(function (resultado) {
      if (!resultado.isConfirmed) return;

      const datos = new FormData();
      datos.append('accion', 'eliminar');
      datos.append('id', id);

      fetch('propiedades_api.php', {
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
            title: 'Propiedad eliminada',
            text: data.mensaje,
            timer: 1800,
            showConfirmButton: false
          });

          resetFormulario();
          cargarPropiedades();
        })
        .catch(function () {
          mostrarError('No fue posible eliminar la propiedad.');
        });
    });
  }

  function activarPropietario(id) {
    Swal.fire({
      icon: 'question',
      title: 'Activar propietario',
      text: 'La cuenta quedara activa y podra iniciar sesion.',
      showCancelButton: true,
      confirmButtonText: 'Activar',
      cancelButtonText: 'Cancelar'
    }).then(function (resultado) {
      if (!resultado.isConfirmed) return;

      const datos = new FormData();
      datos.append('accion', 'activar');
      datos.append('id_propietario', id);

      fetch('propietarios_api.php', {
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
            title: 'Propietario activado',
            text: data.mensaje,
            timer: 1800,
            showConfirmButton: false
          });

          cargarPropietariosPendientes();
        })
        .catch(function () {
          mostrarError('No fue posible activar al propietario.');
        });
    });
  }

  function eliminarPropietario(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar propietario',
      text: 'Esta accion eliminara la cuenta del propietario del registro.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(function (resultado) {
      if (!resultado.isConfirmed) return;

      const datos = new FormData();
      datos.append('accion', 'eliminar');
      datos.append('id_propietario', id);

      fetch('propietarios_api.php', {
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
            title: 'Propietario eliminado',
            text: data.mensaje,
            timer: 1800,
            showConfirmButton: false
          });

          cargarPropietariosPendientes();
        })
        .catch(function () {
          mostrarError('No fue posible eliminar al propietario.');
        });
    });
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const datos = new FormData(form);

    fetch('propiedades_api.php', {
      method: 'POST',
      body: datos
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          const errores = data.errores && data.errores.length
            ? data.errores.join('\n')
            : data.mensaje;
          mostrarError(errores);
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Datos guardados',
          text: data.mensaje,
          timer: 1800,
          showConfirmButton: false
        });

        resetFormulario();
        cargarPropiedades();
      })
      .catch(function () {
        mostrarError('No fue posible guardar la propiedad.');
      });
  });

  tabla.addEventListener('click', function (evento) {
    const botonEditar = evento.target.closest('[data-editar]');
    const botonEliminar = evento.target.closest('[data-eliminar]');

    if (botonEditar) {
      editarPropiedad(botonEditar.dataset.editar);
    }

    if (botonEliminar) {
      eliminarPropiedad(botonEliminar.dataset.eliminar);
    }
  });

  tablaPropietarios.addEventListener('click', function (evento) {
    const botonActivar = evento.target.closest('[data-activar-propietario]');
    const botonEliminar = evento.target.closest('[data-eliminar-propietario]');

    if (botonActivar) {
      activarPropietario(botonActivar.dataset.activarPropietario);
    }

    if (botonEliminar) {
      eliminarPropietario(botonEliminar.dataset.eliminarPropietario);
    }
  });

  btnLimpiar.addEventListener('click', resetFormulario);

  const parametros = new URLSearchParams(window.location.search);
  const idEditar = parametros.get('editar');

  cargarPropiedades();
  cargarPropietariosPendientes();

  if (idEditar) {
    editarPropiedad(idEditar);
  }
});
