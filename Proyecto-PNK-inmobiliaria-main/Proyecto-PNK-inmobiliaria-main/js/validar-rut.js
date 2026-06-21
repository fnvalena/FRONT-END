function validarRutChileno(rutCompleto) {
  if (typeof rutCompleto !== 'string') return false;

  const rut = rutCompleto.trim();

  // Formato valido
  const formatoValido = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/;
  if (!formatoValido.test(rut)) {
    return false;
  }

  // Separar cuerpo y digito 
  const partes = rut.split('-');
  const dv = partes[1].toLowerCase();
  const cuerpo = partes[0].replace(/\./g, '');

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = (multiplo === 7) ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;

  if (resto === 11) {
    dvEsperado = '0';
  } else if (resto === 10) {
    dvEsperado = 'k';
  } else {
    dvEsperado = resto.toString();
  }

  return dv === dvEsperado;
}