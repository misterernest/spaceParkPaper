$(document).ready(function(){
  let idResaltar = -1;
  let arrayResaltar = new Array();
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let arrayAreasOcupadas = new Array();


  $("#canvas2").mousemove(function(e){
    if (!seleccionBtnMover) {
      let coordenadaTemp = new Array();
      if (zoom) {
        coordenadaTemp = [e.offsetX, e.offsetY];
      }else{
        coordenadaTemp = [e.offsetX / zoom_proporcion, e.offsetY / zoom_proporcion];
      }

      context2.clearRect(0, 0, canvas2.width, canvas2.width);
      coordenadaTemp[2] = 1;
      coordenadaTemp[3] = 1;
      coordenadaTemp[4] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
      coordenadaTemp[5] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
      coordenadaTemp[6] = `${fechaSeleccionada.getHours()+1}:00:00`;
      coordenadaTemp[7] = `${fechaSeleccionada.getHours()+1}:00:00`;
      coordenadaTemp[8] = "contenedor";
      idResaltar = areaDisponible(coordenadaTemp, respuestaConsulta);
      if (idResaltar > -1) {
        context2.fillStyle = colorCategoriaResalta[arrayAreasOcupadas[idResaltar].categoria];
        $("#info-head").text(`id: ${arrayAreasOcupadas[idResaltar].id} - ${arrayAreasOcupadas[idResaltar].categoria}`);
        $("#info-cliente").text(`Cliente: ${arrayAreasOcupadas[idResaltar].cliente}`);
        let dateA = new Date();
        let dateB = new Date();
        dateA.setTime(Date.parse(arrayAreasOcupadas[idResaltar].fecha_incial));
        let mes1 = mesNumtext(dateA.getMonth()+1);
        dateB.setTime(Date.parse(arrayAreasOcupadas[idResaltar].fecha_final));
        let mes2 = mesNumtext(dateB.getMonth()+1);
        $("#info-fecha").text(`${dias[dateA.getDay()]} ${dateA.getDate()} de ${mes1} de ${dateA.getFullYear()} - ${dias[dateB.getDay()]} ${dateB.getDate()} de ${mes2} de ${dateB.getFullYear()}`);
        $("#info-size").text(`W:${arrayAreasOcupadas[idResaltar].ancho_x} mts X H:${arrayAreasOcupadas[idResaltar].largo_y} mts`);
        if(zoom){
          context2.fillRect(
            arrayAreasOcupadas[idResaltar].coordenada_x *  1 + 0.5,
            arrayAreasOcupadas[idResaltar].coordenada_y * 1 + 0.5,
            arrayAreasOcupadas[idResaltar].ancho_x * mts2 * 1 + 0.5,
            arrayAreasOcupadas[idResaltar].largo_y * mts2 * 1 + 0.5
          )
          $("#info-popup").removeAttr("hidden");
          $("#info-popup").removeClass("info-popup-zoom0");
          $("#info-popup").addClass("info-popup-zoom");
        }else{
          context2.fillRect(
            arrayAreasOcupadas[idResaltar].coordenada_x *  zoom_proporcion + 0.5,
            arrayAreasOcupadas[idResaltar].coordenada_y * zoom_proporcion + 0.5,
            arrayAreasOcupadas[idResaltar].ancho_x * mts2 * zoom_proporcion + 0.5,
            arrayAreasOcupadas[idResaltar].largo_y * mts2 * zoom_proporcion + 0.5
          )
          $("#info-popup").removeAttr("hidden");
          $("#info-popup").removeClass("info-popup-zoom");
          $("#info-popup").addClass("info-popup-zoom0");
        }
      }else{
        context2.clearRect(0, 0, canvas2.width, canvas2.width);
        $("#info-popup").attr("hidden", "hidden");
      }
    }
  });

  function areaDisponible(coordenadaTemp, respuestaConsulta){
    let idResaltarLocal = -1;
    let date1 = new Date();
    arrayAreasOcupadas = [];
    date1.setTime(Date.parse(`${coordenadaTemp[4]} ${coordenadaTemp[6]}`) );
    let dateA = new Date();
    let dateB = new Date();
    let idBorrar = 0;
    for (let i = 0; i < respuestaConsulta.length; i++) {
      dateA.setTime(Date.parse(respuestaConsulta[i].fecha_incial));
      dateB.setTime(Date.parse(respuestaConsulta[i].fecha_final));
      if ((date1 > dateA && date1 < dateB)) {
        arrayAreasOcupadas.push(respuestaConsulta[i]);
      }
    }
    if (arrayAreasOcupadas.length > 0) {
      for (var i = 0; i < arrayAreasOcupadas.length; i++) {
        if(recorreArrayAreasInternas(arrayAreasOcupadas[i], coordenadaTemp)){
          idResaltarLocal = i;
        }
      }
    }
    return idResaltarLocal;
  }

  /* Verifica si el punto actual esta dentro de un area ocupada (true si esta dentro del cuadro ocupado)*/
    function recorreArrayAreasInternas(arrayCoor, coordenada){

      const x = coordenada[0];
      const y = coordenada[1];
      const x1 = arrayCoor.coordenada_x * 1;
      const x2 = (arrayCoor.ancho_x * mts2) + (x1 * 1);
      const y1 = arrayCoor.coordenada_y * 1;
      const y2 = (arrayCoor.largo_y * mts2) + (y1 * 1);

      let respuesta = false;
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        respuesta = true;
      }
      return respuesta;
    }


});
