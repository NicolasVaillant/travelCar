<?php

if (!isset($_POST["name"])) {
    echo "null";
}

$name = $_POST["name"];

$file = fopen("../data/$name.txt", 'r') or die("Can't create file");
$type_luggage = fgets($file);
fclose($file);

echo $type_luggage;

