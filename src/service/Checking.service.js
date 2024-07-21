import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/checking/manage.php`, 
  API_GETMASTER: `/checking/search.php`,
  API_GETLISTSTUDENT : `/checking/get-liststudent.php`,
  API_GETTEACGERBYCOUSE : `/checking/get-teacherbycouse.php`,
};
  
const CheckingService = () => { 
  
  const updatecheckname = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);

  const getListStudent = (parm = {}) => api.get(`${API_URL.API_GETLISTSTUDENT}?${getParmeter(parm)}`, { ignoreLoading : true });
  
  const getTeacherbyCouse = (code) => api.get(`${API_URL.API_GETTEACGERBYCOUSE}?code=${code}`);
  

  return {
    updatecheckname,
    get, 
    search,
    getListStudent,
    getTeacherbyCouse,
  };
};

export default CheckingService;