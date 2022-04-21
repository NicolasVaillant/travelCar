<?php
date_default_timezone_set('Europe/Paris');

if (!isset($_POST["name"]) or !isset($_POST["type_luggage"]) or !isset($_POST["luggage_count"])) {
    return;
}

$name = $_POST["name"];
$type_luggage = $_POST["type_luggage"];
$luggage_count = $_POST["luggage_count"];
$file_path = "../data/";
$tmp_file_name = $file_path . "travelers.tmp";
$file_name = $file_path . "travelers.json";

while (file_exists($tmp_file_name)) {
} // Wait if concurrent modification of the travelers file

$tmp_file = fopen($tmp_file_name, 'w') or die("Can't create file");

if (file_exists($file_name)) {
    $json = file_get_contents($file_name);
    $array = json_decode($json, true);
    if (array_key_exists("$name", $array)) {
        $array[$name]["type_luggage"] = $type_luggage;
        $array[$name]["luggage_count"] = $luggage_count;
        $array[$name]["updated_at"] = date("Y-m-d-H-i-s");
    } else {
        $tmp_array = array(
            "type_luggage" => $type_luggage,
            "luggage_count" => $luggage_count,
            "updated_at" => date("Y-m-d-H-i-s")
        );
        $array[$name] = $tmp_array;
    }

} else {
    $array = array(
        $name => array(
            "type_luggage" => $type_luggage,
            "luggage_count" => $luggage_count,
            "updated_at" => date("Y-m-d-H-i-s")
        )
    );
}

$json = json_encode($array);
file_put_contents($tmp_file_name, $json);
// Swap tmp file with origin file
fclose($tmp_file);
unlink($file_name);
rename($tmp_file_name, $file_name);

