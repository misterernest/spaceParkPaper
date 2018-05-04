<?php

//update.php

include('../config.php');
if (isset($_POST['id']) && !empty($_POST['id']) &&
	isset($_POST['categoria']) && !empty($_POST['categoria']) &&
	isset($_POST['cliente']) && !empty($_POST['cliente']) &&
	isset($_POST['comentario']) && !empty($_POST['comentario']))
{


 $query = "
 UPDATE area_ocupada
 SET categoria=:categoria, cliente=:cliente, comentario=:comentario
 WHERE id=:id
 ";
 $statement = $pdo->prepare($query);
 $statement->execute(
  array(
   ':categoria'  => $_POST['categoria'],
   ':cliente' => $_POST['cliente'],
   ':comentario' => $_POST['comentario'],
   ':id'   => $_POST['id']
  )
 );
	echo ($statement && true);
} else {
	//echo json_encode($_POST);
	echo 0;
}

?>
