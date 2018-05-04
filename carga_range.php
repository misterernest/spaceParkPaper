<?php
echo '
<script>
$(document).ready(function(){


  let canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = $("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");


  $("#fecha_range").mousemove(function(){
    context3.clearRect(0, 0, canvas3.width, canvas3.width);
    let fechaActual = new Date();
    let dias = $("#fecha_range").val() * 86400;
    fechaActual.setSeconds(dias);
    fechaSeleccionada = fechaActual;
    mesText = mesNumtext(fechaSeleccionada.getMonth() + 1);
    $("#fecha_caja").val(`${mesText} ${fechaSeleccionada.getDate()}, ${fechaSeleccionada.getFullYear()}`);
    recorreConsulta(respuestaConsulta, context3, canvas3);
  });
  $("#fecha_caja").click(function(){
    $("#fecha_range").remove();
    // location.reload()
    context3.clearRect(0, 0, canvas3.width, canvas3.width);
    cargarDiv();
    let fechaActual = new Date();
    fechaSeleccionada = fechaActual;
    mesText = mesNumtext(fechaSeleccionada.getMonth() + 1);
    $("#fecha_caja").val(`${mesText} ${fechaSeleccionada.getDate()}, ${fechaSeleccionada.getFullYear()}`);
    recorreConsulta(respuestaConsulta, context3, canvas3);
  });

  function cargarDiv(){
    $("#container-range").load("carga_range.php");
  }
  $("#fecha_range").focus(function(){
    $(document).keydown(function(e) {
      if (e.keyCode == "39") {
        rangeNewRango();
      }else if(e.keyCode == "37"){
        rangeNewRango();
      }
    });
  });
  function rangeNewRango(){
    context3.clearRect(0, 0, canvas3.width, canvas3.width);
    let fechaActual = new Date();
    let dias = $("#fecha_range").val() * 86400;
    fechaActual.setSeconds(dias);
    fechaSeleccionada = fechaActual;
    mesText = mesNumtext(fechaSeleccionada.getMonth() + 1);
    $("#fecha_caja").val(`${mesText} ${fechaSeleccionada.getDate()}, ${fechaSeleccionada.getFullYear()}`);
    recorreConsulta(respuestaConsulta, context3, canvas3);
  }

});
</script>
<input id="fecha_range" class="form-control col-sm-12 col-md-12" type="range" name="fecha_barra" min="-93" max="365" step="1" value="0">';
