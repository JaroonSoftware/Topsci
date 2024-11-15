/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, message, Select } from "antd";
import { Collapse, Form, Flex, Row, Col, Space } from "antd";
import { Input, Button, Table, Typography } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { accessColumn } from "./student.model";
import Studentservice from "../../service/Student.Service";

const studentservice = Studentservice();
const mngConfig = {
  title: "",
  textOk: null,
  textCancel: null,
  action: "create",
  code: null,
};
const StudentAccess = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [accessData, setAccessData] = useState([]);
  const [activeSearch, setActiveSearch] = useState([]);

  const handleSearch = () => {
    form.validateFields().then((v) => {
      const data = { ...v };
      studentservice
        .search(data)
        .then((res) => {
          const { data } = res.data;
          setAccessData(data);
        })
        .catch((err) => {
          console.log(err);
          message.error("Request error!");
        });
    });
  };

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };

  const hangleAdd = () => {
    navigate("manage/create", {
      state: {
        config: {
          ...mngConfig,
          title: "เพิ่มนักเรียน",
          action: "create",
        },
      },
      replace: true,
    });
  };

  const handleEdit = (data) => {
    // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
    navigate("manage/edit", {
      state: {
        config: {
          ...mngConfig,
          title: "แก้ไขข้อมูลนักเรียน",
          action: "edit",
          code: data?.student_code,
        },
      },
      replace: true,
    });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleDelete = (data) => {
    // startLoading();
    // ctmService.deleted(data?.dncode).then( _ => {
    //     const tmp = accessData.filter( d => d.dncode !== data?.dncode );
    //     setAccessData([...tmp]);
    // })
    // .catch(err => {
    //     console.log(err);
    //     message.error("Request error!");
    // });
  };

  useEffect(() => {
    getData({});
  }, []);

  const getData = (data) => {
    studentservice
      .search(data)
      .then((res) => {
        const { data } = res.data;

        setAccessData(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };
  const FormSearch = (
    <Collapse
      size="small"
      bordered = {true}
      onChange={(e) => {
        setActiveSearch(e);
      }}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: <><SearchOutlined /><span> <b>ค้นหา</b> </span></>,  
          children: (
            <>
              <Form form={form} layout="vertical" autoComplete="off">
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="ชื่อ"
                      name="firstname"
                      //onChange={handleSearch}
                    >
                      <Input placeholder="กรอกชื่อ" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="นามสกุล"
                      name="lastname"
                      //onChange={handleSearch}
                    >
                      <Input placeholder="กรอกนามสกุล" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="ชื่อเล่น"
                      name="nickname"
                      //onChange={handleSearch}
                    >
                      <Input placeholder="กรอกชื่อเล่น" />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="เบอร์โทร"
                      name="tel"
                      onChange={handleSearch}
                    >
                      <Input placeholder="กรอกเบอร์โทร" />
                    </Form.Item>
                  </Col>
                </Row> */}

                <Row gutter={[8, 8]}>
                  {/* <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="Line"
                      name="line"
                      onChange={handleSearch}
                    >
                      <Input placeholder="กรอก Line" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="Facebook"
                      name="facebook"
                      onChange={handleSearch}
                    >
                      <Input placeholder="กรอก Facebook" />
                    </Form.Item>
                  </Col> */}
                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="ประดับชั้น"
                      name="degree"
                      // onChange={handleSearch}
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
                  <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Form.Item
                      label="โรงเรียน"
                      name="school"
                      //onChange={handleSearch}
                    >
                      <Input placeholder="กรอกโรงเรียน" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={8} md={12} lg={12} xl={12}>
                    {/* Ignore */}
                  </Col>
                  <Col xs={24} sm={8} md={12} lg={12} xl={12}>
                    <Flex justify="flex-end" gap={8}>
                      <Button
                        type="primary"
                        size="small"
                        className="bn-action"
                        icon={<SearchOutlined />}
                        onClick={() => handleSearch()}
                      >
                        ค้นหา
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        className="bn-action"
                        danger
                        icon={<ClearOutlined />}
                        onClick={() => handleClear()}
                      >
                        ล้าง
                      </Button>
                    </Flex>
                  </Col>
                </Row>
              </Form>
            </>
          ),
          showArrow: false,
        },
      ]}
    />
  );
  const column = accessColumn({ handleEdit, handleDelete });

  const TitleTable = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={3}>
            รายชื่อนักเรียน
          </Typography.Title>
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            size="small"
            className="bn-action bn-center bn-primary-outline justify-center"
            icon={<MdOutlineLibraryAdd style={{ fontSize: ".9rem" }} />}
            onClick={() => {
              hangleAdd();
            }}
          >
            เพิ่มนักเรียน
          </Button>
        </Flex>
      </Col>
    </Flex>
  );
  return (
    <div className="item-access">
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", position: "relative" }}
      >
        <Card className="card-search">
        <Form form={form} layout="vertical" autoComplete="off" >
            {FormSearch}
        </Form> 
        </Card>
        <Card>
          <Row gutter={[8, 8]} className="m-0">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Table
                title={() => TitleTable}
                size="small"
                rowKey="student_code"
                columns={column}
                dataSource={accessData}
              />
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default StudentAccess;
