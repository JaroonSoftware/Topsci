<?php
ob_start();
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    extract($_POST, EXTR_OVERWRITE, "_");  
    try { 

        if($report_type == 1){
            $sql = "SELECT 
                        st.firstname as name,
                        st.lastname as last_name,
                        st.nickname,
                        (select max(payment_date) from payments where course_id = c.course_id and student_code = st.student_code) as last_payment_date,
                        c.price,
                        c.course_name,
                        ss.session_no,
                        ss.session_date,
                        att.student_code,
                        ROW_NUMBER() OVER (PARTITION BY att.student_code ORDER BY ss.session_date) AS attendance_count,
                        CASE 
                            WHEN ROW_NUMBER() OVER (PARTITION BY att.student_code ORDER BY ss.session_date) = 1 THEN ss.session_date
                            ELSE NULL
                        END AS date_sessions
                    FROM 
                        courses c
                    LEFT JOIN 
                        sessions ss ON c.course_id = ss.course_id
                    LEFT JOIN 
                        courses_student cs ON c.course_id = cs.course_id
                    LEFT JOIN 
                        student st ON cs.student_code = st.student_code
                    LEFT JOIN 
                        attendance att ON ss.session_id = att.session_id AND att.student_code = st.student_code
                    WHERE 
                        att.status = 'Y' and c.course_id = :course
                    ORDER BY 
                        c.course_name, ss.session_no, att.student_code";
            $stmt = $conn->prepare($sql);
            if (!$stmt->execute(['course' => $courses ])){
                $error = $conn->errorInfo(); 
                http_response_code(404);
                throw new PDOException("Geting data error => $error");
            }
            $student = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT c.* ";
            $sql .= " FROM `courses` c ";
            $sql .= " where c.course_id = :code";

            $stmt = $conn->prepare($sql); 
            if (!$stmt->execute([ 'code' => $courses ])){
                $error = $conn->errorInfo(); 
                http_response_code(404);
                throw new PDOException("Geting data error => $error");
            }
            $courses = $stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array( "data" => $student, "course" => $courses)));
        }else if ($report_type == 2){
            $sql = "SELECT 
                        st.firstname as name,
                        st.lastname as last_name,
                        st.nickname,
                        (select max(payment_date) from payments where course_id = c.course_id and student_code = st.student_code) as last_payment_date,
                        c.price,
                        c.course_name,
                        ss.session_no,
                        ss.session_date,
                        att.student_code,
                        ROW_NUMBER() OVER (PARTITION BY att.student_code ORDER BY ss.session_date) AS attendance_count,
                        CASE 
                            WHEN ROW_NUMBER() OVER (PARTITION BY att.student_code ORDER BY ss.session_date) = 1 THEN ss.session_date
                            ELSE NULL
                        END AS date_sessions
                    FROM 
                        courses c
                    LEFT JOIN 
                        sessions ss ON c.course_id = ss.course_id
                    LEFT JOIN 
                        courses_student cs ON c.course_id = cs.course_id
                    LEFT JOIN 
                        student st ON cs.student_code = st.student_code
                    LEFT JOIN 
                        attendance att ON ss.session_id = att.session_id AND att.student_code = st.student_code
                    WHERE 
                        att.status = 'Y' and c.course_id = :course and st.student_code = :student_code
                    ORDER BY 
                        c.course_name, ss.session_no, att.student_code";
            $stmt = $conn->prepare($sql);
            if (!$stmt->execute(['course' => $courses, 'student_code' => $student ])){
                $error = $conn->errorInfo(); 
                http_response_code(404);
                throw new PDOException("Geting data error => $error");
            }
            $student = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT c.* ";
            $sql .= " FROM `courses` c ";
            $sql .= " where c.course_id = :code";

            $stmt = $conn->prepare($sql); 
            if (!$stmt->execute([ 'code' => $courses ])){
                $error = $conn->errorInfo(); 
                http_response_code(404);
                throw new PDOException("Geting data error => $error");
            }
            $courses = $stmt->fetch(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode(array('status' => 1, 'data' => array( "data" => $student, "course" => $courses)));
        }
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