/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,  useRef, useState } from 'react';
import CountUp from 'react-countup';
import "./dashboard.css";
import { Modal, Divider, Card, List, Flex, Row, Space, Typography, message, Table, Form, Col, Collapse, Select, DatePicker } from 'antd';
import { Input, Button, Tooltip, Spin, InputNumber } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { ButtonBack } from "../../components/button";
import { DollarOutlined, FileSearchOutlined } from '@ant-design/icons';

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
  const [groupedDataByStudent, setGroupedDataByStudent] = useState([]);
  const [form] = Form.useForm();
  const [columnReport, setColumnReport] = useState([]);
  const [coursename, setCourseName] = useState(null);
  const [isShowDataList, setIsShowDataList] = useState(false); 
  dayjs.extend(buddhistEra);
  dayjs.locale('th');

  //Edit date attendance
  const [isModalEditDateVisible, setIsModalEditDateVisible] = useState(false);
  const [selectedDateAttendance, setSelectedDateAttendance] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedEditRow, setSelectedEditRow] = useState([]);
  const [loading,  setLoading] = useState(true);

  //Payment 
  const [formAddPaymeny] = Form.useForm();
  const [openModalAddPayment , setOpenModalAddPaymen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCouses, setSelectedCouses] = useState(null);

  //ColumnReportByStudent
  const [dynamicReportColumnsByStudent, setDynamicReportColumnsByStudent] = useState([]);

  const selectedEditRowRef = useRef([]);

  useEffect(() => {
    document.addEventListener('touchstart', function () {}, { passive: true });
  }, []);

  useEffect(() => {
    selectedEditRowRef.current = selectedEditRow;
  }, [selectedEditRow]);
  
  const gotoFrom = "/dashboard";
  const formatDate = (date) => {
    if (!!date) {
      return dayjs(date).format('DD MMM BBBB');
    } else {
      return '';
    }
  };

  //ColumnReportByStudent
  useEffect(() => {
    const generateColumns = (sessionDates) => {
        const baseColumns = [
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
                key: "nickname",
                dataIndex: "nickname",
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
                align: "right",
            },
            {
                title: "วันที่เริ่มเรียนของรอบ",
                dataIndex: "date_sessions",
                key: "date_sessions",
                align: "center",
                render: (date) => formatDate(date),
            },
        ];

        // เพิ่มคอลัมน์ตาม sessionDates ที่ได้จากแต่ละ course_id
        sessionDates.forEach((date, index) => {
            baseColumns.push({
                title: `ครั้งที่ ${index + 1}`,
                dataIndex: `session_date_${index + 1}`,
                key: `session_date_${index + 1}`,
                align: "center",
                render: (date, record) => (
                    <span>
                        {formatDate(date)}
                    </span>
                ),
            });
        });

        return baseColumns;
    };

    // ปรับคอลัมน์ให้เป็นไดนามิกตาม course_id
    if (Object.keys(groupedDataByStudent).length > 0) {
        const columnsByCourse = {};
        for (const courseId in groupedDataByStudent) {
            const { sessionDates } = groupedDataByStudent[courseId];
            columnsByCourse[courseId] = generateColumns(sessionDates);
        }
        setDynamicReportColumnsByStudent(columnsByCourse);
    }
}, [groupedDataByStudent]);

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
      key: "nickname",
      dataIndex: "nickname",
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
        data: { courses, student },
      } = res.data;
      setListCourse(courses);
      setListStudent(student);
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

  const getDataReport = async (data) => {
    setListData([]);
    await dsbservice.getDataReport(data).then(res => {
      const { data, course } = res.data.data;
      if(selectedMenu === 1){
        const transformedData = data.map((item, index) => ({
          studentCode: item.student_code,
          studentName: (item.name ? item.name : '') + ' ' + (item.last_name ? item.last_name : ''),
          courseId: course.course_id,
          courseName: course.course_name,
          sessionDates: item.session_date,
          attendanceNo: item.attendance_no,
          attendanceId: item.attendance_id
        }));
        setSelectedEditRow(transformedData); 
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
                onClick={() => handleEditDate(record.student_code, course.course_id, i, date, `session_date_${i}`)}
              >
                {formatDate(date)}
              </span>
            ),
          });
        }
        //
        dynamicColumns.push({
          title: "Action",
          key: "operation", 
          fixed: 'right',
          align: "center",
          width: 120,
          render: (text, record) => {
              return (
                <span style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Tooltip placement="topLeft" title={'ชำระเงิน'}>
                    <Button
                        type="primary" ghost
                        icon={<DollarOutlined  />}
                        className="checking-button"
                        onClick={(e) => handleAddPayment(text.student_code,course.course_id)}
                        size="small"
                      />
                  </Tooltip>
                </span>
              )
          },
        });
        if(data.length > 0){
          let result = {};
          if (selectedMenu === 1) {
            result = pivotData(data);
            console.log(result);
            setListData(result);
            setColumnReport(dynamicColumns); 
          }
        }
        //
      }else if(selectedMenu === 2){
        const groupedData = data.reduce((acc, item) => {
          const { course_id, attendance_no, session_date } = item;

          if (!acc[course_id]) {
              acc[course_id] = {
                  courseData: [],
                  sessionDates: [],
              };
          }
          acc[course_id].courseData.push(item);

          // จัดเก็บ session_date ตาม attendance_no
          if (attendance_no && session_date) {
              acc[course_id].sessionDates[attendance_no -1] = session_date;
          }

          return acc;
      }, {});

      setGroupedDataByStudent(groupedData);
      }
      setIsShowDataList(true);

    }).catch(err => {
      console.log(err);
      message.error("Request error!");
    });
  }

  const handleEditDate = (student_code, course_id, no, date, key) => {
    setEditingRecord([]);
    const recordEdit = selectedEditRowRef.current.find(v => v.studentCode === student_code && v.courseId === course_id && v.attendanceNo === no);
    //setSelectedDate(date);
    setEditingRecord(recordEdit);
    setSelectedDateAttendance(recordEdit.sessionDates);
    setIsModalEditDateVisible(true);
  };

  const handleSaveDate = () => {
    const param = { 
      ...editingRecord, 
      sessionDates: selectedDateAttendance 
    };
    const actions = dsbservice.updateDate;
    actions(param)
      .then((r) => {
          message.success("บันทึกข้อมูลสำเร็จ.");

          setSelectedEditRow([]);
          setEditingRecord(null);
          setSelectedDateAttendance(null);
          setIsModalEditDateVisible(false);
          handleSearch();
      })
      .catch((err) => {
        message.error("บันทึกข้อมูลไม่สำเร็จ.");
        console.warn(err);
      });
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
          attendance_no: item.attendance_no,
          last_payment_date: item.last_payment_date,
          price: item.price,
          student_code: item.student_code,
          date_sessions: item.date_sessions,
          is_delete: item.is_delete
        };
      }

      result[studentKey][`session_date_${item.attendance_no}`] = item.session_date;
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

  const handleAddPayment = (student_code, course) => {
    setLoading(true);
    setSelectedStudent(null);
    setSelectedCouses(null);
    const param = {
      student_code : student_code,
      course : course
    }
    const actions = dsbservice.getDataPayment;
      actions(param)
        .then((res) => {
          const { data } = res.data;
          const init = {
            ...data,
          };
          formAddPaymeny.setFieldsValue({ ...init });
          setSelectedStudent(student_code);
          setSelectedCouses(course);
          setLoading(false);
          setOpenModalAddPaymen(true);
        })
        .catch((err) => {
          console.log(err);
          message.error("Error getting infomation Product.");
        });
  };

  const handleCloseModalAddPayment = () => {
    setSelectedCouses(null);
    setSelectedStudent(null);
    formAddPaymeny.resetFields();
    setOpenModalAddPaymen(false);
  };

  const handleInsertPayment = () => {
    formAddPaymeny
      .validateFields()
      .then((v) => {
        const payment = { 
          ...v, 
          student_code : selectedStudent,  
          course : selectedCouses   
        };

        const parm = { payment };
        const actions = dsbservice.addDatePayment;
        actions(parm)
          .then((r) => {
            handleCloseModalAddPayment();
            message.success("บันทึกข้อมูลสำเร็จ.");
          })
          .catch((err) => {
            message.error("บันทึกข้อมูลไม่สำเร็จ.");
            console.warn(err);
          });
      }).catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        message.error("โปรดตรวจสอบข้อมูลในฟอร์มก่อนบันทึก");
      });
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
          <List.Item key={index}>
            <List.Item.Meta
              title={<a onClick={() => hendelOpenMenu(item.value)}>{item.title}</a>}
            />
          </List.Item>
        }
      />
    </>
  );
  const ButtonModalAddPayment = (
    <Space direction="horizontal" size="middle" >
        <Button onClick={() => handleCloseModalAddPayment() }>ปิด</Button>
        <Button type='primary' onClick={() => handleInsertPayment() }>บันทึกข้อมูล</Button>
    </Space>
  )

  return (
    <>
      <div className='layout-content px-3 sm:px-5 md:px-5'>
      {/* Modal สำหรับแก้ไขข้อมูลเวลาเรียน */}
        <Modal
          title="แก้ไขข้อมูลเวลาเรียน"
          visible={isModalEditDateVisible}
          onOk={handleSaveDate}
          onCancel={() => setIsModalEditDateVisible(false)}
          okText="บันทึก"
          cancelText="ยกเลิก"
        >
          <div style={{ marginBottom: '1rem' }}>
            <label>คอร์สเรียน :</label>
            <label style={{ marginLeft: '15px' }}>{editingRecord ? editingRecord.courseName : 'Loading...'}</label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>ชื่อ-นามสกุล :</label>
            <label style={{ marginLeft: '15px' }}>{editingRecord ? editingRecord.studentName : 'Loading...'}</label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>เรียนครั้งที่:</label>
            <label style={{ marginLeft: '15px' }}>{editingRecord ? editingRecord.attendanceNo : 'Loading...'}</label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>เวลาเรียน:</label>
            <DatePicker
              style={{ marginLeft: '15px' }}
              value={selectedDateAttendance ? dayjs(selectedDateAttendance) : null}
              onChange={(date, dateString) => setSelectedDateAttendance(dateString)}
            />
          </div>
        </Modal>
      {/* Modal Add Payment*/}
        <Modal
              visible={openModalAddPayment}
              title="เพิ่มการชำระเงิน"
              onCancel={() => handleCloseModalAddPayment() } 
              footer={ButtonModalAddPayment}
              maskClosable={false}
              style={{ top: 20 }}
              width={800}
              className='sample-request-modal-items'
          >
              <Spin spinning={loading}>
                  <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                      <Card style={{backgroundColor:'#f0f0f0' }}>
                          <Form form={formAddPaymeny} layout="vertical" autoComplete="off" >
                              <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                  <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                      <Form.Item
                                          label="ชื่อนักเรียน"
                                          name="student_name"
                                      >
                                      <Input disabled />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                      <Form.Item
                                          label="คอร์ส"
                                          name="courses_name"
                                      >
                                      <Input disabled />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                                      <Form.Item
                                          label="วิชา"
                                          name="subjects"
                                      >
                                      <Input disabled />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                                      <Form.Item
                                          label="วันที่ชำระเงิน"
                                          name="payment_date"
                                          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
                                      >
                                      <DatePicker
                                      style={{width:'100%', height:40}}  
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                                      <Form.Item
                                          label="จำนวนเงินที่ชำระ"
                                          name="amount_paid"
                                          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
                                      >
                                      <InputNumber
                                        min={1}
                                        max={9999999}
                                        style={{width:'100%', height:40}}
                                        className="custom-input-number"
                                        />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                                      <Form.Item
                                          label="ช่องทางการชำระเงิน"
                                          name="payment_method"
                                          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
                                      >
                                      <Select
                                        style={{width:'100%', height:40}}
                                        options={[
                                          { value: 'เงินสด', label: 'เงินสด' },
                                          { value: 'โอนผ่านบัญชีธนาคาร', label: 'โอนผ่านบัญชีธนาคาร' },
                                        ]}
                                      />
                                    </Form.Item>
                                  </Col>
                              </Row> 
                          </Form>
                      </Card>
                  </Space>                
              </Spin> 
        </Modal> 
      
        <div className='drawer-dashboard'>
    {!selectedMenu && ListMenu}

    {selectedMenu && (
        <Collapse
            size="small"
            bordered={true}
            activeKey={1}
            items={[
                {
                    key: "1",
                    label: (
                        <>
                            <span>
                                <b>{findTitleByValue(selectedMenu)}</b>
                            </span>
                        </>
                    ),
                    children: (
                        <>
                            <Form form={form} layout="vertical" autoComplete="off">
                                {selectedMenu === 1 ? (
                                    <Row gutter={[8, 8]} justify="center">
                                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                            <Form.Item
                                                label="คอร์สเรียน"
                                                name="courses"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "กรุณาเลือกคอร์สที่ต้องการดูข้อมูล!",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.label
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
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
                                            <Form.Item label="ชื่อ-นามสกุลนักเรียน" name="student">
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.label
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    style={{ width: '100%', height: 40 }}
                                                    options={liststudent}
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

    {isShowDataList && selectedMenu === 1 && (
        <Card style={{ marginTop: '20px' }}>
            <Row gutter={[8, 8]} className='m-0'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table
                        title={() => TitleTableGroup}
                        size='small'
                        rowKey="student_code"
                        columns={columnReport}
                        dataSource={listdata}
                        scroll={{ x: 'max-content' }}
                    />
                </Col>
            </Row>
        </Card>
    )}

    {isShowDataList && selectedMenu === 2 &&
        Object.keys(groupedDataByStudent).map((courseId) => {
            const courseData = groupedDataByStudent[courseId];
            const course_ids = (courseData.courseData.find(item => item.course_id) || {}).course_id || null;
            const course_name = (courseData.courseData.find(item => item.course_name) || {}).course_name || "ไม่มีข้อมูลคอร์ส";
            const dataByStudent = pivotData(courseData.courseData)
            const TitleTableGroup = (
                <Flex className="width-100" align="center">
                    <Col span={12} className="p-0">
                        <Flex gap={4} justify="start" align="center">
                            <Typography.Title className="m-0 !text-zinc-800" level={3}>
                                คอร์ส : {course_name}
                            </Typography.Title>
                        </Flex>
                    </Col>
                </Flex>
            );

            return (
                <Card style={{ marginTop: '10px' }} key={course_ids}>
                    <Row gutter={[8, 8]} className="m-0">
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Table
                                title={() => TitleTableGroup}
                                size="small"
                                columns={dynamicReportColumnsByStudent[courseId]}
                                dataSource={dataByStudent}
                                rowKey={(index) => index}
                                pagination={false}
                                scroll={{ x: 'max-content' }}
                            />
                        </Col>
                    </Row>
                </Card>
            );
        })
    }
</div>
      {isShowDataList && (
        SectionBottom
      )}
      
      </div>
    </>

  )
}

export default DashBoard


