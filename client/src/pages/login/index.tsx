import React, { useContext, useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Card, Button, Form, Input, Typography, message } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import router from "next/router";

const Login = () => {
  const { getAuthState, updateAuthToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values: any) => {
    fetch("http://localhost:5005/api/auth/login", {
      //posts the user inputs into the database
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          //the following is only when taking the user to the protected page as it stores the token
          return response.json().then((data) => {
            // Display the error message from the backend to the user
            if (data.token != "") {
              //console.log(data.token);
              updateAuthToken(data.token);
              router.push("/protected");
            }
            localStorage.setItem("token", data.token);
          });
          //handles registration errors
        } else if (response.status === 401) {
          return response.json().then((data) => {
            // Display the error message from the backend to the user
            message.error(`${data.error}`);
          });
        }
        throw new Error("Network response was not ok.");
      })
      //catches unknown errors to the console
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  type FieldType = {
    username?: string;
    password?: string;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#eaf7f0",
      }}
    >
      <Card
        bordered={false}
        style={{
          height: 375,
          width: 580,
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography.Title
            style={{ color: "#455A64", marginBottom: 5 }}
            level={2}
          >
            Log In
          </Typography.Title>
        </div>
        <Form
          name="basic"
          layout="vertical"
          style={{ maxWidth: 600, padding: "20px" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="email"
            rules={[
              { type: "email", message: "This is not valid E-mail!" },
              { required: true, message: "Please input your E-mail!" },
            ]}
            style={{ marginBottom: 20 }}
          >
            <div>
              <Typography.Paragraph
                style={{ color: "#455A64", marginBottom: 5 }}
              >
                Email Address
              </Typography.Paragraph>
              <Input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            style={{ marginBottom: 20 }}
          >
            <div>
              <Typography.Paragraph
                style={{ color: "#455A64", marginBottom: 5 }}
              >
                Password
              </Typography.Paragraph>
              <Input.Password
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }}>
            <Button
              style={{ backgroundColor: "#66BB6A" }}
              type="primary"
              htmlType="submit"
              icon={<HomeOutlined />}
              block
            >
              Log In
            </Button>
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <a href="https://spark-bytes-project-team-7-git-main-spark-team-7.vercel.app/">
              <Typography.Text strong style={{ color: "#66BB6A" }}>
                Back to Home
              </Typography.Text>
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
