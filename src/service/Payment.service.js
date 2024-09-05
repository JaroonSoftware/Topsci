import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/payment/manage.php`, 
  API_GETMASTER: `/payment/search.php`,
  API_GETPAYMENT: `/payment/get-payment.php`, 
};
  
const PaymentService = () => { 
  
  const getListPaymentDetail = (parm = {}) => api.post(`${API_URL.API_GETPAYMENT}`, parm);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);

  return {
    getListPaymentDetail,
    get, 
    search,
  };
};

export default PaymentService;