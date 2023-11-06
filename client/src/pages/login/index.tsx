import React, { useContext } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Typography, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Login = () => {

  const { updateAuthToken } = useAuth();

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('/login', values);
      const token = response.data;
      updateAuthToken(token);
    } catch (error) {
      if (error === 404) {
        message.error('No user found with this email.');
      } else if (error === 401) {
        message.error('Wrong password. Please try again.');
      } else {
        message.error('An error occurred. Please try again later.');
      }
    }
  };

  type FieldType = {
    username?: string;
    password?: string;
  };

  return (
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eaf7f0' }}>
      <Card bordered={false} style={{ height: 375, width: 580, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography.Title style={{ color: "#455A64", marginBottom: 5 }} level={2}>Log In</Typography.Title>
        </div>
        <Form
          name="basic"
          layout="vertical"
          style={{ maxWidth: 600, padding: '20px' }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="email"
            rules={[{ type: 'email', message: 'This is not valid E-mail!' }, { required: true, message: 'Please input your E-mail!' }]}
            style={{ marginBottom: 20 }}

          >
            <div>
              <Typography.Paragraph style={{ color: "#455A64", marginBottom: 5 }}>Email Address</Typography.Paragraph>
              <Input placeholder="Email" />
            </div>
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ marginBottom: 20 }}
          >
            <div>
              <Typography.Paragraph style={{ color: "#455A64", marginBottom: 5 }}>Password</Typography.Paragraph>
              <Input.Password placeholder="Password" />
            </div>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button style={{ backgroundColor: "#66BB6A" }} type="primary" htmlType="submit" icon={<HomeOutlined />} block>
              Log In
            </Button>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
            <a href="http://localhost:3000"><Typography.Text strong style={{ color: "#66BB6A" }}>Back to Home</Typography.Text></a>
          </div>
        </Form>
      </Card>
    </div >
  );
};

export default Login;
