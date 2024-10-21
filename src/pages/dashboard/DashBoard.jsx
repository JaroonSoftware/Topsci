/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import "./dashboard.css";
import { Modal, Divider, Card, List, Flex, Row, Space, Typography, message, Table, Form, Col, Collapse, Select } from 'antd';
import { Input, Button } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { ButtonBack } from "../../components/button";

import DashBoardService from '../../service/DashBoard.service';
const { confirm } = Modal;

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

const dsbservice = DashBoardService();
function DashBoard() {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [listdata, setListData] = useState([]);
  const [listcourse, setListCourse] = useState([]);
  const [liststudent, setListStudent] = useState([]);
  const [form] = Form.useForm();
  const [columnReport, setColumnReport] = useState([]);
  const [coursename, setCourseName] = useState(null);
  const [isStudentSelectDisabled, setIsStudentSelectDisabled] = useState(true); 
  const [isShowDataList, setIsShowDataList] = useState(false); 
  dayjs.extend(buddhistEra);
  dayjs.locale('th');

  //Edit date attendance
  const [isModalEditDateVisible, setIsModalEditDateVisible] = useState(false);
  const [selectedDateAttendance, setSelectedDateAttendance] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedEditRow, setSelectedEditRow] = useState(null);

  const gotoFrom = "/dashboard";
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
    try {
      //Get Data Type Report
      const res = await dsbservice.getReport({ menu: value }).catch((error) => message.error("get report data fail."));
      const {
        data: { courses },
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
      if (!!data) {
        let courses = data.courses;
        let student = null;
        let report_type = 1;
        if (selectedMenu === 2) {
          student = data.student;
          report_type = 2;
        }
        let selectedCourse = listcourse.find(course => course.value === courses);
        setCourseName(selectedCourse?.label || '');
        Object.assign(data, { courses, student, report_type });
        setTimeout(() => getDataReport(data), 80);
      }
    }).catch(err => {
      console.warn(err);
    })
  }

  const getDataReport = (data) => {
    setListData([]);
    dsbservice.getDataReport(data).then(res => {
      const { data, course } = res.data.data;
      console.log(res.data.data);
      //add column header 
      for (let i = 1; i <= 12; i++) {
        dynamicColumns.push({
          title: `ครั้งที่ ${i}`,
          dataIndex: `session_date_${i}`,
          key: `session_date_${i}`,
          align: `center`,
          render: (date, record) => (
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => handleEditDate(record, date, `session_date_${i}`)}
            >
              {formatDate(date)}
            </span>
          ),
        });
      }
      setIsShowDataList(true);
      if(data.length > 0){
        let result = {};
        
        if (selectedMenu === 1) {
          result = pivotData(data);
          setListData(result);
        } else if (selectedMenu === 2) {
          result = pivotData(data);
          setListData(result);
        }
      }
      setColumnReport(dynamicColumns); 

    }).catch(err => {
      console.log(err);
      message.error("Request error!");
    });
  }

  // ฟังก์ชันเมื่อคลิกเพื่อแก้ไขข้อมูล
  const handleEditDate = (record, date, key) => {
    console.log(record);
    console.log(key);
    //setSelectedDate(date);
    setEditingRecord({ ...record, key });

    debugger
    setIsModalEditDateVisible(true);
  };

  // ฟังก์ชันบันทึกข้อมูลที่แก้ไข
  const handleSaveDate = () => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.id === editingRecord.id
          ? { ...item, [editingRecord.key]: selectedDate }
          : item
      )
    );
    setIsModalVisible(false);
  };

  const handleClear = () => {
    form.resetFields();
    setListData([]);
    setIsShowDataList(false);
  };
  const pivotData = (data) => {
    const result = {};
    data.forEach(item => {
      const studentKey = `${item.name} ${item.last_name} ${item.nickname}`;

      if (!result[studentKey]) {
        result[studentKey] = {
          name: item.name,
          last_name: item.last_name,
          nickname: item.nickname,
          last_payment_date: item.last_payment_date,
          price: item.price,
          student_code: item.student_code,
          date_sessions: item.date_sessions
        };
      }

      result[studentKey][`session_date_${item.attendance_count}`] = item.session_date;
    });

    return Object.values(result).map(student => {
      for (let i = 1; i <= 12; i++) {
        if (!student[`session_date_${i}`]) {
          student[`session_date_${i}`] = null;
        }
      }
      return student;
    });
  }

  const handleCourseChange = async (value) => {
    
    const res = await dsbservice.getListStudentByCourse({ course: value }).catch((error) => message.error("get list data student fail."));
    const { data } = res.data;
    if(!!data){
      setListStudent(data);
      setIsStudentSelectDisabled(false);
    }
  };

  const TitleTableGroup = (
    <Flex className='width-100' align='center'>
      <Col span={12} className='p-0'>
        <Flex gap={4} justify='start' align='center'>
          <Typography.Title className='m-0 !text-zinc-800' level={3}>รายงานแบบกลุ่มคอร์ส : {coursename}</Typography.Title>
        </Flex>
      </Col>
    </Flex>
  );

  const TitleTable = (
    <Flex className='width-100' align='center'>
      <Col span={12} className='p-0'>
        <Flex gap={4} justify='start' align='center'>
          <Typography.Title className='m-0 !text-zinc-800' level={3}>รายงานแบบรายบุคคล : {coursename} คอร์ส : {coursename}</Typography.Title>
        </Flex>
      </Col>
    </Flex>
  );
  const SectionBottom = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="mt-5"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
      </Col>
    </Row>
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
      {/* Modal สำหรับแก้ไขข้อมูล */}
        <Modal
          title="แก้ไขข้อมูล"
          visible={isModalEditDateVisible}
          onOk={handleSaveDate}
          onCancel={() => setIsModalEditDateVisible(false)}
        >
          <Input
            value={selectedDateAttendance}
            onChange={(e) => setSelectedDateAttendance(e.target.value)}
          />
        </Modal>
      
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
                                showSearch
                                filterOption={(input, option) =>
                                  option.label.toLowerCase().includes(input.toLowerCase())
                                }
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
                                showSearch
                                filterOption={(input, option) =>
                                  option.label.toLowerCase().includes(input.toLowerCase())
                                }
                                style={{ width: '100%', height: 40 }}
                                options={listcourse}
                                onChange={(value) => handleCourseChange(value)}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                            <Form.Item
                              label="ชื่อ-นามสกุลนักเรียน"
                              name="student"
                            >
                              <Select
                                style={{ width: '100%', height: 40 }}
                                options={liststudent}
                                disabled={isStudentSelectDisabled}
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
        {isShowDataList && (
          <Card style={{ marginTop: '20px' }}>
            <Row gutter={[8, 8]} className='m-0'>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {selectedMenu === 1 ? (
                  <Table
                    title={() => TitleTableGroup}
                    size='small'
                    rowKey="student_code"
                    columns={columnReport}
                    dataSource={listdata}
                    scroll={{ x: 'max-content' }}
                  />
                ) : selectedMenu === 2 ? (
                  <Table
                    title={() => TitleTable}
                    size='small'
                    rowKey="student_code"
                    columns={columnReport}
                    dataSource={listdata}
                    scroll={{ x: 'max-content' }}
                  />
                ) : null}
              </Col>
            </Row>
          </Card>
          
        )}
      </div>
      {isShowDataList && (
        SectionBottom
      )}
      
      </div>
    </>

  )
}

export default DashBoard


