// variables del programa para el funcionamiento de proporcion
var mts2 = 12 // metros en px
var width=2217 // tamaño del canvas
var height=1598 // tamaño del canvas
var zoomProporcion // delta de cambio del canvas
var zoom_width // tamaño del canvas sin zoom
var zoom_height // tamaño del canvas sin zoom
var btn_deshacer = false // boton que se activa si hay para deshacer
var zoom = false // comienza con la vista en miniatura

/* Variables de fecha actual para hacer la consulta incial */
var hoy = new Date() // la fecha actual para la consulta
var dd = hoy.getDate() // dia
var mm = hoy.getMonth() + 1 // hoy es 0!
var yyyy = hoy.getFullYear() // año
var hour = hoy.getHours() // hora
var min = 0 // minutos y segundos en ceros
var seg = 0
var mesText = mesNumtext(mm)
var mesActual = mesText

zoomProporcion = $('#container-canvas').width() / width // determina el factor de cambio tamaños
zoom_width = Math.round(width * zoomProporcion) // haya el ancho sin zoom
zoom_height = Math.round(height * zoomProporcion) // haya el alto sin zoom
$('#img-park').attr('width', zoom_width) // tamaño sin zoom
$('#canvas1').attr('width', zoom_width) // tamaño sin zoom
$('#canvas1').attr('height', zoom_height) // tamaño sin zoom
view.size.set(zoom_width, zoom_height) // tamaño sin zoom del canvas en paper
// array de coordenadas dentro de la bodega
var limite = Array(
  [217, 349],
  [199, 265],
  [215, 225],
  [404, 93],
  [711, 115],
  [692, 373],
  [1984, 482],
  [2121, 746],
  [2078, 763],
  [2120, 874],
  [2051, 957],
  [1681, 959],
  [1679, 1473],
  [1341, 1475],
  [1339, 1019],
  [258, 1019],
  [217, 956],
  [78, 956],
  [81, 691],
  [439, 694],
  [440, 589],
  [81, 586],
  [81, 371],
  [217, 349]
)

var CPathCuadricula = new CompoundPath()
var pathPerimetro = new Path() // path del perimetro
perimetro() // llamada a la funcion que pinta el perimetro
function perimetro () {
  pathPerimetro.removeSegments()
  pathPerimetro.strokeColor = 'red'
  var proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
  pathPerimetro.moveTo(limite[0][0] * proporcion, limite[0][1] * proporcion)
  // pinta las lineas al rededor del mapa
  for (var j = 0; j < limite.length - 1; j++) {
    pathPerimetro.lineTo(limite[j][0] * proporcion, limite[j][1] * proporcion)
  }
  pathPerimetro.closed = true
}

var CPathCuadricula = new CompoundPath() // cuadricula del mapa en un solo conjunto
creaCuadricula() // llamada inicial a la cuadricula del mapa
function creaCuadricula () {
  CPathCuadricula.removeChildren() // remueve la cuadricula para ser pintada nuevamente
  CPathCuadricula.strokeColor = 'black' // color de la cuadricula
  CPathCuadricula.strokeWidth = 0.5 // ancho de la cuadricula
  CPathCuadricula.opacity = 0.2 // opacidad de la cuadricula para que sea discreta
  for (var i = mts2; i <= view.size.height; i = i + mts2) { // ancho
    CPathCuadricula.addChild(new Path([0, i], [view.size.width, i]))
  }
  for (var i = mts2; i <= view.size.width; i = i + mts2) { // alto
    CPathCuadricula.addChild(new Path([i, 0], [i, view.size.height]))
  }
}
// }

// function de zoom para cambiar el tamaño del mapa
$('#zoom').click(function () {
  zoomDo()
})

function zoomDo () {
  if (zoom) {
    zoom = false
    $('#calendar').removeAttr('hidden', 'hidden')
    $('#zoom-in').removeAttr('hidden')
    $('#zoom-out').attr('hidden', 'hidden');
    $('#container-canvas').removeClass('width-100')
    $('#container-canvas').addClass('width-70')
    $('#img-park').attr('width', zoom_width)
    $('#canvas1').attr('width', zoom_width)
    $('#canvas1').attr('height', zoom_height)
    view.size.set(zoom_width, zoom_height)
    creaCuadricula()
    perimetro()
  } else {
    zoom = true
    $('#calendar').attr('hidden', 'hidden')
    $('#zoom-in').attr('hidden', 'hidden')
    $('#zoom-out').removeAttr('hidden')
    $('#img-park').removeAttr('width')
    $('#container-canvas').removeClass('width-70')
    $('#container-canvas').addClass('width-100')
    $('#canvas1').attr('width', width)
    $('#canvas1').attr('height', height)
    view.size.set(width, height) // cambio de tamaño del canvas en paper
    creaCuadricula()
    perimetro()
  }
}

/*
mesNumtext convierte el numero del mes en texto
*/
function mesNumtext (num) {
  var mesText = ''
  switch (num) {
    case 1:
      mesText = 'Enero'
      break

    case 2:
      mesText = 'Febrero'
      break

    case 3:
      mesText = 'Marzo'
      break

    case 4:
      mesText = 'Abril'
      break

    case 5:
      mesText = 'Mayo'
      break

    case 6:
      mesText = 'Junio'
      break

    case 7:
      mesText = 'Julio'
      break

    case 8:
      mesText = 'Agosto'
      break

    case 9:
      mesText = 'Septiembre'
      break

    case 10:
      mesText = 'Octubre'
      break

    case 11:
      mesText = 'Noviembre'
      break

    case 12:
      mesText = 'Diciembre'
      break

    default:
      mesText = 'mes ' + num
  }
  return mesText
}
// //////////////////////////// FUNCIONES AJAX
