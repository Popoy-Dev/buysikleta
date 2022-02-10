import React, { useState, useEffect } from "react";
import mcArthur from "./../assets/img/mcArthur.jpg";
import romanticBaboy from "./../assets/img/romantic_baboy.jpg";
import infinitee_pares_logo from "./../assets/img/Infinitee_pares_logo.jpg";
// components
import Navbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import {
  Select,
  InputNumber,
  Form,
  Input,
  Button,
  message,
  Modal,
  Popconfirm,
} from "antd";
import { supabase } from "./../supabaseClient";

export default function Products() {
  const info = supabase.auth.session();
  const uid = info?.user?.user_metadata?.uid;

  const [addCartList, setAddCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const queryString = window.location.pathname;
  const [mainImage, setMainImage] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isProductEditModalVisible, setIsProductEditModalVisible] =
    useState(false);
  const [editValue, setEditValue] = useState({});

  const [shopName, setShopName] = useState(null);

  const bannerImage = () => {
    if (queryString === "/romantic_baboy") setMainImage(romanticBaboy);
    if (queryString === "/macarthur") setMainImage(mcArthur);
    if (queryString === "/infinitee_pares") setMainImage(infinitee_pares_logo);
  };

  const owner = async () => {
    const { data } = await supabase
      .from("users")
      .select("is_shopOwner, shop_name")
      .eq("uid", uid);

    if (
      data[0].is_shopOwner === true &&
      data[0].shop_name === queryString.substring(1)
    ) {
      setShopName(data[0].shop_name);
      setIsOwner(true);
    }
  };

  useEffect(() => {
    bannerImage();
    getProductList();
    owner();
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
    if (info) {
      message.success("Item added to cart.", 10);
      if (addCartList === null) {
        setAddCartList([values]);
        localStorage.setItem("lists", JSON.stringify([values]));
      } else {
        setAddCartList((oldArray) => [...oldArray, values]);
        const data = [...addCartList, values];
        localStorage.setItem("lists", JSON.stringify(data));
      }
    } else {
      message.error(
        "You must first have an account before placing an order",
        10
      );
    }
  };
  useEffect(() => {}, [addCartList]);
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const addProductShowModal = () => {
    setIsProductModalVisible(true);
  };
  const onSaveAddProduct = async (values) => {
    const productId = Math.floor(100000 + Math.random() * 90000);
    let imageName = values.name.toLowerCase().replace(" ", "_");

    var i = 0,
      strLength = imageName.length;
    for (i; i < strLength; i++) {
      imageName = imageName.replace(" ", "_");
    }

    const { data, error } = await supabase.from("products").insert([
      {
        shop: values.shop,
        name: values.name,
        image_name: imageName,
        product_id: productId,
        price: values.price,
      },
    ]);
    if (data) {
      message.success("Product details successfully added!", 10);
      setIsProductModalVisible(false);
      window.location.reload(false);
    }
    if (error) {
      message.error("Something wrong please try again!", 10);
      window.location.reload(false);
    }
    console.log("values", values);
    console.log("productId", productId);
  };

  const editProduct = (list) => {
    setIsProductEditModalVisible(true);
    setEditValue(list);
    console.log("editProduct", list);
  };

  const onSaveEditProduct = async (values) => {
    console.log("values", values);
    const { data, error } = await supabase
      .from("products")
      .update({ shop: values.shop, name: values.name, price: values.price })
      .match({ product_id: values.product_id });

    if (data) {
      message.success("Product details successfully edited!", 10);
      setIsProductEditModalVisible(false);
      window.location.reload(false);
    }
    if (error) {
      message.error("Something wrong please try again!", 10);
    }
  };

  const doConfirm = async (id) => {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .match({ product_id: id });

    if (data) {
      message.success("Product is successfully deleted!", 10);
      window.location.reload(false);
    }

    if (error) {
      message.error("Something wrong please try again!", 10);
    }
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <>
      <Navbar
        transparent
        addCartList={addCartList}
        setAddCartList={setAddCartList}
      />
      <main>
        <section className="pb-20 bg-blueGray-700 mt-10">
          <div className="flex items-center justify-center">
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
          <div className="text-center mt-8">
            {isOwner === true && (
              <>
                <Button
                  type="primary"
                  shape="round"
                  onClick={addProductShowModal}
                >
                  Add Product
                </Button>

                <Modal
                  title="Add Product"
                  visible={isProductModalVisible}
                  footer={null}
                  onCancel={() => setIsProductModalVisible(false)}
                >
                  <Form
                    onFinish={onSaveAddProduct}
                    initialValues={{
                      shop: shopName,
                    }}
                    labelCol={{ span: 8 }}
                  >
                    <Form.Item label="shop" name="shop" hidden={true}>
                      <Select initialvalues={shopName}></Select>
                    </Form.Item>
                    <Form.Item
                      label="Name of product"
                      name="name"
                      labelCol={{ span: 6 }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Product Price"
                      name="price"
                      labelCol={{ span: 6 }}
                    >
                      <Input />
                    </Form.Item>

                    <div className="text-right">
                      <Button type="primary" htmlType="submit" className="mr-4">
                        Submit
                      </Button>
                      <Button
                        type="default"
                        onClick={() => setIsProductModalVisible(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Modal>

                <Modal
                  title="Edit Product"
                  visible={isProductEditModalVisible}
                  footer={null}
                  onCancel={() => setIsProductEditModalVisible(false)}
                >
                  <Form
                    onFinish={onSaveEditProduct}
                    initialValues={{
                      shop: editValue.shop,
                      name: editValue.name,
                      price: editValue.price,
                      product_id: editValue.product_id,
                    }}
                    labelCol={{ span: 8 }}
                  >
                    <Form.Item label="shop" name="shop" hidden={true}>
                      <Select initialvalues={shopName}></Select>
                    </Form.Item>
                    <Form.Item
                      label="Name of product"
                      name="name"
                      labelCol={{ span: 6 }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Product Price"
                      name="price"
                      labelCol={{ span: 6 }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      hidden={true}
                      name="product_id"
                      labelCol={{ span: 6 }}
                    >
                      <Input />
                    </Form.Item>

                    <div className="text-right">
                      <Button type="primary" htmlType="submit" className="mr-4">
                        Submit
                      </Button>
                      <Button
                        type="default"
                        onClick={() => setIsProductModalVisible(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Modal>
              </>
            )}
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
                            {isOwner === true && (
                              <div className="text-right">
                                <Button
                                  shape="round"
                                  style={{ backgroundColor: "#cccc00" }}
                                  onClick={() => editProduct(list)}
                                >
                                  Edit
                                </Button>

                                <Popconfirm
                                  title="Are you sure to delete this task?"
                                  onConfirm={() => {
                                    doConfirm(list.product_id);
                                  }}
                                  onCancel={cancel}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button
                                    shape="round"
                                    style={{ backgroundColor: "#ff6257" }}
                                  >
                                    Delete
                                  </Button>
                                </Popconfirm>
                              </div>
                            )}

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
                                shop: list.shop,
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
                              <Form.Item
                                name="shop"
                                labelCol={{ span: 4 }}
                                hidden={true}
                              >
                                <Input initialvalues={list.shop} />
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
      {/* <Footer /> */}
    </>
  );
}
