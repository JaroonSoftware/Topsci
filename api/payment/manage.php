<?php 
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");

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
        $payment = (object)$payment; 
        
        if (!empty($payment->payment_date)) {
            $date = new DateTime($payment->payment_date, new DateTimeZone('UTC'));
            $date->setTimezone(new DateTimeZone('Asia/Bangkok'));
            $paymentDate = $date->format('Y-m-d H:i:s'); 
        } else {
            $paymentDate = null;
        }
        // insert payment
        $sql = "INSERT INTO `payments`(`course_id`, `student_code`, `payment_date`, `amount_paid`, `payment_method`)  
        values (:course_id,:student_code,:payment_date,:amount_paid,:payment_method)";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("payment data value prepare error => {$conn->errorInfo()}");   
        $payment_date = new DateTime($payment_date);
        $stmt->bindParam(":course_id", $payment->course, PDO::PARAM_INT);
        $stmt->bindParam(":student_code", $payment->student_code, PDO::PARAM_INT);
        $stmt->bindParam(":amount_paid", $payment->amount_paid, PDO::PARAM_INT);
        $stmt->bindParam(":payment_date", $paymentDate, PDO::PARAM_STR);
        $stmt->bindParam(":payment_method", $payment->payment_method, PDO::PARAM_STR);

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert Payment data error => $error");
            die;
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("payment" => $payment->payment_date)));

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true); 
        extract($_PUT, EXTR_OVERWRITE, "_");
        $payment = (object)$payment; 
        //var_dump($_PUT);
        if (!empty($payment_date)) {
            $date = new DateTime($payment_date, new DateTimeZone('UTC'));
            $date->setTimezone(new DateTimeZone('Asia/Bangkok'));
            $paymentDate = $date->format('Y-m-d H:i:s'); 
        } else {
            $paymentDate = null;
        }

        $sql = "
        update payments 
        set
        payment_date = :payment_date,
        amount_paid = :amount_paid,
        payment_method = :payment_method
        where payment_id = :payment_id";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Update data error => {$conn->errorInfo()}"); 
        //Update Payment
            $stmt->bindParam(":amount_paid", $amount_paid, PDO::PARAM_INT);
            $stmt->bindParam(":payment_date", $paymentDate, PDO::PARAM_STR);
            $stmt->bindParam(":payment_method", $payment_method, PDO::PARAM_STR);
            $stmt->bindParam(":payment_id", $payment_id, PDO::PARAM_INT);
            
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Update data error => $error"); 
            }
    
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("payment" => $paymentDate)));
        
    } else  if($_SERVER["REQUEST_METHOD"] == "DELETE"){
        
    } else  if($_SERVER["REQUEST_METHOD"] == "GET"){
        $code = $_GET["code"]; 
        $sql = " 
            select c.*,
            s.*,
            (SELECT COUNT(course_id)+1 FROM sessions WHERE course_id = c.course_id) AS session_no
            from courses c        
            left join subjects s on c.subject_id = s.subject_id
            where c.course_id = :code and c.active_status = 'Y'";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $courses = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "select s.student_code,CONCAT_WS(' ',s.firstname,s.lastname) as student_name,s.degree,s.school,c.course_id,
            CASE 
                WHEN EXISTS (SELECT 1 FROM sessions ss join attendance at on ss.session_id = at.session_id where ss.course_id = c.course_id and at.student_code = cs.student_code ) 
                THEN 'Y'
                ELSE 'N'
            END AS check_checking,
            c.price,
            c.number_of_payment,
            (SELECT COALESCE(max(ss2.session_no), 0) 
                FROM sessions ss2 
                WHERE ss2.course_id = c.course_id ) AS last_sessions,
            (SELECT COALESCE(SUM(p.amount_paid), 0) 
                FROM payments p 
                WHERE p.course_id = c.course_id AND p.student_code = cs.student_code) AS total_payment
        from courses_student cs 
        left join courses c on cs.course_id = c.course_id
        left join student s on cs.student_code = s.student_code
        where cs.course_id  = :code";
        
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute(['code' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $student = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array( "courses" => $courses, "student" => $student )));
    }

} catch (PDOException $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally{
    $conn = null;
}  
ob_end_flush(); 
exit;