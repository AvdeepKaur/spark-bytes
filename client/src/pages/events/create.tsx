import React, { useContext, useState } from "react";
import { BoldOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Typography,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Upload,
} from "antd";
import { useAuth } from "../../contexts/AuthContext";
import router from "next/router";

const Create = () => {
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expTime, setExpTime] = useState("");
  const [tag, setTag] = useState("");
  const { getAuthState, authState } = useAuth();

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
        photos: photoList,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          router.push("/events");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //handler for uploading photos
  const onUploadHandler = (e: any) => {
    {
      const newPhoto = e.fileList.map(
        (file: { originFileObj: any }) => file.originFileObj
      );
      setPhotoList([...photoList, ...newPhoto]);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#eaf7f0",
          padding: "20px",
          width: "100%",
          height: "100%",
        }}
      >
        <div>
          <Typography.Title
            level={2}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Create an Event
          </Typography.Title>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card style={{ width: 500 }}>
            <Form
              labelCol={{ span: 30 }}
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
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "rgb(102, 187, 106)" }}
                >
                  Submit
                </Button>
              </Form.Item>
              <Form.Item>
                <Upload
                  listType="picture"
                  maxCount={10}
                  multiple
                  onChange={onUploadHandler}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Create;
