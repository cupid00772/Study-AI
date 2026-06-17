<?php
session_start();
session_unset();  // 清除 session 資料
session_destroy(); // 銷毀 session
header("Location:login.php"); // 回到登入頁面
exit();
?>