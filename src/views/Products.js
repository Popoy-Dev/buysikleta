import React, { useState, useEffect } from "react";
import mcArthur from "./../assets/img/mcArthur.jpg";
import romanticBaboy from "./../assets/img/romantic_baboy.jpg";
import infinitee_pares_logo from "./../assets/img/Infinitee_pares_logo.jpg";
// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { Select, InputNumber, Form, Input, Button, message } from "antd";
import { supabase } from "./../supabaseClient";

export default function Products() {
  const [addCartList, setAddCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const queryString = window.location.pathname;
  const [mainImage, setMainImage] = useState(null);

  const bannerImage = () => {
    if (queryString === "/romantic_baboy") setMainImage(romanticBaboy);
    if (queryString === "/macarthur") setMainImage(mcArthur);
    if (queryString === "/infinitee_pares") setMainImage(infinitee_pares_logo);
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
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  useEffect(() => {
    setAddCartList(JSON.parse(localStorage.getItem("lists")));
  }, []);
  const onChange = (value) => {};

  const onFinish = (values) => {
    message.success("Item added to cart.", 10);
    if (addCartList === null) {
      setAddCartList([values]);
      localStorage.setItem("lists", JSON.stringify([values]));
    } else {
      setAddCartList((oldArray) => [...oldArray, values]);
      const data = [...addCartList, values];
      localStorage.setItem("lists", JSON.stringify(data));
    }
  };
  useEffect(() => {}, [addCartList]);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Navbar
        transparent
        addCartList={addCartList}
        setAddCartList={setAddCartList}
      />
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
                                product_id: list.product_id,
                              }}
                              onFinish={onFinish}
                              onFinishFailed={onFinishFailed}
                              autoComplete="off"
                            >
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
                                name="product_id"
                                labelCol={{ span: 4 }}
                                hidden={true}
                              >
                                <Input initialvalues={list.product_id} />
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
