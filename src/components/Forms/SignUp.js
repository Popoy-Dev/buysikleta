import React from "react";
import { Form, Input, Button, Select, InputNumber } from "antd";

const SignUp = ({ onSaveData, handleCancel }) => {
  const { Option } = Select;
  return (
    <>
      <Form onFinish={onSaveData} labelCol={{ span: 8 }}>
        <Form.Item
          label="First Name"
          name="firstname"
          rules={[{ required: true, message: "Please input your firstname!" }]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastname"
          labelAlign="left"
          rules={[{ required: true, message: "Please input your lastname!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contact Number"
          name="contact_number"
          labelAlign="left"
          rules={[
            { required: true, message: "Please input your contact number!" },
          ]}
        >
          <InputNumber min={10} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          labelAlign="left"
          rules={[{ required: true, message: "Please input your Address!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          labelAlign="left"
          name="barangay"
          label="Barangay"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select Barangay">
            <Option value="Bonga Mayor">Bonga Mayor</Option>
            <Option value="Bonga Menor">Bonga Menor</Option>
            <Option value="Buisan">Buisan</Option>
            <Option value="Camachilihan">Camachilihan</Option>
            <Option value="Cambaog">Cambaog</Option>
            <Option value="Catacte">Catacte</Option>
            <Option value="Liciada">Liciada</Option>
            <Option value="Malamig">Malamig</Option>
            <Option value="Malawak">Malawak</Option>
            <Option value="Poblacion">Poblacion</Option>
            <Option value="San Pedro">San Pedro</Option>
            <Option value="Talampas">Talampas</Option>
            <Option value="Tanawan">Tanawan</Option>
            <Option value="Tibagan">Tibagan</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          labelAlign="left"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          labelAlign="left"
          rules={[{ required: true, message: "Please input your username!" }]}
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
        <Form.Item
          labelAlign="left"
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
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

export default SignUp;
