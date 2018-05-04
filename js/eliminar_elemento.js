
$(document).ready(function(){

  let coordenadaTemp = new Array(); //coordenadas que almacenan el estado actual del click

  /* click sobre el boton eliminar */
  $("#eliminar").click(function(){
    if (seleccionBtnEliminar) {
      seleccionBtnEliminar = cambiaEstBtn($("#eliminar"), true);
    }else{
      $('#zoom').removeClass("btn-inactivo");
      seleccionBtnEliminar = cambiaEstBtn($("#eliminar"), false);
      seleccionBtnMover = cambiaEstBtn($("#mover"), true);
      seleccionBtnActualizaFecha = cambiaEstBtn($("#actualiza-fecha"), true);
    }
  });

  $('#canvas2').mouseup(function(e){
    if (zoom && seleccionBtnEliminar) {
      coordenadaTemp[0] = ubicaCoordenada([e.offsetX, e.offsetY]);
      coordenadaTemp[0][2] = 1;
      coordenadaTemp[0][3] = 1;
      coordenadaTemp[0][4] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
      coordenadaTemp[0][5] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
      coordenadaTemp[0][6] = `${fechaSeleccionada.getHours()}:00`;
      coordenadaTemp[0][7] = `${fechaSeleccionada.getHours()+1}:00`;
      coordenadaTemp[0][8] = "contenedor";
      let idBorrar = areaDisponible(coordenadaTemp, respuestaConsulta);
      if ( idBorrar != 0) {
        $('#myConfirm1Label').text("PREGUNTA");
        $('#msj-confirm1').text(``);
        $('#msj-confirm1').append(`<div class="col-lg-11 col-md-11">Desea eliminar este elemento</div>`);
        $('#confirm1').modal('show');

        $("#aceptar").click(function(){
          $('#confirm1').modal("hide");
          eliminarElementoBD(idBorrar);
        });

        $("#rechazar").click(function(){
          $('#confirm1').modal('toggle');
        });
        $("#cerrar").click(function(){
          $('#confirm1').modal('toggle');
        });
        $("#confirm1").on('hidden.bs.modal', function () {
          idBorrar = 0;
        });
      }else{
        $('#myAlertLabel').text("ADVERTENCIA")
        $('#msj-alert').text(``);
        $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Seleccione sobre el elemento a eliminar</div>`)
        $('#alert').modal('toggle');
      }
    }
  });

  function areaDisponible(coordenadaTemp, arrayAreasOcupadas){
    let date1 = new Date();
    date1.setTime(Date.parse(`${coordenadaTemp[0][4]} ${coordenadaTemp[0][6]}`) );
    let date2 = new Date();
    date2.setTime(Date.parse(`${coordenadaTemp[0][5]} ${coordenadaTemp[0][7]}`));
    let dateA = new Date();
    let dateB = new Date();
    let idBorrar = 0;
    for (let i = 0; i < arrayAreasOcupadas.length; i++) {
      dateA.setTime(Date.parse(arrayAreasOcupadas[i]["fecha_incial"]));
      dateB.setTime(Date.parse(arrayAreasOcupadas[i]["fecha_final"]));
      if (!((date1 > dateA && date1 < dateB)
      || (date2 > dateA && date2 < dateB)
      || (date1 < dateA && date2 > dateB))) {
        arrayAreasOcupadas.splice(i, 1);
      }
    }
    if (arrayAreasOcupadas.length > 0) {
      for (var i = 0; i < arrayAreasOcupadas.length; i++) {
        respuesta = llenaMatrizInterno(coordenadaTemp, arrayAreasOcupadas[i]); // si llega a coincidir en un punto lo vuelve false
        if(!respuesta){
            idBorrar = arrayAreasOcupadas[i]["id"];
          break;
        }
      }
    }
    return idBorrar;
  }

    /* Crea la matriz con los cuadros a dibujar */
    function llenaMatrizInterno(coordenadaTemp, arrayAreasOcupadas){
      /* cooredenadas a comparara si es posible ubicar dentro de este espacio */
      let x1 = arrayAreasOcupadas["coordenada_x"]*1;
      let y1 = arrayAreasOcupadas["coordenada_y"]*1;
      let x2 = x1 + (arrayAreasOcupadas["ancho_x"] * mts2);
      let y2 = y1 + (arrayAreasOcupadas["largo_y"] * mts2);
      //parametros que van a buscar coincidencia con rectangulo
      let OrigenX = coordenadaTemp[0][0];
      let OrigenY = coordenadaTemp[0][1];
      let ancho = coordenadaTemp[0][2];
      let largo = coordenadaTemp[0][3];
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
});



/*Cambia el estado de los botones cuando se presiona el de eliminar*/
function cambiaEstBtn(btn, estado){
  if (estado) {
    btn.removeClass("btn-seleccion");
    return false;
  }else{
    btn.addClass("btn-seleccion");
    return true;
  }
}

//eliminarElementoBD("1");
function eliminarElementoBD(id){
 // Convertir a objeto
 var data = {};
 data.id = id;
 var url = 'eliminarelementobd.php';   //este es el PHP al que se llama por AJAX

 	resultado = new Array();
     $.ajax({
         method: 'POST',
         url: url,
         data: data,   //acá están todos los parámetros (valores a enviar) del POST
         success: function(response){
             // resultado es un array que indica exitoso o no.
             if(response == "1"){
               $('#myAlertLabel').text("ADVERTENCIA")
               $('#msj-alert').text(``);
               $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Elemento eliminado correctamente</div>`)
               $('#alert').modal('toggle');
               $("#enterado").click(function(){
                 location.reload();
               });
             }else{
               $('#myAlertLabel').text("ADVERTENCIA")
               $('#msj-alert').text(``);
               $('#msj-alert').append(`<div class="col-lg-11 col-md-11">No se pudo eliminar elemento, error en base de datos</div>`)
               $('#alert').modal('toggle');
             }
         },
         error: function( jqXHR, textStatus, errorThrown ) {
           $('#myAlertLabel').text("ERROR")
           $('#msj-alert').text(``);
           $('#msj-alert').append(`<div class="col-lg-11 col-md-11">ERROR ${textStatus} - ${errorThrown}</div>`)
           $('#alert').modal('show');
         }
       });
     }
