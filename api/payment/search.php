<?php
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
http_response_code(400);
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");  

    $courses_name = !empty($courses_name) ? " and c.course_name like '%$courses_name%'" : " ";
    $subject = !empty($subject) ? " and s.subject like '%$subject%'" : "";
    
    try {   
        $sql = " 
            select c.*,
            CONCAT_WS('-', TIME_FORMAT(c.time_from, '%H:%i'), TIME_FORMAT(c.time_to, '%H:%i')) AS study_time,
            s.*,
            (SELECT COUNT(courses_student_id) FROM courses_student WHERE course_id = c.course_id) AS student_count
            from courses c        
            left join subjects s on c.subject_id = s.subject_id
            where 1 = 1 and c.active_status = 'Y'
            $courses_name
            $subject
            order by c.created_date desc";

        $stmt = $conn->prepare($sql); 
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

        http_response_code(200);
        echo json_encode(array("data"=>$res));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        $conn = null;
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit;
?>