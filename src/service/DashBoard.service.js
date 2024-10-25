import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_GETREPORT: `/dashboard/get-report.php`,
  API_GETDATA:  `/dashboard/get-data.php`,
  API_LIST_STUDENT_BY_COURSE:  `/dashboard/get-student-by-course.php`,
  API_UPDATE_DATE: `/dashboard/update-date.php`,
  API_GETDATAPAYMENT:  `/dashboard/get-data-payment.php`,
  API_ADD_PAYMENT:  `/dashboard/add-data-payment.php`,
};
  
const DashBoardService = () => { 
  
  const getReport = (parm = {}) => api.post(`${API_URL.API_GETREPORT}`, parm);
  const getDataReport = (parm = {}) => api.post(`${API_URL.API_GETDATA}`, parm);
  const getListStudentByCourse = (parm = {}) => api.post(`${API_URL.API_LIST_STUDENT_BY_COURSE}`, parm);
  const updateDate = (parm = {}) => api.post(`${API_URL.API_UPDATE_DATE}`, parm);
  const getDataPayment = (parm = {}) => api.post(`${API_URL.API_GETDATAPAYMENT}`, parm);
  const addDatePayment = (parm = {}) => api.post(`${API_URL.API_ADD_PAYMENT}`, parm);
  return {
    getReport,
    getDataReport,
    getListStudentByCourse,
    updateDate,
    getDataPayment,
    addDatePayment,
  };
};

export default DashBoardService;