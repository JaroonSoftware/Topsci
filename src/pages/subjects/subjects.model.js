import { Badge, Space } from "antd";
import { Button } from "antd";
// import { PrinterOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
// import dayjs from 'dayjs';

export const accessColumn = ({ handleEdit, handleDelete, handleView }) => [
  {
    title: "ชื่อวิชา",
    dataIndex: "subject_name",
    key: "subject_name",
    width: "40%",
    sorter: (a, b) => (a?.subject_name || "").localeCompare(b?.subject_name || ""),
  },
  {
    title: "รายละเอียดวิชา",
    dataIndex: "description",
    key: "description",
    width: "30%",
    sorter: (a, b) => (a?.description || "").localeCompare(b?.description || ""),
  },
  {
    title: "Action",
    key: "subject_id",
    dataIndex: "subject_id",
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

