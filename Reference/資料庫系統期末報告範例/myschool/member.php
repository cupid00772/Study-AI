<?php
session_start();
include "connect.php";

// 取得帳號資訊（如果有登入）
$u_account = $_SESSION["u_account"] ?? '';
$loginStatus = !empty($u_account);
$userData = [];

if ($loginStatus) {
    $sql = "SELECT * FROM users WHERE u_account = :u_account";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":u_account", $u_account);
    $stmt->execute();
    $userData = $stmt->fetch();
}
?>
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>會員中心</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      background-color: #f8f9fa;
      font-family: "Segoe UI", sans-serif;
    }
    .card {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-radius: 1rem;
    }
    .status-msg {
      font-size: 1.25rem;
      font-weight: bold;
    }
    .btn-group a {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="row vh-100 justify-content-center align-items-center">
      <div class="col-md-6">
        <div class="text-center mb-4">
          <h2 class="fw-bold">會員中心</h2>
          <p class="status-msg">
            <?php
              if ($loginStatus) {
                echo '<span class="text-success">✅ 成功登入</span>';
              } else {
                echo '<span class="text-danger">⚠ 尚未登入</span>';
              }
            ?>
          </p>
        </div>

        <div class="card p-4">
          <div class="card-body text-center">
            <h5 class="card-title fs-3 fw-bold">
              <?php echo $userData['u_name'] ?? ''; ?>
            </h5>
            <h6 class="card-subtitle mb-2 text-muted fs-5 fw-semibold">
              <?php echo $userData['u_account'] ?? ''; ?>
            </h6>
            <p class="card-text fs-6">
              <?php echo $userData['u_address'] ?? ''; ?>
            </p>
            <div class="btn-group w-100 d-flex flex-column mt-3">
  <?php if ($loginStatus): ?>
    <a href="update.php" class="btn btn-primary">修改資料</a>
  <?php endif; ?>
  <a href="web.php" class="btn btn-outline-secondary">回到首頁</a>
  <?php if ($loginStatus): ?>
    <a href="logout.php" class="btn btn-danger">登出</a>
  <?php else: ?>
    <a href="login.php" class="btn btn-danger">回到登入介面</a>
  <?php endif; ?>
</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
