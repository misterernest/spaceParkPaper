<?php
  session_start();
  if (!$_SESSION["online"]) {
    header('Location: index.php');
  }
 ?>
<html>
<head>
  <script src="./js/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <script type="text/javascript" src="js/gantt.js"> </script>
  <link href='http://fonts.googleapis.com/css?family=Roboto:400,500' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="css/gantt.css">
</head>
<body>
  <header>
    <h1>DIAGRAMA DE GANTT - PTWPARK</h1>
  </header>
  <br>
  <div id="chart_div" class="div-chart"></div>
</body>
</html>
