import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import starbucksCover from "./../assets/img/starbucks-cover.png";
import benchStoreMain from "./../assets/img/bench-store-main.jpg";
// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { Select, InputNumber, Form, Input, Button } from "antd";

export default function Products() {
  const [addCartList, setAddCartList] = useState([]);
  const { Option } = Select;
  const queryString = window.location.pathname;
  const [mainImage, setMainImage] = useState(null);
  console.log("queryString", queryString);
  const bannerImage = () => {
    if (queryString === "/bench") setMainImage(benchStoreMain);
    if (queryString === "/starbucks") setMainImage(starbucksCover);
    if (queryString === "/bench") setMainImage(benchStoreMain);
  };

  useEffect(() => {
    bannerImage();
  }, []);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onChange = (value) => {
    // console.log("changed", value);
  };
  const onFinish = (values) => {
    setAddCartList((oldArray) => [...oldArray, values]);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  console.log("addCartList", addCartList);
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="pb-20 bg-blueGray-200 mt-10">
          <div className="flex items-center justify-center ">
            <div
              className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center"
              style={{
                backgroundImage: mainImage,
              }}
            >
              <img
                alt="..."
                src={mainImage}
                className="w-full align-middle rounded-t-lg"
              />
            </div>
          </div>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Cookie Frappucino</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">Tall</p>
                    <Form
                      name="basic"
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Size"
                        name="size"
                        labelCol={{ span: 4 }}
                        rules={[
                          {
                            required: true,
                            message: "Please input size!",
                          },
                        ]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          onChange={handleChange}
                        >
                          <Option value="small">Small</Option>
                          <Option value="medium">Medium</Option>
                          <Option value="large">Large</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[
                          {
                            required: true,
                            message: "Please input quantity!",
                          },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          max={10}
                          style={{ width: "100%" }}
                          onChange={onChange}
                        />
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Add to Cart
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>

              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Cookie Frappucino</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">Tall</p>
                  </div>
                </div>
              </div>

              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                      <i className="fas fa-award"></i>
                    </div>
                    <h6 className="text-xl font-semibold">Cookie Frappucino</h6>
                    <p className="mt-2 mb-4 text-blueGray-500">Tall</p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex flex-wrap items-center mt-32">
              <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                  <i className="fas fa-user-friends text-xl"></i>
                </div>
                <h3 className="text-3xl mb-2 font-semibold leading-normal">
                  Working with us is a pleasure
                </h3>
                <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                  Don't let your uses guess by attaching tooltips and popoves to
                  any element. Just make sure you enable them first via
                  JavaScript.
                </p>
                <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-blueGray-600">
                  The kit comes with three pre-built pages to help you get
                  started faster. You can change the text and images and you're
                  good to go. Just make sure you enable them first via
                  JavaScript.
                </p>
                <Link to="/" className="font-bold text-blueGray-700 mt-8">
                  Check Notus React!
                </Link>
              </div>

              <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                  <img
                    alt="..."
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80"
                    className="w-full align-middle rounded-t-lg"
                  />
                  <blockquote className="relative p-8 mb-4">
                    <svg
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 583 95"
                      className="absolute left-0 w-full block h-95-px -top-94-px"
                    >
                      <polygon
                        points="-30,95 583,95 583,65"
                        className="text-lightBlue-500 fill-current"
                      ></polygon>
                    </svg>
                    <h4 className="text-xl font-bold text-white">
                      Top Notch Services
                    </h4>
                    <p className="text-md font-light mt-2 text-white">
                      The Arctic Ocean freezes every winter and much of the
                      sea-ice then thaws every summer, and that process will
                      continue whatever happens.
                    </p>
                  </blockquote>
                </div>
              </div>
            </div> */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
