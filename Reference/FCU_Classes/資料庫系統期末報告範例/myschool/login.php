<?php
session_start();
$_SESSION['u_account'] = '';
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>會員系統</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
    <style>
      body {
        background: #f5f7fa;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .card {
        border: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-radius: 1rem;
      }
      .form-control:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.2rem rgba(13,110,253,.25);
      }
      .btn-container {
        display: flex;
        justify-content: space-around;
        margin-top: 1rem;
      }
      .img-fluid {
        border-radius: 1rem 0 0 1rem;
      }
    </style>
  </head>
  <body>
    <?php
    function test_input($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])) {
        $fc = empty($_POST["account"]);
        $fp = empty($_POST["password"]);
        if ($fc || $fp) {
            $errMsg = '<div class="alert alert-danger" role="alert">未輸入帳號或密碼!</div>';
        } else {
            $account = test_input($_POST["account"]);
            $password = test_input($_POST["password"]);
            include "connect.php";
            $sql = "SELECT u_password FROM USERS WHERE u_account= :u_account ;";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":u_account", $account);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if (password_verify($password, $row["u_password"])) {
                    $_SESSION["u_account"] = $account;
                    header("Location:member.php");
                    exit();
                } else {
                    $errMsg = '<div class="alert alert-danger fw-bold" role="alert">帳號或密碼錯誤，請重新輸入!</div>';
                }
            } else {
                $errMsg = '<div class="alert alert-danger fw-bold" role="alert">帳號或密碼錯誤，請重新輸入!</div>';
            }

            $conn = null;
            $stmt = null;
        }
    }
    ?>

    <div class="container">
      <div class="row vh-100 align-items-center justify-content-center">
        <div class="card mb-3" style="max-width: 580px;">
          <div class="row g-0">
            <div class="col-md-4 d-flex flex-column align-items-center justify-content-center p-3">
              
                <img src="https://img.freepik.com/premium-vector/green-technology-logo-lightbulb-with-plant-energy-efficiency-design_1256803-9277.jpg" class="img-fluid rounded-start mb-2" alt="圖片無法顯示" data-bs-toggle="tooltip" data-bs-placement="top">
             
              <a href="regist.php" class="card-text text-decoration-none mt-2"><small class="text-muted fw-bold">沒有帳號? 按我註冊</small></a>
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title fw-bold fs-3">會員系統</h5>
                <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingInput" placeholder="account" name="account" required>
                    <label for="floatingInput">帳號</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="floatingPassword" name="password" placeholder="Password" required>
                    <label for="floatingPassword">密碼</label>
                  </div>
                  <div class="btn-container">
                    <button type="submit" class="btn btn-primary" name="submit">登入</button>
                    <a href="web.php" class="btn btn-secondary">回首頁</a>
                  </div>
                </form>
                <?php
                $errMsg = $errMsg ?? '';
                echo $errMsg;
                ?>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
    <script>
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
      const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    </script>
  </body>
</html>
