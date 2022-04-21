<?php

$file_path = "../data/";
$file_name = $file_path . "travelers.json";

if (!isset($_POST["name"]) or !file_exists($file_name)) {
    echo "{}";
}
$name = $_POST["name"];

$json = file_get_contents($file_name);
$array = json_decode($json, true);
$json_extract = json_encode($array[$name]);

echo $json_extract;

