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
} from "antd";
import dayjs from 'dayjs';
import { Card, Col, Divider, Flex, Row, Space } from "antd";

import OptionService from "../../service/Options.service";
import CoursesService from "../../service/Courses.service";
import { SaveFilled, SearchOutlined } from "@ant-design/icons";
import ModalTeacher from "../../components/modal/teacher/ModalTeacher";
import ModalStudent from "../../components/modal/student/ModalStudents";
import {
  studentColumn,
  teacherColumn,
} from "./courses.model";

import { delay, comma } from "../../utils/util";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";

import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPackageSearch } from "react-icons/lu";
import { LuPrinter } from "react-icons/lu";
const opservice = OptionService();
const coursesservice = CoursesService();

const gotoFrom = "/courses";

function CoursesManage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || { config: null };
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [optionSubjects, setOptionSubjects] = useState([]);

  /** Modal handle */
  const [openStudent, setOpenStudent] = useState(false);
  const [openTeacher , setOpenTeacher] = useState(false);


  /** Detail Data State */
  const [listDetail, setListDetail] = useState([]);
  const [listStudent, setListStudent] = useState([]);

  const [listTeacher, setListTeacher] = useState([]);

  const [formDetail, setFormDetail] = useState([]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    height: "calc(100% - (25.4px + 1rem))",
  };

  useEffect(() => {
    GetItemsSubjects();
    
    const initial = async () => {
      if (config?.action !== "create") {
        const res = await coursesservice
          .get(config?.code)
          .catch((error) => message.error("get Course data fail."));
        const {
          data: { courses, teacher, student },
        } = res.data;
        setFormDetail(courses);
        setListTeacher(teacher);
        setListStudent(student);
        form.setFieldsValue({ ...courses });
        form.setFieldsValue({
          courses_time: [dayjs(courses.time_from, 'HH:mm'), dayjs(courses.time_to, 'HH:mm')],
        });
      }
    };

    initial();
    return () => {};
  }, []);
  const GetItemsSubjects = () => {
    opservice.optionsSubjects().then((res) => {
      let { data } = res.data;
      setOptionSubjects(data);
    });
  };

  /** Function modal handle */
  const handleChoosedStudent = (value) => {
    setListStudent(value);
  };
  const handleChoosedTeacher = (value) => {
    setListTeacher(value);
  };


  const handleConfirm = () => {
    form
      .validateFields()
      .then((v) => {
        
        if (listStudent.length < 1){
          message.error("กรุณาเพิ่ม รายชื่อนักเรียน");
          return;
        }
        if (listTeacher.length < 1){
          message.error("กรุณาเพิ่ม รายชื่อครู");
          return;
        }
        debugger
        if (v.courses_time && v.courses_time.length === 2) {
          const timefrom = v.courses_time[0].format('HH:mm');
          const timeto =v.courses_time[1].format('HH:mm');
            v = { ...v, timefrom, timeto}   
        }
        const courses = { ...formDetail, ...v }
        const student = listStudent;
        const teacher = listTeacher;

        const parm = { courses, student , teacher };
        //console.log(parm);
        const actions = config?.action !== "create" ? coursesservice.update : coursesservice.create;
        actions(parm)
          .then((r) => {
            handleClose().then((r) => {
              message.success("บันทึกข้อมูลสำเร็จ.");
            });
          })
          .catch((err) => {
            message.error("บันทึกข้อมูลไม่สำเร็จ.");
            console.warn(err);
          });
      })
      .catch((err) => {
        Modal.error({
          title: "This is an error message",
          content: err,
        });
      });
  };

  const handleClose = async () => {
    navigate(gotoFrom, { replace: true });
    await delay(300);
    console.clear();
  };

  const handleDeleteStudent = (code) => {
    const itemDetail = [...listStudent];
    const newData = itemDetail.filter((item) => item?.student_code !== code);
    setListStudent([...newData]);
  };

  const handleRemoveStudent = (record) => {
    const itemDetail = [...listStudent];
    return itemDetail.length >= 1 ? (
      <Button
        className="bt-icon"
        size="small"
        danger
        icon={
          <RiDeleteBin5Line style={{ fontSize: "1rem", marginTop: "3px" }} />
        }
        onClick={() => handleDeleteStudent(record?.student_code)}
        disabled={!record?.student_code}
      />
    ) : null;
  };
  const handleDeleteTeacher = (code) => {
    const itemDetail = [...listTeacher];
    const newData = itemDetail.filter((item) => item?.teacher_id !== code);
    setListTeacher([...newData]);
  };
  const handleRemoveTeacher = (record) => {
    const itemDetail = [...listTeacher];
    return itemDetail.length >= 1 ? (
      <Button
        className="bt-icon"
        size="small"
        danger
        icon={
          <RiDeleteBin5Line style={{ fontSize: "1rem", marginTop: "3px" }} />
        }
        onClick={() => handleDeleteTeacher(record?.teacher_id)}
        disabled={!record?.teacher_id}
      />
    ) : null;
  };


  /** setting column table */
  //const prodcolumns = columnsParametersEditable(handleEditCell,unitOption, { handleRemove});
  const columnstudent = studentColumn({ handleRemoveStudent });
  const columnteacher = teacherColumn({ handleRemoveTeacher });

  const SectionCourses = (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form.Item
            label="ชื่อคอร์สเรียน"
            name="course_name"
            rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
          >
            <Input placeholder="กรอกชื่อคอร์สเรียน" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
      <Form.Item
          label="วิชาเรียน"
          name="subject_id"
          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
        >
          <Select
            size="large"
            placeholder="เลือกวิชาเรียน"
            showSearch
            filterOption={filterOption}
            options={optionSubjects}
          ></Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="จำนวนรอบเรียน"
            name="number_of_sessions"
            rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
          >
            <Input placeholder="กรอกจำนวนรอบเรียน" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
            label="ราคาคอร์ส"
            name="price"
            rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
          >
            <Input placeholder="กรอกราคาคอร์ส" />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
            <Form.Item 
              label='เวลาเรียน' 
              name='courses_time'
               rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
            >
                <RangePicker 
                  placeholder={['เวลาตั้งแต่', 'เวลาถึง']} 
                  style={{width:'100%', height:40}}  
                  picker="time"
                  format="HH:mm"
                  showTime={{
                    format: 'HH:mm',
                  }}
                />
            </Form.Item>
      </Col>
    </Row>
  );

  const TitleTableTeacher = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={4}>
            รายชื่อครู
          </Typography.Title>
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex justify="end">
          <Button
            icon={<LuPackageSearch style={{ fontSize: "1.2rem" }} />}
            className="bn-center justify-center bn-primary-outline"
            onClick={() => {
              setOpenTeacher(true);
            }}
          >
            เพิ่มครู
          </Button>
        </Flex>
      </Col>
    </Flex>
  );

  const TitleTableStudent = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={4}>
            รายชื่อนักเรียน
          </Typography.Title>
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex justify="end">
          <Button
            icon={<LuPackageSearch style={{ fontSize: "1.2rem" }} />}
            className="bn-center justify-center bn-primary-outline"
            onClick={() => {
              setOpenStudent(true);
            }}
          >
            เพิ่มนักเรียน
          </Button>
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

  const SectionTeacher = (
    <>
      <Flex className="width-100" vertical gap={4}>
        <Table
          title={() => TitleTableTeacher}
          bordered
          dataSource={listTeacher}
          columns={columnteacher}
          pagination={false}
          rowKey="teacher_id"
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
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          {!!formDetail.quotcode && (
            <Button
              icon={<LuPrinter />}
              onClick={() => {
              }}
              className="bn-center !bg-orange-400 !text-white !border-transparent"
            >
              PRINT QUOTATION{" "}
            </Button>
          )}
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
        <Flex gap={4} justify="end">
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            onClick={() => {
              handleConfirm();
            }}
          >
            Save
          </Button>
        </Flex>
      </Col>
    </Row>
  );

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
            <Card
              title={
                <>
                </>
              }
            >
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
                    ข้อมูลครู
                  </Divider>
                  <Card style={{ backgroundColor: "#f0f0f0" }}>
                  {SectionTeacher}
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!my-0">
                    ข้อมูลนักเรียน
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
      </div>

      {openStudent && (
        <ModalStudent
          show={openStudent}
          close={() => setOpenStudent(false)}
          values={(v) => {
            handleChoosedStudent(v);
          }}
          selected={listStudent}
        ></ModalStudent>
      )} 

      {openTeacher && (
        <ModalTeacher
          show={openTeacher}
          close={() => setOpenTeacher(false)}
          values={(v) => {
            handleChoosedTeacher(v);
          }}
          selected={listTeacher}
        ></ModalTeacher>
      )}
    </div>
  );
}

export default CoursesManage;
