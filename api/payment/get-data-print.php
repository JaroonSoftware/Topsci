<?php
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");
$db = new DbConnect;
$conn = $db->connect();  

// Handling POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    extract($_POST, EXTR_OVERWRITE, "_");

    // SQL statement
    $sql = "SELECT CONCAT(IFNULL(st.firstname, ''), ' ', IFNULL(st.lastname, '')) AS student_name,
                   st.nickname,
             --    c.price,
                   p.amount_paid as price_pay,
                   p.bill_date,
                   c.course_id,
                   c.course_name,
                   CONCAT(IFNULL(DATE_FORMAT(c.time_from, '%H:%i'), ''), '-', IFNULL(DATE_FORMAT(c.time_to, '%H:%i'), '')) AS course_time,
                   sj.subject_name,
                   (SELECT GROUP_CONCAT(CONCAT(IFNULL(t.first_name, ''), ' ', IFNULL(t.last_name, '')) SEPARATOR ', ') 
                    FROM teachers t 
                    JOIN courses_teacher ct ON t.teacher_id = ct.teacher_id 
                    WHERE ct.course_id = c.course_id) AS teachers,
                   att.attendance_no,
                   att.attendance_date AS session_date,
                   att.attendance_id,
                   att.student_code,
                   CASE WHEN att.attendance_no = 1 THEN att.attendance_date ELSE NULL END AS date_sessions
            FROM courses c
            LEFT JOIN sessions ss ON c.course_id = ss.course_id
            LEFT JOIN courses_student cs ON c.course_id = cs.course_id
            LEFT JOIN student st ON cs.student_code = st.student_code
            LEFT JOIN attendance att ON ss.session_id = att.session_id AND att.student_code = st.student_code
            LEFT JOIN subjects sj ON c.subject_id = sj.subject_id
            LEFT JOIN payments p ON p.course_id = c.course_id AND p.student_code = cs.student_code
            WHERE att.status = 'Y' AND att.student_code = :student AND c.course_id = :course AND p.payment_id = :payment
            ORDER BY c.course_name, ss.session_no, att.student_code";

    // Prepared statement
    try {
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['student' => $student, 'course' => $couses, 'payment' => $payment])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Getting data error => " . $error[2]);
        }
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode(array("data"=>$data));
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(['status' => '0', 'message' => $e->getMessage()]);
    } finally {
        $conn = null; // Closing connection
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => '0', 'message' => 'Request method fail.']);
}

ob_end_flush();
exit;
?>
