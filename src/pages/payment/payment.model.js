import { Button, Popconfirm,  message, Badge, Switch, Form, Input } from "antd"; 
import "../../assets/styles/banks.css";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { FaPrint } from "react-icons/fa6";
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { DollarOutlined, FileSearchOutlined } from '@ant-design/icons';
import BillPDF from './BillPDF';
import { pdf } from '@react-pdf/renderer'; // ใช้ pdf() ในการสร้าง Blob จาก PDF
import PaymentService from "../../service/Payment.service";

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};
const paymentservice = PaymentService();

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
      }else if ((parseFloat(record.price)- parseFloat(record.total_payment)) < 0) {
        return "0";
      } else {
        return (parseFloat(record.price) - parseFloat(record.total_payment));
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
      }else if (parseFloat(record.price) === parseFloat(record.total_payment)) {
        return "ชำระเงินครบ";
      } else if (parseFloat(record.total_payment) < parseFloat(record.price)) {
        return "ค้างชำระเงิน";
      } else if (parseFloat(record.total_payment) > parseFloat(record.price)) {
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
      // const handlePrint = async () => {
      //   try {
      //     const res = await paymentservice
      //     .getDataPrint({ student: record.student_code, couses: record.course_id })
      //     .catch((error) => message.error("get data fail."));
      //     //console.log(res.data.data);
      //     const dataPrint = res.data.data;
      //     const blob = await pdf(<BillPDF data={dataPrint}  />).toBlob(); 
          
      //     // ตรวจสอบ Blob ที่ถูกสร้าง
      //     if (!blob) {
      //       console.error("Blob ไม่ถูกสร้าง");
      //       return;
      //     }
      
      //     const url = URL.createObjectURL(blob);
      
      //     // เปิดแท็บใหม่และสั่งพิมพ์จากแท็บใหม่แทนการใช้ iframe
      //     const newWindow = window.open(url);
      //     if (newWindow) {
      //       newWindow.onload = () => {
      //         newWindow.print();
      //       };
      //     } else {
      //       console.error("ไม่สามารถเปิดแท็บใหม่ได้");
      //     }
      //   } catch (error) {
      //     console.error("เกิดข้อผิดพลาด: ", error);
      //   }
      // };
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
    },
  }, 
];
export const listPaymentDetailColumn = (isEditing, edit, save, cancel, editingKey, printBill) => [
    {
      title: "วันที่ชำระเงิน",
      key: "payment_date",
      dataIndex: "payment_date",
      editable: true,
      inputType: "date",
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
      editable: true,
      inputType: "number",
    },
    {
      title: "วิธีการชำระเงิน",
      dataIndex: "payment_method",
      key: "payment_method",
      editable: true,
      inputType: "select",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <span style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {editable ? (
              <>
                <Tooltip placement="topLeft" title={"บันทึกแก้ไขการชำระเงิน"}>
                  <Button onClick={() => save(record.key)} size="small">
                    Save
                  </Button>
                </Tooltip>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <Button type="link" size="small">
                    Cancel
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <Button
                disabled={editingKey !== ""}
                size="small"
                onClick={() => edit(record)}
              >
                Edit
              </Button>
            )}
            {/* ปุ่ม Print Receipt */}
            <Tooltip placement="topLeft" title={'ปริ้นใบเสร็จ'}>
              <Button
                type="primary" ghost
                className="checking-button"
                icon={<FaPrint />}
                onClick={() => printBill(record)}
                size="small"
              >
              </Button>
            </Tooltip>
          </span>
        );
      },
    },
  ];