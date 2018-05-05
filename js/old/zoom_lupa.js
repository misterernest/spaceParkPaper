/*
Hace el zoom en el DOM
 */
function zoomDo(canvas1, context1, canvas2, context2, canvas3, context3){
  if (zoom) {
    zoom = false;
    $('#calendar').removeAttr("hidden", "hidden");
    $('#zoom-in').removeAttr("hidden");
    $('#gant').removeAttr("hidden");
    $('#session').removeAttr("hidden");
    $('#zoom-out').attr("hidden", "hidden");
    $('#zoom').addClass("btn-lupa1");
    $('#zoom').removeClass("btn-lupa2");
    $('#deshacer').addClass("btn-rollback");
    $('#deshacer').removeClass("btn-rollback2");
    $('#mover').addClass("btn-mover1");
    $('#mover').removeClass("btn-mover2");
    $('#actualiza-fecha').addClass("btn-actualizarFecha1");
    $('#actualiza-fecha').removeClass("btn-actualizarFecha2");
    $('#eliminar').addClass("btn-eliminar1");
    $('#eliminar').removeClass("btn-eliminar2");
    $('#categorias').removeAttr("hidden", "hidden");
    $('#container-canvas').removeClass('width-100');
    $('#container-canvas').addClass('width-70');
    $('#img-park').attr("width", zoom_width);
    $('#canvas1').attr("width", zoom_width);
    $('#canvas1').attr("height", zoom_height);
    $('#canvas2').attr("width", zoom_width);
    $('#canvas2').attr("height", zoom_height);
    $('#canvas3').attr("width", zoom_width);
    $('#canvas3').attr("height", zoom_height);
    /* zonasMuertas(areaDisponible1, context1);
    zonasMuertas(areaDisponible2, context1); */
    recorreConsulta(respuestaConsulta, context3, canvas3);
  }else{
    zoom = true;
    $('#calendar').attr("hidden", "hidden");
    $('#zoom-out').removeAttr("hidden");
    $('#zoom').removeClass("btn-lupa1");
    $('#zoom').addClass("btn-lupa2");
    $('#deshacer').removeClass("btn-rollback");
    $('#deshacer').addClass("btn-rollback2");
    $('#mover').addClass("btn-mover2");
    $('#mover').removeClass("btn-mover1");
    $('#actualiza-fecha').removeClass("btn-actualizarFecha1");
    $('#actualiza-fecha').addClass("btn-actualizarFecha2");
    $('#eliminar').addClass("btn-eliminar2");
    $('#eliminar').removeClass("btn-eliminar1");
    $('#gant').attr("hidden", "hidden");
    $('#session').attr("hidden", "hidden");
    $('#zoom-in').attr("hidden", "hidden");
    $('#categorias').attr("hidden", "hidden");
    $('#container-canvas').removeClass('width-70');
    $('#container-canvas').addClass('width-100');
    $('#img-park').removeAttr("width");
    $('#canvas1').attr("width", width);
    $('#canvas1').attr("height", height);
    $('#canvas2').attr("width", width);
    $('#canvas2').attr("height", height);
    $('#canvas3').attr("width", width);
    $('#canvas3').attr("height", height);
    creaCuadricula(canvas1.width, canvas1.height, context1);
    recorreConsulta(respuestaConsulta, context3, canvas3);
    /* zonasMuertas(areaDisponible1, context1);
    zonasMuertas(areaDisponible2, context1); */
  }
}



$(document).ready(function(){
  /* Manejo del Canvas y su inicializacion */
  let canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = $("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");
  $('#zoom').click(function(){
    if (!seleccionBtnMover) {
      zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
    }
  });
});
