<?php


/* localhost/dev/spacepark/guardar.php?x=900&y=700&ancho=100&largo=100&date1=2018-02-07&date2=2018-02-20&time1=12:00&time2=12:00&categoria=ELEMENTO&cliente=ernesto */

//error_reporting(-1);
//ini_set('display_errors', 'On');

if (
  isset($_POST['x']) &&
  !empty($_POST['x']) &&
  isset($_POST['y']) &&
  !empty($_POST['y']) &&
  isset($_POST['ancho']) &&
  !empty($_POST['ancho']) &&
  isset($_POST['largo']) &&
  !empty($_POST['largo']) &&
  isset($_POST['date1']) &&
  !empty($_POST['date1']) &&
  isset($_POST['date2']) &&
  !empty($_POST['date2']) &&
  isset($_POST['time1']) &&
  !empty($_POST['time1']) &&
  isset($_POST['time2']) &&
  !empty($_POST['time2']) &&
  isset($_POST['categoria']) &&
  !empty($_POST['categoria']) &&
  isset($_POST['cliente']) &&
  !empty($_POST['cliente'])&&
  isset($_POST['angulo']) &&
  isset($_POST['comentario']))  {
	// Datos recibidos
  $id = NULL;
  $x = $_POST['x'];
	$y = $_POST['y'];
	$ancho = $_POST['ancho'];
	$largo = $_POST['largo'];
	$date1 = $_POST['date1'];
	$date2 = $_POST['date2'];
	$time1 = $_POST['time1'];
	$time2 = $_POST['time2'];
	$categoria = $_POST['categoria'];
  $cliente = $_POST['cliente'];
  $angulo = $_POST['angulo'];
  $comentario = $_POST['comentario'];
	// Conexion base de datos
	require_once 'config.php';



// comienza proceso del cache
      $contraquery= "DELETE FROM area_ocupada WHERE coordenada_x = $x AND coordenada_y = $y AND fecha_incial = \'$date1 $time1\'";
      $sql="INSERT INTO cache VALUES (NULL, '$contraquery')";
      $prepared = $pdo->prepare($sql);
      $resultado = $prepared->execute();
      $prepared=null;
  // termina proceso cache Insert

	// insert
  $query = "INSERT INTO area_ocupada
  (
    id,
    coordenada_x,
    coordenada_y,
    ancho_x,
    largo_y,
    fecha_incial,
    fecha_final,
    categoria,
    cliente,
    angulo,
    comentario
  ) VALUES (
    :id, :x, :y, :ancho, :largo, :fecha_incial , :fecha_final , :categoria, :cliente, :angulo, :comentario);";
  $prepared = $pdo->prepare($query);
  $resultado = $prepared->execute([
    'id'=>$id,
    'x'=>$x,
    'y'=>$y,
    'ancho'=>$ancho,
    'largo'=>$largo,
    'fecha_incial'=>$date1 ." ". $time1,
    'fecha_final'=>$date2 ." ". $time2,
    'categoria'=>$categoria,
    'cliente'=>$cliente,
    'angulo'=>$angulo,
    'comentario'=>$comentario
  ]);
  $prepared = null;
	if ($resultado) {
      echo 1;
    }else {
      echo 0;
    }
}
?>
