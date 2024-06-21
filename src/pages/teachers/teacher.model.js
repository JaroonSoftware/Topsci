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
    width: "40%",
    sorter: (a, b) => (a?.name || "").localeCompare(b?.name || ""),
  },
  {
    title: "เบอร์โทร",
    dataIndex: "phone_number",
    key: "phone_number",
    width: "30%",
    sorter: (a, b) => (a?.phone_number || "").localeCompare(b?.phone_number || ""),
  },
  {
    title: "Action",
    key: "teacher_id",
    dataIndex: "teacher_id",
    width: "30%",
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

