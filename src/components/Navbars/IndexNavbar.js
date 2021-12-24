/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import { Modal, Button, message } from "antd";
import IndexDropdown from "components/Dropdowns/IndexDropdown.js";
import { supabase } from "./../../supabaseClient";
import SignUp from "./../../components/Forms/SignUp";
import LoginForm from "./../../components/Forms/LoginForm";
export default function Navbar() {
  const info = supabase.auth.session();
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [userData, setUserData] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  // useEffect(() => {
  //   setUserDetails(userData);
  // }, [userData]);

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
      const { data } = await supabase.from("users").select().eq("uid", uid);
      setUserData(data);
      setIsLoginModalVisible(false);
      message.success(
        "This is a prompt message for success, and it will disappear in 10 seconds",
        10
      );
    }
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const fetchUser = async () => {
    const { data } = await supabase.from("users").select().eq("uid", uid);
    setUserData(data);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
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
                    <p className="font-bold pr-4">{` ${userData[0].firstname} ${userData[0].lastname}`}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <Button danger onClick={signOut}>
                      Logout
                    </Button>
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
