import { Button, Popconfirm, Space, Badge, Switch, Form, Input } from "antd"; 
import "../../assets/styles/banks.css"
// import { Typography } from "antd"; 
// import { Popconfirm, Button } from "antd";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { FaListCheck } from "react-icons/fa6";
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
    render: (text, record) => {
      if (record.session_count === record.number_of_sessions) {
        return <Badge count={record.session_count+'/'+record.number_of_sessions} className="badge-success" />;
      }else{
        return <Badge count={record.session_count+'/'+record.number_of_sessions} className="badge-warning" />;
      }
      return null; // หรือสามารถแสดงข้อความอื่น หรือเว้นว่างไว้
    },
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
    render: (text, record) => {
      if (record.session_count < record.number_of_sessions) {
      return <Space>
              <Button
                type="primary" ghost
                icon={<FaListCheck  />}
                className="checking-button"
                onClick={(e) => handleCheck(record)}
                size="small"
              />
            </Space>
      }
    },
  }, 
];

export const studentColumn = (listStudent, handleReasonChange,handleSwitchChange ) => [
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
        checkedChildren="มา" unCheckedChildren="ไม่มา"
        onChange={(checked) => handleSwitchChange(checked, student)} 
      />
    ),
  },
  {
    title: 'เหตุผลที่ไม่มาเรียน',
    dataIndex: 'reason',
    key: 'reason',
    render: (text, student) => (
      <Form.Item
        name={`reason_${student.student_code}`}
        rules={[
          {
            required: !student.attendance,
            message: 'กรุณากรอกเหตุผลที่ไม่มาเรียน',
          },
        ]}
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
