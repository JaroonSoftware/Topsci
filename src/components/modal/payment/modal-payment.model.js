/** get items column */
export const columns = ()=>{
  return [
    {
      title: "วันที่ชำระเงิน",
      key: "payment_date",
      dataIndex: "payment_date", 
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount_paid",
      key: "amount_paid",
    },
    {
      title: "วิธีการชำระเงิน",
      dataIndex: "payment_method",
      key: "payment_method",
    },
  ]
};