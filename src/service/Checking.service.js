import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/checking/manage.php`, 
  API_GETMASTER: `/checking/search.php`,
};
  
const CheckingService = () => { 
  
  const checking = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);

  return {
    checking,
    get, 
    search,
  };
};

export default CheckingService;