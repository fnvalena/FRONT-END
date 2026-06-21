document.addEventListener('DOMContentLoaded', function () {
  const galeria = document.querySelector('.gallery-photos');

  if (!galeria) return;

  const imagenes = Array.from(galeria.querySelectorAll('img'));

  if (imagenes.length === 0) return;

  let indiceActual = 0;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML =
    '<div class="gallery-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Galeria de imagenes">' +
      '<button type="button" class="gallery-lightbox__close" aria-label="Cerrar galeria">&times;</button>' +
      '<button type="button" class="gallery-lightbox__nav gallery-lightbox__prev" aria-label="Imagen anterior">&lsaquo;</button>' +
      '<img class="gallery-lightbox__image" src="" alt="">' +
      '<button type="button" class="gallery-lightbox__nav gallery-lightbox__next" aria-label="Imagen siguiente">&rsaquo;</button>' +
      '<p class="gallery-lightbox__caption"></p>' +
    '</div>';

  document.body.appendChild(lightbox);

  const imagenGrande = lightbox.querySelector('.gallery-lightbox__image');
  const textoImagen = lightbox.querySelector('.gallery-lightbox__caption');
  const btnCerrar = lightbox.querySelector('.gallery-lightbox__close');
  const btnAnterior = lightbox.querySelector('.gallery-lightbox__prev');
  const btnSiguiente = lightbox.querySelector('.gallery-lightbox__next');

  function mostrarImagen(indice) {
    indiceActual = (indice + imagenes.length) % imagenes.length;
    const imagen = imagenes[indiceActual];

    imagenGrande.src = imagen.src;
    imagenGrande.alt = imagen.alt || 'Imagen de propiedad';
    textoImagen.textContent = (imagen.alt || 'Imagen de propiedad') + ' (' + (indiceActual + 1) + ' de ' + imagenes.length + ')';
  }

  function abrirGaleria(indice) {
    mostrarImagen(indice);
    lightbox.hidden = false;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    btnCerrar.focus();
  }

  function cerrarGaleria() {
    lightbox.classList.remove('is-open');
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  imagenes.forEach(function (imagen, indice) {
    imagen.classList.add('gallery-clickable');
    imagen.setAttribute('tabindex', '0');
    imagen.setAttribute('role', 'button');
    imagen.setAttribute('aria-label', 'Abrir imagen ' + (indice + 1) + ' de la galeria');

    imagen.addEventListener('click', function () {
      abrirGaleria(indice);
    });

    imagen.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        abrirGaleria(indice);
      }
    });
  });

  btnCerrar.addEventListener('click', cerrarGaleria);
  btnAnterior.addEventListener('click', function () { mostrarImagen(indiceActual - 1); });
  btnSiguiente.addEventListener('click', function () { mostrarImagen(indiceActual + 1); });

  lightbox.addEventListener('click', function (evento) {
    if (evento.target === lightbox) {
      cerrarGaleria();
    }
  });

  document.addEventListener('keydown', function (evento) {
    if (!lightbox.classList.contains('is-open')) return;

    if (evento.key === 'Escape') {
      cerrarGaleria();
    }

    if (evento.key === 'ArrowLeft') {
      mostrarImagen(indiceActual - 1);
    }

    if (evento.key === 'ArrowRight') {
      mostrarImagen(indiceActual + 1);
    }
  });
});
