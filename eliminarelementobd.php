<?php
// Se actualiza una reserva indicando el id de la anterior reserva y la nueva coordenada y la fecha final.// La reserva actual se le actualiza la fecha final con la enviada// Se crea una nueva reserva con fecha inicial igual a la fecha final ingresada y fecha final como la fecha final original. con las coordenadas enviadas y los datos de la anterior reserva.



if (isset($_POST['id']) && !empty($_POST['id']))  {
	// Conexion base de datos
	require_once 'config.php';	// consultamos la reserva
	// Datos recibidos
	$id = $_POST['id'];
	

	// empieza deshacer
	$sql="SELECT * FROM area_ocupada WHERE id=:id";
	$prepared = $pdo->prepare($sql);
	$resulti = $prepared->execute(['id'=>$id]);
    $resulti = $prepared->fetch(PDO::FETCH_ASSOC);
    
	$coordenada_x = $resulti['coordenada_x'];
	$coordenada_y = $resulti['coordenada_y'];
	$ancho_x = $resulti['ancho_x'];
	$largo_y = $resulti['largo_y'];
	$fecha_incial = $resulti['fecha_incial'];
	$fecha_final = $resulti['fecha_final'];
	$categoria = $resulti['categoria'];
	$cliente = $resulti['cliente'];
	$angulo = $resulti['angulo'];
	$comentario = $resulti['comentario'];

	
	$contraquery="INSERT INTO area_ocupada VALUES (
		$id,
		$coordenada_x,
		$coordenada_y, 
		$ancho_x,
		$largo_y, 
		\'$fecha_incial\', 
		\'$fecha_final\', 
		\'$categoria\', 
		\'$cliente\', 
		$angulo, 
		\'$comentario\'
	); ";

    $sql="INSERT INTO cache VALUES (NULL, '$contraquery')";
	$prepared = $pdo->prepare($sql);
	$resultC = $prepared->execute();
	$prepared = NULL;
	//termina el deshacer

	$queryd = "DELETE FROM area_ocupada WHERE id ='".$_POST['id']."'";
	$prepared = $pdo->prepare($queryd);
	$resulti = $prepared->execute();
	$prepared = null;



	//$resultado = array("consulta"=>$reserva1,"insert"=>$resulti,"update"=>$resultu,"queryi"=>$queryi,"queryu"=>$queryu);
	//echo json_encode($resultado);
	echo ($resulti);
} else {
	//echo json_encode($_POST);
	echo 0;
}

?>
