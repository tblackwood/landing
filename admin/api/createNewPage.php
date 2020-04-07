<?php

$_POST = json_decode(file_get_contents("php://input"), true);

$newFile = "../../" .  $_POST['name'] . '.html';

if(!file_exists($newFile)){
    fopen($newFile, 'w');
}else{
    header('HTTP/1.0 400 Bad Request');
}

