<?php

//load.php
require_once('../config.php');
date_default_timezone_set('Europe/Madrid');
$data = array();
$colorCategoria = array(
  'SAILING_YACHT' =>"rgb(180, 0, 0)", //RED
  'MOTOR_YACHT' => "rgb(20, 170, 20)", //GREEN
  'CAT' => "rgb(0, 0, 170)",//BLUE
  'PESCA' => "rgb(190, 190, 0)",//YELLOW
  'ELEMENTO' => "rgb(180, 0, 170)",//PURPLE
  'TENDER' => "rgb(215,49,31)"//TOMATO
);
$query = "SELECT * FROM area_ocupada";


$statement = $pdo->query($query);


$result = $statement->fetchAll(PDO::FETCH_ASSOC);
//var_dump($result);
foreach($result as $row)
{

	$horaStart= date('H:i', strtotime($row["fecha_incial"]));
	$horaEnd= date('H:i', strtotime($row["fecha_final"]));
 $data[] = array(
  'id'   => $row["id"],
  'x'   => $row["coordenada_x"],
  'y'   => $row["coordenada_y"],
  'ancho'   => $row["ancho_x"],
  'largo'   => $row["largo_y"],
  'title'   => $row["cliente"],
  'start'   => $row["fecha_incial"],
  'startHora'   => $horaStart,
  'end'   => $row["fecha_final"],
  'endHora'   => $horaEnd,
  'categorias'   => $row["categoria"],
  'comentario'   => $row["comentario"],
  'color' => $colorCategoria[$row["categoria"]]
 );

}

echo json_encode($data);
?>
