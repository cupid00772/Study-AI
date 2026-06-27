<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["id"])) {
    $id = $_POST["id"];

    include "connect.php";

    // 安全地刪除該筆資料
    $sql = "DELETE FROM collection WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $conn = null;

    // 回到原本的列表
    header("Location: collectionlist.php");
    exit();
} else {
    // 非法存取導回列表
    header("Location: collectionlist.php");
    exit();
}