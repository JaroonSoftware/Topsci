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

        // insert sessions
        $sql = "INSERT INTO `sessions`(`course_id`, `teacher_id`, `session_no`, `session_date`, `created_by`)  
        values (:course_id,:teacher_id,:session_no,:session_date,:action_user)";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("sessions data value prepare error => {$conn->errorInfo()}"); 
        $courses = (object)$courses;  
        $session_date = new DateTime($courses->session_date);
        $stmt->bindParam(":course_id", $courses->course_id, PDO::PARAM_INT);
        $stmt->bindParam(":teacher_id", $courses->teacher, PDO::PARAM_INT);
        $stmt->bindParam(":session_no", $courses->session_no, PDO::PARAM_STR);
        $stmt->bindParam(":session_date", $session_date->format('Y-m-d'), PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert sessions data error => $error");
            die;
        }
        $sessionId = $conn->lastInsertId();
        
        // insert attendance
        $sql = "insert into attendance (session_id,student_code,status,remarks)
        values (:session_id,:student_code,:status,:remarks)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert attendance prepare data error => {$conn->errorInfo()}");

        foreach( $student as $ind => $val){
            $val = (object)$val;
            $stmt->bindParam(":session_id", $sessionId, PDO::PARAM_INT);
            $stmt->bindParam(":student_code", $val->student_code, PDO::PARAM_STR);
            $attendance = $val->attendance ? 'Y' : 'N';
            $stmt->bindParam(":status", ($attendance) , PDO::PARAM_STR);
            $stmt->bindParam(":remarks", ($val->reason) , PDO::PARAM_STR);
            
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert attendance error => $error"); 
            }
        }
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("course" => $courses->course_name)));

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true); 
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);
        $sql = "
        update courses 
        set
        course_name = :course_name,
        subject_id = :subject_id,
        price = :price,
        time_from = :time_from,
        time_to = :time_to,
        number_of_sessions = :number_of_sessions,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where course_id = :course_id";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Update data error => {$conn->errorInfo()}"); 

        $courses = (object)$courses; 

        $stmt->bindParam(":course_name", $courses->course_name, PDO::PARAM_STR);
        $stmt->bindParam(":subject_id", $courses->subject_id, PDO::PARAM_STR);
        $stmt->bindParam(":price", $courses->price, PDO::PARAM_STR);
        $stmt->bindParam(":time_from", $courses->timefrom, PDO::PARAM_STR);
        $stmt->bindParam(":time_to", $courses->timeto, PDO::PARAM_STR);
        $stmt->bindParam(":number_of_sessions", $courses->number_of_sessions, PDO::PARAM_STR); 
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);  
        $stmt->bindParam(":course_id", $courses->course_id, PDO::PARAM_STR); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Update data error => $error");
            die;
        }
        $courseId = $courses->course_id;
        $sql = "delete from courses_teacher where course_id = :course_id";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute([ 'course_id' => $courses->course_id ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into courses_teacher (course_id,teacher_id)
        values (:course_id,:teacher_id)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert courses teacher data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        //Insert Courses Teacher
        foreach( $teacher as $ind => $val){
            $val = (object)$val;
            $stmt->bindParam(":course_id", $courseId, PDO::PARAM_STR);
            $stmt->bindParam(":teacher_id", $val->teacher_id, PDO::PARAM_STR);
            
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error"); 
            }
        } 

        $sql = "delete from courses_student where course_id = :course_id";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute([ 'course_id' => $courses->course_id ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }
        //Insert Courses Student
        $sql = "insert into courses_student (course_id,student_code)
        values (:course_id,:student_code)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert courses student data error => {$conn->errorInfo()}");

        foreach( $student as $ind => $val){
            $val = (object)$val;
            $stmt->bindParam(":course_id", $courseId, PDO::PARAM_STR);
            $stmt->bindParam(":student_code", $val->student_code, PDO::PARAM_STR);
            
            if(!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error"); 
            }
        } 
        
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("code" => $code)));
    } else  if($_SERVER["REQUEST_METHOD"] == "DELETE"){
        // $code = $_DELETE["code"];
        $code = $_GET["code"];
        
        $sql = "delete from packingset where code = :code";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }            
        
        $sql = "delete from packingset_detail where packingsetcode = :code";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status"=> 1));
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

        $sql = "select s.student_code,CONCAT_WS(' ',s.firstname,s.lastname) as student_name,s.degree,s.school,
            CASE 
                WHEN EXISTS (SELECT 1 FROM sessions ss join attendance at on ss.session_id = at.session_id where ss.course_id = c.course_id and at.student_code = cs.student_code ) 
                THEN 'Y'
                ELSE 'N'
            END AS check_checking,
            c.price,
            c.number_of_sessions,
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