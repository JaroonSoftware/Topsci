import { Button, Popconfirm, Space } from "antd"; 
import "../../assets/styles/banks.css"
// import { Typography } from "antd"; 
// import { Popconfirm, Button } from "antd";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { DeleteOutlined, EditOutlined, PrinterOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { comma } from '../../utils/util';


/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView, handlePrint}) => [
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
    width: 120,
    sorter: (a, b) => (a.number_of_sessions).localeCompare(b.number_of_sessions),
  },
  { 
    title: "จำนวนนักเรียน",
    dataIndex: "student_count",
    key: "student_count", 
    align: "right",
    width: 120,
    sorter: (a, b) => (a.student_count).localeCompare(b.student_count),
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
          icon={<EditOutlined />}
          className="bn-primary-outline"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => handleEdit(record)}
          size="small"
        />
      </Space>
    ),
  }, 
];

export const studentColumn = ({handleRemoveStudent}) => [
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
    title: "ตัวเลือก",
    align: "center",
    key: "operation",
    dataIndex: "operation",
    render: (_, record, idx) => handleRemoveStudent(record),
    width: '90px',
    fixed: 'right',
  },
];

export const teacherColumn = ({handleRemoveTeacher}) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    width: 80, 
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "ชื่อ-นามสกุล ครู",
    dataIndex: "teacher_name",
    key: "teacher_name",
    align: "left",
  },
  {
    title: "ตัวเลือก",
    align: "center",
    key: "operation",
    dataIndex: "operation",
    render: (_, record, idx) => handleRemoveTeacher(record),
    width: '90px',
    fixed: 'right',
  },
];




