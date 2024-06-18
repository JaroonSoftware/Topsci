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
        <div
          className="layout-default ant-layout layout-sign-up"
          style={{ paddingTop: 200,backgroundImage: (logo4) }}
          
        >
          <Card className="card-signup" style={{ backgroundColor: '#44008b',}}>
            <Space direction="vertical" className="width-100"  size={12}>
              <div className="flex justify-center ">
                <img
                  style={{ width: 150 }}
                  src={logo4}
                  alt="่ninestartfood, jaroon logo"
                />
              </div>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="row-col"
              >
                <Flex gap={8} className="width-100 md:px-5" vertical>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: "กรุณากรอก username!" }]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: "กรุณาใส่รหัสผ่าน!" }]}
                  >
                    <Input.Password
                      placeholder="Password"
                      className="input-40"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button style={{ width: "100%",textShadowColor: 'rgba(0, 0, 0, 0.75)',}} htmlType="submit">
                      LOGIN
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </Space>
          </Card>
          <Footer>
            <p className="copyright">
              <a href="https://www.facebook.com/jaroonsoft">
                {" "}
                Jaroon Software Co., Ltd.{" "}
              </a>
            </p>
          </Footer>
        </div>
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default Login;
