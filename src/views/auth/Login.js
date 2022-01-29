import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./../../supabaseClient";
import { Form, Input, Button } from "antd";
import { useHistory } from "react-router-dom";

export default function Login() {
  let history = useHistory();
  const [errorMessage, setErrorMessage] = useState([]);
  const onFinish = async (values) => {
    const { user, session, error } = await supabase.auth.signIn({
      email: values.email,
      password: values.password,
    });
    const uid = session?.user.user_metadata.uid;
    if (user) {
      const { data } = await supabase.from("users").select().eq("uid", uid);
      if (data[0]?.is_rider) {
        history.push("/rider-profile");
      } else {
        setErrorMessage("You dont have a permission to login as Rider!");
      }
    }

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h2 className="text-blueGray-500 text-2xl font-bold">
                    Login
                  </h2>
                </div>
                <div className="btn-wrapper text-center"></div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-center mb-3 font-bold">
                  {errorMessage && (
                    <h2 className="text-red-500 text-md">{errorMessage}</h2>
                  )}
                </div>
                <Form onFinish={onFinish}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Please input valid Email!",
                          type: "email",
                        },
                      ]}
                    >
                      <Input
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                      />
                    </Form.Item>
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: "Please Password!" },
                        {
                          min: 5,
                          message: "Username must be minimum 5 characters.",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input.Password
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                      />
                    </Form.Item>
                  </div>

                  <div className="text-center mt-6">
                    <Form.Item>
                      <Button
                        type="primary"
                        className="bg-blue-800 text-white active:bg-blue-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        htmlType="submit"
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
