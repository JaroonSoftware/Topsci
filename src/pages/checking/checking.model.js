import { Button, Popconfirm, Space, Badge, Switch, Form, Input } from "antd"; 
import "../../assets/styles/banks.css"
// import { Typography } from "antd"; 
// import { Popconfirm, Button } from "antd";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { DeleteOutlined, EditOutlined, PrinterOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { BsCardChecklist } from "react-icons/bs";

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const accessColumn = ({handleCheck}) => [
  {
    title: "ชื่อคอร์ส",
    key: "course_name",
    dataIndex: "course_name",
    align: "left",
    sorter: (a, b) => (a.course_name).localeCompare(b.course_name),
    width:140,
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
    title: "จำนวนรอบเรียน",
    dataIndex: "number_of_sessions",
    key: "number_of_sessions", 
    align: "right",
    width: 80,
    render: (text) => (
      <Badge count={text} className="badge-success" />
    ),
  },
  { 
    title: "จำนวนนักเรียน",
    dataIndex: "student_count",
    key: "student_count", 
    align: "right",
    width: 80,
  },
  {
    title: "Action",
    key: "operation", 
    fixed: 'right',
    align: "center",
    width: 100,
    render: (text, record) => (
      <Space>
        <Button
          icon={<BsCardChecklist />}
          className="checking-button"
          onClick={(e) => handleCheck(record)}
          size="small"
        />
      </Space>
    ),
  }, 
];

export const studentColumn = ({handleCheckChange, handleReasonChange}) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
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
    title: 'เช็คชื่อ',
    dataIndex: 'attendance',
    key: 'attendance',
    render: (text, student) => (
      <Switch 
        checked={student.attendance} 
        onChange={(checked) => handleCheckChange(checked, student)} 
      />
    ),
  },
  {
    title: 'เหตุผลที่ไม่มาเรียน',
    dataIndex: 'reason',
    key: 'reason',
    render: (text, student) => (
      <Form.Item
        name={`reason_${student.code}`}
        rules={[
          {
            required: !student.attendance,
            message: 'กรุณากรอกเหตุผลที่ไม่มาเรียน',
          },
        ]}
        initialValue={student.reason}
      >
        <Input 
          value={student.reason} 
          onChange={(e) => handleReasonChange(e, student)} 
          placeholder="กรอกเหตุผลที่ไม่มาเรียน" 
          disabled={student.attendance} 
        />
      </Form.Item>
    ),
  },
];
