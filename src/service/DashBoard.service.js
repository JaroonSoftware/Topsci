import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_GETREPORT: `/dashboard/get-report.php`,  
};
  
const DashBoardService = () => { 
  
  const getReport = (parm = {}) => api.post(`${API_URL.API_GETREPORT}`, parm);

  return {
    getReport,

  };
};

export default DashBoardService;