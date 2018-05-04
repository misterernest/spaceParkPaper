<?php
require_once 'config.php';

//se trae la consulta
$query="SELECT * FROM cache WHERE id_cache=(SELECT MAX(id_cache) FROM cache)";
$prepared = $pdo->query($query);
$resultado = $prepared->fetch(PDO::FETCH_ASSOC);
$prepared=null;

//var_dump($resultado);

$query2= $resultado['consulta'];
$id=$resultado['id_cache'];
//aqui se ejecuta
$prepared = $pdo->prepare($query2);
$resultado2 = $prepared->execute();
$prepared=null;

//var_dump($resultado2);

if($resultado2){
    //echo "entro al if";
    $sql="DELETE FROM cache WHERE id_cache = $id";
    $prepared = $pdo->prepare($sql);
    $resultado3 = $prepared->execute();

}

?>
