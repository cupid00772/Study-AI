<!doctype html>
<html lang="zh-Hant">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>典藏清單</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f8f9fa;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        h2 {
            color: #007bff;
            margin-bottom: 20px;
        }

        table.table {
            background-color: white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        table th, table td {
            text-align: center;
        }

        table thead {
            background-color: #e9ecef;
        }

        tr:hover {
            background-color: #f1f1f1;
        }
    </style>
</head>

<body>
    <?php include('navbar.html'); ?>
    <div class="container mt-5">
        <div class="text-center">
            <h2>典藏清單</h2>
            <table class="table">
                <!-- 增加「操作」欄 -->
<thead>
    <tr>
        <th>編號</th>
        <th>名字</th>
        <th>類型</th>
        <th>發電量(MW)</th>
        <th>地址</th>
        <th>操作</th> <!-- 新增操作欄 -->
    </tr>
</thead>
<tbody>
<?php
include "connect.php";

$sql = "SELECT * FROM collection ORDER BY id";
$stmt = $conn->prepare($sql);
$stmt->execute();

while ($row = $stmt->fetch()) {
    echo "<tr>";
    echo "<th>" . $row["id"] . "</th>";
    echo "<td class='fw-bold fs-5'>" . htmlspecialchars($row["d_name"]) . "</td>";
    echo "<td>" . htmlspecialchars($row["type"]) . "</td>";
    echo "<td>" . htmlspecialchars($row["Dynamo"]) . "</td>";
    echo "<td class='fw-bold fs-5'>" . htmlspecialchars($row["address"]) . "</td>";
    
    // 新增取消按鈕 (form post)
    echo "<td>
        <form method='POST' action='remove_collection.php' onsubmit=\"return confirm('確定要取消典藏嗎？');\">
            <input type='hidden' name='id' value='" . $row["id"] . "'>
            <button class='btn btn-danger btn-sm' type='submit'>取消典藏</button>
        </form>
    </td>";

    echo "</tr>";
}
$conn = null;
?>
</tbody>
            </table>
        </div>
    </div>
</body>
</html>
