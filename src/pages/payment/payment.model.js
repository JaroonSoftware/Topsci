import { Button, Popconfirm, Space, Badge, Switch, Form, Input } from "antd"; 
import "../../assets/styles/banks.css";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { DollarOutlined, FileSearchOutlined } from '@ant-design/icons';

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const accessColumn = ({handleListPayment}) => [
  {
    title: "ชื่อคอร์ส",
    key: "course_name",
    dataIndex: "course_name",
    align: "left",
    sorter: (a, b) => (a.course_name).localeCompare(b.course_name),
    width:140,
    render: (text, record) => (
      <span
        style={{ color: "#29f", cursor: "pointer" }}
        onClick={(e) => handleListPayment(record)}
      >
        {record.course_name}
      </span>
    ),
  },
  {
    title: "วิชา",
    dataIndex: "subject_name",
    key: "subject_name",
    width: 140,
    sorter: (a, b) => (a.subject_name).localeCompare(b.subject_name),
  },
  {
    title: "เวลาเรียน",
    dataIndex: "study_time",
    key: "study_time",
    width: 120,
    sorter: (a, b) => (a.study_time).localeCompare(b.study_time),
  },
  { 
    title: "จำนวนนักเรียน",
    dataIndex: "student_count",
    key: "student_count", 
    align: "right",
    width: 80,
  },
];

export const studentColumn = (listStudent, handleDetailPayment,handleAddPayment ) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    align: "center",
    width: 80, 
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "ชื่อ-นามสกุล นักเรียน",
    dataIndex: "student_name",
    key: "student_name",
    align: "left",
  },
  {
    title: "ชั้นปี",
    dataIndex: "degree",
    key: "degree", 
    align: "left",
  },
  {
    title: "โรงเรียน",
    dataIndex: "school",
    key: "school", 
    align: "left",
  },
  {
    title: "ยอดค้างชำระ",
    dataIndex: "overdue_balance",
    key: "overdue_balance", 
    align: "center",
    render: (text, record) => {
      if (record.check_checking === "N") {
        return "0"
      }else if ((parseFloat(record.price) * parseFloat(record.last_sessions) - parseFloat(record.total_payment)) < 0) {
        return "0";
      } else {
        return (parseFloat(record.price) * parseFloat(record.last_sessions) - parseFloat(record.total_payment));
      }
    },
  },
  {
    title: "สถานะการชำระเงิน",
    dataIndex: "check_checking",
    key: "check_checking", 
    align: "center",
    width: 200,
    render: (text, record) => {
      if (record.check_checking === "N") {
        return "รอการชำระเงิน"
      }else if (parseFloat(record.price) * parseFloat(record.last_sessions) === parseFloat(record.total_payment)) {
        return "ชำระเงินครบ";
      } else if (parseFloat(record.total_payment) < parseFloat(record.price) * parseFloat(record.last_sessions)) {
        return "ค้างชำระเงิน";
      } else if (parseFloat(record.total_payment) > parseFloat(record.price) * parseFloat(record.last_sessions)) {
        return "ชำระเงินเกิน";
      }
      return null; // หรือสามารถแสดงข้อความอื่น หรือเว้นว่างไว้
    },
  },
  {
    title: "Action",
    key: "operation", 
    fixed: 'right',
    align: "center",
    width: 120,
    render: (text, record) => {
      if (record.last_sessions < record.number_of_sessions) {
        return (
          <span style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <Tooltip placement="topLeft" title={'ดูประวัตการชำระเงิน'}>
              <Button
                type="primary" ghost
                icon={<FileSearchOutlined  />}
                className="checking-button"
                onClick={(e) => handleDetailPayment(record.student_code)}
                size="small"
              />
            </Tooltip>
            <Tooltip placement="topLeft" title={'ชำระเงิน'}>
              <Button
                  type="primary" ghost
                  icon={<DollarOutlined  />}
                  className="checking-button"
                  onClick={(e) => handleAddPayment(record.student_code)}
                  size="small"
                />
            </Tooltip>
          </span>
        )
      }else{
        return (
          <span>
            <Tooltip placement="topLeft" title={'ดูประวัตการชำระเงิน'}>
              <Button
                type="primary" ghost
                icon={<FileSearchOutlined  />}
                className="checking-button"
                onClick={(e) => handleDetailPayment(record.student_code)}
                size="small"
              />
            </Tooltip>
            {' '}
          </span>
        )
      }
    },
  }, 
];
export const listPaymentDetailColumn = () => [
    {
      title: "วันที่ชำระเงิน",
      key: "payment_date",
      dataIndex: "payment_date",
      render: (text) => {
        const date = new Date(text);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
      }, 
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
];
