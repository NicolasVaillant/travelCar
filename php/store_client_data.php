<?php

if (!isset($_POST["name"]) or !isset($_POST["type_luggage"])) {
    return;
}

$name = $_POST["name"];
$type_luggage = $_POST["type_luggage"];

$file = fopen("../data/$name.txt", 'w') or die("Can't create file");
fwrite($file, $type_luggage);
fclose($file);

