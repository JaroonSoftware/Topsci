<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
include_once(dirname(__FILE__, 2) . "/common/fnc-code.php");

$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    extract($_POST, EXTR_OVERWRITE, "_");

    try {
        // Query for course and student data
        $sql = "
            SELECT 
            CONCAT(IFNULL(s.firstname, ''), ' ', IFNULL(s.lastname, '')) AS student_name,
            c.course_name as courses_name,
            sj.subject_name as subjects
            from attendance att
            LEFT JOIN courses c on att.course_id = c.course_id
            LEFT JOIN student s on att.student_code = s.student_code
            LEFT JOIN subjects sj on c.subject_id = sj.subject_id
            where att.course_id = :course_id and att.student_code  = :student_code
            LIMIT 1";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['course_id' => $course, 'student_code' => $student_code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Get data error => $error");
        }

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode([
            'status' => 1,
            'data' => $data
        ]);

    } catch (mysqli_sql_exception $e) {
        http_response_code(400);
        echo json_encode([
            'status' => '0',
            'message' => $e->getMessage()
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'status' => '0',
            'message' => $e->getMessage()
        ]);

    } finally {
        $conn = null;
    }

} else {
    http_response_code(400);
    echo json_encode([
        'status' => '0',
        'message' => 'Request method failed.'
    ]);
}

ob_end_flush();
exit;
?>
