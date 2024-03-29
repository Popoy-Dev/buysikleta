import React, { useState, useEffect } from "react";

import Navbar from "components/Navbars/AuthNavbar.js";

import Footer from "components/Footers/Footer.js";
import { supabase } from "./../supabaseClient";
import { Button, Table, Modal, message, Typography } from "antd";
import moment from "moment";

export default function Profile() {
  const { Text } = Typography;
  const info = supabase.auth.session();
  const uid = info?.user.user_metadata.uid;
  const [profileInfo, setProfileInfo] = useState("");
  const [orderDetailLists, setOrderDetailLists] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [isOrderInfoModal, setIsOrderInfoModal] = useState(false);
  const [isRiderInfoModal, setIsRiderInfoModal] = useState(false);
  const [modalOrderLists, setModalOrderLists] = useState({});
  const [order, setOrder] = useState({});
  const [availableOrders, setAvailableOrders] = useState(true);
  const [riderInfo, setRiderInfo] = useState({});
  const [pendingNumber, setpendingNumber] = useState(0);
  const [realtime, setRealTime] = useState({});
  const [modalHistory, setModalHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const profileImage = async () => {
    const { data } = await supabase.from("users").select().eq("uid", uid);
    setProfileInfo(data);
  };

  const mySubscription = supabase
    .from("orders")
    .on("*", (payload) => {
      setRealTime(payload);
    })
    .subscribe();

  useEffect(() => {
    deliveredNotification();
  }, [realtime]);

  useEffect(() => {
    deliveredNotification();
  }, []);

  const deliveredNotification = async () => {
    const { data } = await supabase.from("orders").select().eq("user_id", uid);

    data.map((list) => {
      if (list.rider_uid) {
        setpendingNumber(1 + pendingNumber);
      }
    });
  };

  const orderLists = async () => {
    const { data } = await supabase
      .from("orders")
      .select()
      .eq("user_id", uid)
      .is("rider_uid", null);
    // .not("rider_uid", "is", null);
    setOrderDetailLists(data);
  };
  const pendingOrderLists = async () => {
    const { data } = await supabase
      .from("orders")
      .select()
      .eq("user_id", uid)
      // .is("rider_uid", null);
      .not("rider_uid", "is", null);
    setOrderDetailLists(data);
  };

  const orderDetail = () => {
    orderDetailLists?.map(async (list) => {
      if (list.is_order_success) {
        const { data } = await supabase
          .from("users")
          .select("firstname, lastname, address, barangay")
          .match({ uid: list.user_id });
        data[0].order_id = list.order_id;
        data[0].created_at = list.created_at;
        data[0].rider_uid = list.rider_uid;
        setOrderHistory((oldArray) => [...oldArray, ...data]);
      } else {
        const { data } = await supabase
          .from("users")
          .select("firstname, lastname, address, barangay")
          .eq("uid", list.user_id);

        data[0].order_id = list.order_id;
        data[0].created_at = list.created_at;
        data[0].rider_uid = list.rider_uid;

        setCustomerDetails((oldArray) => [...oldArray, ...data]);
      }
    });
  };
  useEffect(() => {
    profileImage();
    orderLists();
  }, []);

  useEffect(() => {
    orderDetail();
  }, [orderDetailLists]);

  const viewOrder = (record) => {
    setOrderId(record.order_id);
    setIsOrderInfoModal(true);
    setModalOrderLists(record);
  };

  const viewRiderDetails = async (record) => {
    setOrderId(record.order_id);
    if (record["rider_uid"] === null) {
      message.error("No rider assign to your order ", 6);
    } else {
      const { data } = await supabase
        .from("users")
        .select("firstname, lastname, contact_number, barangay")
        .eq("uid", record["rider_uid"]);
      record["rider_firstname"] = data[0].firstname;
      record["rider_lastname"] = data[0].lastname;
      record["rider_contact_number"] = data[0].contact_number;
      setIsRiderInfoModal(true);
      setRiderInfo([record]);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, record) => (
        <>
          <p>
            {moment(record.created_at)
              .utcOffset("+0800")
              .format("MMMM Do YYYY, h:mm a")}
          </p>
        </>
      ),
    },

    {
      title: "Order Details",
      dataIndex: "orders",
      key: "orders",
      render: (text, record) => (
        <Button
          style={{ backgroundColor: "#f0c83a" }}
          onClick={() => viewOrder(record)}
          className="pr-2"
        >
          Order Details
        </Button>
      ),
    },

    {
      title: "Rider Details",
      dataIndex: "orders",
      key: "orders",
      render: (text, record) => (
        <Button
          style={{ backgroundColor: "#f0c83a" }}
          onClick={() => viewRiderDetails(record)}
          className="pr-2"
        >
          Rider Details
        </Button>
      ),
    },
  ];
  const handleOrderDetailsCancel = () => {
    setIsOrderInfoModal(false);
    setIsRiderInfoModal(false);
  };

  const handleOrderDetailsOk = async () => {
    const { data, error } = await supabase
      .from("orders")
      .update({ is_order_success: true })
      .match({ order_id: orderId });
    if (data) {
      setIsOrderInfoModal(false);
      setCustomerDetails([]);
      pendingOrderLists();
    }
  };

  const handleOrderReceived = async () => {
    const { data, error } = await supabase
      .from("orders")
      .update({ is_order_success: true })
      .match({ order_id: orderId });
    if (data) {
      setIsRiderInfoModal(false);
      setCustomerDetails([]);
      pendingOrderLists();
    }
  };

  const modaldetailLists = async () => {
    const { data } = await supabase
      .from("orders")
      .select()
      .eq("order_id", modalOrderLists.order_id);
    setOrder(data);
  };
  useEffect(() => {
    modaldetailLists();
  }, [modalOrderLists]);

  const orderColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Shop",
      dataIndex: "shop",
      key: "shop",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => {
        return `₱ ${record.price}.00 `;
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => {
        return ` ${record.quantity} pc/s`;
      },
    },
    {
      title: " Computation",
      dataIndex: "Computation",
      key: "name",
      render: (text, record) => {
        return record.price * record.quantity;
      },
    },
  ];

  const riderDetailsColumn = [
    {
      title: "Name",
      dataIndex: "firstname",
      key: "firstname",
      render: (text, record) => (
        <p>
          {record.rider_firstname} {record.rider_lastname}
        </p>
      ),
    },
    {
      title: "Contact",
      dataIndex: "rider_contact_number",
      key: "rider_contact_number",
    },
  ];
  const handleAvailableOrders = () => {
    setCustomerDetails([]);
    orderLists();
    setAvailableOrders(true);
  };
  const handlePendingOrders = () => {
    setCustomerDetails([]);
    pendingOrderLists();
    setAvailableOrders(false);
  };

  const handleOrderHistory = () => {
    setModalHistory(true);
    setCustomerDetails([]);
    setOrderHistory([]);
    pendingOrderLists();
    setAvailableOrders(false);
  };

  return (
    <>
      <Modal
        width={1000}
        title="Order Details"
        visible={isOrderInfoModal}
        // change to  handleOrderDetailsOk
        onOk={handleOrderDetailsOk}
        onCancel={handleOrderDetailsCancel}
        okText={availableOrders ? "Ok" : "Order Received"}
        cancelText="Return"
      >
        <Table
          dataSource={order[0]?.orders}
          columns={orderColumns}
          rowKey="order_id"
          summary={(pageData) => {
            let totalpayment = 0;
            pageData.forEach(({ price, quantity }) => {
              totalpayment += price * quantity;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell style={{ textAlign: "right" }}>
                    <Text strong>Product Total Amount</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">₱{totalpayment}.00</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>Delivery fee</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="danger">
                      ₱{Math.round(totalpayment * 0.1 + 20)}.00
                    </Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text mark>
                      ₱{totalpayment + Math.round(totalpayment * 0.1) + 20}.00
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text type="">Cash on Delivery</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Modal>

      {/* rider modal info */}

      <Modal
        width={1000}
        title="Rider Details"
        visible={isRiderInfoModal}
        onOk={orderHistory ? handleOrderDetailsCancel : handleOrderReceived}
        onCancel={handleOrderDetailsCancel}
        okText={availableOrders ? "Ok" : "Order Received"}
        cancelText={orderHistory ? "Back" : "Return"}
      >
        <Table
          dataSource={riderInfo.length && riderInfo}
          columns={riderDetailsColumn}
          rowKey="order_id"
        />
      </Modal>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundColor: " grey",
              // "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
            style={{ transform: "translateZ(0)" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-4 bg-blueGray-700">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="..."
                        src={require("assets/img/team-2-800x800.jpg").default}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0"></div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8"></div>
                  </div>
                </div>
                {profileInfo && (
                  <div className="text-center mt-12">
                    <h3 className="text-xl leading-normal text-blueGray-700">
                      Customer
                    </h3>
                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                      {`${profileInfo[0]?.firstname}   ${profileInfo[0]?.lastname} `}
                    </h3>
                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                      {`${profileInfo[0]?.address}  ${profileInfo[0]?.barangay}  `}
                    </div>
                  </div>
                )}
                <Button type="primary" onClick={handleAvailableOrders}>
                  {" "}
                  Available Orders{" "}
                </Button>
                <Button
                  type="default"
                  style={{ marginLeft: "20px" }}
                  onClick={handlePendingOrders}
                >
                  {" "}
                  Pending Orders{" "}
                  {pendingNumber > 0 && (
                    <span
                      style={{ marginTop: "-10px" }}
                      className="absolute right-2 top-2 rounded-full bg-red-600 w-5 h-5 top right p-0 m-0 text-white font-mono text-sm  leading-tight text-center"
                    >
                      {pendingNumber}
                    </span>
                  )}
                </Button>
                <Button
                  danger
                  onClick={handleOrderHistory}
                  style={{ float: "right" }}
                >
                  History
                </Button>

                <Modal
                  title="Order History"
                  centered
                  visible={modalHistory}
                  onOk={() => setModalHistory(false)}
                  onCancel={() => setModalHistory(false)}
                  width={1000}
                >
                  <h1
                    className="text-center text-3xl my-6 font-extrabold "
                    style={{ color: "#c7a76b" }}
                  >
                    History
                  </h1>
                  <Table
                    dataSource={orderHistory}
                    columns={columns}
                    rowKey="order_id"
                  />
                </Modal>

                <br />
                {availableOrders === true ? (
                  <>
                    <h1
                      className="text-center text-3xl my-6 font-extrabold "
                      style={{ color: "#6da2e8" }}
                    >
                      Available Order/s
                    </h1>
                    <Table
                      dataSource={customerDetails}
                      columns={columns}
                      rowKey="order_id"
                    />
                  </>
                ) : (
                  <>
                    <h1
                      className="text-center text-3xl my-6 font-extrabold "
                      style={{ color: "#c7a76b" }}
                    >
                      Pending Order/s
                    </h1>
                    <Table
                      dataSource={customerDetails}
                      columns={columns}
                      rowKey="order_id"
                    />
                  </>
                )}
                {}

                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}
