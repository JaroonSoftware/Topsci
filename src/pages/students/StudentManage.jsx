/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Flex,
  message,
  Radio,
  Select,
  Divider,
  Card,
} from "antd";
import { Row, Col, Space } from "antd";
import { SaveFilled } from "@ant-design/icons";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router";
import { delay } from "../../utils/util";
import Studentservice from "../../service/Student.Service";

const studentservice = Studentservice();
const from = "/students";
const ItemsManage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || { config: null };
  const [form] = Form.useForm();

  const [formDetail, setFormDetail] = useState({});

  const init = async () => {
  };

  useEffect(() => {
    // setLoading(true);

    if (config?.action !== "create") {
      getsupData(config.code);
    } else {
      init();
      return () => {
        form.resetFields();
      };
    }
  }, []);

  const getsupData = (v) => {
    studentservice
      .get(v)
      .then(async (res) => {
        const { data } = res.data;

        const init = {
          ...data,
        };

        setFormDetail(init);
        form.setFieldsValue({ ...init });
      })
      .catch((err) => {
        console.log(err);
        message.error("Error getting infomation Product.");
      });
  };
  const handleConfirm = () => {
    form.validateFields().then((v) => {
      const source = { ...formDetail, ...v };
      const actions =
        config?.action !== "create"
          ? studentservice.update(source)
          : studentservice.create(source);

      actions
        .then(async (r) => {
          message.success("บันทึกสำเร็จ");
          navigate(from, { replace: true });
          await delay(300);
          console.clear();
        })
        .catch((err) => {
          console.warn(err);
          const data = err?.response?.data;
          message.error(data?.message || "บันทึกไม่สำเร็จ");
        });
    });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const Detail = () => (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={14} xl={3} xxl={3}>
      <Form.Item 
        label="เพศ" 
        name="gender"
        rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
      >
        <Radio.Group 
        optionType="button"
        buttonStyle="solid"
        className="radio-group-student-gender"
        options={[
          {
            value: "ชาย",
            label: "ชาย",
          },
          {
            value: "หญิง",
            label: "หญิง",
          },
        ]}
       />
      </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={14} xl={21} xxl={21}></Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="ชื่อ"
            name="firstname"
            rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
          >
            <Input placeholder="กรอกชื่อ" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="นามสกุล"
            name="lastname"
            rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
          >
            <Input placeholder="กรอกนามสกุล" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="ชื่อเล่น"
            name="nickname"
            rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
          >
            <Input placeholder="กรอกชื่อเล่น" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="ID Line"
            name="line"
          >
            <Input placeholder="กรอก ID Line" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="Facebook"
            name="facebook"
          >
            <Input placeholder="กรอกชื่อ Facebook" />
          </Form.Item>
      </Col>

      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="เบอร์โทรศัพท์ 1"
            name="tel1"
          >
            <Input placeholder="กรอกเบอร์โทรศัพท์" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="เบอร์โทรศัพท์ 2"
            name="tel2"
          >
            <Input placeholder="กรอกเบอร์โทรศัพท์" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
        <Form.Item
          label="ระดับชั้น"
          name="degree"
          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
        >
          <Select
            size="large"
            placeholder="เลือกระดับชั้น"
            showSearch
            filterOption={filterOption}
            options={[
              {
                value: "ป.1",
                label: "ป.1",
              },
              {
                value: "ป.2",
                label: "ป.2",
              },
              {
                value: "ป.3",
                label: "ป.3",
              },
              {
                value: "ป.4",
                label: "ป.4",
              },
              {
                value: "ป.5",
                label: "ป.5",
              },
              {
                value: "ป.6",
                label: "ป.6",
              },
              {
                value: "ม.1",
                label: "ม.1",
              },
              {
                value: "ม.2",
                label: "ม.2",
              },
              {
                value: "ม.3",
                label: "ม.3",
              },
              {
                value: "ม.4",
                label: "ม.4",
              },
              {
                value: "ม.5",
                label: "ม.5",
              },
              {
                value: "ม.6",
                label: "ม.6",
              },
            ]}
          ></Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="โรงเรียน"
            name="school"
          >
            <Input placeholder="กรอกโรงเรียน" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
          <Form.Item
            label="Remark"
            name="remark"
          >
            <Input placeholder="Remark" />
          </Form.Item>
      </Col>
    </Row>
  );

  const SectionBottom = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={from} />
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            onClick={() => {
              handleConfirm();
            }}
          >
            บันทึก
          </Button>
        </Flex>
      </Col>
    </Row>
  );

  return (
    <div className="customer-manage xs:px-0 sm:px-0 md:px-8 lg:px-8">
      <Space direction="vertical" className="flex gap-2">
        <Form form={form} layout="vertical" autoComplete="off">
          <Card title={config?.title}>
            <Divider
              orientation="left"
              plain
              style={{ margin: 10, fontSize: 20, border: 20 }}
            >
              รายละเอียดข้อมูล
            </Divider>
            <Detail />

          </Card>
        </Form>
        {SectionBottom}
      </Space>
    </div>
  );
};

export default ItemsManage;
