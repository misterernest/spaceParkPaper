$(document).ready(function(){
  /* Manejo del Canvas y su inicializacion */
  let canvas1 = document.getElementById("canvas1");//$("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = document.getElementById("canvas2");//$("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = document.getElementById("canvas3");//$("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");
  let paint = false;
  let idMover = 0;
  let coordenadaTemp = new Array();
  //fecha a realizar el cambio en la base de datos
  let fechaRevisar = "";

  $("#mover").click(function(){
    if (seleccionBtnMover) {
      $('#zoom').removeClass("btn-inactivo");
      seleccionBtnMover = cambiaEstBtn($("#mover"), true);
      coordenadaTemp = [];
    }else{
      $('#zoom').addClass("btn-inactivo");
      seleccionBtnMover = cambiaEstBtn($("#mover"), false);
      seleccionBtnActualizaFecha = cambiaEstBtn($("#actualiza-fecha"), true);
      seleccionBtnEliminar = cambiaEstBtn($("#eliminar"), true);
      if(zoom){
        zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
      }
    }
    //coordenadaTemp = [];
  });
  $("#actualiza-fecha").click(function(){
    if (seleccionBtnActualizaFecha) {
      $('#zoom').removeClass("btn-inactivo");
      seleccionBtnActualizaFecha = cambiaEstBtn($("#actualiza-fecha"), true);
    }else{
      $('#zoom').addClass("btn-inactivo");
      seleccionBtnActualizaFecha = cambiaEstBtn($("#actualiza-fecha"), false);
      seleccionBtnEliminar = cambiaEstBtn($("#eliminar"), true);
      seleccionBtnMover = cambiaEstBtn($("#mover"), true);
      if(zoom){
        zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
      }
    }

  });

  $("#canvas2").mousedown(function(e){
    if (seleccionBtnMover && !zoom && !seleccionBtnActualizaFecha) {
      fechaRevisar = (`${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()} ${fechaSeleccionada.getHours()}:${fechaSeleccionada.getMinutes()}:00`);
      let posCuadro = ubicaCoordenada([(e.offsetX /zoom_proporcion), (e.offsetY / zoom_proporcion)]);
      coordenadaTemp[0] = (posCuadro[0]);
      coordenadaTemp[1] = (posCuadro[1]);
      coordenadaTemp[2] = 1;
      coordenadaTemp[3] = 1;
      coordenadaTemp[4] = fechaRevisar;
      coordenadaTemp[5] = fechaRevisar;
      coordenadaTemp[6] = `${fechaSeleccionada.getHours()}:00`;
      coordenadaTemp[7] = `${fechaSeleccionada.getHours()+1}:00`;
      coordenadaTemp[8] = "contenedor";
      areaDisponibleLocal(respuestaConsulta);
      paint = true;
    }else if (seleccionBtnActualizaFecha && !zoom) {
      fechaRevisar = (`${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()} ${fechaSeleccionada.getHours()}:${fechaSeleccionada.getMinutes()}:00`);
      let posCuadro = [(e.offsetX /zoom_proporcion), (e.offsetY / zoom_proporcion)];
      coordenadaTemp[0] = (posCuadro[0]);
      coordenadaTemp[1] = (posCuadro[1]);
      coordenadaTemp[2] = 1;
      coordenadaTemp[3] = 1;
      coordenadaTemp[4] = fechaRevisar;
      coordenadaTemp[5] = fechaRevisar;
      coordenadaTemp[6] = `${fechaSeleccionada.getHours()}:00`;
      coordenadaTemp[7] = `${fechaSeleccionada.getHours()+1}:00`;
      coordenadaTemp[8] = "contenedor";
      areaDisponibleLocal(respuestaConsulta);
      ventanaActualiza(`Desea actualizar los datos del elemento`, 2);

    }
  });
  $("#canvas2").mousemove(function(e){
    if (seleccionBtnMover && coordenadaTemp["id"] != 0 && paint && !seleccionBtnActualizaFecha) {
      coordenadaTemp[0] = e.offsetX;
      coordenadaTemp[1] = e.offsetY;
      mueveElemento();
    }
  });

  $("#canvas2").mouseup(function(e){
      if (seleccionBtnMover && coordenadaTemp[9] != 0 && !seleccionBtnActualizaFecha) {
        if (zoom) {
          paint = false;
          let posCuadroTemp = new Array();
          posCuadroTemp[0] = coordenadaTemp[0];
          posCuadroTemp[1] = coordenadaTemp[1];
          posCuadroTemp = ubicaCoordenada(posCuadroTemp);
          coordenadaTemp[0] = posCuadroTemp[0];
          coordenadaTemp[1] = posCuadroTemp[1];
          llenaMatrizLocal();

        }else{
          let posCuadroTemp = new Array();
          posCuadroTemp[0] = coordenadaTemp[0] / zoom_proporcion;
          posCuadroTemp[1] = coordenadaTemp[1] / zoom_proporcion;
          posCuadroTemp = ubicaCoordenada(posCuadroTemp);
          coordenadaTemp[0] = posCuadroTemp[0];
          coordenadaTemp[1] = posCuadroTemp[1];
          llenaMatrizLocal();
        }
        if (coordenadaTemp.length > 0) {
          if(validaEspacioInterno() && !zoom){
            zoomMapa(e, canvas1, context1, canvas2, context2, canvas3, context3);
          }else if(validaEspacioInterno() && zoom){
            ventanaActualiza(`Desea realizar el movimiento del elemento`, 1);
          }else if(!validaEspacioInterno()){
            context2.clearRect(0, 0, canvas2.width, canvas2.width);
            if(zoom) zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
            coordenadaTemp = [];
          }
        }else if(coordenadaTemp.length <= 0){
          if(zoom) zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
          context2.clearRect(0, 0, canvas2.width, canvas2.width);
        }
      }
  });

  function ventanaActualiza(mensaje, tipoActualizacion){

      /* $('#myConfirm1Label').text("PREGUNTA");
      $('#msj-confirm1').text(``);
      $('#msj-confirm1').append(`<div class="col-lg-11 col-md-11">${mensaje}</div>`);
      $('#confirm1').modal('show'); */

        $('#confirm1').modal('hide');
        $("#anchoX").val(coordenadaTemp[2]);
        $("#largoY").val(coordenadaTemp[3]);
        $("#date").val(coordenadaTemp[4].slice(0, 10));
        $("#date1").val(coordenadaTemp[5].slice(0, 10));
        $("#time").val(coordenadaTemp[4].slice(11));
        $("#time1").val(coordenadaTemp[5].slice(11));
        $("#categoria").val(coordenadaTemp[8]);
        $("#cliente").val(coordenadaTemp[7]);
        $("#comentario").html(coordenadaTemp[11]);
        $('#modal').modal('show');
        $("#guardar").click(function(){
          anchoCuadro = $("#anchoX").val();
          largoCuadro =$("#largoY").val();
          let mensaje = new Array();
          $('#msj-alert').text("");


          let valido = true;

          if(anchoCuadro == '' || largoCuadro == '' || anchoCuadro <= 0 || largoCuadro <= 0){
            mensaje.push("Ancho y largo del area son obligatorios y deben ser positivo");
            valido = false;
          }

          if ($("#date").val() == '' || $("#time").val() == '') {
            mensaje.push("Fecha y hora inicial son obligatorios");
            valido = false;
          }

          if ($("#date1").val() == '' || $("#time1").val() == '') {
            mensaje.push("Fecha y hora final son obligatorios");
            valido = false;
          }

          if(validaFecha($("#date").val(), $("#date1").val())){
            mensaje.push("Fecha inicial debe ser mayor de la fecha final");
            valido = false;
          }

          if($("#cliente").val() == ''){
            mensaje.push("El cliente es un campo obligatorio");
            valido = false;
          }
          if(!valido){
            $('#myAlertLabel').text("ADVERTENCIA")
            for (let i = 0; i < mensaje.length; i++) {
              $('#msj-alert').append(`<div class="col-lg-11 col-md-11"> ${mensaje[i]} </div>`)
            }
            $('#alert').modal('show');
          }else if(valido){
            $('#modal').modal('hide');
          }

          if (valido) {
            coordenadaTemp[2] = $("#anchoX").val();
            coordenadaTemp[3] = $("#largoY").val();
            coordenadaTemp[4] = $("#date").val();
            coordenadaTemp[5] = $("#date1").val();
            coordenadaTemp[6] = $("#time").val();
            coordenadaTemp[7] = $("#time1").val();
            coordenadaTemp[8] = $("#categoria").val();
            coordenadaTemp[10] = coordenadaTemp[9];
            coordenadaTemp[9] = $("#cliente").val();
            coordenadaTemp[11] = $("#comentario").val();
            actualizarBD(
              coordenadaTemp[0],
              coordenadaTemp[1],
              coordenadaTemp[2],
              coordenadaTemp[3],
              coordenadaTemp[4],
              coordenadaTemp[5],
              coordenadaTemp[6],
              coordenadaTemp[7],
              coordenadaTemp[8],
              coordenadaTemp[9],
              coordenadaTemp[10],
              coordenadaTemp[11],
              fechaRevisar,
              tipoActualizacion
            );
          }else{
            $('#modal').modal('show');
          }

        });

      $("#rechazar").click(function(){
        context2.clearRect(0, 0, canvas2.width, canvas2.width);
        $('#confirm1').modal('hide');
      });
      $("#cerrar").click(function(){
        context2.clearRect(0, 0, canvas2.width, canvas2.width);
        $('#confirm1').modal('hide');
      });

      $("#confirm1").on('hidden.bs.modal', function () {
        context2.clearRect(0, 0, canvas2.width, canvas2.width);
      });

  }

  function areaDisponibleLocal(arrayAreasOcupadas){
    let arrayAreaCoincide = new Array();
    let date1 = new Date();
    date1.setTime(Date.parse(fechaRevisar) );
    let date2 = new Date();
    date2.setTime(Date.parse(fechaRevisar));
    let dateA = new Date();
    let dateB = new Date();
    let  = 0;
    for (let i = 0; i < arrayAreasOcupadas.length; i++) {
      dateA.setTime(Date.parse(arrayAreasOcupadas[i]["fecha_incial"]));
      dateB.setTime(Date.parse(arrayAreasOcupadas[i]["fecha_final"]));
      if (date1 >= dateA && date1 <= dateB) {
        arrayAreaCoincide.push(arrayAreasOcupadas[i]);
      }
    }
    if (arrayAreaCoincide.length > 0) {
      for (var i = 0; i < arrayAreaCoincide.length; i++) {
        respuesta = llenaMatrizInternoBusca(arrayAreaCoincide[i]); // si llega a coincidir en un punto lo vuelve false
        if(!respuesta){
            coordenadaTemp[0] = arrayAreaCoincide[i].coordenada_x;
            coordenadaTemp[1] = arrayAreaCoincide[i].coordenada_y;
            coordenadaTemp[2] = arrayAreaCoincide[i].ancho_x;
            coordenadaTemp[3] = arrayAreaCoincide[i].largo_y;
            coordenadaTemp[4] = arrayAreaCoincide[i].fecha_incial;
            coordenadaTemp[5] = arrayAreaCoincide[i].fecha_final;
            coordenadaTemp[7] = arrayAreaCoincide[i].cliente;
            coordenadaTemp[8] = arrayAreaCoincide[i].categoria;
            coordenadaTemp[9] = arrayAreaCoincide[i].id;
            coordenadaTemp[10] = arrayAreaCoincide[i].angulo;
            coordenadaTemp[11] = arrayAreaCoincide[i].comentario;
          break;
        }
      }
    }
  }
  /* Crea la matriz con los cuadros a dibujar */
  function llenaMatrizInternoBusca(arrayAreasOcupadas){
    /* cooredenadas a comparara si es posible ubicar dentro de este espacio */
    let x1 = arrayAreasOcupadas["coordenada_x"]*1;
    let y1 = arrayAreasOcupadas["coordenada_y"]*1;
    let x2 = x1 + (arrayAreasOcupadas["ancho_x"] * mts2);
    let y2 = y1 + (arrayAreasOcupadas["largo_y"] * mts2);
    //parametros que van a buscar coincidencia con rectangulo
    let OrigenX = coordenadaTemp[0];
    let OrigenY = coordenadaTemp[1];
    let ancho = coordenadaTemp[2];
    let largo = coordenadaTemp[3];
    let arrayCoordComparacion = Array(x1, x2, y1, y2);
    let respuesta = true;
    for (var i = 0; i < ancho; i++) {
      for (var j = 0; j < largo; j++) {
        //si llega a tocar
        if(!areaDisponibleInterno([OrigenX + (mts2 * i), OrigenY + (mts2 * j)], arrayCoordComparacion)){
          respuesta = false;
          break;
        }
      }
    }
    return respuesta;
  }

  /* Detecta si la coordenada esta dento de un area ocupada o libre
   si es false esta fuera de un recuadro ocupado (false si no es valido) */

    function areaDisponibleInterno(coordenada, areaOcupadaInterna){
      let puntoValido = true;
      let puntoDentro = recorreArrayAreasInternas(areaOcupadaInterna, coordenada);
      if(puntoDentro){
        puntoValido = false;
      }
      return puntoValido;
    }

  /* Verifica si el punto actual esta dentro de un area ocupada (true si esta dentro del cuadro ocupado)*/
    function recorreArrayAreasInternas(arrayCoor, coordenada){
      const x = coordenada[0];
      const y = coordenada[1];
      const x1 = arrayCoor[0];
      const x2 = arrayCoor[1];
      const y1 = arrayCoor[2];
      const y2 = arrayCoor[3];
      let respuesta = false;
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        respuesta = true;
      }
      return respuesta;
    }

    function mueveElemento(){
      context2.clearRect(0, 0, canvas2.width, canvas2.width);
      if (zoom) {
        context2.moveTo(coordenadaTemp[0], coordenadaTemp[1]);
        context2.fillStyle = colorCategoria[coordenadaTemp[8]];
        context2.fillRect(
          coordenadaTemp[0],
          coordenadaTemp[1],
          coordenadaTemp[2] * mts2,
          coordenadaTemp[3] * mts2
        );
      }else{
        context2.moveTo(coordenadaTemp[0], coordenadaTemp[1]);
        context2.fillStyle = colorCategoria[coordenadaTemp[8]];
        context2.fillRect(
          coordenadaTemp[0],
          coordenadaTemp[1],
          coordenadaTemp[2] * mts2 * zoom_proporcion,
          coordenadaTemp[3] * mts2 * zoom_proporcion
        );
      }
    }

    /*
    Crea la matriz de cuadros a dibujar
     */
     function llenaMatrizLocal(){
       let OrigenX = coordenadaTemp[0];
       let OrigenY = coordenadaTemp[1];
       ancho = coordenadaTemp[2];
       largo = coordenadaTemp[3];
       for (var i = 0; i < ancho; i++) {
         for (var j = 0; j < largo; j++) {
           if(!areaDisponible([OrigenX + (mts2 * i), OrigenY + (mts2 * j)])){
             coordenadaTemp = [];
             break;
           }
         }
         if (coordenadaTemp.length == 0) {
           break;
         }
       }
     }

     /* Valida lo espacios internos de las instalaciones si se esta ocupando con algun otro elemento */
     function validaEspacioInterno(){
       let respuesta = true; // si es true es valido para ubicar
       fechaRevisar = (`${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()} ${fechaSeleccionada.getHours()}:00:00`);
       let date1 = new Date();
       date1.setTime(Date.parse(`${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()} ${fechaSeleccionada.getHours()}:00:00`) );
       let date2 = new Date();
       date2.setTime(Date.parse(`${coordenadaTemp[5]}`));
       let dateA = new Date();
       let dateB = new Date();
       let arrayComparacion = new Array();
       for (let i = 0; i < respuestaConsulta.length; i++) {
         dateA.setTime(Date.parse(respuestaConsulta[i].fecha_incial));
         dateB.setTime(Date.parse(respuestaConsulta[i].fecha_final));
         if (((date1 > dateA && date1 < dateB)
         || (date2 > dateA && date2 < dateB)
         || (date1 < dateA && date2 > dateB))) {
           arrayComparacion.push(respuestaConsulta[i]);
         }
       }
       if (arrayComparacion.length > 0) {
         for (var i = 0; i < arrayComparacion.length; i++) {
           respuesta = llenaMatrizInterno(coordenadaTemp, arrayComparacion[i]); // si llega a coincidir en un punto lo vuelve false
           if(!respuesta){
             $('#myAlertLabel').text("ADVERTENCIA")
             $('#msj-alert').text(``);
             $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Espacio ocupado por otro elelmento</div>`)
             $('#alert').modal('show');
             break;
           }
         }
       }
       return respuesta;
     }

     /* Crea la matriz con los cuadros a dibujar */
     function llenaMatrizInterno(coordenaAUbicar, arrayComparacion){
       /* cooredenadas a comparara si es posible ubicar dentro de este espacio */
       let x1 = arrayComparacion["coordenada_x"]*1;
       let y1 = arrayComparacion["coordenada_y"]*1;
       let x2 = x1 + (arrayComparacion["ancho_x"] * mts2);
       let y2 = y1 + (arrayComparacion["largo_y"] * mts2);
       //parametros que van a buscar coincidencia con rectangulo
       let OrigenX = coordenaAUbicar[0]*1;
       let OrigenY = coordenaAUbicar[1]*1;
       let ancho = coordenaAUbicar[2]*1;
       let largo = coordenaAUbicar[3]*1;
       let arrayCoordComparacion = Array(x1, x2, y1, y2);
       let respuesta = true;
       for (var i = 0; i < ancho; i++) {
         for (var j = 0; j < largo; j++) {
           //si llega a tocar
           if(!areaDisponibleInterno([OrigenX + (mts2 * i), OrigenY + (mts2 * j)], arrayCoordComparacion)){
             respuesta = false;
             break;
           }
         }
       }
       return respuesta;
     }

});//fin document ready **********************************************************************


//actualizarBD(600,150, 9, '2018-03-20 02:53:00');
function actualizarBD (x, y, ancho,largo, date1,date2,time1,time2, categoria, cliente ,id, comentario, date, typeUpdate){
 // Convertir a objeto
 var data = {};

 data.date = date;
 data.id = id;
 data.x = x;
 data.y = y;
 data.ancho = ancho;
 data.largo = largo;
 data.date1 = date1;
 data.date2 = date2;
 data.time1 = time1;
 data.time2 = time2;
 data.categoria = categoria;
 data.comentario = comentario;
 data.cliente = cliente;
 data.typeUpdate = typeUpdate;
 var url = 'actualizar.php';   //este es el PHP al que se llama por AJAX

 	resultado = new Array();
     $.ajax({
       method: 'POST',
       url: url,
       data: data,   //acá están todos los parámetros (valores a enviar) del POST
       success: function(response){
         // resultado es un array que indica exitoso o no.
         if(response == "1"){
           $('#myAlertLabel').text("MOVIMIENTO")
           $('#msj-alert').text(``);
           $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Espacio actualizado correctamente</div>`)
           $('#alert').modal('show');
         }else{
           $('#myAlertLabel').text("ERROR")
           $('#msj-alert').text(``);
           $('#msj-alert').append(`<div class="col-lg-11 col-md-11">No se pudo actualizar el espacio error al actualizar en base de datos</div>`)
           $('#alert').modal('show');
         }
         $("#enterado").click(function(){
           location.reload();
         });
       },
       error: function( jqXHR, textStatus, errorThrown ) {
         $('#myAlertLabel').text("ERROR")
         $('#msj-alert').text(``);
         $('#msj-alert').append(`<div class="col-lg-11 col-md-11">ERROR ${textStatus} - ${jqXHR} - ${errorThrown}</div>`)
         $('#alert').modal('show');
       }
     });
   }
