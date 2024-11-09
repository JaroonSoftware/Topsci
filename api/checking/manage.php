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
    // echo $action_user;

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");
        $courses = (object)$courses;  
        if (!empty($courses->session_date)) {
            $date = new DateTime($courses->session_date, new DateTimeZone('UTC'));
            $date->setTimezone(new DateTimeZone('Asia/Bangkok'));
            $sessionDate = $date->format('Y-m-d H:i:s'); 
        } else {
            $sessionDate = null;
        }

        // insert sessions
        $sql = "INSERT INTO `sessions`(`course_id`, `teacher_id`, `session_no`, `session_date`, `created_by`)  
        values (:course_id,:teacher_id,:session_no,:session_date,:action_user)";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("sessions data value prepare error => {$conn->errorInfo()}"); 
        
        $session_date = new DateTime($courses->session_date);
        $stmt->bindParam(":course_id", $courses->course_id, PDO::PARAM_INT);
        $stmt->bindParam(":teacher_id", $courses->teacher, PDO::PARAM_INT);
        $stmt->bindParam(":session_no", $courses->session_no, PDO::PARAM_STR);
        $stmt->bindParam(":session_date", $sessionDate, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert sessions data error => $error");
            die;
        }
        $sessionId = $conn->lastInsertId();
        
        // insert attendance
        $sql = "insert into attendance (session_id,course_id,student_code,status,remarks,attendance_no,attendance_date)
        values (:session_id,:course_id,:student_code,:status,:remarks,:attendance_no,:attendance_date)";
        //count attendance
        $countSql = "SELECT COUNT(*) + 1 AS attendance_count 
             FROM attendance 
             WHERE student_code = :student_code 
             AND course_id = :course_id 
             AND status = 'Y'";
        $stmt = $conn->prepare($sql);
        $countStmt = $conn->prepare($countSql);
        if(!$stmt || !$countStmt) throw new PDOException("Prepare data error => {$conn->errorInfo()}");

        foreach( $student as $ind => $val){
            $val = (object)$val;

            //คิวรี่ count เพื่อหา attendance_no
            $countStmt->bindParam(":student_code", $val->student_code, PDO::PARAM_STR);
            $countStmt->bindParam(":course_id", $courses->course_id, PDO::PARAM_INT);
            
            if (!$countStmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Count query error => $error");
            }
            $countResult = $countStmt->fetch(PDO::FETCH_ASSOC);
            $attendance_no = $countResult['attendance_count'];

            $stmt->bindParam(":session_id", $sessionId, PDO::PARAM_INT);
            $stmt->bindParam(":course_id", $courses->course_id, PDO::PARAM_INT);
            $stmt->bindParam(":student_code", $val->student_code, PDO::PARAM_STR);
            $attendance = $val->attendance ? 'Y' : 'N';
            $stmt->bindParam(":status", ($attendance) , PDO::PARAM_STR);
            $stmt->bindParam(":remarks", ($val->reason) , PDO::PARAM_STR);
            $attendance_no = $val->attendance ? $attendance_no : null;
            $attendance_date = $val->attendance ? $sessionDate : null;
            $stmt->bindParam(":attendance_no", $attendance_no , PDO::PARAM_STR);
            $stmt->bindParam(":attendance_date", $attendance_date , PDO::PARAM_STR);
            
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert attendance error => $error"); 
            }
        }
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("course" => $courses->course_name)));

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){

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

        $sql = "SELECT t.teacher_id as value,CONCAT_WS(' ',t.first_name,t.last_name) as label ";
        $sql .= " from courses_teacher ct left join teachers t on ct.teacher_id = t.teacher_id";        
        $sql .= " where ct.course_id  = :code";
        
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute(['code' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $teacher = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $sql = "select s.student_code,CONCAT_WS(' ',s.firstname,s.lastname) as student_name,s.degree,s.school ";
        $sql .= " from courses_student cs left join student s on cs.student_code = s.student_code";        
        $sql .= " where cs.course_id  = :code and cs.is_delete = 'N'";
        
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute(['code' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $student = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array( "courses" => $courses, "teacher" => $teacher, "student" => $student )));
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