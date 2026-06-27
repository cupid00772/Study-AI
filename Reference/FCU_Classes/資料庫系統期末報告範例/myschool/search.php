<!doctype html>
<html lang="en">
   <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>簡易搜尋</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>

    <!-- 加入 CSS 美化 -->
    <style>
        body {
            background-color: #f8f9fa;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        h2 {
            color: #007bff;
            margin-bottom: 20px;
        }

        .form-inline {
            margin-bottom: 30px;
        }

        .form-control {
            width: 300px;
            display: inline-block;
            margin-right: 10px;
        }

        .btn-outline-info {
            transition: 0.3s;
        }

        .btn-outline-info:hover {
            background-color: #17a2b8;
            color: white;
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
        <!-- 這是最上方導覽列 -->
        <?php include('navbar.html')  ?>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-9">
                    <div class="text-center">
                        <h2>簡易搜尋</h2><br />
                        <form class="form-inline justify-content-center" method="GET" action="search.php">
                            <input class="form-control mr-sm-2" name="keyword" type="text" placeholder="請輸入名字" size="40" />
                            <button class="btn btn-outline-info my-2" type="submit">查詢</button>
                        </form>
                        <table class="table">
    <thead>
        <tr>
            <th scope="col">編號</th>
            <th scope="col">名字</th>
            <th scope="col">類型</th>
            <th scope="col">發電量(MW)</th>
            <th scope="col">地址</th>
            <th scope="col">操作</th> <!-- 新增欄位 -->
        </tr>
    </thead>
    <tbody>
        <?php
        $keyword = $_GET["keyword"] ?? "";
        include "connect.php";
        $sql = "SELECT * FROM dyna WHERE d_name LIKE '%$keyword%' ORDER BY d_id";
        $exec = $conn->prepare($sql);
        $exec->execute();

        while ($row = $exec->fetch()) {
            echo "<tr>";
            echo "<th>" . $row["d_id"] . "</th>";
            echo '<td class="fw-bold fs-5">' . $row["d_name"] . "</td>";
            echo "<td>" . $row["type"] . "</td>";
            echo "<td>" . $row["Dynamo"] . "</td>";
            echo '<td class="fw-bold fs-5">' . $row["address"] . "</td>";
            echo '<td>
    <form method="POST" action="collect.php">
        <input type="hidden" name="d_id" value="' . $row["d_id"] . '">
        <input type="hidden" name="d_name" value="' . $row["d_name"] . '">
        <input type="hidden" name="type" value="' . $row["type"] . '">
        <input type="hidden" name="Dynamo" value="' . $row["Dynamo"] . '">
        <input type="hidden" name="address" value="' . $row["address"] . '">
        <button class="btn btn-sm btn-outline-primary" type="submit">典藏</button>
    </form>
</td>';
            echo "</tr>";
        }
        $conn = null;
        ?>
    </tbody>
</table>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
    </body>
</html>