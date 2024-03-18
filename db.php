<?php
$config = [
    'provider' => 'mysql',
    'hostname' => 'localhost',
    'database' => 'DataBase',
    'username' => 'root',
    'password' => ''
];

$db = new PDO(
    $config['provider'] . ':host=' . $config['hostname'] . ';dbname=' . $config['database'],
    $config['username'],
    $config['password']
);

function query($sql, $params = [])
{
    global $db;
    $query = $db->prepare($sql);
    if (!empty($params)) {
        foreach ($params as $key => $val) {
            $query->bindValue(':' . $key, $val);
        }
    }
    $query->execute();

    return $query;
}

function insert($sql, $params = [])
{
    global $db;
    query($sql, $params);
    return (int)$db->lastInsertId();
}

//function update($sql, $params = [])
//{
//    global $db;
//    query($sql, $params);
//    return $db->rowCount();
//}