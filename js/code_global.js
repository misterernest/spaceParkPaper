//constantes del programa
const mts2 = 12;
const width=2217;
const height=1598;
let zoom_proporcion;
let zoom_width ;
let zoom_height;
let btn_deshacer = false;
$(document).ready(function(){
    zoom_proporcion = $('#container-canvas').width() / width;
    zoom_width = width * zoom_proporcion;
    zoom_height = height*zoom_proporcion;
});
//Constante dia de la semana
const dias = new Array ("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
//const zoom_proporcion = 0.323;
const color = "rgb(120, 8, 8)";
//Asigna un color a cada colorCategoria


const colorCategoria = {
  SAILING_YACHT:"rgb(180, 0, 0)", //RED
  MOTOR_YACHT:"rgb(20, 170, 20)", //GREEN
  CAT:"rgb(0, 0, 170)",//BLUE
  PESCA:"rgb(190, 190, 0)",//YELLOW
  ELEMENTO:"rgb(180, 0, 170)",//PURPLE
  TENDER:"rgb(215,49,31)"//TOMATO
};

const colorCategoriaResalta = {
  SAILING_YACHT:"rgb(255, 0, 0)",//RED
  MOTOR_YACHT:"rgb(51, 204, 51)",//GREEN
  CAT:"rgb(0, 0, 255)",//BLUE
  PESCA:"rgb(255, 255, 0)",//YELLOW
  ELEMENTO:"rgb(220, 0, 210)",//PURPLE
  TENDER:"rgb(255,99,71)"//TOMATO
};

/*Manejo del zoom*/
let zoom = false;

/* Manejo del Canvas y su inicializacion */
  let canvas1 = "";
  let context1 = "";
  let canvas2 = "";
  let context2 = "";
  let canvas3 = "";
  let context3 = "";


/* Variables de fecha actual para hacer la consulta incial*/
  const hoy = new Date();
  const dd = hoy.getDate();
  const mm = hoy.getMonth()+1; //hoy es 0!
  const yyyy = hoy.getFullYear();
  const hour = hoy.getHours();
  const min = 00;
  const seg = 00;
  let mesText = mesNumtext(mm);
  let mesActual = mesText;
  $('#fecha_caja').val(`${mesText} ${dd}, ${yyyy}`);

// Variable de fecha para el input range
// Fecha seleccionada para manejar consultas
  let fechaSeleccionada = hoy;


// cooredenada que vienen de la base de datos, ya estan almacenadas
  let respuestaConsulta = new Array();
  let cantDeshacer = 0;
// coordenadas para delimitar la bodega
  const areaDisponible1 = Array(
    [217, 349],
    [199, 265],
    [215, 225],//
    [404, 93],//
    [711, 115],//
    [692, 373],//
    [1984, 482],//
    [2121, 746],//
    [2078, 763],//
    [2120, 874],//
    [2051, 957],//
    [1681, 959],//
    [1679, 1473],//
    [1341, 1475],//
    [1339, 1019],//
    [258, 1019],//
    [217, 956],//
    [78, 956],//
    [81, 691],//
    [439, 694],//
    [440, 589],//
    [81, 586],//
    [81, 371],//
    [217, 349]
  );
  const areaDisponible2 = new Array();
  /*
  const areaDisponible2 = Array(
    [1596, 553],
    [1992, 600],
    [2028, 600],
    [2112, 756],
    [2076, 780],
    [2112, 888],
    [1596, 888],
    [1596, 553]
  ); */

/* Manejo del evento borrar o mover */
  let seleccionBtnEliminar = false;
  let seleccionBtnMover = false;
  let seleccionBtnActualizaFecha = false;



//Manejo de variables por medio de jquery
  $(document).ready(function(){
    /* Manejo del Canvas y su inicializacion */
    let canvas1 = $("#canvas1").get(0);
    const context1 = canvas1.getContext("2d");
    let canvas2 = $("#canvas2").get(0);
    const context2 = canvas2.getContext("2d");
    let canvas3 = $("#canvas3").get(0);
    const context3 = canvas3.getContext("2d");

    consultarBaseDatos(`${yyyy}-${mm}-${dd}`, 180, context3, canvas3);
    $('#fecha_caja').val(`${mesText} ${dd}, ${yyyy}`);
    /* Set inicial en el tamaño para el manejo del zoom */
    $('#img-park').attr("width", zoom_width);
    $('#canvas1').attr("width", zoom_width);
    $('#canvas1').attr("height", zoom_height);
    $('#canvas2').attr("width", zoom_width);
    $('#canvas2').attr("height", zoom_height);
    $('#canvas3').attr("width", zoom_width);
    $('#canvas3').attr("height", zoom_height);
    cargarDiv();
    /* zonasMuertas(areaDisponible1, context1);
    zonasMuertas(areaDisponible2, context1); */
  });
