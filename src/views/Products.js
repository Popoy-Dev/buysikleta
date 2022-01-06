import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import starbucksCover from "./../assets/img/starbucks-cover.png";
import benchStoreMain from "./../assets/img/bench-store-main.jpg";
import romanticBaboy from "./../assets/img/romantic_baboy.jpg";
// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { Select, InputNumber, Form, Input, Button } from "antd";
import { supabase } from "./../supabaseClient";

export default function Products() {
  const [addCartList, setAddCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const { Option } = Select;
  const queryString = window.location.pathname;
  const [mainImage, setMainImage] = useState(null);
  const itemId = Math.floor(100000 + Math.random() * 900000);
  const bannerImage = () => {
    if (queryString === "/romantic_baboy") setMainImage(romanticBaboy);
    if (queryString === "/starbucks") setMainImage(starbucksCover);
    if (queryString === "/bench") setMainImage(benchStoreMain);
  };

  useEffect(() => {
    bannerImage();
    getProductList();
  }, []);

  const getProductList = async () => {
    var shopName = queryString.substring(1);
    const { data } = await supabase
      .from("products")
      .select()
      .eq("shop", shopName);
    setProductList(data);
    console.log("datas list", data);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onChange = (value) => {
    // console.log("changed", value);
  };
  const onFinish = (values) => {
    setAddCartList((oldArray) => [...oldArray, values]);

    const data = [...addCartList, values];
    // const data = setAddCartList((oldArray) => [...oldArray, values]);
    localStorage.setItem("lists", JSON.stringify(data));

    console.log("values", values);
  };
  useEffect(() => {}, [addCartList]);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Navbar transparent addCartList={addCartList} />
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
              {productList && productList.length ? (
                <>
                  {productList.map((list, i) => {
                    return (
                      <div
                        className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center"
                        key={i}
                      >
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                          <div className="px-4 py-5 flex-auto">
                            <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                              <i className="fas fa-award"></i>
                            </div>
                            <h6 className="text-xl font-semibold">
                              {list.name} - {`₱${list.price}.00`}
                            </h6>
                            <Form
                              name="basic"
                              initialValues={{
                                name: list.name,
                                price: list.price,
                                itemId: i + itemId,
                              }}
                              onFinish={onFinish}
                              onFinishFailed={onFinishFailed}
                              autoComplete="off"
                            >
                              {/* <Form.Item
                                label="Size"
                                name="size"
                                labelCol={{ span: 4 }}
                              >
                                <Select
                                  style={{ width: "100%" }}
                                  onChange={handleChange}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please input size!",
                                    },
                                  ]}
                                >
                                  <Option value="small">Small</Option>
                                  <Option value="medium">Medium</Option>
                                  <Option value="large">Large</Option>
                                </Select>
                              </Form.Item> */}
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
                                  style={{ width: "100%" }}
                                  onChange={onChange}
                                />
                              </Form.Item>
                              <Form.Item
                                label="name"
                                name="name"
                                labelCol={{ span: 4 }}
                                hidden={true}
                              >
                                <Select
                                  style={{ width: "100%" }}
                                  onChange={handleChange}
                                  initialvalues={list.name}
                                ></Select>
                              </Form.Item>
                              <Form.Item
                                label="Size"
                                name="price"
                                labelCol={{ span: 4 }}
                                hidden={true}
                              >
                                <Input initialvalues={list.price} />
                              </Form.Item>
                              <Form.Item
                                label="itemId"
                                name="itemId"
                                labelCol={{ span: 4 }}
                                hidden={true}
                              >
                                <Input initialvalues={itemId} />
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
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
