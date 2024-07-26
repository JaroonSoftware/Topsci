/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Space,
  Flex,
  Modal,
  Row,
  Col,
} from "antd";
import { message } from "antd";
import logo4 from "../assets/images/logo.png";
import SystemService from "../service/System.service";
import { Authenticate } from "../service/Authenticate.service";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;
const authService = Authenticate();
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logined, setLogined] = useState(false);

  useEffect(() => {
    const isLogin = () => {
      const isAuthen = authService.isExpireToken();
      if (!!isAuthen) direcetSystem();
      else setLogined(true);
    };

    // console.log(curLocation);
    // setCurr(curLocation);
    isLogin();

    // SystemService.getUnit()
    //   .then((res) => {
    //     let { status, data } = res;
    //     if (status === 200) {
    //       console.log(data);
    //     }
    //   })
    //   .catch((err) => {});
  }, []);

  const onFinish = (values) => {
    // alert(values.password, values);
    Connectapp(values);
  };
  const direcetSystem = () => {
    const curr = authService.getCurrent();
    navigate("/dashboard", { replace: true });
    // navigate(!!curr ? curr : "/items", { replace: true });
  };

  const Connectapp = (values) => {
    SystemService.signIn(values)
      .then((res) => {
        let { status, data } = res;
        const { token } = data;
        if (status === 200) {
          if (data?.status === "1") {
            authService.setToken(token);

            direcetSystem();
          } else {
            Modal.error({
              title: <strong>{data.message}</strong>,
              content: "Login request failed...",
            });
            // Swal.fire({
            //   title: "<strong>" + data.message + "</strong>",
            //   html: "ผิดพลาด",
            //   icon: "error",
            // });
          }
        } else {
          Modal.error({
            title: <strong>Login ผิดพลาด!</strong>,
            content: "Login request failed...",
          });
          // Swal.fire({
          //   title: "<strong>Login ผิดพลาด!</strong>",
          //   html: data.message,
          //   icon: "error",
          // });
        }
      })
      .catch((err) => {
        message.error("Login request failed.");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {logined ? (
        <Layout className="layout-default ant-layout layout-sign-up">
          <Header></Header>

          <Content className="p-0">
            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} span={12}>
                <div   className="im-signup  header-solid ant-card pt-0">
                  <img
                  
                    src={logo4}
                    alt="่ninestartfood, jaroon logo"
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} span={12} style={{paddingTop: 30}}>
                <Card
                  className="card-signup header-solid ant-card pt-0"
                  bordered="false"
                >
                  <Space direction="vertical" className="width-100" size={12}>
                    <Form
                      name="basic"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      className="row-col"
                    >
                      <Flex
                        gap={8}
                        className="width-100 md:px-5"
                        vertical
                        style={{ padding: 40 }}
                      >
                        <div className="content">
                          <Title>LOGIN</Title>
                          <p className="text-lg">
                            Enter your username and password to login
                          </p>
                        </div>
                        <Form.Item
                          name="username"
                          rules={[
                            { required: true, message: "กรุณากรอก username!" },
                          ]}
                        >
                          <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                          name="password"
                          rules={[
                            { required: true, message: "กรุณาใส่รหัสผ่าน!" },
                          ]}
                        >
                          <Input.Password
                            placeholder="Password"
                            className="input-40"
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            style={{ width: "100%" }}
                            type="primary"
                            htmlType="submit"
                          >
                            LOGIN
                          </Button>
                        </Form.Item>
                      </Flex>
                    </Form>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Content>
          <Footer>
            <p className="copyright">
              <a href="https://www.facebook.com/jaroonsoft">
                Jaroon Software Co., Ltd.
              </a>
            </p>
          </Footer>
        </Layout>
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default Login;
