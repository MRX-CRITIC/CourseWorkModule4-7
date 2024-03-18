<?php
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {
        $login = $_POST["login"];
        $password = $_POST["password"];
        if (empty($login || $password)) {
            $response = array("success" => false, "message" => "Поля не могут быть пустыми!");
            echo json_encode($response);
            exit;
        }
        $result = query("SELECT * FROM users WHERE login = :login", [
            'login' => $login
        ])->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($result)) {
            $response = array("success" => false, "message" => "Пользователь с таким логином уже зарегистрирован!");
            echo json_encode($response);
            exit;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);

        $result = insert("INSERT INTO users (login, password) VALUES (:login, :hash)", [
            'login' => $login,
            'hash' => $hash,
        ]);
        $response = array("success" => true, "login" => $login);
    } catch (Exception $err) {
        $response = array("success" => false, "message" => "Ошибка регистрации!");
    }

    echo json_encode($response);
    exit;
}