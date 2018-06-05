// variables del programa para el funcionamiento de proporcion
var mts2 = 12 // metros en px
var width=2217 // tamaño del canvas
var height=1598 // tamaño del canvas
var zoomProporcion // delta de cambio del canvas
var zoomWidth // tamaño del canvas sin zoom
var zoomHeight // tamaño del canvas sin zoom
var cantDeshacer = 0 // contador de elementos  deshacer inicializa
var zoom = false // comienza con la vista en miniatura
var arrayElementosConsulta = [] // array que va almacenar los elementos de la DB
var arrayElementosConsultaTemp = [] // array usado para comparar fechas y espacios
var arrayConsultaNombres = [] // array usado para guardar las coincidencias de nombres
var proporcion = 1// proporción cuando el zoom esta activado
var cuadriculaID = 0
var perimetroName; // nombre del perimetro
var tipoActualizacion = 0
var nuevoElemento = false
var coordenadaNuevoElemento = {x: 0, y: 0}

// botones que inician en false para que primero elijan el elemento a mover
var btnActivo = false
var btnMover = false // boton mover
var btnActualizarDatos = false // boton actualizar datos
var btnEliminar = false // boton eliminar
var btnDeshacer = false // boton que se activa si hay para deshacer
var btnRotar = false // boton que se activa si hay para deshacer

// variables de pintar en el plano
var CPathCuadricula = new CompoundPath() // cuadricula del mapa en un solo conjunto
var pathPerimetro = new Path() // path del perimetro
var pathTempNuevo = new Path()
var seleccionado = -1

/* Variables de fecha actual para hacer la consulta incial */
var hoy = new Date() // la fecha actual para la consulta
var dd = hoy.getDate() // dia
var mm = hoy.getMonth() + 1 // hoy es 0!
var yyyy = hoy.getFullYear() // año
var dias = new Array ('Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado');
console.log(hoy.getHours())
$('#horaActual').val(hoy.getHours() + ':00')
// var hour = hoy.getHours() // hora
// var min = 0 // minutos y segundos en ceros
// var seg = 0
//voy aquí debo terminar lo de la hora que cambie y me lo pinte
var mesText = mesNumtext(mm)
var mesActual = mesText
var fechaSeleccionada = hoy
fechaSeleccionada.setMinutes(0)
fechaSeleccionada.setSeconds(0)
fechaSeleccionada.setMilliseconds(0)
consultarBaseDatos(yyyy + '-' + mm + '-' + dd)

zoomProporcion = $('#container-canvas').width() / width // determina el factor de cambio tamaños
zoomWidth = Math.round(width * zoomProporcion) // haya el ancho sin zoom
zoomHeight = Math.round(height * zoomProporcion) // haya el alto sin zoom
$('#img-park').attr('width', zoomWidth) // tamaño sin zoom
$('#canvas1').attr('width', zoomWidth) // tamaño sin zoom
$('#canvas1').attr('height', zoomHeight) // tamaño sin zoom
view.size.set(zoomWidth, zoomHeight) // tamaño sin zoom del canvas en paper

//variables de colores según categoria
var colorCategoria = {
  SAILING_YACHT:"rgb(180, 0, 0)", //RED
  MOTOR_YACHT:"rgb(20, 170, 20)", //GREEN
  CAT:"rgb(0, 0, 170)",//BLUE
  PESCA:"rgb(190, 190, 0)",//YELLOW
  ELEMENTO:"rgb(180, 0, 170)",//PURPLE
  TENDER:"rgb(215,49,31)"//TOMATO
};

// array de coordenadas dentro de la bodega
var limite = Array(
  [217, 349],
  [199, 265],
  [215, 225],
  [404, 93],
  [711, 115],
  [692, 373],
  [743, 378],
  [743, 349],
  [743,180],
  [948,180],
  [948,180],
  [948,277],
  [872,277],
  [872,349],
  [743,349],
  [743, 378],
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


// ////////////////////////////// FUNCIONES DE PINTAR EN CANVAS
perimetro() // llamada a la funcion que pinta el perimetro
function perimetro () { // funcion que pinta el permietro y lo actualiza
  pathPerimetro.removeSegments()
  pathPerimetro.strokeColor = 'red'
  pathPerimetro.opacity = 0

  proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
  pathPerimetro.moveTo(limite[0][0] * proporcion, limite[0][1] * proporcion)
  // pinta las lineas al rededor del mapa
  for (var j = 0; j < limite.length - 1; j++) {
    pathPerimetro.lineTo(limite[j][0] * proporcion, limite[j][1] * proporcion)
  }
  pathPerimetro.closed = true
  perimetroName = pathPerimetro.Name
}

creaCuadricula() // llamada inicial a la cuadricula del mapa

function creaCuadricula () { // funcion que pinta la cuadricula
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
  cuadriculaID = CPathCuadricula.id
}

// //////////////////////////// FUNCIONES PINTAR ELEMENTOS

// funcion que pinta los elementos contenidos en arrayElementosConsulta

function organizaFecha (cadenaFecha) {
  var y4 = parseInt(cadenaFecha.slice(0, 4))
  var m2 = parseInt(cadenaFecha.slice(5, 7)) - 1
  var d2 = parseInt(cadenaFecha.slice(8, 10)) + 1
  var h2 = parseInt(cadenaFecha.slice(11, 13))
  //var respuesta = new Date(y4, m2, d2, 23, 59, 59, 0)
  var respuesta = new Date(y4, m2, d2, h2, 0, 0, 0)
  respuesta.setDate(respuesta.getDate() -1)
  return respuesta
}
function pintaElementos () {
  project.activeLayer.removeChildren(2)
  proporcion = (zoom) ? 1 : zoomProporcion
  var fechaInicialArray = new Date()
  var fechaFinalArray = new Date()
  var rotateElement = 0
  for (var i = 0; i < arrayElementosConsulta.length; i++) {
    var rotacion = 0
    var fontSize = 14
    arrayElementosConsulta[i].coordenada_x = parseInt(arrayElementosConsulta[i].coordenada_x)
    arrayElementosConsulta[i].coordenada_y = parseInt(arrayElementosConsulta[i].coordenada_y)
    fechaInicialArray = organizaFecha(arrayElementosConsulta[i].fecha_incial)
    fechaFinalArray = organizaFecha(arrayElementosConsulta[i].fecha_final)
    if (fechaInicialArray <= fechaSeleccionada && fechaFinalArray > fechaSeleccionada) {
      fontSize = arrayElementosConsulta[i].ancho_x * proporcion * mts2 / 20
      rotateElement = arrayElementosConsulta[i].angulo
      if(parseInt(arrayElementosConsulta[i].ancho_x) < parseInt(arrayElementosConsulta[i].largo_y)) {
        rotacion = 90
        fontSize = arrayElementosConsulta[i].largo_y * proporcion * mts2 / 5
      }
      var pathTemp = new Path.Rectangle({
        point: [
          parseInt(arrayElementosConsulta[i].coordenada_x * proporcion ),
          parseInt(arrayElementosConsulta[i].coordenada_y * proporcion )
        ],
        size: [
          parseInt(arrayElementosConsulta[i].ancho_x * proporcion * mts2),
          parseInt(arrayElementosConsulta[i].largo_y * proporcion * mts2)
        ],
        fillColor: colorCategoria[arrayElementosConsulta[i].categoria],
        strokeWidth: 0,
        name: '"' + i + '"',
        rotation: rotateElement,
        data: {
          seleccionado: false,
          id:arrayElementosConsulta[i]
        }
      })
      var pathSubTemp = new Path.Rectangle({
        point: [
          (parseInt(arrayElementosConsulta[i].coordenada_x  * proporcion ) + 15 * proporcion),
          (parseInt(arrayElementosConsulta[i].coordenada_y * proporcion ) + 15 * proporcion)
        ],
        size: [
          (parseInt(arrayElementosConsulta[i].ancho_x * proporcion * mts2) - 30 * proporcion),
          (parseInt(arrayElementosConsulta[i].largo_y * proporcion * mts2) - 30 * proporcion)
        ],
        visible: false,
        name: 'subpath' + i + '"',
        rotation: rotateElement
      });
      var textTemp = new PointText({
        point: [
          parseInt(arrayElementosConsulta[i].coordenada_x * proporcion ),
          parseInt(arrayElementosConsulta[i].coordenada_y * proporcion )
        ],
        content: arrayElementosConsulta[i].cliente,
        fillColor: 'white',
        fontFamily: 'Courier New',
        fontWeight: 'bold',
        name: 'text' + i + '"',
        fontSize: fontSize,
        rotation: rotateElement
      })
      textTemp.rotate(rotacion, pathTemp.point);
      textTemp.fitBounds(pathSubTemp.bounds)
      if (i == nameSeleccionado) {
        var posXActual = pathTemp.position.x
        var posYActual = pathTemp.position.y
        pathTemp.shadowOffset = new Point(3, 3)
        pathTemp.shadowColor = 'black'
        pathTemp.shadowBlur = 5
      }
    }
  }
}

var idNuevo
function pintaElementosTime  (fecha1, fecha2) {
  arrayConsultaNombres = []
  var rotateElement
  var fechaInicialElemento = new Date()
  var fechaFinalElemento = new Date()
  var fechaInicialArrayRango = new Date()
  fechaInicialArrayRango.setTime(Date.parse(fecha1))
  var fechaFinalArrayRango = new Date()
  fechaFinalArrayRango.setTime(Date.parse(fecha2))
  proporcion = (zoom) ? 1 : zoomProporcion
  for (var i = 0; i < arrayElementosConsultaTemp.length; i++) {
    rotateElement = arrayElementosConsultaTemp[i].angulo
    fechaInicialElemento.setTime(Date.parse(arrayElementosConsultaTemp[i].fecha_incial))
    fechaFinalElemento.setTime(Date.parse(arrayElementosConsultaTemp[i].fecha_final))
    if (
      (fechaInicialElemento < fechaInicialArrayRango && fechaFinalElemento > fechaInicialArrayRango) ||
      (fechaFinalElemento > fechaInicialArrayRango && fechaFinalElemento <= fechaFinalArrayRango) ||
      (fechaInicialElemento >= fechaInicialArrayRango && fechaInicialElemento < fechaFinalArrayRango)
    ) {
      var pathTemp = new Path.Rectangle({
        point: [
          parseInt(arrayElementosConsultaTemp[i].coordenada_x * proporcion),
          parseInt(arrayElementosConsultaTemp[i].coordenada_y * proporcion)
        ],
        size: [
          parseInt(arrayElementosConsultaTemp[i].ancho_x * proporcion * mts2),
          parseInt(arrayElementosConsultaTemp[i].largo_y * proporcion * mts2)
        ],
        fillColor: '#DEDEDE',
        strokeColor: '#DEDEDE',
        strokeWidth: 1,
        name: 'temp' + i,
        opacity: 1,
        rotation: rotateElement,
        data: {
          fechaIni: dias[fechaInicialElemento.getDay()] + ' ' + fechaInicialElemento.getDate() + ' de ' + mesNumtext(fechaInicialElemento.getMonth() + 1) + ', del ' + fechaInicialElemento.getFullYear(),
          fechaFin: dias[fechaFinalElemento.getDay()] + ' ' + fechaFinalElemento.getDate() + ' de ' + mesNumtext(fechaFinalElemento.getMonth() + 1) + ', del ' + fechaFinalElemento.getFullYear(),
          id: arrayElementosConsultaTemp[i].id
        }
      })
      idNuevo = pathTemp.name
      arrayConsultaNombres.push(pathTemp.name)
    }
  }
}

// function de zoom para cambiar el tamaño del mapa
$('#zoom').click(function () {
  zoomDo()
})

function zoomDo () {
  if (zoom) {
    zoom = false
    $('#calendar').removeAttr('hidden', 'hidden')
    $('#zoom-in').removeAttr('hidden')
    $('#zoom-out').attr('hidden', 'hidden')
    $('#container-canvas').removeClass('width-100')
    $('#container-canvas').addClass('width-70')
    $('#img-park').attr('width', zoomWidth)
    $('#canvas1').attr('width', zoomWidth)
    $('#canvas1').attr('height', zoomHeight)
    view.size.set(zoomWidth, zoomHeight)
    creaCuadricula()
    perimetro()
    pintaElementos()
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
    pintaElementos ()
  }
}

function desactivarBtn () {

}

// Funcion que activa y de descativa botones

function accionesBtn () {
  if (btnActivo) {
    btnActivo = false // bandera para saber si esta seleccionado un elemento
    btnMover = false // boton mover
    btnActualizarDatos = false // boton actualizar datos
    btnRotar = false // boton rotar
    btnEliminar = true // boton eliminar
    $("#rotar").addClass('btn-inactivo')
    $("#mover").addClass('btn-inactivo')
    $("#actualiza-fecha").addClass('btn-inactivo')
    $("#eliminar").addClass('btn-inactivo')
  }else {
    // reinicia los botones
    btnActivo = true
    btnMover = false // boton mover
    btnActualizarDatos = false // boton actualizar datos
    btnEliminar = false // boton eliminar
    btnRotar = false // boton rotar
    $("#rotar").removeClass('btn-inactivo')
    $("#rotar").removeClass('btn-seleccion')
    $("#mover").removeClass('btn-inactivo')
    $("#mover").removeClass('btn-seleccion')
    $("#actualiza-fecha").removeClass('btn-inactivo')
    $("#eliminar").removeClass('btn-inactivo')
  }
}
// modal
function modalPerimetro () {
  $('#modal').modal('hide')
  $('#myAlertLabel').text('ADVERTENCIA')
  $('#msj-alert').text('')
  $('#msj-alert').append('<div class="col-lg-11 col-md-11">Área no permitida seleccione una nueva ubicación dentro de las intalaciones</div>')
  $('#alert').modal('show')

}

$('#enterado').click(function () {
  $('#alert').modal('hide')
  $('#msj-alert').empty()
  accionesBtn()
  accionesBtn()
})
// ////////EFECTO DEL MOUSE AL HACER CLIC SOBRE ELEMENTO// /////////////////////////////////

var nameSeleccionado // varibale que almacena el valor del index de arrayElementosConsulta que esta seleccionado
var dragPermiso = false // permiso para hacer drag sobre los elementos por defecto es false
var dragRotar = false
var elementoMovimiento // variable que se va a modificar
var posZoom = new Point()
var lineaRotarTemp
var elemento_x
var elemento_y
function onMouseDown (event) {
  // if (pathPerimetro.contains(event.point)) {
  if (true) {  
    posZoom = event.point
    if (event.item && event.item.className == "Path") {
      posZoom = event.point
      if (event.item.name.slice(1, -1) == nameSeleccionado) {
        if (btnMover) {
          dragPermiso = true
          diferenciaEventRectangle(event)
        } else if (btnRotar) {
          project.activeLayer.children['"' + nameSeleccionado + '"'].rotation = -parseInt(arrayElementosConsulta[nameSeleccionado].angulo)
          project.activeLayer.children['subpath' + nameSeleccionado + '"'].rotation = -parseInt(arrayElementosConsulta[nameSeleccionado].angulo)
          project.activeLayer.children['text' + nameSeleccionado + '"'].visible = false
          elemento_x = arrayElementosConsulta[nameSeleccionado].coordenada_x + (arrayElementosConsulta[nameSeleccionado].ancho_x * mts2 / 2)
          elemento_y = arrayElementosConsulta[nameSeleccionado].coordenada_y + (arrayElementosConsulta[nameSeleccionado].largo_y * mts2 / 2)
          vectorTempRotar = event.point - new Point(elemento_x, elemento_y)
          anguloIncialRotar = vectorTempRotar.angle
          dragRotar = true
        }
      } else {
        accionesBtn()
        accionesBtn()
      }
      nameSeleccionado = event.item.name.slice(1, -1)
    } else if (event.item && event.item.className == "PointText") {
      posZoom = event.point
      if (event.item.name.slice(4, -1) == nameSeleccionado) {
        if ( btnMover) {
          dragPermiso = true
          diferenciaEventRectangle(event)
        }else if (btnRotar) {
          project.activeLayer.children['"' + nameSeleccionado + '"'].rotation = -parseInt(arrayElementosConsulta[nameSeleccionado].angulo)
          project.activeLayer.children['subpath' + nameSeleccionado + '"'].rotation = -parseInt(arrayElementosConsulta[nameSeleccionado].angulo)
          project.activeLayer.children['text' + nameSeleccionado + '"'].visible = false
          elemento_x = arrayElementosConsulta[nameSeleccionado].coordenada_x + (arrayElementosConsulta[nameSeleccionado].ancho_x * mts2 / 2)
          elemento_y = arrayElementosConsulta[nameSeleccionado].coordenada_y + (arrayElementosConsulta[nameSeleccionado].largo_y * mts2 / 2)
          vectorTempRotar = event.point - new Point(elemento_x, elemento_y)
          anguloIncialRotar = vectorTempRotar.angle
          dragRotar = true
        }
      }else{
        accionesBtn()
        accionesBtn()
      }
      nameSeleccionado = event.item.name.slice(4, -1)
    } else {
      nameSeleccionado = -1
      if (true) {
        var puntoUbicado = ubicaCoordenada(event.point)
        coordenadaNuevoElemento.x = puntoUbicado.x
        coordenadaNuevoElemento.y = puntoUbicado.y
        if (!zoom) {
          proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
          coordenadaNuevoElemento.x = Math.floor(coordenadaNuevoElemento.x / proporcion)
          coordenadaNuevoElemento.y = Math.floor(coordenadaNuevoElemento.y / proporcion)
        }
        nuevoElemento = true
        $('#date').val(fechaSeleccionada.getFullYear() + '-' + (fechaSeleccionada.getMonth() + 1) + '-' + fechaSeleccionada.getDate());
        //$('#time').val(); // para colocar la hora indicada
        $('#modal').modal('show')
      }
    }
    if (nameSeleccionado >= 0) {
      if (!btnActivo) {
        accionesBtn()
      }
    }
  }
  //  else {
  //   nameSeleccionado = -1
  //   modalPerimetro()
  // }
}
var diferenciaPosX = 0
var diferenciaPosy = 0
function diferenciaEventRectangle (event) {
  proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
  diferenciaPosX = arrayElementosConsulta[nameSeleccionado].ancho_x * mts2 * proporcion / 2
  diferenciaPosy = arrayElementosConsulta[nameSeleccionado].largo_y * mts2 * proporcion / 2
}
var posElementoDrag = new Point()
function onMouseDrag(event) {
  proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
  if (btnActivo && btnMover && dragPermiso) {
    project.activeLayer.children['"' + nameSeleccionado + '"'].position += event.delta
    project.activeLayer.children['subpath' + nameSeleccionado + '"'].position += event.delta
    project.activeLayer.children['text' + nameSeleccionado + '"'].position += event.delta
  } else if (btnActivo && dragRotar){
    rotar(event)
  }
}

function onMouseUp (event) {
  proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
  if (!zoom && btnMover && dragPermiso) {
    dragPermiso = false
    arrayElementosConsulta[nameSeleccionado].coordenada_x = (project.activeLayer.children['"' + nameSeleccionado + '"'].position.x - diferenciaPosX) / proporcion
    arrayElementosConsulta[nameSeleccionado].coordenada_y = (project.activeLayer.children['"' + nameSeleccionado + '"'].position.y - diferenciaPosy) / proporcion
    x = arrayElementosConsulta[nameSeleccionado].coordenada_x
    y = arrayElementosConsulta[nameSeleccionado].coordenada_y
    ancho = arrayElementosConsulta[nameSeleccionado].ancho_x
    largo = arrayElementosConsulta[nameSeleccionado].largo_y
    fechaFinalInArray = arrayElementosConsulta[nameSeleccionado].fecha_final
    id = arrayElementosConsulta[nameSeleccionado].id
    zoomMapa(event.point)
    mueveElemento(x, y , ancho, largo, fechaSeleccionada, fechaFinalInArray, id, true)
    pintaElementos()
  } else if (zoom && btnMover && dragPermiso) {
    dragPermiso = false
    arrayElementosConsulta[nameSeleccionado].coordenada_x = (project.activeLayer.children['"' + nameSeleccionado + '"'].position.x - diferenciaPosX)
    arrayElementosConsulta[nameSeleccionado].coordenada_y = (project.activeLayer.children['"' + nameSeleccionado + '"'].position.y - diferenciaPosy)
    x = arrayElementosConsulta[nameSeleccionado].coordenada_x
    y = arrayElementosConsulta[nameSeleccionado].coordenada_y
    ancho = arrayElementosConsulta[nameSeleccionado].ancho_x
    largo = arrayElementosConsulta[nameSeleccionado].largo_y
    fechaFinalInArray = arrayElementosConsulta[nameSeleccionado].fecha_final
    id = arrayElementosConsulta[nameSeleccionado].id
    mueveElemento(x, y , ancho, largo, fechaSeleccionada, fechaFinalInArray, id, false)
  } else if (btnRotar && btnActivo) {
    dragPermiso = false
    guardarRotar()
    if (anguloIncialRotar < 0 ) {
      gradosSeleccionado += Math.abs(anguloIncialRotar) + parseInt(arrayElementosConsulta[nameSeleccionado].angulo)
    } else {
      gradosSeleccionado -= anguloIncialRotar + parseInt(arrayElementosConsulta[nameSeleccionado].angulo)
    }
    arrayElementosConsulta[nameSeleccionado].angulo = gradosSeleccionado
  }
}
function mueveElemento (x, y , ancho, largo, fechaSeleccionada, fechaFinalInArray, id, primerPaso) {
  var puntoTemp = new Point({
    x: x,
    y: y
  })
  puntoTemp = ubicaCoordenada(puntoTemp)
  dateTime1 = new Date(Date.parse(arrayElementosConsulta[nameSeleccionado].fecha_incial))
  dateTime2 = new Date(Date.parse(fechaFinalInArray))
  var date1 = dateTime1.getFullYear() + "-" + (dateTime1.getMonth() + 1) + "-" + dateTime1.getDate()
  var time1 = dateTime1.getHours() + ":" + "00:00"
  var date2 = dateTime2.getFullYear() + "-" + (dateTime2.getMonth() + 1) + "-" + dateTime2.getDate()
  var time2 = dateTime2.getHours() + ":" + dateTime2.getMinutes() + ":00"
  dateTimeSeleccionada = fechaSeleccionada.getFullYear() + "-" + (fechaSeleccionada.getMonth() + 1) + "-" + fechaSeleccionada.getDate() + " " + fechaSeleccionada.getHours() + ":" + "00:00"
  categoria = arrayElementosConsulta[nameSeleccionado].categoria
  cliente = arrayElementosConsulta[nameSeleccionado].cliente
  comentario = arrayElementosConsulta[nameSeleccionado].comentario
  angulo = arrayElementosConsulta[nameSeleccionado].angulo
  if (revisaEspacio(puntoTemp.x, puntoTemp.y , ancho, largo, angulo, date1, time1, date2, time2, id)) { // revisa si interseca con otro elemento
    if (btnActivo && btnMover && !primerPaso) {
      $('#myConfirm1Label').text('PREGUNTA')
      $('#msj-confirm1').text('')
      $('#msj-confirm1').append('<div class="col-lg-11 col-md-11">Desea mover elemento a la nueva ubicación</div>');
      $('#confirm1').modal('show')

      $('#aceptar').click(function () {
        $('#confirm1').modal('hide')
        actualizarBD(puntoTemp.x, puntoTemp.y, ancho, largo, date1, date2, time1, time2,categoria, cliente ,id, comentario, dateTimeSeleccionada, 1, angulo)
      });

      $('#rechazar').click(function () {
        $('#confirm1').modal('hide')
        location.reload()
      });
      $('#cerrar').click(function () {
        $('#confirm1').modal('hide')
        location.reload()
      });
      $('#confirm1').on('hidden.bs.modal', function () {
        location.reload()
      })
    }
  } else {
    $('#alert').on('hidden.bs.modal', function () {
      location.reload()
    })
  }
}
var gradosSeleccionado = 0
var anguloIncialRotar = 0
var vectorTempRotar
var intersections
function rotar (event) {
  vectorTempRotar = event.point - new Point(elemento_x, elemento_y)
  project.activeLayer.children['"' + nameSeleccionado + '"'].rotation = -gradosSeleccionado
  project.activeLayer.children['subpath' + nameSeleccionado + '"'].rotation = -gradosSeleccionado
  project.activeLayer.children['"' + nameSeleccionado + '"'].rotation = vectorTempRotar.angle
  project.activeLayer.children['subpath' + nameSeleccionado + '"'].rotation = vectorTempRotar.angle
  project.activeLayer.children['text' + nameSeleccionado + '"'].visible = false
  gradosSeleccionado = vectorTempRotar.angle
  arrayElementosConsulta[nameSeleccionado].angulo = Math.abs(gradosSeleccionado)


}
//aqui voy
function guardarRotar () {
  var puntoTemp = new Point({
    x: arrayElementosConsulta[nameSeleccionado].coordenada_x,
    y: arrayElementosConsulta[nameSeleccionado].coordenada_y
  })
  id = arrayElementosConsulta[nameSeleccionado].id
  dateTime1 = new Date(Date.parse(arrayElementosConsulta[nameSeleccionado].fecha_incial))
  fechaFinalInArray = arrayElementosConsulta[nameSeleccionado].fecha_final
  dateTime2 = new Date(Date.parse(fechaFinalInArray))
  var date1 = dateTime1.getFullYear() + "-" + (dateTime1.getMonth() + 1) + "-" + dateTime1.getDate()
  var time1 = dateTime1.getHours() + ":" + "00:00"
  var date2 = dateTime2.getFullYear() + "-" + (dateTime2.getMonth() + 1) + "-" + dateTime2.getDate()
  var time2 = dateTime2.getHours() + ":" + dateTime2.getMinutes() + ":00"
  dateTimeSeleccionada = fechaSeleccionada.getFullYear() + "-" + (fechaSeleccionada.getMonth() + 1) + "-" + fechaSeleccionada.getDate() + " " + fechaSeleccionada.getHours() + ":" + "00:00"
  categoria = arrayElementosConsulta[nameSeleccionado].categoria
  cliente = arrayElementosConsulta[nameSeleccionado].cliente
  comentario = arrayElementosConsulta[nameSeleccionado].comentario
  ancho = arrayElementosConsulta[nameSeleccionado].ancho_x
  largo = arrayElementosConsulta[nameSeleccionado].largo_y
  angulo = gradosSeleccionado
  if (revisaEspacio(puntoTemp.x, puntoTemp.y , ancho, largo, angulo, date1, time1, date2, time2, id)) { // revisa si interseca con otro elemento
      if (btnActivo && btnRotar) {
        $('#myConfirm1Label').text('PREGUNTA')
        $('#msj-confirm1').text('')
        $('#msj-confirm1').append('<div class="col-lg-11 col-md-11">Desea mover elemento a la nueva ubicación</div>');
        $('#confirm1').modal('show')

        $('#aceptar').click(function () {
          $('#confirm1').modal('hide')
          actualizarBD(puntoTemp.x, puntoTemp.y, ancho, largo, date1, date2, time1, time2,categoria, cliente ,id, comentario, dateTimeSeleccionada, 1, angulo)
        });

        $('#rechazar').click(function(){
          $('#confirm1').modal('hide')
          location.reload()
        });
        $('#cerrar').click(function(){
          $('#confirm1').modal('hide')
          location.reload()
        });
        $('#confirm1').on('hidden.bs.modal', function () {
          location.reload()
        })
      }
  }
}
// ////////UBICA COORDENADA EN EL ZOOM////////////////////////////////

function zoomMapa (punto) {
  var posX1 = 0
  var posY1 = 0
  var posX1 = punto.x/view.size.width;
  var posY1 = punto.y/view.size.height;
  zoomDo()
  var posX = ($('#canvas1').width() * posX1) - ($('#container-canvas').width() * 0.3)
  var posY = ($('#canvas1').height() * posY1) - ($('#container-canvas').height() * 0.3)
  $('#container-canvas').scrollLeft(posX);
  $('#container-canvas').scrollTop(posY);
}

// ////////EFECTO DEL MOUSE AL PASAR SOBRE ELEMENTO// /////////////////////////////////
var nameEventMove
function limpiaSombra () {
  project.activeLayer.style.shadowOffset = new Point(0, 0)
  project.activeLayer.style.shadowColor = 'black'
  project.activeLayer.style.shadowBlur = 0
}
function onMouseMove (event) {
  limpiaSombra()
  if (event.item && event.item != CPathCuadricula && event.item != pathPerimetro) {
    if (event.item.className == "Path") {
      nameEventMove = event.item.name.slice(1, -1)
    }else if (event.item.className == "PointText") {
      nameEventMove = event.item.name.slice(4, -1)
    }
    popupElement(event.item) // muestra la ventana emergente con la información del evento
  } else {
    limpiaSombra()

    $('#info-popup').attr('hidden', 'hidden');
  }

  if (nameSeleccionado >= 0) {
    project.activeLayer.children['"' + nameSeleccionado + '"'].shadowOffset = new Point(3, 3)
    project.activeLayer.children['"' + nameSeleccionado + '"'].shadowColor = 'black'
    project.activeLayer.children['"' + nameSeleccionado + '"'].shadowBlur = 5
  }
}

// funcion encargada de mostrar la informacion en el lado derecho de la pantalla
// del elemento con el cual se esta haciendo el hover
function popupElement (elementItem) {
  var pos;
  if (elementItem.className == 'Path') {
    pos = elementItem.name.slice(1, -1)
  } else if (elementItem.className == 'PointText') {
    pos = elementItem.name.slice(4, -1)
  }

  if (nameSeleccionado != elementItem.name.slice(1, -1)) {
    project.activeLayer.children['"' + pos + '"'].shadowOffset = new Point(3, 3)
    project.activeLayer.children['"' + pos + '"'].shadowColor = 'black'
    project.activeLayer.children['"' + pos + '"'].shadowBlur = 5
  }
  var i = pos;
  proporcion = (zoom) ? 1 : zoomProporcion
  $('#info-head').text('id: ' + arrayElementosConsulta[i].id + ' - ' + arrayElementosConsulta[i].categoria)
  $('#info-cliente').text('Cliente: ' + arrayElementosConsulta[i].cliente)
  var dateA = new Date();
  var dateB = new Date();
  dateA.setTime(Date.parse(arrayElementosConsulta[i].fecha_incial));
  var mes1 = mesNumtext(dateA.getMonth()+1);
  dateB.setTime(Date.parse(arrayElementosConsulta[i].fecha_final));
  var mes2 = mesNumtext(dateB.getMonth()+1);
  $('#info-fecha').text(
    dias[dateA.getDay()]
    + ' '
    + dateA.getDate() + ' de ' + mes1 + ' de ' + dateA.getFullYear() + ' - ' + dias[dateB.getDay()] + ' ' + dateB.getDate() + ' de ' + mes2 + ' de ' + dateB.getFullYear());
  $('#info-size').text('W:' + arrayElementosConsulta[i].ancho_x + 'mts X H:' + arrayElementosConsulta[i].largo_y + ' mts');
  $('#info-popup').removeAttr('hidden');
  if (proporcion == 1) {
    $('#info-popup').removeClass('info-popup-zoom0');
    $('#info-popup').addClass('info-popup-zoom');
  } else {
    $('#info-popup').removeClass('info-popup-zoom');
    $('#info-popup').addClass('info-popup-zoom0');
  }
}



// /////////// FIN DE ELEMENTO EFECTO SOBRE EL ELEMENTO/////////////////////////////////////

// /////////////// BTN ELIMINAR ////////////////////////////////
$('#eliminar').click(function () {
  if (btnActivo) {
    $('#myConfirm1Label').text('PREGUNTA')
    $('#msj-confirm1').text('')
    $('#msj-confirm1').append('<div class="col-lg-11 col-md-11">Desea eliminar este elemento</div>');
    $('#confirm1').modal('show')

    $('#aceptar').click(function () {
      $('#confirm1').modal('hide')
      eliminarElementoBD(arrayElementosConsulta[nameSeleccionado].id);
    });

    $('#rechazar').click(function(){
      $('#confirm1').modal('hide')
      accionesBtn()
      accionesBtn()
    });
    $('#cerrar').click(function(){
      $('#confirm1').modal('hide')
      accionesBtn()
      accionesBtn()
    });
    $('#confirm1').on('hidden.bs.modal')
  }
})

//eliminarElementoBD("1");
function eliminarElementoBD (id) {
  // Convertir a objeto
  var data = {}
  data.id = id
  var url = 'eliminarelementobd.php' // este es el PHP al que se llama por AJAX

  resultado = new Array()
  $.ajax({
    method: 'POST',
    url: url,
    data: data, // acá están todos los parámetros (valores a enviar) del POST
    success: function (response) {
      // resultado es un array que indica exitoso o no.
      if (response == '1') {
        $('#myAlertLabel').text('ADVERTENCIA')
        $('#msj-alert').text('')
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">Elemento eliminado correctamente</div>')
        $('#alert').modal('show')
        $('#enterado').click(function () {
          location.reload()
        })
      } else {
        $('#myAlertLabel').text('ADVERTENCIA')
        $('#msj-alert').text('')
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">No se pudo eliminar elemento, error en base de datos</div>')
        $('#alert').modal('show');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#myAlertLabel').text('ERROR')
      $('#msj-alert').text('')
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">ERROR ' + textStatus + ' - ' + errorThrown + '</div>')
      $('#alert').modal('show')
    }
  })
}


// /////////////////////FIN FUNCION ELIMINAR //////////////////////////

// /////////////////////FUNCION ACTUALIZAR ////////////////////////////
$('#actualiza-fecha').click(function () {
  if(btnActivo){
    accionesBtn()
    accionesBtn()
    btnActualizarDatos = true
    ventanaActualiza()

  }
})
$('#mover').click(function () {
  if(btnActivo) {
    if (!btnMover) {
      accionesBtn()
      accionesBtn()
      btnMover = true
      if(zoom) {
        zoomDo()
      }
      $("#mover").addClass('btn-seleccion')
    } else {
      accionesBtn()
      accionesBtn()
      btnMover = false
      $("#mover").removeClass('btn-seleccion')
    }
    ventanaActualiza()
  }
})
var puntoZoom
$('#rotar').click(function () {
  if (btnActivo) {
    if (!btnRotar) {
      accionesBtn()
      accionesBtn()
      btnRotar = true
      if (!zoom) {
        puntoZoom = new Point(arrayElementosConsulta[nameSeleccionado].coordenada_x * proporcion, arrayElementosConsulta[nameSeleccionado].coordenada_y * proporcion)
        zoomMapa(puntoZoom)
      }
      $("#rotar").addClass('btn-seleccion')
    } else {
      accionesBtn()
      accionesBtn()
      btnRotar = false
      $("#rotar").removeClass('btn-seleccion')
    }
    ventanaActualiza()
  }
})
// ventanaActualiza('Desea actualizar los datos del elemento', 2)
// Cuando se actualiza por la ventada de actualizar en con 2
// Cuando se actualiza por la opcion de mover es con 1
var id = -1
var x
var y // coordenada para manejar lo elementos sleccionados
function ventanaActualiza () {
  if (btnActualizarDatos) {
    $('#confirm1').modal('hide');
    $('#anchoX').val(arrayElementosConsulta[nameSeleccionado].ancho_x)
    $('#largoY').val(arrayElementosConsulta[nameSeleccionado].largo_y);
    $('#date').val(arrayElementosConsulta[nameSeleccionado].fecha_incial.slice(0, 10));
    $('#date1').val(arrayElementosConsulta[nameSeleccionado].fecha_final.slice(0, 10));
    $('#time').val(arrayElementosConsulta[nameSeleccionado].fecha_incial.slice(11));
    $('#time1').val(arrayElementosConsulta[nameSeleccionado].fecha_final.slice(11));
    $('#categoria').val(arrayElementosConsulta[nameSeleccionado].categoria);
    $('#cliente').val(arrayElementosConsulta[nameSeleccionado].cliente);
    $('#comentario').html(arrayElementosConsulta[nameSeleccionado].comentario);
    x = arrayElementosConsulta[nameSeleccionado].coordenada_x
    y = arrayElementosConsulta[nameSeleccionado].coordenada_y
    id = arrayElementosConsulta[nameSeleccionado].id
    tipoActualizacion = 2
    $('#modal').modal('show')
  }
}
var mensaje = new Array();
function llenarFormularioNuevo () {
  $('#confirm1').modal('hide');
  $('#anchoX').val('')
  $('#largoY').val('');
  $('#date').val('');
  $('#date1').val('');
  $('#time').val('');
  $('#time1').val('');
  $('#categoria').val('');
  $('#cliente').val('');
  $('#comentario').html('');
}
// modal manejo de de guardar en el modal
$('#guardar').click(function () {
  $('#msj-alert').empty()
  mensaje = []
  var anchoCuadro = $('#anchoX').val()
  var largoCuadro = $('#largoY').val()
  $('#msj-alert').text('');
  var valido = true;
  if (anchoCuadro == '' || largoCuadro == '' || anchoCuadro <= 0 || largoCuadro <= 0) {
    mensaje.push('Ancho y largo del area son obligatorios y deben ser positivo');
    valido = false;
  }

  if ($('#date').val() == '' || $('#time').val() == '') {
    mensaje.push('Fecha y hora inicial son obligatorios');
    valido = false;
  }

  if ($('#date1').val() == '' || $('#time1').val() == '') {
    mensaje.push('Fecha y hora final son obligatorios');
    valido = false;
  }

  if (validaFecha($('#date').val(), $('#date1').val())) {
    mensaje.push('Fecha inicial debe ser mayor de la fecha final');
    valido = false;
  }

  if ($('#cliente').val() == '') {
    mensaje.push('El cliente es un campo obligatorio')
    valido = false;
  }
  if (!valido) {
    $('#myAlertLabel').text('ADVERTENCIA')
    for (var i = 0; i < mensaje.length; i++) {
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">' + mensaje[i] + '</div>')
    }
    $('#alert').modal('show');
  }else if (valido) {
    $('#modal').modal('hide');
  }

  if (valido) {
    
    var ancho = $('#anchoX').val();
    var largo = $('#largoY').val();
    var date1 = $('#date').val();
    var date2 = $('#date1').val();
    var time1 = $('#time').val();
    var time2 = $('#time1').val();
    var categoria = $('#categoria').val();
    var cliente = $('#cliente').val();
    var angulo = (nameSeleccionado != -1)? arrayElementosConsulta[nameSeleccionado].angulo : 0
    var comentario = $('#comentario').val();
    if (nuevoElemento) {
      // guardarBaseDatos (x, y, ancho,largo, date1,date2,time1,time2, categoria, cliente, angulo, comentario)
      var x = coordenadaNuevoElemento.x
      var y = coordenadaNuevoElemento.y
      mensaje = [].slice()
      if (revisaEspacio(x, y , ancho, largo, 0, date1, time1, date2, time2, -1)) { // revisa si interseca con otro elemento
        guardarBaseDatos(x, y, ancho, largo, date1, date2, time1, time2, categoria, cliente, angulo, comentario)
      }
    } else {
      x = arrayElementosConsulta[nameSeleccionado].coordenada_x
      y = arrayElementosConsulta[nameSeleccionado].coordenada_y
      zoomDo()
      if (revisaEspacio(x, y , ancho, largo, angulo, date1, time1, date2, time2, id)) {
        var fechaRevisar = (fechaSeleccionada.getFullYear() + '-' + (fechaSeleccionada.getMonth() + 1) + '-' + fechaSeleccionada.getDate() + ' ' + fechaSeleccionada.getHours() + ':' + '00:00')
        actualizarBD(
          x,
          y,
          ancho,
          largo,
          date1,
          date2,
          time1,
          time2,
          categoria,
          cliente,
          id,
          comentario,
          fechaRevisar,
          tipoActualizacion,
          arrayElementosConsulta[nameSeleccionado].angulo
        )
      }
    }
  } else {
    $('#modal').modal('show')
  }

})

$('#rechazar').click(function(){
  $('#confirm1').modal('hide');
});
$('#cerrar').click(function(){
  $('#confirm1').modal('hide');
});

$('#confirm1').on('hidden.bs.modal');

// Valida fecha la inicial se mayor a la final
function validaFecha (fecha1, fecha2) {
  var f1 = new Date();
  var f2 = new Date();
  f1.setTime(Date.parse(fecha1));
  f2.setTime(Date.parse(fecha2));
  return (f1 < f2) ? false : true;
}

// //inicio funcion para revisar si el espacio esta ocupando
function revisaEspacio (x, y , ancho, largo, angulo,date1, time1, date2, time2, id) {
  var respuesta = true
  arrayElementosConsultaTemp = arrayElementosConsulta.slice()
  if (id >=0) {
    for (var i = 0; i < arrayElementosConsultaTemp.length; i++) {
      if (arrayElementosConsultaTemp[i].id == id) { //quita el item para que no se compare con el mismo
        arrayElementosConsultaTemp.splice(i, 1)
        break
      }
    }
  }
  
  arrayElementosConsultaTemp.push({
    coordenada_x: x,
    coordenada_y: y,
    ancho_x: ancho,
    largo_y: largo,
    fecha_inicial: date1 + " " + time1,
    fecha_final: date2 + " " + time2,
    angulo: angulo
  })
  pintaElementosTime(date1 + " " + time1, date2 + " " + time2) // dibuja todos los elementos en el tiempo para comprobar si se topa con el nuevo elemento
  mensaje = [].slice()

  for (var i = 0; i < arrayConsultaNombres.length-1; i++) {
    var nombre = arrayConsultaNombres[i]
    if (project.activeLayer.children[nombre].bounds.intersects(project.activeLayer.children[idNuevo].bounds)) {
      respuesta = false
      mensaje.push('<div class="col-lg-11 col-md-11">Espacio ocupado desde el '+ project.activeLayer.children[nombre].data.fechaIni + ' al '+ project.activeLayer.children[nombre].data.fechaFin + '</div>')
      arrayConsultaNombres = []
      break;
    }
  }
  if (nuevoElemento) {
    intersections = project.activeLayer.children[idNuevo].getIntersections(pathPerimetro);
  } else {
    intersections = project.activeLayer.children[idNuevo].getIntersections(pathPerimetro)
  }
  if (!btnRotar){
    if (!AreaPerimetro(x, y , ancho, largo, angulo)) {
      mensaje.push('<div class="col-lg-11 col-md-11" id="borrarMsj">Área no permitida seleccione una nueva ubicación dentro de las intalaciones</div>')
      respuesta = false
    }

  } else {
    if (intersections.length > 0) {
      mensaje.push('<div class="col-lg-11 col-md-11" id="borrarMsj">Área no permitida seleccione una nueva ubicación dentro de las intalaciones</div>')
      respuesta = false
    }
  }
  if (!respuesta) {
    $('#myAlertLabel').text('ADVERTENCIA')
    for (var i = 0; i < mensaje.length; i++) {
      $('#msj-alert').append('<div class="col-lg-11 col-md-11" id="borrarMsj" >' + mensaje[i] + '</div>')
    }
    $('#alert').modal('show')
    pintaElementos()
  }
  return respuesta
}
$('#enterado').click(function () {
  if(btnDeshacer) {
    $('#alert').modal('hide')
    $('#msj-alert').empty()
  }
})

function AreaPerimetro (x, y , ancho, largo) {
  var resultadoPerimetro = true
  var cuentaValiPerimetro = 0 //Revisa que todo el elemento esta por fuera o por dentro del perimetro
  proporcion = (zoom) ? 1 : zoomProporcion // sin zoom y con zoom
  if (intersections.length == 0) {
    for (var i = 0; i <= ancho; i++) {
      if (!pathPerimetro.contains(new Point(x + (i * mts2), y)) || !pathPerimetro.contains(new Point(x + (i * mts2), y +  (largo * mts2)))) {
        cuentaValiPerimetro++
      }
    }
    for (var i = 0; i <= largo; i++) {
      if (!pathPerimetro.contains(new Point(x, y + (i * mts2))) || !pathPerimetro.contains(new Point(x  + (ancho * mts2) , y + (i * mts2)))) {
        cuentaValiPerimetro++
      }
    }
    if (cuentaValiPerimetro >= (ancho + largo + 2)) {
      resultadoPerimetro = false
    }
  } else {
    resultadoPerimetro = false
  }
  return resultadoPerimetro
}
// //fin funcion para revisar si el espacio esta ocupando

// //////////// FIN FUNCION ACTUALIZAR /////////

/* organiza el punto para que ubique la coordenada correspondiente con un cuadro */
function ubicaCoordenada (puntoCoordenada) {
  var pos1 = puntoCoordenada.x
  var pos2 = puntoCoordenada.y
  puntoCoordenada.x = Math.floor(pos1 / mts2) * mts2
  puntoCoordenada.y = Math.floor(pos2 / mts2) * mts2
  return puntoCoordenada
}
// fin organiza punto
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

// //////////////////////////// FUNCIONES DESHACER

// cambia de estado el boton deshacer si hay elementos para deshacer en cola
function activaBtnDeshacer () {
  if (cantDeshacer > 0) {
    btnDeshacer=true;
    $('#deshacer').removeClass('btn-inactivo');
}
}

$('#deshacer').click(function () {
  if(btnDeshacer) {
    deshacerAjax()
  }
})

function deshacerAjax () {
  // Convertir a objeto
  var url = 'deshacer.php' // este es el PHP al que se llama por AJAX
  $.ajax({
    method: 'POST',
    url: url,
    success: function(response) {
      // resultado es un array que indica exitoso o no.
      location.reload()
    },
    error: function ( jqXHR, textStatus, errorThrown ) {
      $('#myAlertLabel').text('ERROR')
      $('#msj-alert').text('')
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">ERROR ' + textStatus + ' - ' + errorThrown + '</div>')
      $('#alert').modal('show')
    }
  })
}
// //////////////////////////// FUNCIONES AJAX

/* Consulta la base de datos por meses */
function consultarBaseDatos (date) {
  // Convertir a objeto
  var data = {}

  data.date = date // Fecha actual con la que se va ha hacer la consulta
  data.categoria = ''

  var url = 'consultar.php' // este es el PHP al que se llama por AJAX

  $.ajax({
    method: 'POST',
    url: url,
    data: data, // acá están todos los parámetros (valores a enviar) del POST
    success: function (response) {
      $('fecha_range').removeAttr('hidden')

      $('fecha_caja').removeAttr('hidden')
      cantDeshacer = response[1][0]
      activaBtnDeshacer()
      arrayElementosConsulta = response[0]
      pintaElementos()
    },
    dataType:'json'
  })
}

// funcion AJAX para guardar en bd
// AJAX Guardar Formulario

function guardarBaseDatos (x, y, ancho,largo, date1,date2,time1,time2, categoria, cliente, angulo, comentario) {
  // Convertir a objeto
  var data = {};
  data.x = x;
  data.y = y;
  data.ancho = ancho;
  data.largo = largo;
  data.date1 = date1;
  data.date2 = date2;
  data.time1 = time1;
  data.time2 = time2;
  data.categoria = categoria;
  data.cliente = cliente;
  data.angulo = angulo;
  data.comentario = comentario;
  var url = 'guardar.php';   //este es el PHP al que se llama por AJAX
  $.ajax({
    method: 'post',
    url: url,
    data: data,   //acá están todos los parámetros (valores a enviar) del POST
    success: function (response) {
      if (response == '1') {
        $('#myAlertLabel').text('MENSAJE')
        $('#modal').modal('hide')
        $('#msj-alert').text('')
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">Espacio asignado correctamente </div>')
        $('#alert').modal('show')
        $('#enterado').click(function () {
          location.reload()
        })
      }else{
        $('#myAlertLabel').text('MENSAJE')
        $('#modal').modal('hide')
        $('#msj-alert').text('')
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">No se pudo asignar espacio error al guardar base de datos </div>')
        $('#alert').modal('show')
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#myAlertLabel').text('ERROR')
      $('#msj-alert').text('')
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">ERROR ' + textStatus + ' - ' + jqXHR + ' - ' + errorThrown + '</div>')
      $('#alert').modal('toggle')
    }
  })
}

// actualizarBD(600,150, 9, '2018-03-20 02:53:00')
function actualizarBD (x, y, ancho, largo, date1, date2, time1, time2, categoria, cliente, id, comentario, date, typeUpdate, angulo) {
// Convertir a objeto
  var data = {}

  data.date = date
  data.id = id
  data.x = x
  data.y = y
  data.ancho = ancho
  data.largo = largo
  data.date1 = date1
  data.date2 = date2
  data.time1 = time1
  data.time2 = time2
  data.categoria = categoria
  data.comentario = comentario
  data.cliente = cliente
  data.typeUpdate = typeUpdate
  data.angulo = angulo
  var url = 'actualizar.php'   //este es el PHP al que se llama por AJAX
  resultado = new Array()
  $.ajax({
    method: 'POST',
    url: url,
    data: data,   //acá están todos los parámetros (valores a enviar) del POST
    success: function (response) {
      //  resultado es un array que indica exitoso o no.
      if (response == "1") {
        $('#myAlertLabel').text("MOVIMIENTO")
        $('#msj-alert').text('')
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">Espacio actualizado correctamente</div>')
        $('#alert').modal('show')
      } else {
        $('#myAlertLabel').text("ERROR")
        $('#msj-alert').text('')
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">No se pudo actualizar el espacio error al actualizar en base de datos</div>')
        $('#alert').modal('show')
      }
      $("#enterado").click(function () {
        location.reload()
      })
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $('#myAlertLabel').text("ERROR")
      $('#msj-alert').text('')
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">ERROR ' + textStatus + ' - ' + jqXHR + ' - ' + errorThrown + '</div>')
      $('#alert').modal('show')
    }
  })
}



// ///////////////////////////////////////////////////////////////////// calendario
var calendar = $('#calendar').fullCalendar({
 editable:true,
 header:{
  left:'prev,next today',
  center:'title',
  right:'month,agendaWeek'
 },
 firstDay: 1,
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  buttonText:
           {
               prev:     ' ◄ ',
               next:     ' ► ',
               prevYear: ' &lt;&lt; ',
               nextYear: ' &gt;&gt; ',
               today:    'hoy',
               month:    'mes',
               week:     'semana',
               day:      'día'
           },
 events: 'calendario/load.php',
 selectable:true,
 selectHelper:true,
 select: function(start, end, allDay)
 {
   var fechaActual = new Date(start._d);
   fechaSeleccionada.setFullYear(fechaActual.getFullYear())
   fechaSeleccionada.setMonth(fechaActual.getMonth())
   fechaSeleccionada.setDate(fechaActual.getDate() + 1)
   pintaElementos()

 },
 editable:false,
eventClick:function(event)
 {
   var id = event.id;
   var fechaStart = new Date(event.start);
   var fechaEnd = new Date(event.end);
   $('#largoY_1').val(event.largo);
   $('#anchoX_1').val(event.ancho);
   $('#cliente_1').val(event.title);
   $('#categoria_1').val(event.categorias);
   $('#date_1').val(fechaStart.getFullYear() + '-' + (fechaStart.getMonth()+1) + '-' + (fechaStart.getDate()+1));
   $('#time_1').val(event.startHora);
   $('#date1_1').val(fechaEnd.getFullYear() + '-' + (fechaEnd.getMonth()+1) + '-' + (fechaEnd.getDate()));
   $('#time1_1').val(event.endHora);
   $('#comentario_1').html(event.comentario);

   $('#largoY_1').prop('readonly', true);
   $('#anchoX_1').prop('readonly', true);
   $('#date_1').prop('readonly', true);
   $('#time_1').prop('readonly', true);
   $('#date1_1').prop('readonly', true);
   $('#time1_1').prop('readonly', true);

   $('#modal_1').modal('show');
   $('#guardar_1').click(function(){
       $('#modal_1').modal('hide');
     actualizarCalBD(
       event.id,
       $('#categoria_1').val(),
       $('#cliente_1').val(),
       $('#comentario_1').val()
       );

   });
 }
});
// });

function actualizarCalBD (id, categoria, cliente , comentario){
// Convertir a objeto
var data = {};

data.id = id;
data.categoria = categoria;
data.cliente = cliente;
data.comentario = comentario;
var url = 'calendario/update.php';   //este es el PHP al que se llama por AJAX

resultado = new Array();
  $.ajax({
    method: 'POST',
    url: url,
    data: data,   //acá están todos los parámetros (valores a enviar) del POST
    success: function(response){
      // resultado es un array que indica exitoso o no.

      if(response == "1"){
        $('#myAlertLabel').text("ACTUALIZACION")
        $('#msj-alert').text('');
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">Datos actualizados correctamente</div>')
        $('#alert').modal('show');
      }else{
        $('#myAlertLabel').text("ERROR")
        $('#msj-alert').text('');
        $('#msj-alert').append('<div class="col-lg-11 col-md-11">No se pudo actualizar los Datos error al en base de datos</div>')
        $('#alert').modal('show');
      }
      $("#enterado").click(function(){
        location.reload();
      });
    },
    error: function( jqXHR, textStatus, errorThrown ) {
      $('#myAlertLabel').text("ERROR")
      $('#msj-alert').text('');
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">ERROR ${textStatus} - ${jqXHR} - ${errorThrown}</div>')
      $('#alert').modal('show');
    }
  });
}
