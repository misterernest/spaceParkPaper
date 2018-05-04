<?php

error_reporting(-1);
ini_set('display_errors', 'On');

if ( isset($_POST['date']) && !empty($_POST['date']) && isset($_POST['dias']) && !empty($_POST['dias']) )  {
	// Datos recibidos
	$fecha = $_POST['date'];
	$dias = $_POST['dias'];
	$categoria = $_POST['categoria'];

	//$fechai = date('Y-m-d');
	$diasInicial = 93;
	$diasFinal = 365;
	$nuevafechai = date('Y-m-d', strtotime("$fecha - $diasInicial days"));
	$nuevafechaf = date('Y-m-d', strtotime("$fecha + $diasFinal days"));

	// Conexion base de datos
	require_once 'config.php';

	// insert
  $query = "SELECT * FROM area_ocupada WHERE fecha_incial BETWEEN '$nuevafechai' AND '$nuevafechaf' OR fecha_final BETWEEN '$nuevafechai' AND '$nuevafechaf '";
	/*if(!empty($categoria)){
		$query = $query . " AND categoria LIKE '$categoria'";
	}*/


	$prepared = $pdo->query($query);
	$resultado[0] = $prepared->fetchAll(PDO::FETCH_ASSOC);
	$prepared = null;
	$resultado[1]=0;
	$sql="SELECT COUNT(id_cache) FROM cache";
	$prepared = $pdo->prepare($sql);
	$prepared->execute();
	$resultadoDeshacer= $prepared->fetch(PDO::FETCH_NUM);
	$resultado[1] = ($resultadoDeshacer== NULL)?0:$resultadoDeshacer;

	echo json_encode($resultado);
}
?>
