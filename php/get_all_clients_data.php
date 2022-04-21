<?php

$file_path = "../data/";
$file_name = $file_path . "travelers.json";

$json = file_get_contents($file_name);

echo $json;

