<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");

    $mysecrch = "";
    $mysecrch .= !empty($first_name) ? " and a.first_name like '%$firstname%' " : " ";
    $mysecrch .= !empty($last_name) ? " and a.last_name like '%$lastname%' " : " ";
    $mysecrch .= !empty($phone_number) ? " and a.phone_number like '%$phone_number%' " : " ";
    
    try {
        $sql = "SELECT CONCAT_WS(' ', a.first_name, a.last_name) AS name, a.phone_number,a.teacher_id, a.active_status 
        FROM `teachers` as a WHERE 1    
        $mysecrch
        order by a.created_date asc";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array("data" => $res, "sql" => $sql));
    } catch (mysqli_sql_exception $e) {
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally {
        $conn = null;
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush();
exit;
