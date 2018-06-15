<?php
if (isset($_POST['id']) && !empty($_POST['id']) &&
	isset($_POST['x']) && !empty($_POST['x']) &&
	isset($_POST['y']) && !empty($_POST['y']) &&
	isset($_POST['date1']) && !empty($_POST['date1']) &&
	isset($_POST['date2']) && !empty($_POST['date2']) &&
	isset($_POST['time1']) && !empty($_POST['time1']) &&
	isset($_POST['time2']) && !empty($_POST['time2']) &&
	isset($_POST['categoria']) && !empty($_POST['categoria']) &&
	isset($_POST['cliente']) && !empty($_POST['cliente']) &&
	isset($_POST['date']) && !empty($_POST['date']) &&
	isset($_POST['ancho']) && !empty($_POST['ancho']) &&
	isset($_POST['largo']) && !empty($_POST['largo']) &&
	isset($_POST['typeUpdate']) && !empty($_POST['typeUpdate'])&&
	isset($_POST['angulo']) &&
	isset($_POST['comentario']))  {

	// Datos recibidos
	$xPost = $_POST['x'];
	$yPost = $_POST['y'];
	$anchoPost = $_POST['ancho'];
	$largoPost = $_POST['largo'];
	$date1 = $_POST['date1'];
	$date2 = $_POST['date2'];
	$time1 = $_POST['time1'];
	$time2 = $_POST['time2'];
	$categoriaPost = $_POST['categoria'];
  $clientePost = $_POST['cliente'];
	$id = $_POST['id'];
	$date = $_POST['date'];
	$tipoActualizacion = $_POST['typeUpdate'];
	$comentarioPost = $_POST['comentario'];
	$anguloPost = $_POST['angulo'];
	// Conexion base de datos
	$contraquery = "";
	require_once 'config.php';	// consultamos la reserva
	$query = "SELECT * FROM area_ocupada WHERE id = $id";
	$prepared = $pdo->query($query);
	$reserva1 = $prepared->fetch(PDO::FETCH_ASSOC);
	$prepared = null;
	$cliente = $reserva1["cliente"];
	$ancho = $reserva1["ancho_x"];
	$largo = $reserva1["largo_y"];
	$fechaI = $reserva1["fecha_incial"];
	$fechaf = $reserva1["fecha_final"];
	$categoria = $reserva1["categoria"];
	$comentario = $reserva1["comentario"];
	$coordenadaX = $reserva1["coordenada_x"];
	$coordenadaY = $reserva1["coordenada_y"];
	$angulo = $reserva1["angulo"];


	$fecha2a = explode(" ", $date);
	$fecha2b = explode("-", $fecha2a[0]);

	$fecha1a = explode(" ", $fechaI);
	$fecha1b = explode("-", $fecha1a[0]);

	if ($tipoActualizacion == 1) {
		# code...
		$valido = false;
		if ($fecha1b[0] == $fecha2b[0] && $fecha1b[1] == $fecha2b[1] && $fecha1b[2] == $fecha2b[2]) {
			$valido = false;
		}else {
			$valido = true;
		}

		if ($valido) {
			// Sentencia query para deshacer
			$contraquery= "DELETE FROM area_ocupada ";
			$contraquery.="WHERE coordenada_x =$xPost ";
			$contraquery.="AND coordenada_y = $yPost ";
			$contraquery.="AND fecha_incial = \'$date\' ";
			$contraquery.="AND fecha_final = \'$date2 $time2\' ";
			$contraquery.="AND ancho_x = \'$ancho\' ";
			$contraquery.="AND largo_y = \'$largo\';";
			// termina proceso cache Insert
			//insert

			$queryi = "INSERT INTO `area_ocupada`
			(
				`id`,
				`coordenada_x`,
				`coordenada_y`,
				`ancho_x`,
				`largo_y`,
				`fecha_incial`,
				`fecha_final`,
				`categoria`,
				`cliente`,
				`comentario`,
				`angulo`
			) VALUES (
				NULL, '$xPost', '$yPost', '$anchoPost', '$largoPost', '$date', '$date2 $time2', '$categoriaPost', '$clientePost', '$comentarioPost', '$anguloPost');";
			$prepared = $pdo->prepare($queryi);
			$resulti = $prepared->execute();
			$prepared = null;
			// Sentencia query para deshacer
			$contraquery.= "UPDATE area_ocupada SET fecha_final=\'$fechaf\', cliente=\'$cliente\', categoria=\'$categoria\', comentario=\'$comentario\' WHERE id=$id";
			// termina proceso cache Update
			// update anterior reserva
			$queryu = "UPDATE area_ocupada
				SET fecha_final='$date',
				cliente='$clientePost' ,
				categoria='$categoriaPost',
				comentario='$comentarioPost'
				WHERE id=$id";
				$prepared = $pdo->prepare($queryu);
				$resultu = $prepared->execute();
				$prepared = null;


		}else{
			// Sentencia query para deshacer
			$contraquery.= "UPDATE area_ocupada
			SET coordenada_x=$coordenadaX,
			coordenada_y=$coordenadaY,
			fecha_final=\'$fechaf\',
			cliente=\'$cliente\',
			categoria=\'$categoria\',
			comentario=\'$comentario\',
			angulo=\'$angulo\'
			WHERE id=$id";
			// termina proceso cache Update

			$queryu = "UPDATE area_ocupada
			SET coordenada_x='$xPost',
			coordenada_y='$yPost',
			fecha_final='$date2 $time2',
			cliente='$clientePost',
			categoria='$categoriaPost',
			comentario='$comentario',
			angulo='$anguloPost'
			WHERE id=$id";
			$prepared = $pdo->prepare($queryu);
			$resultu = $prepared->execute();
			$prepared = null;
			$resulti = true;
		}
	} else if($tipoActualizacion == 2) {

		// Sentencia query para deshacer
		$contraquery.= "UPDATE area_ocupada
		SET fecha_final=\'$fechaf\',
		fecha_incial = \'$fechaI\',
		cliente=\'$cliente\',
		categoria=\'$categoria\',
		comentario=\'$comentario\',
		ancho_x=\'$ancho\',
		largo_y=\'$largo\'
		WHERE id=$id;";
		// termina proceso cache Update

		$queryu = "UPDATE area_ocupada
		SET fecha_final='$date2 $time2',
		fecha_incial = '$date1 $time1',
		cliente='$clientePost' ,
		categoria='$categoriaPost',
		comentario='$comentarioPost',
		ancho_x='$anchoPost',
		largo_y='$largoPost'

		WHERE id=$id ";
		$prepared = $pdo->prepare($queryu);
		$resultu = $prepared->execute();
		$prepared = null;
		$resulti = true;
	}
	$queryCache= "INSERT INTO cache VALUES (NULL, '$contraquery');";

	$prepared = $pdo->prepare($queryCache);
	$prepared->execute();


	//$resultado = array("consulta"=>$reserva1,"insert"=>$resulti,"update"=>$resultu,"queryi"=>$queryi,"queryu"=>$queryu);
	//echo json_encode($resultado);
	echo ($resultu && $resulti);
} else {
	//echo json_encode($_POST);
	echo 0;
}


?>
