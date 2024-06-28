/** get items column */
export const columns = ()=>{
  return [
    {
      title: "ชื่อ-นามสกุล",
      key: "student_name",
      dataIndex: "student_name", 
    },
    {
      title: "ชั้นเรียน",
      dataIndex: "degree",
      key: "degree",
    },
    {
      title: "โรงเรียน",
      dataIndex: "school",
      key: "school",
    },
  ]
};