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
    $mysecrch .= !empty($firstname) ? " and a.firstname like '%$firstname%' " : " ";
    $mysecrch .= !empty($lastname) ? " and a.lastname like '%$lastname%' " : " ";
    $mysecrch .= !empty($nickname) ? " and a.nickname like '%$nickname%' " : " ";
    $mysecrch .= !empty($degree) ? " and a.degree like '$degree' " : " ";
    $mysecrch .= !empty($school) ? " and a.school like '%$school%' " : " ";
    
    try {
        $sql = "SELECT CONCAT_WS(' ', a.firstname, a.lastname) AS name, a.nickname,a.degree,a.school,a.student_code, a.active_status 
        FROM `student` as a WHERE 1    
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
