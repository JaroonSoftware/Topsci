/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Typography,
  message,
  Select,
  Badge,
  Switch,
  Spin,
} from "antd";
import dayjs from 'dayjs';
import { Card, Col, Divider, Flex, Row, Space } from "antd";

import OptionService from "../../service/Options.service";
import PaymentService from "../../service/Payment.service";
import {
  studentColumn,
  listPaymentDetailColumn,
} from "./payment.model";

import { delay } from "../../utils/util";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
const paymentservice = PaymentService();

const gotoFrom = "/payment";

function PaymentManage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || { config: null };
  const [form] = Form.useForm();
  const [formListPaymeny] = Form.useForm();
  const [formAddPaymeny] = Form.useForm();
  const [openModalListPayment , setOpenModalListPaymen] = useState(false);
  const [openModalAddPayment , setOpenModalAddPaymen] = useState(false);
  const [loading,  setLoading] = useState(true);
  const [formEditPaymeny] = Form.useForm();
  

  /** Detail Data State */
  const [listStudent, setListStudent] = useState([]);
 
  const [formDetail, setFormDetail] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCouses, setSelectedCouses] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [listDataPayment, setListDataPayment] = useState([]);


  const [dataSourceEditPayment, setDataSourceEditPayment] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    height: "calc(100% - (25.4px + 1rem))",
  };

  useEffect(() => {
    const initial = async () => {
      if (config?.action === "detail") {
        await Search();
      }
    };

    initial();
    return () => {};
  }, []);

  const Search = async () => {
    const res = await paymentservice
          .get(config?.code)
          .catch((error) => message.error("get Course data fail."));
        const {
          data: { courses, student },
        } = res.data;
        setFormDetail(courses);
        const studentWithAttendance = student.map((students) => ({
          ...students,
          attendance: true,
          reason: null,
        }));
        setListStudent(studentWithAttendance);
        form.setFieldsValue({ ...courses });
        form.setFieldsValue({
          courses_time: [dayjs(courses.time_from, 'HH:mm'), dayjs(courses.time_to, 'HH:mm')],
        });
  }

  const handleConfirmAddPayment = () => {
    formAddPaymeny
      .validateFields()
      .then((v) => {
        const payment = { 
          ...v, 
          student_code : selectedStudent,  
          course : selectedCouses   
        };

        const parm = { payment };
        const actions = paymentservice.addPayment;
        actions(parm)
          .then((r) => {
            handleCloseModalAddPayment();
            message.success("บันทึกข้อมูลสำเร็จ.");
            Search();
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

  const handleClose = async () => {
    navigate(gotoFrom, { replace: true });
    await delay(300);
    console.clear();
  };

  const handleAddPayment = (student_code) => {
    setLoading(true);
    let student = listStudent.find(data => data.student_code === student_code);
    setSelectedStudent(student.student_code);
    setSelectedCouses(formDetail.course_id);
    const dataAddPayment = {
      student_name: student.student_name,
      courses_name: formDetail.course_name,
      subjects: formDetail.subject_name
    }
    formAddPaymeny.setFieldsValue({ ...dataAddPayment });
    setLoading(false);
    setOpenModalAddPaymen(true);

  };
  const handleDetailPayment = (student_code) => {
    setLoading(true); // เริ่มการแสดงสถานะ loading
    let student = listStudent.find(data => data.student_code === student_code);
    paymentservice.getListPaymentDetail({ student: student_code, couses: formDetail.course_id })
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          setItemsData(data.data); 
          setListDataPayment(data.data);
          setDataSourceEditPayment(data.data);
          formListPaymeny.setFieldsValue({ student_name: student.student_name });
        }
      })
      .catch((err) => {
        message.error("Request error!");
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false); 
          setOpenModalListPaymen(true); 
        }, 400); 
      });
  };

  const isEditing = (record) => record.payment_id === editingKey;

  const edit = (record) => {
    formEditPaymeny.setFieldsValue({
      ...record,
      payment_date: (record.payment_date) ? dayjs(record.payment_date) : ""
   });
    setEditingKey(record.payment_id);
  };


  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await formEditPaymeny.validateFields(); 
      const newData = [...dataSourceEditPayment];
      const index = newData.findIndex((item) => key === item.key);
  
      if (index > -1) {
        const item = newData[index];
        const payment = {...item,...row};
        // newData.splice(index, 1, { ...item, ...row }); 
        // setDataSourceEditPayment(newData);
        // setEditingKey("");
        const parm = payment;
        const actions = paymentservice.updatePayment;
        actions(parm)
          .then((r) => {
              message.success("บันทึกข้อมูลสำเร็จ.");
              newData.splice(index, 1, { ...item, ...row }); 
              setDataSourceEditPayment(newData);
              setEditingKey("");
              Search();
          })
          .catch((err) => {
            message.error("บันทึกข้อมูลไม่สำเร็จ.");
            console.warn(err);
          });
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns = listPaymentDetailColumn(isEditing, edit, save, cancel, editingKey).map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,  
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode;

    if (inputType === "number") {
      inputNode = <InputNumber />;
    } else if (inputType === "date") {

      inputNode = (
        <DatePicker formate="DD-MM-YYYY" />
      );
    } else if (inputType === "select") {
      inputNode = (
        <Select
          style={{width:'100%', height:40}}
          options={[
            { value: 'เงินสด', label: 'เงินสด' },
            { value: 'โอนผ่านบัญชีธนาคาร', label: 'โอนผ่านบัญชีธนาคาร' },
          ]}
        />
      );
    } else {
      inputNode = <Input />;
    }
  
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };


  const columnstudent = studentColumn( listStudent, handleDetailPayment, handleAddPayment );
  const columnlistpayment = listPaymentDetailColumn();
  const SectionCourses = (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={12} xl={16} xxl={16}>
          <Form.Item
            label="คอร์สเรียน"
            name="course_name"
          >
            <Input readOnly />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
          <Form.Item
              label="วิชาเรียน"
              name="subject_name"
          >
           <Input readOnly />
        </Form.Item>
      </Col>
    </Row>
  );

  const TitleTableStudent = (
    <Flex className="width-100" align="center">
      <Col span={14} className="p-0">
        <Flex gap={15} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={4} >
            รายชื่อนักเรียน
          </Typography.Title>
        </Flex>
      </Col>
    </Flex>
  );

  const SectionStudent = (
    <>
      <Flex className="width-100" vertical gap={4}>
        <Table
          title={() => TitleTableStudent}
          bordered
          dataSource={listStudent}
          columns={columnstudent}
          pagination={false}
          rowKey="student_code"
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: <span>No data available, please add some data.</span>,
          }}
        />
      </Flex>
    </>
  );

  ///** button */

  const SectionTop = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={gotoFrom} />
        </Flex>
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
          <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
      </Col>
    </Row>
  );

  const ButtonModalListPayment = (
    <Space direction="horizontal" size="middle" >
        <Button onClick={() => handleCloseModalListPayment() }>ปิด</Button>
    </Space>
  )
  const ButtonModalAddPayment = (
    <Space direction="horizontal" size="middle" >
        <Button onClick={() => handleCloseModalAddPayment() }>ปิด</Button>
        <Button type='primary' onClick={() => handleConfirmAddPayment() }>บันทึกข้อมูล</Button>
    </Space>
  )
  const handleCloseModalListPayment = () => {
    formListPaymeny.resetFields();
    setOpenModalListPaymen(false);
  };
  
  const handleCloseModalAddPayment = () => {
    setSelectedCouses(null);
    setSelectedStudent(null);
    formAddPaymeny.resetFields();
    setOpenModalAddPaymen(false);
  };

  return (
    <div className="courses-manage">
      <div id="courses-manage" className="px-0 sm:px-0 md:px-8 lg:px-8">
        <Space direction="vertical" className="flex gap-4">
          {SectionTop}
          <Form
            form={form}
            layout="vertical"
            className="width-100"
            autoComplete="off"
          >
            <Card title={config?.title}>
              <Row className="m-0" gutter={[12, 12]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!mb-3 !mt-1">
                    {" "}
                    ข้อมูลคอร์สเรียน{" "}
                  </Divider>
                  <Card style={cardStyle}>{SectionCourses}</Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!my-0">
                    รายชื่อนักเรียน
                  </Divider>
                  <Card style={{ backgroundColor: "#f0f0f0" }}>
                  {SectionStudent}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Form>
          {SectionBottom}
        </Space>
        {openModalListPayment && (
        <Modal
            open={openModalListPayment}
            title="ประวัติการชำระเงิน"
            onCancel={() => handleCloseModalListPayment() } 
            footer={ButtonModalListPayment}
            maskClosable={false}
            style={{ top: 20 }}
            width={800}
            className='sample-request-modal-items'
        >
            <Spin spinning={loading}>
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={formListPaymeny} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                  <Form.Item
                                      label="ชื่อนักเรียน"
                                      name="student_name"
                                  >
                                  <Input disabled/>
                                </Form.Item>
                              </Col>
                            </Row> 
                        </Form>
                    </Card>
                      <Form form={formEditPaymeny} component={false}>
                        <Table  
                            components={{
                              body: {
                                cell: EditableCell,
                              },
                            }}
                            bordered
                            dataSource={dataSourceEditPayment}
                            rowKey="payment_id"
                            columns={mergedColumns} 
                            pagination={{ 
                                total:listDataPayment.length, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${itemsData.length} items`,
                                defaultPageSize:10,
                                pageSizeOptions:[10,25,35,50,100]
                            }}
                            scroll={{ x: 'max-content' }} size='small'
                        /> 
                      </Form>
                </Space>                
            </Spin> 
        </Modal>    
      )}
      {openModalAddPayment && (
        <Modal
            open={openModalAddPayment}
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
      )}
      </div>
    </div>
  );
}

export default PaymentManage;
