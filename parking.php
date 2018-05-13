<?php
  session_start();
  if (!$_SESSION["online"]) {
    header('Location: index.php');
  }
 ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="css/parking.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <title>space parking</title>
  <script src="./js/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="./js/dist/paper-full.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />

  <link rel="stylesheet" href="./css/bootstrap-material-datetimepicker.css" />
	<link href="http://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


	<script src="https://code.jquery.com/jquery-1.12.3.min.js"  crossorigin="anonymous"></script>
	<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.10/js/ripples.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.10/js/material.min.js"></script>
	<!-- <script type="text/javascript" src="https://rawgit.com/FezVrasta/bootstrap-material-design/master/dist/js/material.min.js"></script> -->
	<script type="text/javascript" src="http://momentjs.com/downloads/moment-with-locales.min.js"></script>
	<script type="text/javascript" src="./js/bootstrap-material-datetimepicker.js"></script>
  <script type="text/paperscript" canvas="canvas1" src="js/paperPark.js" ></script>
<!--  agrega librerias de calendar-->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.js"></script>
</head>
<body>
  <div class="btn-park btn-lupa1" id="zoom">
    <img src="img/lupa-mas.png" alt="lupa-zoom-in" id="zoom-in">
    <img src="img/lupa-menos.png" alt="lupa-zoom-out" id="zoom-out" hidden="hidden">
  </div>
  <div class="btn-park btn-inactivo btn-rollback" id="deshacer">
    <img src="img/deshacer.png" alt="deshacer cambio">
  </div>
  <div class="btn-park btn-inactivo btn-mover1" id="mover">
    <img src="img/mover.png" alt="mover">
  </div>
  <div class="btn-park btn-inactivo btn-rotar" id="rotar">
    <img src="img/rotar.png" alt="rotar">
  </div>
  <div class="btn-park btn-inactivo btn-actualizarFecha1" id="actualiza-fecha">
    <img src="img/editar-fecha.png" alt="actualizar fecha">
  </div>
  <div class="btn-park btn-inactivo btn-eliminar1" id="eliminar">
    <img src="img/eliminar.png" alt="eliminar elemento">
  </div>
  <a href="calendar.php" target="_blank">
    <div class="btn-park btn-gant" id="gant">
      <img src="img/diagrama-grant.png" alt="Diagrama Gant">
    </div>
  </a>
  <div id="info-popup" class="info-popup info-popup-zoom" hidden="hidden">
    <div>
      <span id="info-head"></span>
    </div>
    <div>
      <span id="info-cliente"></span>
    </div>
    <div >
      <span id="info-fecha"></span>
    </div>
    <div >
      <span>Recurso:</span><span id="info-size"></span>
    </div>
  </div>

  <a href="session_close.php">
    <div class="btn-park btn-session" id="session">
        <img src="img/cerrar-sesion.png" alt="Cerrar sesion">
    </div>
  </a>
  <div class="container" id="container-canvas-1">
    <div class="container-canvas width-70" id="container-canvas">
        <img src="img/mapa.png" class="img-park" id="img-park" >
        <canvas class="canvas1" id="canvas1" width="2217" height="1598" resize>
          Su navegador no soporta canvas :(
        </canvas>
    </div>

    <!-- comienza -->
      <style type="text/css">
      .cal{

        width: 40%;
        margin: 1rem auto 0;
        margin-top: 7rem;

      }
    </style>
    <div class="cal" id="calendar">
      <div class="container">
       <div id="calendar"></div>
      </div>

    </div>
    <!-- finaliza -->

  </div>
  <div class="container">
    <div class="row col-sm-12 col-md-12">
      <div class="col-sm-10 row col-md-10 barra-fecha" id="container-range">

      </div>
      <div class="col-sm-2 row col-md-2 barra-fecha">
        <input id="fecha_caja" type="text" required="true" class="form-control col-sm-12 col-md-12 form-group">
      </div>
    </div>
  </div>

  <?php
    include 'modal.html';
    include 'alert.html';
    include 'confirm.html';
    include 'modal_1.html';
  ?>

</body>
</html>
