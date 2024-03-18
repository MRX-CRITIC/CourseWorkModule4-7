<?php

$score = $_POST['score'];
$login = $_POST['login'];

if (insert($score) && insert($login)) {
    $mysqli = new mysqli('localhost', 'root', '', 'DataBase');
    $query = "UPDATE `users` SET score = '$score' WHERE login = '$login'";
    if (!empty($query)) {
        $mysqli->query($query);
        $response = array("success" => true, "message" => "Рекорд зарегистрирован!");
    } else {
        $response = array("success" => false, "message" => "Ошибка регистрации!");
    }
    echo json_encode($response);
    exit;
}


