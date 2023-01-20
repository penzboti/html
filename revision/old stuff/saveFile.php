<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    header("Content-Type: application/text", true);
    if (isset($_POST['data'])) {
        $data = $_POST["data"];
        $file = fopen("text.txt", "a");
        // w+ or a
        fwrite($file, $data);
        fclose($file);
        echo "done";
    }
?>