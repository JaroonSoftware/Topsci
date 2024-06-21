<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");

$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();
http_response_code(400);
try {
    $action_date = date("Y-m-d H:i:s"); 
    $action_user = $token->userid;

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");

        // var_dump($_POST);
        echo $sql;
        $sql = "INSERT INTO teachers (`first_name`, `last_name`, `phone_number`,`created_by`) 
        values (:first_name,:last_name,:phone_number,:created_by)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        
        $stmt->bindParam(":first_name", $first_name, PDO::PARAM_STR);
        $stmt->bindParam(":last_name", $last_name, PDO::PARAM_STR);
        $stmt->bindParam(":phone_number", $phone_number, PDO::PARAM_STR);     
        $stmt->bindParam(":created_by", $action_user, PDO::PARAM_INT); 
        
        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
           
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => "ok", 'message' => 'เพิ่มครูสำเร็จ')));  

    } else  if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true);
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);

        $sql = "
        update teachers 
        set
        first_name = :first_name,
        last_name = :last_name,
        phone_number = :phone_number,
        updated_date = :updated_date,
        updated_by = :updated_by
        where teacher_id = :teacher_id";

        
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt->bindParam(":teacher_id", $teacher_id, PDO::PARAM_STR);
        $stmt->bindParam(":first_name", $first_name, PDO::PARAM_STR);
        $stmt->bindParam(":last_name", $last_name, PDO::PARAM_STR);
        $stmt->bindParam(":phone_number", $phone_number, PDO::PARAM_STR);
        $stmt->bindParam(":updated_date", $action_date, PDO::PARAM_STR);    
        $stmt->bindParam(":updated_by", $action_user, PDO::PARAM_INT);        


        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Update data error => $error");
            die;
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("id" => $_PUT)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = " SELECT a.* ";
        $sql .= " FROM `teachers` as a ";
        $sql .= " where teacher_id  = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => $res));
    }
} catch (PDOException $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally {
    $conn = null;
}
ob_end_flush();
exit;
