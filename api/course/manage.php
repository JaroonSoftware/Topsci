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

        // var_dump($_POST);
        $sql = "insert courses (`subject_id`, `course_name`, `price`,
        `time_from`, `time_to`, `number_of_payment`, `created_by`) 
        values (:subject_id,:course_name,:price,:time_from,:time_to,:number_of_payment,:action_user)";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $courses = (object)$courses;  
        $stmt->bindParam(":subject_id", $courses->subject_id, PDO::PARAM_STR);
        $stmt->bindParam(":course_name", $courses->course_name, PDO::PARAM_STR);
        $stmt->bindParam(":price", $courses->price, PDO::PARAM_STR);
        $stmt->bindParam(":time_from", $courses->timefrom, PDO::PARAM_STR);
        $stmt->bindParam(":time_to", $courses->timeto, PDO::PARAM_STR);
        $stmt->bindParam(":number_of_payment", $courses->number_of_payment, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $courseId = $conn->lastInsertId();
        // var_dump($master); exit;
        
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
        number_of_payment = :number_of_payment,
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
        $stmt->bindParam(":number_of_payment", $courses->number_of_payment, PDO::PARAM_STR); 
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
        //Insert & Update Courses Student
        // สร้างรายการ student_code ทั้งหมดที่อยู่ใน courses_student ปัจจุบัน
        $sql = "SELECT student_code FROM courses_student WHERE course_id = :course_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":course_id", $courseId, PDO::PARAM_STR);
        $stmt->execute();
        
        // ดึงข้อมูลทั้งหมดมาเก็บไว้ใน array
        $existingStudents = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // สร้าง array ของ student_code ที่มาจาก input ($student)
        $inputStudents = array_column($student, 'student_code');

        // วนลูปเพื่อเช็คว่าใน $student มี student_code ที่ยังไม่มีในฐานข้อมูล
        foreach($student as $ind => $val){
            $val = (object)$val;
            
            // ถ้า student_code นี้ยังไม่มีในฐานข้อมูลให้ทำการ insert
            if (!in_array($val->student_code, $existingStudents)) {
                $sqlInsert = "INSERT INTO courses_student (course_id, student_code) VALUES (:course_id, :student_code)";
                $stmtInsert = $conn->prepare($sqlInsert);
                $stmtInsert->bindParam(":course_id", $courseId, PDO::PARAM_STR);
                $stmtInsert->bindParam(":student_code", $val->student_code, PDO::PARAM_STR);
                
                if(!$stmtInsert->execute()) {
                    $error = $conn->errorInfo();
                    throw new PDOException("Insert data courses_student error => $error");
                }
            }
        }

        // วนลูปเช็ค student_code ที่อยู่ในฐานข้อมูล แต่ไม่มีใน $student
        foreach($existingStudents as $existingStudentCode) {
            if (!in_array($existingStudentCode, $inputStudents)) {
                $sqlUpdate = "UPDATE courses_student SET is_delete = 'Y' WHERE course_id = :course_id AND student_code = :student_code";
                $stmtUpdate = $conn->prepare($sqlUpdate);
                $stmtUpdate->bindParam(":course_id", $courseId, PDO::PARAM_STR);
                $stmtUpdate->bindParam(":student_code", $existingStudentCode, PDO::PARAM_STR);
                
                if(!$stmtUpdate->execute()) {
                    $error = $conn->errorInfo();
                    throw new PDOException("Update data error => $error");
                }
            }
        }
        
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("code" => $code)));
    } else  if($_SERVER["REQUEST_METHOD"] == "DELETE"){
        
    } else  if($_SERVER["REQUEST_METHOD"] == "GET"){
        $code = $_GET["code"]; 
        $sql = "SELECT c.* ";
        $sql .= " FROM `courses` c ";
        $sql .= " where c.course_id = :code";

        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $courses = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT t.teacher_id,CONCAT_WS(' ',t.first_name,t.last_name) as teacher_name ";
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