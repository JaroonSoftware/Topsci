import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_GETREPORT: `/dashboard/get-report.php`,
  API_GETDATA:  `/dashboard/get-data.php`,
};
  
const DashBoardService = () => { 
  
  const getReport = (parm = {}) => api.post(`${API_URL.API_GETREPORT}`, parm);
  const getDataReport = (parm = {}) => api.post(`${API_URL.API_GETDATA}`, parm);
  return {
    getReport,
    getDataReport,

  };
};

export default DashBoardService;