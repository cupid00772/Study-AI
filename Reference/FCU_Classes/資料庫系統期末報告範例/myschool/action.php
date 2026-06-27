<?php
function sample() {
    include('connect.php');
    $sql = 'SELECT * FROM books ORDER BY b_no';
    $exec = $conn->prepare($sql);
    $exec->execute();
    $data = array();
    $i = 0;
    //將資料打包成物件格式，然後等待前端呼叫
    while ($row = $exec->fetch()){
        $data[$i]['b_no'] = $row['b_no'];
        $data[$i]['b_bookname'] = $row['b_bookname'];
        $data[$i]['b_author'] = $row['b_author'];
        $data[$i]['b_price'] = $row['b_price'];
        $data[$i]['b_publisher'] = $row['b_publisher'];
        $i++;
    }

    $conn = null;

    return json_encode($data);
}
echo sample();