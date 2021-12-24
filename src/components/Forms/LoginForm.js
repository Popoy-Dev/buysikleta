import React from "react";
import { Form, Input, Button } from "antd";

const LoginForm = ({ onSaveLoginData, handleCancel }) => {
  return (
    <>
      <Form onFinish={onSaveLoginData} labelCol={{ span: 8 }}>
        <Form.Item
          label="Email"
          name="email"
          labelAlign="left"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          labelAlign="left"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <div className="text-right">
          <Button type="primary" htmlType="submit" className="mr-4">
            Submit
          </Button>
          <Button type="default" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
