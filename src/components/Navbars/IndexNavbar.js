/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import { Modal, Button, message, Table, Space, Menu, Dropdown } from "antd";

import { supabase } from "./../../supabaseClient";
import SignUp from "./../../components/Forms/SignUp";
import LoginForm from "./../../components/Forms/LoginForm";
import { DownOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
export default function Navbar({ addCartList }) {
  let history = useHistory();
  const info = supabase.auth.session();
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [userData, setUserData] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [cartList, setCartList] = useState({});

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setCartList(JSON.parse(localStorage.getItem("lists")));
  }, []);
  useEffect(() => {
    setCartList(JSON.parse(localStorage.getItem("lists")));
  }, [addCartList]);

  const userId = Math.floor(100000 + Math.random() * 900000);
  const uid = info?.user.user_metadata.uid;

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleLoginCancel = () => {
    setIsLoginModalVisible(false);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const saveSignUp = async (values) => {
    try {
      const { user, session, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      throw new Error(error);
    }

    const { data, err } = await supabase.from("users").insert([
      {
        firstname: values.firstname,
        lastname: values.lastname,
        contact_number: values.contact_number,
        username: values.username,
        address: values.address,
        barangay: values.barangay,
        uid: userId,
      },
    ]);
    const { user } = await supabase.auth.update({
      data: {
        uid: userId,
      },
    });
    if (data) {
      setUserData(data);
      setIsModalVisible(false);
      message.success(
        "Congratulations, your account has been succesfully created",
        10
      );
    }
  };

  const saveLogin = async (values) => {
    const { user, session } = await supabase.auth.signIn({
      email: values.email,
      password: values.password,
    });
    if (user) {
      message.success(
        "This is a prompt message for success, and it will disappear in 10 seconds",
        10
      );

      const { data } = await supabase.from("users").select().eq("uid", uid);
      setUserData(data);
      setIsLoginModalVisible(false);
      window.location.reload(false);
    } else {
      message.error("Wrong Email or Password", 10);
    }
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    window.location.reload(false);
  };

  const fetchUser = async () => {
    const { data } = await supabase.from("users").select().eq("uid", uid);
    setUserData(data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Action",
      key: "itemId",
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => deleteItem(record)}>Remove</a>
        </Space>
      ),
    },
  ];

  const deleteItem = (record) => {
    const items = JSON.parse(localStorage.getItem("lists"));
    const filtered = items.filter(
      (item) => item.product_id !== record.product_id
    );
    localStorage.setItem("lists", JSON.stringify(filtered));
    const getUpdatedItems = setCartList(
      JSON.parse(localStorage.getItem("lists"))
    );
  };

  const handleModal = () => {
    setCartList(JSON.parse(localStorage.getItem("lists")));
    setVisible(true);
  };

  const onSubmit = async () => {
    message.success("Congratulations, your order has been placed.", 10);

    const { data, err } = await supabase.from("orders").insert([
      {
        orders: cartList,
        user_id: info.user.user_metadata.uid,
        order_id: Math.floor(100000 + Math.random() * 900000),
      },
    ]);
    if (data) {
      message.success("Congratulations, your order has been placed.", 10);
    }
    setVisible(false);
    localStorage.removeItem("lists");
    window.location.reload(false);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => history.push("/track-orders")}
        >
          Track Orders
        </a>
      </Menu.Item>

      <Menu.Item danger>
        {" "}
        <Button danger onClick={signOut}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Modal
        title="Checkout"
        centered
        visible={visible}
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
        width={1000}
        okText="Check Out"
        cancelText="Cancel"
      >
        <Table dataSource={cartList} columns={columns} rowKey="itemId" />
      </Modal>
      <Modal
        title="Login"
        visible={isLoginModalVisible}
        footer={null}
        onCancel={handleLoginCancel}
        // onOk={saveSignUp}
      >
        <LoginForm
          onSaveLoginData={saveLogin}
          handleCancel={handleLoginCancel}
        />
      </Modal>

      <Modal
        title="Sign Up"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        // onOk={saveSignUp}
      >
        <SignUp onSaveData={saveSignUp} handleCancel={handleCancel} />
      </Modal>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              BUYSIKLETA
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="text-green fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {userData && Object.keys(userData).length !== 0 ? (
                <>
                  <li className="pt-4 flex items-center">
                    {cartList ? (
                      <a
                        href="#"
                        role="button"
                        className="relative flex"
                        onClick={handleModal}
                      >
                        <svg
                          className="flex-1 w-8 h-8 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                        </svg>
                        <span
                          className="absolute right-0 top-4 rounded-full bg-red-600 w-5 h-5 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center"
                          style={{ top: "-10px" }}
                        >
                          {JSON.parse(localStorage.lists).length}
                        </span>
                      </a>
                    ) : (
                      <a href="#" role="button" className="relative flex">
                        <svg
                          className="flex-1 w-8 h-8 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z" />
                        </svg>
                      </a>
                    )}

                    <Dropdown overlay={menu} trigger={["click"]}>
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      >
                        {` ${userData[0].firstname} ${userData[0].lastname}`}{" "}
                        <DownOutlined />
                      </a>
                    </Dropdown>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <button
                      className=" text-white  text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                      type="button"
                      onClick={showLoginModal}
                      style={{ backgroundColor: "#4ade80" }}
                    >
                      Login
                    </button>
                  </li>
                  <li className="flex items-center">
                    <button
                      className="bg-slate-300 text-black active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                      type="button"
                      onClick={showModal}
                    >
                      Sign Up
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
