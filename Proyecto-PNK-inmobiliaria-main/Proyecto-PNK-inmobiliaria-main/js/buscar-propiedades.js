document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formBusquedaAjax');
  const contenedor = document.getElementById('resultados-ajax');

  function escapeHtml(texto) {
    return String(texto || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatoCLP(valor) {
    return '$' + Number(valor || 0).toLocaleString('es-CL');
  }

  function renderResultados(propiedades) {
    if (!propiedades.length) {
      contenedor.innerHTML = '<article class="content-card"><span class="badge">Sin resultados</span><h3>No se encontraron propiedades</h3><p>Prueba cambiando provincia, comuna o sector.</p></article>';
      return;
    }

    contenedor.innerHTML = propiedades.map(function (propiedad) {
      const foto = propiedad.foto
        ? '<img src="' + escapeHtml(propiedad.foto) + '" alt="Foto de propiedad">'
        : '';
      const titulo = propiedad.tipo + ' en ' + propiedad.comuna + ', ' + propiedad.sector;
      const urlVisita = 'solicitar_visita.php?id=' + encodeURIComponent(propiedad.id) +
        '&codigo=ID%20' + encodeURIComponent(propiedad.id) +
        '&titulo=' + encodeURIComponent(titulo);

      return '<article class="property-card">' +
        foto +
        '<div class="property-body">' +
          '<span class="badge">ID ' + escapeHtml(propiedad.id) + '</span>' +
          '<h3>' + escapeHtml(propiedad.tipo) + ' en ' + escapeHtml(propiedad.comuna) + '</h3>' +
          '<p>' + escapeHtml(propiedad.sector) + ', ' + escapeHtml(propiedad.provincia) + '</p>' +
          '<p class="price">' + formatoCLP(propiedad.precio_clp) + '</p>' +
          '<ul class="meta-list">' +
            '<li>UF ' + escapeHtml(propiedad.precio_uf) + '</li>' +
            '<li>' + escapeHtml(propiedad.dormitorios) + ' dormitorios</li>' +
            '<li>' + escapeHtml(propiedad.banos) + ' banos</li>' +
            '<li>' + escapeHtml(propiedad.area_total) + ' m2 totales</li>' +
          '</ul>' +
          '<p>' + escapeHtml(propiedad.descripcion).slice(0, 120) + '</p>' +
          '<div class="hero-actions">' +
            '<a class="btn" href="' + urlVisita + '">Solicitar visita</a>' +
            '<a class="btn btn-outline" href="administracion.php?editar=' + encodeURIComponent(propiedad.id) + '#crud-propiedades">Editar en CRUD</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    contenedor.innerHTML = '<article class="content-card"><span class="badge">Buscando</span><h3>Cargando resultados...</h3><p>Consultando propiedades registradas.</p></article>';

    const parametros = new URLSearchParams(new FormData(form));

    fetch(form.action + '?' + parametros.toString())
      .then(function (respuesta) { return respuesta.json(); })
      .then(function (data) {
        if (!data.ok) {
          renderResultados([]);
          return;
        }

        renderResultados(data.propiedades || []);
      })
      .catch(function () {
        contenedor.innerHTML = '<article class="content-card"><span class="badge">Error</span><h3>No fue posible buscar</h3><p>Revisa la conexion con el servidor.</p></article>';
      });
  });
});
