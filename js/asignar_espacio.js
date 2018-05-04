$(document).ready(function(){
  let coordenadaTemp = new Array();
    let cuentaCuadros = 0; // cantidad de cuadros seleccionado con el mouse

    /* Manejo del Canvas y su inicializacion */
    let canvas1 = $("#canvas1").get(0);
    const context1 = canvas1.getContext("2d");
    let canvas2 = $("#canvas2").get(0);
    const context2 = canvas2.getContext("2d");
    let canvas3 = $("#canvas3").get(0);
    const context3 = canvas3.getContext("2d");
    $('#canvas2').mousedown(function(e){

    });

    /*
  Funciones que maneja el evento del mouse sobre el canvas2 para pintar recuadros
     */
    $('#canvas2').mouseup(function(e){
      if (zoom && !seleccionBtnEliminar && !seleccionBtnMover && !seleccionBtnActualizaFecha) {
        let posCuadro = ubicaCoordenada([e.offsetX, e.offsetY]);
        if (areaDisponible(posCuadro)) {
          resBusca = buscaCoordenada(posCuadro,coordenadaTemp);
          if (resBusca[0]) {
            cuentaCuadros--;
            borraRecuadro(posCuadro);
            coordenadaTemp = [];
          }else {
            if (cuentaCuadros > 0) {
              borraRecuadro(coordenadaTemp[0]);
              coordenadaTemp = [];
              cuentaCuadros--;
            }
            cuentaCuadros++;
            coordenadaTemp.push(posCuadro);
            let lengthArray = coordenadaTemp.length;
            repinta(
              coordenadaTemp[lengthArray - 1], context2
            );
          }
          if (seleccionBtnEliminar) {
            coordenadaTemp[0][2] = 1;
            coordenadaTemp[0][3] = 1;
            coordenadaTemp[0][4] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
            coordenadaTemp[0][5] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
            coordenadaTemp[0][6] = `${fechaSeleccionada.getHours()}:00`;
            coordenadaTemp[0][7] = `${fechaSeleccionada.getHours()+1}:00`;
            coordenadaTemp[0][8] = "ELEMENTO";
            coordenadaTemp[0][8] = "GENERICO";
            ejecutaCuadro(true);
          }else{
            if(coordenadaTemp.length != 0){
              $('#modal').modal('show');
            }
          }
        }
      }
    });


    $("#enterado").click(function(){
      $('#alert').modal('hide');
    })


    /*
    Responde al evento del boton guardar del modal
     */

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

       }
       if (valido && !seleccionBtnMover && !seleccionBtnActualizaFecha) {
         coordenadaTemp[0][2] = $("#anchoX").val();
         coordenadaTemp[0][3] = $("#largoY").val();
         coordenadaTemp[0][4] = $("#date").val();
         coordenadaTemp[0][5] = $("#date1").val();
         coordenadaTemp[0][6] = $("#time").val();
         coordenadaTemp[0][7] = $("#time1").val();
         coordenadaTemp[0][8] = $("#categoria").val();
         coordenadaTemp[0][9] = $("#cliente").val();
         coordenadaTemp[0][10] = 0;
         coordenadaTemp[0][11] = $("#comentario").val();
         llenaMatriz(coordenadaTemp[0][2] , coordenadaTemp[0][3]);
         if (coordenadaTemp[0].length > 2 ) {
           if (validaEspacioInterno()) {
             guardarBaseDatos(
               coordenadaTemp[0][0],
               coordenadaTemp[0][1],
               coordenadaTemp[0][2],
               coordenadaTemp[0][3],
               coordenadaTemp[0][4],
               coordenadaTemp[0][5],
               coordenadaTemp[0][6],
               coordenadaTemp[0][7],
               coordenadaTemp[0][8],
               coordenadaTemp[0][9],
               coordenadaTemp[0][10],
               coordenadaTemp[0][11]
             );
           }
         }

       }else{
         $('#modal').modal('show');
       }
     } );






  /* Revisa si un punto esta ocupado o no */
  function buscaCoordenada(pos, arrayCoordenadas){
    let encontro = false;
    let posicion = -1;
    for (let i = 0; i < arrayCoordenadas.length; i++) {
      if (pos[0] == arrayCoordenadas[i][0]) {
        if (pos[1] == arrayCoordenadas[i][1]) {
          encontro = true;
          posicion = i;
        }
      }
    }
    return [encontro, posicion];
  }

  /*
  Borra el recuadro ya pintado
   */
  function borraRecuadro(coordenada){
    if(context2){
      context2.clearRect(
        coordenada[0],
        coordenada[1],
        mts2,
        mts2
      );
    }
  }


  /*
  Crea la matriz de cuadros a dibujar
   */
   function llenaMatriz(ancho, largo){
     let OrigenX = coordenadaTemp[0][0];
     let OrigenY = coordenadaTemp[0][1];
     for (var i = 0; i < ancho; i++) {
       for (var j = 0; j < largo; j++) {
         if(!areaDisponible([OrigenX + (mts2 * i), OrigenY + (mts2 * j)])){
           coordenadaTemp = [];
           coordenadaTemp[0] = [OrigenX, OrigenY];
           break;
         }
       }
     }
   }



   /* Valida lo espacios internos de las instalaciones si se esta ocupando con algun otro elemento */
   function validaEspacioInterno(){
     let respuesta = true; // si es true es valido para ubicar
     let date1 = new Date();
     date1.setTime(Date.parse(`${coordenadaTemp[0][4]} ${coordenadaTemp[0][6]}`) );
     let date2 = new Date();
     date2.setTime(Date.parse(`${coordenadaTemp[0][5]} ${coordenadaTemp[0][7]}`));
     let dateA = new Date();
     let dateB = new Date();
     let arrayCoomparacion = new Array();
     for (let i = 0; i < respuestaConsulta.length; i++) {
       dateA.setTime(Date.parse(respuestaConsulta[i]["fecha_incial"]));
       dateB.setTime(Date.parse(respuestaConsulta[i]["fecha_final"]));
       if ((date1 > dateA && date1 < dateB) || (date2 > dateA && date2 < dateB) || (date1 < dateA && date2 > dateB)) {
         arrayCoomparacion.push(respuestaConsulta[i]);
       }
     }
     if (arrayCoomparacion.length > 0) {
       for (var i = 0; i < arrayCoomparacion.length; i++) {
         respuesta = llenaMatrizInterno(coordenadaTemp, arrayCoomparacion[i]); // si llega a coincidir en un punto lo vuelve false
         if(!respuesta){
           $('#myAlertLabel').text("ADVERTENCIA")
           $('#modal').modal('hide');
           $('#msj-alert').text(`Espacio ocupado por otro elemento`);
           $('#alert').modal('show');
           break;
         }
       }
     }
     return respuesta;
   }

   /* Crea la matriz con los cuadros a dibujar */
   function llenaMatrizInterno(coordenaAUbicar, arrayCoomparacion){
     /* cooredenadas a comparara si es posible ubicar dentro de este espacio */
     let x1 = arrayCoomparacion["coordenada_x"]*1;
     let y1 = arrayCoomparacion["coordenada_y"]*1;
     let x2 = x1 + (arrayCoomparacion["ancho_x"] * mts2);
     let y2 = y1 + (arrayCoomparacion["largo_y"] * mts2);
     //parametros que van a buscar coincidencia con rectangulo
     let OrigenX = coordenaAUbicar[0][0];
     let OrigenY = coordenaAUbicar[0][1];
     let ancho = coordenaAUbicar[0][2];
     let largo = coordenaAUbicar[0][3];
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

});//fin document ready ***************************************************************************

/*
Detecta si la coordenada esta un punto valido
 */
function areaDisponible(coordenada){
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let puntoValido = false;
  let numEncuentro = recorreArrayAreas(areaDisponible1, coordenada);
  numEncuentro += recorreArrayAreas(areaDisponible2, coordenada);
  if(numEncuentro % 2 != 0){
    puntoValido = true;
  }else{
    $("#modal").modal('hide');
    $('#myAlertLabel').text("ADVERTENCIA")
    $('#msj-alert').text(``);
    $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Área no permitida seleccione una nueva ubicación dentro de las intalaciones</div>`)
    $('#alert').modal('show');
  }

  return puntoValido;
}

/*
Recorre el array revisando cuantas veces toca el perimetro
*/
function recorreArrayAreas(arrayCoor, coordenada){
 const x = coordenada[0];
 const y = coordenada[1];
 let numEncuentro = 0;
 let pendiente = 0;
 let x1 = 0;
 let y1 = 0;
 let x2 = 0;
 let y2 = 0;
 let resEcuacion = x+1;
 let numY = Array();
 for (let i = 0; i < arrayCoor.length - 1; i++) {
   numY = mayorAMenor(arrayCoor[i][1], arrayCoor[i+1][1]);
   if (y >=  numY[0] && y <= numY[1]) {
     if (x >= arrayCoor[i][0] && x >= arrayCoor[i+1][0]) {
       numEncuentro++;
     }else{
       x1 = arrayCoor[i][0];
       y1 = arrayCoor[i][1];
       x2 = arrayCoor[i+1][0];
       y2 = arrayCoor[i+1][1];
       pendiente = (y2 - y1)/(x2 - x1);
       if(pendiente != 0){
         resEcuacion = ((y - y1) / pendiente) + x1;
       }
       if(x > resEcuacion){
         numEncuentro++;
       }
       resEcuacion = x + 1;
     }
   }
 }
 return numEncuentro;
}

/*
Retorna un array con dos numeros, pos1 num menor - pos2 num mayor
*/
function mayorAMenor(num1, num2){
  if (num1 > num2) {
      let numTemp = num1;
      num1 = num2;
      num2 = numTemp;
  }
  return [num1, num2];
}

// AJAX Guardar Formulario

function guardarBaseDatos (x, y, ancho,largo, date1,date2,time1,time2, categoria, cliente, angulo, comentario){
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
      success: function(response){
        // Se ejecuta al finalizar
        //   mostrar si está OK en consola
        if(response == "1"){
          $('#myAlertLabel').text("MENSAJE")
          $('#modal').modal('hide');
          $('#msj-alert').text(``);
          $('#msj-alert').append(`<div class="col-lg-11 col-md-11">Espacio asignado correctamente </div>`)
          $('#alert').modal('show');
          $("#enterado").click(function(){
            location.reload();
          });
        }else{
          $('#myAlertLabel').text("MENSAJE")
          $('#modal').modal('hide');
          $('#msj-alert').text(``);
          $('#msj-alert').append(`<div class="col-lg-11 col-md-11">No se pudo asignar espacio error al guardar base de datos </div>`)
          $('#alert').modal('show');
        }
      },
      error: function( jqXHR, textStatus, errorThrown ) {
        $('#myAlertLabel').text("ERROR")
        $('#msj-alert').text(``);
        $('#msj-alert').append(`<div class="col-lg-11 col-md-11">ERROR ${textStatus} - ${jqXHR} - ${errorThrown}</div>`)
        $('#alert').modal('toggle');
      }
    });
  }


  /* Valida fecha la inicial se mayor a la final*/
  function validaFecha(fecha1, fecha2){
    let f1 = new Date();
    let f2 = new Date();
    f1.setTime(Date.parse(fecha1));
    f2.setTime(Date.parse(fecha2));
    return (f1 < f2)? false : true;
  }
