<?php
define('DB_HOST','localhost');
define('DB_USER','root');
define('DB_PASS','123456');
define('DB_NAME','coffee');

$conn = mysqli_connect(DB_HOST,DB_USER,DB_PASS,DB_NAME);
mysqli_set_charset($conn,'utf8mb4');
if(!$conn){
    die(json_encode(['code'=>500,'msg'=>'数据库连接失败']));
}

header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:POST,GET,OPTIONS");
header("Access-Control-Allow-Headers:Content-Type");
if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    exit(json_encode(['code'=>200]));
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if(strpos($contentType,'application/json') !== false){
    $jsonData = file_get_contents('php://input');
    if(!empty($jsonData)){
        $data = json_decode($jsonData,true);
        if(is_array($data)){
            foreach($data as $key=>$value){
                $_POST[$key] = $value;
            }
        }
    }
}
?>