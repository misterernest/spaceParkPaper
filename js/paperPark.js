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
var formularioBorrar = true

// botones que inician en false para que primero elijan el elemento a mover
var btnActivo = false
var btnMover = false // boton mover
var btnActualizarDatos = false // boton actualizar datos
var btnEliminar = false // boton eliminar
var btnDeshacer = false // boton que se activa si hay para deshacer

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
// var hour = hoy.getHours() // hora
// var min = 0 // minutos y segundos en ceros
// var seg = 0
var mesText = mesNumtext(mm)
var mesActual = mesText
var fechaSeleccionada = hoy
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
var itemSeleccionado = -1 // variable que lleva el elemento seleccionado
function organizaFecha (cadenaFecha) {
  var y4 = parseInt(cadenaFecha.slice(0, 4))
  var m2 = parseInt(cadenaFecha.slice(5, 7)) - 1
  var d2 = parseInt(cadenaFecha.slice(8, 10))
  var respuesta = new Date(y4, m2, d2, 23, 59, 59, 0)
  respuesta.setDate(respuesta.getDate() -1)
  return respuesta
}
function pintaElementos () {
  project.activeLayer.removeChildren(2)
  proporcion = (zoom) ? 1 : zoomProporcion
  var fechaInicialArray = new Date();
  var fechaFinalArray = new Date();
  fechaSeleccionada.setHours(23,59,59,0)
  for (var i = 0; i < arrayElementosConsulta.length; i++) {
    var rotacion = 0
    var fontSize = 14
    fechaInicialArray = organizaFecha(arrayElementosConsulta[i].fecha_incial)
    fechaFinalArray = organizaFecha(arrayElementosConsulta[i].fecha_final)
    if (fechaInicialArray <= fechaSeleccionada && fechaFinalArray > fechaSeleccionada) {
      fontSize = arrayElementosConsulta[i].ancho_x * proporcion * mts2 / 20
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
        data: {
          seleccionado: false,
          id:arrayElementosConsulta[i]
        }
      })
      var pathSubTemp = new Path.Rectangle({
        point: [
          (parseInt(arrayElementosConsulta[i].coordenada_x  * proporcion ) + 10 * proporcion),
          (parseInt(arrayElementosConsulta[i].coordenada_y * proporcion ) + 10 * proporcion)
        ],
        size: [
          (parseInt(arrayElementosConsulta[i].ancho_x * proporcion * mts2) - 20 * proporcion),
          (parseInt(arrayElementosConsulta[i].largo_y * proporcion * mts2) - 20 * proporcion)
        ],
        visible: false,
        name: 'subpath' + i,
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
        fontSize: fontSize
      })
      textTemp.rotate(rotacion, pathTemp.point);
      textTemp.fitBounds(pathSubTemp.bounds)
      if (i == itemSeleccionado) {
        var posXActual = pathTemp.position.x
        var posYActual = pathTemp.position.y
        pathTemp.position.x = posXActual - 3
        pathTemp.position.y = posYActual - 3
        pathTemp.shadowOffset = new Point(3, 3)
        pathTemp.shadowColor = 'black'
        pathTemp.shadowBlur = 5
      }
    }
  }
}

var idNuevo
function pintaElementosTime (fecha1, fecha2) {
  arrayConsultaNombres = []
  var fechaInicialElemento = new Date()
  var fechaFinalElemento = new Date()
  var fechaInicialArrayRango = new Date()
  fechaInicialArrayRango.setTime(Date.parse(fecha1))
  var fechaFinalArrayRango = new Date()
  fechaFinalArrayRango.setTime(Date.parse(fecha2))
  proporcion = (zoom) ? 1 : zoomProporcion
  for (var i = 0; i < arrayElementosConsultaTemp.length; i++) {
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

// Funcion que activa y de descativa botones

function accionesBtn () {
  if (btnActivo) {
    btnActivo = false // bandera para saber si esta seleccionado un elemento
    btnMover = false // boton mover
    btnActualizarDatos = false // boton actualizar datos
    btnEliminar = false // boton eliminar
    $("#mover").addClass('btn-inactivo')
    $("#actualiza-fecha").addClass('btn-inactivo')
    $("#eliminar").addClass('btn-inactivo')
  }else {
    // reinicia los botones
    btnActivo = true
    btnMover = false // boton mover
    btnActualizarDatos = false // boton actualizar datos
    btnEliminar = false // boton eliminar
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
  accionesBtn()
  accionesBtn()
})
// ////////EFECTO DEL MOUSE AL HACER CLIC SOBRE ELEMENTO// /////////////////////////////////

var hitOptions = {
  fill: true,
  tolerance: 5
}
var elementoMovimiento // variable que se va a modificar

function onMouseDown (event) {
  if (pathPerimetro.contains(event.point)) {
    var movePath = false
    var hitResult = project.hitTest(event.point, hitOptions)
    if (!hitResult) {
      if (btnActivo) {
        itemSeleccionado = -1
        accionesBtn()
      }else{
        if (zoom) {
          ubicaCoordenada(event.point)
          nuevoElemento = true
          vaciaFormulario()
          $('#modal').modal('show')
        }
      }
      if (!zoom) {
        zoomMapa(event)
      }
      return
    }
    movePath = hitResult.type === 'fill'
    if (movePath) {

      elementoMovimiento = hitResult.item // le asigna el item a un elemento que va a seleccionar
      if (elementoMovimiento.className == 'Path') {
        if (itemSeleccionado != elementoMovimiento.name.slice(1, -1)) {
          btnMover = false
          $("#mover").removeClass('btn-seleccion')
        }
        itemSeleccionado = elementoMovimiento.name.slice(1, -1)
      } else if (elementoMovimiento.className == 'PointText') {
        if (itemSeleccionado != elementoMovimiento.name.slice(4, -1)) {
          btnMover = false
          $("#mover").removeClass('btn-seleccion')
        }
        itemSeleccionado = elementoMovimiento.name.slice(4, -1)
      }


      nuevoElemento = false
      if (!zoom) {
        $("#mover").removeClass('btn-seleccion')
        zoomMapa(event)
      }
      if (!btnActivo) {
        accionesBtn()
      }
      if (btnMover) {
        $("#mover").removeClass('btn-seleccion')
      }
      // project.activeLayer.addChild(hitResult.item)
    }
  } else {
    modalPerimetro()
  }
}
function onMouseDrag(event) {
  console.log(btnActivo);
  if (btnActivo && btnMover) {
    if (elementoMovimiento.className == 'Path') {
      itemSeleccionado = elementoMovimiento.name.slice(1, -1)
    } else if (elementoMovimiento.className == 'PointText') {
      itemSeleccionado = itemSeleccionado = elementoMovimiento.name.slice(4, -1)
    }
    $("#mover").addClass('btn-seleccion')
    project.activeLayer.children['subpath' + itemSeleccionado].position += event.delta
    project.activeLayer.children['text' + itemSeleccionado + '"'].position += event.delta
    project.activeLayer.children['"' + itemSeleccionado + '"'].position += event.delta
  }
}

// ////////UBICA COORDENADA EN EL ZOOM////////////////////////////////

function zoomMapa (e) {
  var posX1 = e.point.x/view.size.width;
  var posY1 = e.point.y/view.size.height;
  zoomDo();
  var posX = ($('#canvas1').width() * posX1) - ($('#container-canvas').width() * 0.3) ;
  var posY = ($('#canvas1').height() * posY1) - ($('#container-canvas').height() * 0.3);
  $('#container-canvas').scrollLeft(posX);
  $('#container-canvas').scrollTop(posY);
}

// ////////EFECTO DEL MOUSE AL PASAR SOBRE ELEMENTO// /////////////////////////////////
function onMouseMove (event) {
  project.activeLayer.selected = false;
  pintaElementos()
  if (event.item && event.item != CPathCuadricula && event.item != pathPerimetro) {
    popupElement(event.item) // muestra la ventana emergente con la información del evento
  } else {
    $('#info-popup').attr('hidden', 'hidden');
  }
}
function popupElement (elementItem) {
  var pos;
  if (elementItem.className == 'Path') {
    pos = elementItem.name.slice(1, -1)
  } else if (elementItem.className == 'PointText') {
    pos = elementItem.name.slice(4, -1)
  }

  if (itemSeleccionado != elementItem.name.slice(1, -1)) {
    var posXActual = project.activeLayer.children['"' + pos + '"'].position.x
    var posYActual = project.activeLayer.children['"' + pos + '"'].position.y
    project.activeLayer.children['"' + pos + '"'].position.x = posXActual - 3
    project.activeLayer.children['"' + pos + '"'].position.y = posYActual - 3
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
      eliminarElementoBD(arrayElementosConsulta[itemSeleccionado].id);
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
  if(btnActivo){
    accionesBtn()
    accionesBtn()
    $("#mover").addClass('btn-seleccion')
    btnMover = true
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
    $('#anchoX').val(arrayElementosConsulta[itemSeleccionado].ancho_x)
    $('#largoY').val(arrayElementosConsulta[itemSeleccionado].largo_y);
    $('#date').val(arrayElementosConsulta[itemSeleccionado].fecha_incial.slice(0, 10));
    $('#date1').val(arrayElementosConsulta[itemSeleccionado].fecha_final.slice(0, 10));
    $('#time').val(arrayElementosConsulta[itemSeleccionado].fecha_incial.slice(11));
    $('#time1').val(arrayElementosConsulta[itemSeleccionado].fecha_final.slice(11));
    $('#categoria').val(arrayElementosConsulta[itemSeleccionado].categoria);
    $('#cliente').val(arrayElementosConsulta[itemSeleccionado].cliente);
    $('#comentario').html(arrayElementosConsulta[itemSeleccionado].comentario);
    x = arrayElementosConsulta[itemSeleccionado].coordenada_x
    y = arrayElementosConsulta[itemSeleccionado].coordenada_y
    id = arrayElementosConsulta[itemSeleccionado].id
    tipoActualizacion = 2
    $('#modal').modal('show')
  }
}

function vaciaFormulario () {
  if (formularioBorrar) {
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
}

// modal manejo de de guardar en el modal
$('#guardar').click(function () {
  var anchoCuadro = $('#anchoX').val();
  var largoCuadro = $('#largoY').val();
  var mensaje = new Array();
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
    var angulo = 0
    var comentario = $('#comentario').val();
    if (nuevoElemento) {
      // guardarBaseDatos (x, y, ancho,largo, date1,date2,time1,time2, categoria, cliente, angulo, comentario)
      var x = coordenadaNuevoElemento.x
      var y = coordenadaNuevoElemento.y


      if (revisaEspacio(x, y , ancho, largo, date1, time1, date2, time2, id)) { // revisa si interseca con otro elemento
        guardarBaseDatos(x, y, ancho, largo, date1, date2, time1, time2, categoria, cliente, angulo, comentario)
      }
    } else {
      if (revisaEspacio(x, y , ancho, largo, date1, time1, date2, time2, id)) {
        x = arrayElementosConsulta[itemSeleccionado].coordenada_x
        y = arrayElementosConsulta[itemSeleccionado].coordenada_y
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
          tipoActualizacion
        )
      }
    }
  } else {
    $('#modal').modal('show')
    formularioBorrar = false
  }

})

$('#rechazar').click(function(){
  $('#confirm1').modal('hide');
});
$('#cerrar').click(function(){
  $('#confirm1').modal('hide');
});

$('#confirm1').on('hidden.bs.modal', function () {
  // revisar codigo
});

// Valida fecha la inicial se mayor a la final
function validaFecha (fecha1, fecha2) {
  var f1 = new Date();
  var f2 = new Date();
  f1.setTime(Date.parse(fecha1));
  f2.setTime(Date.parse(fecha2));
  return (f1 < f2) ? false : true;
}

// //inicio funcion para revisar si el espacio esta ocupando
// aqui voy
function revisaEspacio (x, y , ancho, largo, date1, time1, date2, time2, id) {
  var mensaje = []
  var respuesta = true
  arrayElementosConsultaTemp = arrayElementosConsulta.slice()
  if (id >=0) {
    for (var i = 0; i < arrayElementosConsultaTemp.length; i++) {
      if (arrayElementosConsultaTemp[i].id == id) {
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
    fecha_final: date2 + " " + time2
  })
  pintaElementosTime(date1 + " " + time1, date2 + " " + time2) // dibuja todos los elementos en el tiempo para comprobar si se topa con el nuevo elemento
  for (var i = 0; i < arrayConsultaNombres.length-1; i++) {
    var nombre = arrayConsultaNombres[i]
    if (project.activeLayer.children[nombre].bounds.intersects(project.activeLayer.children[idNuevo].bounds)) {
      respuesta = false
      mensaje.push('<div class="col-lg-11 col-md-11">Espacio ocupado desde el '+ project.activeLayer.children[nombre].data.fechaIni + ' al '+ project.activeLayer.children[nombre].data.fechaFin + '</div>')
      arrayConsultaNombres = []
      break;
    }
  }
  if (!AreaPerimetro(x, y , ancho, largo)) {
    mensaje.push('<div class="col-lg-11 col-md-11">Área no permitida seleccione una nueva ubicación dentro de las intalaciones</div>')
    respuesta = false
  }

  if (!respuesta) {
    $('#myAlertLabel').text('ADVERTENCIA')
    for (var i = 0; i < mensaje.length; i++) {
      $('#msj-alert').append('<div class="col-lg-11 col-md-11">' + mensaje[i] + '</div>')
    }
    $('#alert').modal('show');
    mensaje = []
    formularioBorrar = false
  }
  return respuesta
}

function AreaPerimetro (x, y , ancho, largo) {
  var resultadoPerimetro = true
  for (var i = x; i <= x + ancho * mts2; i = i + mts2) {
    if (!pathPerimetro.contains(new Point(i, y)) || !pathPerimetro.contains(new Point(i + (largo * mts2), y))) {
      resultadoPerimetro = false
      break
    }
  }
  if (resultadoPerimetro) {
    for (i = y; i <= y + (largo * mts2); i = i + mts2) {
      if (!pathPerimetro.contains(new Point(x, i)) || !pathPerimetro.contains(new Point(x, i + (ancho * mts2)))) {
        resultadoPerimetro = false
        break
      }
    }
  }
  return resultadoPerimetro
}
// //fin funcion para revisar si el espacio esta ocupando

// //////////// FIN FUNCION ACTUALIZAR /////////

/* organiza el punto para que ubique la coordenada correspondiente con un cuadro */
function ubicaCoordenada (puntoCoordenada) {
  var pos1 = puntoCoordenada.x
  var pos2 = puntoCoordenada.y
  coordenadaNuevoElemento.x = Math.floor(pos1 / mts2) * mts2
  coordenadaNuevoElemento.y = Math.floor(pos2 / mts2) * mts2
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
function actualizarBD (x, y, ancho,largo, date1,date2,time1,time2, categoria, cliente ,id, comentario, date, typeUpdate) {
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



// /////////////////////////////////////////////////////////////////////
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
   fechaSeleccionada = fechaActual;
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
