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
        $sql = "INSERT INTO student (`firstname`, `lastname`, `gender`, `nickname`, `line`, `facebook`, `tel1`, `tel2`, 
        `degree`, `school`, `regis_date`, `remark`, `created_by`) 
        values (:firstname,:lastname,:gender,:nickname,:lines,:facebook,:tel1,
        :tel2,:degree,:school,:regis_date,:remark,:created_by)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        
        $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
        $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
        $stmt->bindParam(":gender", $gender, PDO::PARAM_STR);     
        $stmt->bindParam(":nickname", $nickname, PDO::PARAM_STR);
        $stmt->bindParam(":lines", $line, PDO::PARAM_STR); 
        $stmt->bindParam(":facebook", $facebook, PDO::PARAM_STR);         
        $stmt->bindParam(":tel1", $tel1, PDO::PARAM_STR);   
        $stmt->bindParam(":tel2", $tel2, PDO::PARAM_STR);   
        $stmt->bindParam(":degree", $degree, PDO::PARAM_STR);                
        $stmt->bindParam(":school", $school, PDO::PARAM_STR);
        $stmt->bindParam(":regis_date",  $action_date, PDO::PARAM_STR); 
        $stmt->bindParam(":remark", $remark, PDO::PARAM_STR);        
        $stmt->bindParam(":created_by", $action_user, PDO::PARAM_INT); 

       // echo $sql;
        
        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
           
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("id" => "ok", 'message' => 'เพิ่มนักเรียนสำเร็จ')));  

    } else  if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true);
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);

        $sql = "
        update student 
        set
        firstname = :firstname,
        lastname = :lastname,
        gender = :gender,
        nickname = :nickname,
        line = :line,
        facebook = :facebook,
        tel1 = :tel1,
        tel2 = :tel2,
        degree = :degree,
        school = :school,
        remark = :remark,
        updated_date = :updated_date,
        updated_by = :updated_by
        where student_code = :student_code";

        
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt->bindParam(":student_code", $student_code, PDO::PARAM_STR);
        $stmt->bindParam(":firstname", $firstname, PDO::PARAM_STR);
        $stmt->bindParam(":lastname", $lastname, PDO::PARAM_STR);
        $stmt->bindParam(":gender", $gender, PDO::PARAM_STR);     
        $stmt->bindParam(":nickname", $nickname, PDO::PARAM_STR);
        $stmt->bindParam(":line", $line, PDO::PARAM_STR); 
        $stmt->bindParam(":facebook", $facebook, PDO::PARAM_STR);         
        $stmt->bindParam(":tel1", $tel1, PDO::PARAM_STR);   
        $stmt->bindParam(":tel2", $tel2, PDO::PARAM_STR);   
        $stmt->bindParam(":degree", $degree, PDO::PARAM_STR);                
        $stmt->bindParam(":school", $school, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $remark, PDO::PARAM_STR);             
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
        $sql .= " FROM `student` as a ";
        $sql .= " where student_code  = :code";

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
