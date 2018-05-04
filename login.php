<?php

$user = null;
$query = null;

if (!empty($_POST)) {
    require_once 'config.php';

    $query = "SELECT * FROM usuario WHERE nombre_user = '".$_POST['usuario']."' AND password = '".sha1($_POST['password'])."'";
    $prepared = $pdo->prepare($query);

    $prepared->execute();
    $user = $prepared->fetch(PDO::FETCH_ASSOC);

    if ($user) {
      session_start();
      $_SESSION["usuario"] = $user['nombre_user'];
      $_SESSION["online"] = true;
      header('Location: parking.php');
    }else {
      header('Location: index.php?error=1');
    }
}else{
  header('Location: index.php?error=1');
}
