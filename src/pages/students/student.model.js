import { Badge, Space } from "antd";
import { Button } from "antd";
// import { PrinterOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
// import dayjs from 'dayjs';

export const accessColumn = ({ handleEdit, handleDelete, handleView }) => [
  {
    title: "ชื่อ-นามสกุล",
    dataIndex: "name",
    key: "name",
    width: "30%",
    sorter: (a, b) => (a?.typename || "").localeCompare(b?.typename || ""),
  },
  {
    title: "ชื่อเล่น",
    dataIndex: "nickname",
    key: "nickname",
    width: "20%",
    sorter: (a, b) => (a?.typename || "").localeCompare(b?.typename || ""),
  },
  {
    title: "ระดับชั้น",
    dataIndex: "degree",
    key: "degree",
    width: "15%",
    sorter: (a, b) => (a?.typename || "").localeCompare(b?.typename || ""),
  },
  {
    title: "โรงเรียน",
    dataIndex: "school",
    key: "school",
    width: "25%",
    sorter: (a, b) => (a?.typename || "").localeCompare(b?.typename || ""),
  },
  {
    title: "Action",
    key: "student_code",
    dataIndex: "student_code",
    width: "10%",
    fixed: "right",
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

export const Items = {
  student_code : null,
  stcode: null,
  stname: null,
  prename: null,
  idno: null,
  road: null,
  subdistrict: null,
  district: null,
  province: null,
  zipcode: null,
  country: null,
  delidno: null,
  delroad: null,
  delsubdistrict: null,
  deldistrict: null,
  delprovince: null,
  delzipcode: null,
  delcountry: null,
  tel: null,
  fax: null,
  taxnumber: null,
  email: null,
  active_status: "Y",
};
