<?php

//load.php

require_once('../config.php');
$data = array();

$query = "SELECT * FROM area_ocupada";


$statement = $pdo->query($query);


$result = $statement->fetchAll(PDO::FETCH_ASSOC);
//var_dump($result);
foreach($result as $row)
{

	$horaStart= date('h:i', strtotime($row["fecha_incial"]));
	$horaEnd= date('h:i', strtotime($row["fecha_final"]));
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
  'comentario'   => $row["comentario"]
 );

}

echo json_encode($data);
?>
