import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/course/manage.php`, 
  API_GETMASTER: `/course/search.php`,
  API_GETLISTSTUDENT : `/course/get-liststudent.php`,
};
  
const CoursesService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);

  const getListStudent = (parm = {}) => api.get(`${API_URL.API_GETLISTSTUDENT}?${getParmeter(parm)}`, { ignoreLoading : true });
  

  return {
    create,
    update,
    deleted,
    get, 
    search,
    getListStudent,
  };
};

export default CoursesService;