<?php
// collect.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    include "connect.php"; // 使用相同資料庫連線設定

    // 接收表單資料
    $d_id = $_POST["d_id"];
    $d_name = $_POST["d_name"];
    $type = $_POST["type"];
    $dynamo = $_POST["Dynamo"];
    $address = $_POST["address"];

    // 插入到 collection 資料表
    $sql = "INSERT INTO collection (d_id, d_name, type, Dynamo, address)
            VALUES (:d_id, :d_name, :type, :dynamo, :address)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":d_id", $d_id);
    $stmt->bindParam(":d_name", $d_name);
    $stmt->bindParam(":type", $type);
    $stmt->bindParam(":dynamo", $dynamo);
    $stmt->bindParam(":address", $address);

    if ($stmt->execute()) {
        echo "<script>alert('成功典藏！');window.history.back();</script>";
    } else {
        echo "<script>alert('典藏失敗');window.history.back();</script>";
    }

    $conn = null;
} else {
    header("Location: index.php"); // 若非法進入
}
?>