/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import "./dashboard.css";
import { Divider, Card, List, Flex, Row, Space, Typography, message, Table, Form, Col, Collapse, Select } from 'antd';
import { Input, Button } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

import DashBoardService from '../../service/DashBoard.service';

const dataMenuDashBoard = [
  {
    title: 'รายงานแบบกลุ่ม',
    value: 1,
  },
  {
    title: 'รายงานแบบรายบุคคล',
    value: 2,
  },
];

const pagging = { pagination: { current: 1, pageSize: 10, }, };
const dsbservice = DashBoardService();
function DashBoard() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [listdata, setListData] = useState([]);
  const [listcourse, setListCourse] = useState([]);
  const [liststudent, setListStudent] = useState([]);
  const [form] = Form.useForm();
  const [columnGroupReport, setColumnGroupReport] = useState([]);
  const [coursename, SetCourseName] = useState(null);

  dayjs.extend(buddhistEra);
  dayjs.locale('th');

  const formatDate = (date) => {
    if (!!date) {
      return dayjs(date).format('DD MMM BBBB');
    } else {
      return '';
    }
  };

  const dynamicColumns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
      align: "left",
    },
    {
      title: "ชื่อเล่น",
      align: "center",
      key: "nick_name",
      dataIndex: "nick_name",
    },
    {
      title: "วันที่ชำระเงิน",
      dataIndex: "last_payment_date",
      key: "last_payment_date",
      align: "center",
      render: (date) => formatDate(date),
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "price",
      key: "price",
      align: "rigth",
    },
    {
      title: "วันที่เริ่มเรียนของรอบ",
      dataIndex: "date_sessions",
      key: "date_sessions",
      align: "center",
      render: (date) => formatDate(date),
    },
  ];

  const hendelOpenMenu = async (value) => {
    console.log(value)
    try {
      //Get Data Type Report
      const res = await dsbservice.getReport({ menu: value }).catch((error) => message.error("get report data fail."));
      const {
        data: { courses, student },
      } = res.data;
      setListCourse(courses);
      //setListStudent(student);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error');
    }
    setSelectedMenu(value);
  }

  const findTitleByValue = (value) => {
    const result = dataMenuDashBoard.find(item => item.value === value);
    return result ? result.title : 'ไม่พบข้อมูล';
  };

  const handleSearch = () => {
    form.validateFields().then(v => {
      const data = { ...v };
      debugger
      if (!!data) {
        let courses = data.courses;
        let student = null;
        let report_type = 1;
        if (selectedMenu === 2) {
          student = data.student;
          report_type = 2;
        }
        Object.assign(data, { courses, student, report_type });
        console.log(data);
        setTimeout(() => getDataReport(data), 80);
      }

    }).catch(err => {
      console.warn(err);
    })
  }

  const getDataReport = (data) => {
    dsbservice.getDataReport(data).then(res => {
      const { data } = res.data.data;
      let result = {};
      debugger
      SetCourseName(data[0].course_name);
      //add column header 
      if (selectedMenu === 1) {
        for (let i = 1; i <= data[0].number_of_sessions; i++) {
          dynamicColumns.push({
            title: `ครั้งที่ ${i}`,
            dataIndex: `session_date_${i}`,
            key: `session_date_${i}`,
            align: `center`,
            render: (date) => formatDate(date),
          });
        }
        setColumnGroupReport(dynamicColumns);
        debugger
        console.log(columnGroupReport);
        result = pivotData(data);
        debugger
        console.log(result);
        setListData(result);
      } else if (selectedMenu === 2) {

      }
      //end 

    }).catch(err => {
      console.log(err);
      message.error("Request error!");
    });
  }
  const handleClear = () => {
    form.resetFields();
    setListData([]);
    handleSearch();
  };
  const pivotData = (data) => {
    const result = {};
    data.forEach(item => {
      const studentKey = `${item.name} ${item.last_name} ${item.nickname}`;

      // ถ้าข้อมูลนักเรียนยังไม่ถูกบันทึกใน result ให้สร้าง object ใหม่
      if (!result[studentKey]) {
        result[studentKey] = {
          name: item.name,
          last_name: item.last_name,
          nickname: item.nickname,
          last_payment_date: item.last_payment_date,
          price: item.price,
          student_code: item.student_code,
          number_of_sessions: item.number_of_sessions,
          date_sessions: item.date_sessions
        };
      }

      // บันทึก session_date ตาม attendance_count โดยสร้างคอลัมน์ sessions_X
      result[studentKey][`session_date_${item.attendance_count}`] = item.session_date;
    });

    // แปลง object กลับเป็น array เพื่อใช้งานง่ายขึ้น
    return Object.values(result).map(student => {
      // เติมคอลัมน์ sessions_X ที่อาจไม่มีให้เป็น null
      for (let i = 1; i <= student.number_of_sessions; i++) {
        if (!student[`session_date_${i}`]) {
          student[`session_date_${i}`] = null;
        }
      }
      return student;
    });
  }

  const TitleTable = (
    <Flex className='width-100' align='center'>
      <Col span={12} className='p-0'>
        <Flex gap={4} justify='start' align='center'>
          <Typography.Title className='m-0 !text-zinc-800' level={3}>รายงานแบบกลุ่มคอร์ส : {coursename}</Typography.Title>
        </Flex>
      </Col>
    </Flex>
  );

  const ListMenu = (
    <>
      <List
        size="large"
        header={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>ข้อมูลต่างๆ</div>}
        bordered
        dataSource={dataMenuDashBoard}
        renderItem={(item, index) =>
          <List.Item>
            <List.Item.Meta
              title={<a onClick={() => hendelOpenMenu(item.value)}>{item.title}</a>}
            />
          </List.Item>
        }
      />
    </>
  );

  return (
    <>
      <div className='layout-content px-3 sm:px-5 md:px-5'>

      
      <div className='drawer-dashboard'>
        {!selectedMenu && ListMenu}
        {selectedMenu && (
          <Collapse
            size="small"
            // onChange={(e) => {
            //   setActiveSearch(e);
            // }}
            bordered={true}
            activeKey={1}
            items={[
              {
                key: "1",
                label: <><span> <b>{findTitleByValue(selectedMenu)}</b> </span></>,
                children: (
                  <>
                    <Form form={form} layout="vertical" autoComplete="off" >
                      {selectedMenu === 1 ? (
                        <Row gutter={[8, 8]} justify="center">
                          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Form.Item
                              label="คอร์สเรียน"
                              name="courses"
                              rules={[{ required: true, message: "กรุณาเลือกคอร์สที่ต้องการดูข้อมูล!" }]}
                            >
                              <Select
                                style={{ width: '100%', height: 40 }}
                                options={listcourse}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : selectedMenu === 2 ? (
                        <Row gutter={[8, 8]} justify="center">
                          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                            <Form.Item
                              label="คอร์สเรียน"
                              name="courses"
                            >
                              <Select
                                style={{ width: '100%', height: 40 }}
                                options={listcourse}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                            <Form.Item
                              label="ชื่อ-นามสกุลนักเรียน"
                              name="student_code"
                            >
                              <Select
                                style={{ width: '100%', height: 40 }}
                                options={null}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : null}
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

        )}
        {listdata.length > 0 && (
          <Card style={{ marginTop: '20px' }}>
            <Row gutter={[8, 8]} className='m-0'>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {selectedMenu === 1 ? (
                  <Table
                    title={() => TitleTable}
                    size='small'
                    rowKey="student_code"
                    columns={columnGroupReport}
                    dataSource={listdata}
                    scroll={{ x: 'max-content' }}
                  />
                ) : selectedMenu === 2 ? (
                  <Table
                    title={() => TitleTable}
                    size='small'
                    rowKey="student_code"
                    columns={columnGroupReport}
                    dataSource={listdata}
                    scroll={{ x: 'max-content' }}
                  />
                ) : null}
              </Col>
            </Row>
          </Card>
        )}
      </div>
      </div>
    </>

  )
}

export default DashBoard

