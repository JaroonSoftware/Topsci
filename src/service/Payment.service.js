import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/payment/manage.php`, 
  API_GETMASTER: `/payment/search.php`,
  API_GETPAYMENT: `/payment/get-payment.php`, 
  API_GETPRINT: `/payment/get-data-print.php`, 
  API_UPDATEBILLDATE: `/payment/up-bill-date.php`, 
};
  
const PaymentService = () => { 
  
  const getListPaymentDetail = (parm = {}) => api.post(`${API_URL.API_GETPAYMENT}`, parm);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);
  const search = (parm = {}) => api.post(`${API_URL.API_GETMASTER}`, parm);
  const addPayment = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const updatePayment = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const getDataPrint = (parm = {}) => api.post(`${API_URL.API_GETPRINT}`, parm);
  const updatePaymentBillDate = (parm = {}) => api.post(`${API_URL.API_UPDATEBILLDATE}`, parm);
  return {
    getListPaymentDetail,
    get, 
    search,
    addPayment,
    updatePayment,
    getDataPrint,
    updatePaymentBillDate,
  };
};

export default PaymentService;