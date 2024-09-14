import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_GETREPORT: `/dashboard/get-report.php`,
  API_GETDATA:  `/dashboard/get-data.php`,
  API_LIST_STUDENT_BY_COURSE:  `/dashboard/get-student-by-course.php`,
};
  
const DashBoardService = () => { 
  
  const getReport = (parm = {}) => api.post(`${API_URL.API_GETREPORT}`, parm);
  const getDataReport = (parm = {}) => api.post(`${API_URL.API_GETDATA}`, parm);
  const getListStudentByCourse = (parm = {}) => api.post(`${API_URL.API_LIST_STUDENT_BY_COURSE}`, parm);
  return {
    getReport,
    getDataReport,
    getListStudentByCourse,
  };
};

export default DashBoardService;