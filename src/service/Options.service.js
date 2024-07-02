import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = {
  OPTION_ITEMS: `/common/options-items.php`, 
  OPTION_STUDENT: `/common/options-student.php`,
  OPTION_TEACHER: `/common/options-teacher.php`,
  OPTION_QUOTATION: `/common/options-quotation.php`,
  OPTION_ITEMSTYPE: `/common/options-itemstype.php`,
  OPTION_UNIT: `/common/options-unit.php`,
  OPTION_SUBJECTS: `/common/options-subjects.php`,
  OPTION_COURSE: `/common/options-course.php`,
};
 

const OptionService = () => {
  const optionsItems = (parm = {}) => api.get(`${API_URL.OPTION_ITEMS}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsStudent = () => api.get(`${API_URL.OPTION_STUDENT}`, { ignoreLoading : true });
  const optionsTeacher = () => api.get(`${API_URL.OPTION_TEACHER}`, { ignoreLoading : true });
  const optionsQuotation = () => api.get(`${API_URL.OPTION_QUOTATION}`, { ignoreLoading : true });
  const optionsItemstype = () => api.get(`${API_URL.OPTION_ITEMSTYPE}`, { ignoreLoading : true });
  const optionsUnit = () => api.get(`${API_URL.OPTION_UNIT}`, { ignoreLoading : true });
  const optionsSubjects = () => api.get(`${API_URL.OPTION_SUBJECTS}`, { ignoreLoading : true });
  const optionsCourse = () => api.get(`${API_URL.OPTION_COURSE}`, { ignoreLoading : true });

  return {
    optionsItems,
    optionsStudent,
    optionsTeacher,
    optionsQuotation,
    optionsItemstype,
    optionsUnit,
    optionsSubjects,
    optionsCourse,
  };
};

export default OptionService;