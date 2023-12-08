import React, { useContext, FC, useState } from "react";
import { Typography, Button, Form, Input, DatePicker, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from "../../contexts/AuthContext";
import router from "next/router";
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';


const Create: React.FC = () => {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expTime, setExpTime] = useState("");
  const [tag, setTag] = useState("");
  const { getAuthState, authState } = useAuth();
  const [fileList, setFileList] = useState<UploadFile[]>();


  const createEvent = async (values: any) => {
    fetch("http://localhost:5005/api/events/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthState()?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exp_time: new Date(expTime).toISOString(),
        description: description,
        qty: quantity,
        tags: { connect: tag },
        photos: fileList,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          router.push("/events");
          alert("event created!");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };


  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);


  return (
    <div
      style={{
        backgroundColor: "#eaf7f0",
        padding: "20px",
        width: "100%",
        height: "100%",
      }}>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Create an Event
      </Typography.Title>


      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={createEvent}
      >
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[
            { required: true },
            { pattern: /^[0-9]+$/, message: "Please enter a number." },
          ]}
        >
          <Input onChange={(e) => setQuantity(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Expiration Time"
          name="expTime"
          rules={[{ required: true }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            onChange={(date, dateString) => setExpTime(dateString)}
          />
        </Form.Item>
        <Form.Item label="Tag" name="tag" rules={[{ required: true }]}>
          <Input onChange={(e) => setTag(e.target.value)} />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/events" listType="picture-card" maxCount={10} onChange={handleChange}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "rgb(102, 187, 106)" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};


export default Create;
