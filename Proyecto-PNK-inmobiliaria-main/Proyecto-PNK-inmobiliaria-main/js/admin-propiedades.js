document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formCrudPropiedad');
  const tabla = document.getElementById('tabla-propiedades');
  const tablaPropietarios = document.getElementById('tabla-propietarios-pendientes');
  const tablaGestores = document.getElementById('tabla-gestores');
  const tablaSolicitudes = document.getElementById('tabla-solicitudes-visita');
  const totalPropiedades = document.getElementById('total-propiedades');
  const totalPropietariosPendientes = document.getElementById('total-propietarios-pendientes');
  const totalGestoresPendientes = document.getElementById('total-gestores-pendientes');
  const tituloFormulario = document.getElementById('titulo-formulario');
  const inputAccion = document.getElementById('accion');
  const inputId = document.getElementById('id');
  const btnLimpiar = document.getElementById('btn-limpiar');
  let gestoresAprobados = [];

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

  function opcionesGestores(idSeleccionado) {
    const seleccionado = String(idSeleccionado || '');
    let opciones = '<option value="">Sin gestor</option>';

    opciones += gestoresAprobados.map(function (gestor) {
      return '<option value="' + gestor.id + '"' + (String(gestor.id) === seleccionado ? ' selected' : '') + '>' +
        escapeHtml(gestor.nombre) +
      '</option>';
    }).join('');

    return opciones;
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
      tabla.innerHTML = '<tr><td colspan="9">No hay propiedades registradas.</td></tr>';
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
        '<td>' +
          '<select data-asignar-propiedad="' + propiedad.id + '">' +
            opcionesGestores(propiedad.id_gestor) +
          '</select>' +
          '<small class="form-note">' + escapeHtml(propiedad.estado_gestion || 'sin_asignar') + '</small>' +
        '</td>' +
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

  function renderGestores(gestores) {
    if (!tablaGestores) return;

    const pendientes = gestores.filter(function (gestor) {
      return gestor.estado === 'pendiente';
    }).length;

    if (totalGestoresPendientes) {
      totalGestoresPendientes.textContent = pendientes;
    }

    if (gestores.length === 0) {
      tablaGestores.innerHTML = '<tr><td colspan="8">No hay gestores registrados.</td></tr>';
      return;
    }

    tablaGestores.innerHTML = gestores.map(function (gestor) {
      const botonAprobar = gestor.estado === 'pendiente'
        ? '<button type="button" data-estado-gestor="' + gestor.id + '" data-estado="aprobado">Aprobar</button>'
        : '';
      const botonRechazar = gestor.estado === 'pendiente'
        ? '<button type="button" class="btn-outline" data-estado-gestor="' + gestor.id + '" data-estado="rechazado">Rechazar</button>'
        : '';
      const certificado = gestor.certificado_pdf
        ? '<a class="btn btn-outline" href="' + escapeHtml(gestor.certificado_pdf) + '" target="_blank" rel="noopener">Ver PDF</a>'
        : '<span class="badge">Sin PDF</span>';

      return '<tr>' +
        '<td>' + escapeHtml(gestor.rut) + '</td>' +
        '<td>' + escapeHtml(gestor.nombre) + '</td>' +
        '<td>' + escapeHtml(gestor.correo) + '</td>' +
        '<td>' + escapeHtml(gestor.telefono) + '</td>' +
        '<td>' + certificado + '</td>' +
        '<td>' + escapeHtml(gestor.fecha_postulacion) + '</td>' +
        '<td><span class="badge">' + escapeHtml(gestor.estado) + '</span></td>' +
        '<td><div class="table-actions">' +
          botonAprobar +
          botonRechazar +
          '<button type="button" class="btn-outline" data-eliminar-gestor="' + gestor.id + '">Eliminar</button>' +
        '</div></td>' +
      '</tr>';
    }).join('');
  }

  function renderSolicitudesVisita(solicitudes) {
    if (!tablaSolicitudes) return;

    if (solicitudes.length === 0) {
      tablaSolicitudes.innerHTML = '<tr><td colspan="8">No hay solicitudes de visita registradas.</td></tr>';
      return;
    }

    tablaSolicitudes.innerHTML = solicitudes.map(function (solicitud) {
      const codigo = solicitud.codigo_propiedad
        ? '<span class="badge">' + escapeHtml(solicitud.codigo_propiedad) + '</span> '
        : '';

      return '<tr>' +
        '<td>' + codigo + escapeHtml(solicitud.titulo_propiedad) + '</td>' +
        '<td>' + escapeHtml(solicitud.nombre_interesado) + '</td>' +
        '<td>' + escapeHtml(solicitud.correo_interesado) + '<br>' + escapeHtml(solicitud.telefono_interesado) + '</td>' +
        '<td>' + escapeHtml(solicitud.mensaje || 'Sin mensaje').slice(0, 90) + '</td>' +
        '<td>' + escapeHtml(solicitud.fecha_solicitud) + '</td>' +
        '<td>' +
          '<select data-asignar-solicitud="' + solicitud.id + '">' +
            opcionesGestores(solicitud.id_gestor) +
          '</select>' +
          '<small class="form-note">' + escapeHtml(solicitud.gestor_nombre || 'No derivada') + '</small>' +
        '</td>' +
        '<td><select data-estado-solicitud="' + solicitud.id + '">' +
          '<option value="pendiente"' + (solicitud.estado === 'pendiente' ? ' selected' : '') + '>Pendiente</option>' +
          '<option value="asignada"' + (solicitud.estado === 'asignada' ? ' selected' : '') + '>Asignada</option>' +
          '<option value="contactado"' + (solicitud.estado === 'contactado' ? ' selected' : '') + '>Contactado</option>' +
          '<option value="coordinada"' + (solicitud.estado === 'coordinada' ? ' selected' : '') + '>Coordinada</option>' +
          '<option value="cerrada"' + (solicitud.estado === 'cerrada' ? ' selected' : '') + '>Cerrada</option>' +
          '<option value="rechazada"' + (solicitud.estado === 'rechazada' ? ' selected' : '') + '>Rechazada</option>' +
        '</select></td>' +
        '<td><div class="table-actions">' +
          '<button type="button" class="btn-outline" data-eliminar-solicitud="' + solicitud.id + '">Eliminar</button>' +
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

  function cargarGestores() {
    if (!tablaGestores) return;

    fetch('gestores_api.php?accion=listar')
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          return;
        }

        gestoresAprobados = (data.gestores || []).filter(function (gestor) {
          return gestor.estado === 'aprobado';
        });
        renderGestores(data.gestores || []);
        cargarPropiedades();
        cargarSolicitudesVisita();
      })
      .catch(function () {
        mostrarError('No fue posible cargar los gestores registrados.');
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

  function cargarSolicitudesVisita() {
    if (!tablaSolicitudes) return;

    fetch('solicitudes_visita_api.php?accion=listar')
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          return;
        }

        renderSolicitudesVisita(data.solicitudes || []);
      })
      .catch(function () {
        mostrarError('No fue posible cargar las solicitudes de visita.');
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

  function asignarGestorPropiedad(idPropiedad, idGestor) {
    const datos = new FormData();
    datos.append('accion', 'asignar_gestor');
    datos.append('id', idPropiedad);
    datos.append('id_gestor', idGestor || '');

    fetch('propiedades_api.php', {
      method: 'POST',
      body: datos
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          cargarPropiedades();
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Gestor asignado',
          text: data.mensaje,
          timer: 1400,
          showConfirmButton: false
        });

        cargarPropiedades();
      })
      .catch(function () {
        mostrarError('No fue posible asignar el gestor.');
        cargarPropiedades();
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

  function actualizarEstadoGestor(id, estado) {
    const accion = estado === 'aprobado' ? 'Aprobar gestor' : 'Rechazar gestor';
    const texto = estado === 'aprobado'
      ? 'El gestor podra iniciar sesion cuando su cuenta quede aprobada.'
      : 'La postulacion quedara marcada como rechazada.';

    Swal.fire({
      icon: 'question',
      title: accion,
      text: texto,
      showCancelButton: true,
      confirmButtonText: accion.replace(' gestor', ''),
      cancelButtonText: 'Cancelar'
    }).then(function (resultado) {
      if (!resultado.isConfirmed) return;

      const datos = new FormData();
      datos.append('accion', 'actualizar_estado');
      datos.append('id_gestor', id);
      datos.append('estado', estado);

      fetch('gestores_api.php', {
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
            title: 'Gestor actualizado',
            text: data.mensaje,
            timer: 1800,
            showConfirmButton: false
          });

          cargarGestores();
        })
        .catch(function () {
          mostrarError('No fue posible actualizar al gestor.');
        });
    });
  }

  function eliminarGestor(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar gestor',
      text: 'Esta accion eliminara la postulacion del gestor.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(function (resultado) {
      if (!resultado.isConfirmed) return;

      const datos = new FormData();
      datos.append('accion', 'eliminar');
      datos.append('id_gestor', id);

      fetch('gestores_api.php', {
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
            title: 'Gestor eliminado',
            text: data.mensaje,
            timer: 1800,
            showConfirmButton: false
          });

          cargarGestores();
        })
        .catch(function () {
          mostrarError('No fue posible eliminar al gestor.');
        });
    });
  }

  function actualizarEstadoSolicitud(id, estado) {
    const datos = new FormData();
    datos.append('accion', 'actualizar_estado');
    datos.append('id', id);
    datos.append('estado', estado);

    fetch('solicitudes_visita_api.php', {
      method: 'POST',
      body: datos
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          cargarSolicitudesVisita();
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
        cargarSolicitudesVisita();
      });
  }

  function asignarGestorSolicitud(idSolicitud, idGestor) {
    const datos = new FormData();
    datos.append('accion', 'asignar_gestor');
    datos.append('id', idSolicitud);
    datos.append('id_gestor', idGestor || '');

    fetch('solicitudes_visita_api.php', {
      method: 'POST',
      body: datos
    })
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          mostrarError(data.mensaje);
          cargarSolicitudesVisita();
          return;
        }

        Swal.fire({
          icon: 'success',
          title: 'Solicitud derivada',
          text: data.mensaje,
          timer: 1400,
          showConfirmButton: false
        });

        cargarSolicitudesVisita();
      })
      .catch(function () {
        mostrarError('No fue posible derivar la solicitud.');
        cargarSolicitudesVisita();
      });
  }

  function eliminarSolicitud(id) {
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar solicitud',
      text: 'Esta accion eliminara la solicitud de visita del registro.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(function (resultado) {
      if (!resultado.isConfirmed) return;

      const datos = new FormData();
      datos.append('accion', 'eliminar');
      datos.append('id', id);

      fetch('solicitudes_visita_api.php', {
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
            title: 'Solicitud eliminada',
            text: data.mensaje,
            timer: 1400,
            showConfirmButton: false
          });

          cargarSolicitudesVisita();
        })
        .catch(function () {
          mostrarError('No fue posible eliminar la solicitud.');
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

  tabla.addEventListener('change', function (evento) {
    const selectorGestor = evento.target.closest('[data-asignar-propiedad]');

    if (selectorGestor) {
      asignarGestorPropiedad(selectorGestor.dataset.asignarPropiedad, selectorGestor.value);
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

  if (tablaGestores) {
    tablaGestores.addEventListener('click', function (evento) {
      const botonEstado = evento.target.closest('[data-estado-gestor]');
      const botonEliminar = evento.target.closest('[data-eliminar-gestor]');

      if (botonEstado) {
        actualizarEstadoGestor(botonEstado.dataset.estadoGestor, botonEstado.dataset.estado);
      }

      if (botonEliminar) {
        eliminarGestor(botonEliminar.dataset.eliminarGestor);
      }
    });
  }

  if (tablaSolicitudes) {
    tablaSolicitudes.addEventListener('change', function (evento) {
      const selector = evento.target.closest('[data-estado-solicitud]');

      if (selector) {
        actualizarEstadoSolicitud(selector.dataset.estadoSolicitud, selector.value);
      }

      const selectorGestor = evento.target.closest('[data-asignar-solicitud]');

      if (selectorGestor) {
        asignarGestorSolicitud(selectorGestor.dataset.asignarSolicitud, selectorGestor.value);
      }
    });

    tablaSolicitudes.addEventListener('click', function (evento) {
      const botonEliminar = evento.target.closest('[data-eliminar-solicitud]');

      if (botonEliminar) {
        eliminarSolicitud(botonEliminar.dataset.eliminarSolicitud);
      }
    });
  }

  btnLimpiar.addEventListener('click', resetFormulario);

  const parametros = new URLSearchParams(window.location.search);
  const idEditar = parametros.get('editar');

  cargarPropietariosPendientes();
  cargarGestores();

  if (idEditar) {
    editarPropiedad(idEditar);
  }
});
