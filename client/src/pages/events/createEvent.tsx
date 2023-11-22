import React, { useContext, useState } from "react";
import { BoldOutlined } from "@ant-design/icons";
import { Typography, Button, Form, Input, DatePicker } from 'antd'
import { useAuth } from "../../contexts/AuthContext";
import router from "next/router";

const Create = () => {
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

  return (
    <div>
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
          <Input onChange={(e) => setExpTime(e.target.value)} />
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
      </Form>
    </div>
  );
};

export default Create;
