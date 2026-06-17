<?php
/*
Microsoft®SQL Server™
伺服器名稱, 資料庫名稱, 帳號, 密碼

try {
    $conn = new PDO("sqlsrv:Server=163.17.9.68;Database=DB1_70", "DB1_70", "DB1_70");
    if($conn)
        echo 'success';
} catch (PDOException $e) {
    echo $e->getMessage();
}
*/
// try {
//     $conn = new PDO("sqlsrv:Server=163.17.9.68;Database=DB1_70", "DB1_70", "DB1_70");

//     if($conn)
//         echo 'success';
// } catch (PDOException $e) {
//     echo $e->getMessage();
// }


/*
MYSQL
伺服器名稱, 資料庫名稱, 帳號, 密碼
新進去的時候應該沒有密碼，所以不用，資料庫自己創一個b
*/

    try{
        $conn = new PDO("mysql:host=localhost;dbname=school", 'root', '');
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
        echo "連接失敗，代碼: " . $e->getMessage();
    }

?>