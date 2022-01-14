import React, { useState, useEffect } from "react";

import Navbar from "components/Navbars/AuthNavbar.js";

import Footer from "components/Footers/Footer.js";
import { supabase } from "./../supabaseClient";
import { Button, Table, Modal } from "antd";

export default function Profile() {
  const info = supabase.auth.session();
  const uid = info?.user.user_metadata.uid;
  const [riderInfo, setRiderInfo] = useState("");
  const [orderDetailLists, setOrderDetailLists] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [isOrderInfoModal, setIsOrderInfoModal] = useState(false);
  const [modalOrderLists, setModalOrderLists] = useState({});
  const [order, setOrder] = useState({});
  const profileImage = async () => {
    const { data } = await supabase.from("users").select().eq("uid", uid);
    setRiderInfo(data);
  };
  const orderLists = async () => {
    const { data } = await supabase
      .from("orders")
      .select()
      .not("rider_uid", "is", null);
    setOrderDetailLists(data);
  };

  const orderDetail = () => {
    orderDetailLists?.map(async (list) => {
      const { data } = await supabase
        .from("users")
        .select("firstname, lastname, address, barangay")
        .eq("uid", list.user_id);
      data[0].order_id = list.order_id;

      setCustomerDetails((oldArray) => [...oldArray, ...data]);
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

  const columns = [
    {
      title: "Name",
      dataIndex: "firstname",
      key: "firstname",
      render: (text, record) => (
        <p>
          {record.firstname} {record.lastname}
        </p>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <p>
          {record.address} {record.barangay}
        </p>
      ),
    },
    {
      title: "Orders",
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
  ];
  const handleOrderDetailsCancel = () => {
    setIsOrderInfoModal(false);
  };

  const handleOrderDetailsOk = async () => {
    const { data, error } = await supabase
      .from("orders")
      .update({ rider_uid: uid })
      .match({ order_id: orderId });
    setIsOrderInfoModal(false);
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
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <>
      <Modal
        width={1000}
        title="Order Details"
        visible={isOrderInfoModal}
        onOk={handleOrderDetailsOk}
        onCancel={handleOrderDetailsCancel}
      >
        <Table dataSource={order[0]?.orders} columns={orderColumns} />
        {/* {order && order[0]?.orders?.map((item) => <>
          <p className="inline">{item.name}</p>
          <p className="inline">{item.name}</p>
        </>)} */}
      </Modal>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
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
        <section className="relative py-16 bg-blueGray-200">
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
                {riderInfo && (
                  <div className="text-center mt-12">
                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                      {`${riderInfo[0]?.firstname}   ${riderInfo[0]?.lastname} `}
                    </h3>
                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
                      {`${riderInfo[0]?.address}  ${riderInfo[0]?.barangay}  `}
                    </div>
                  </div>
                )}
                <Button type="primary"> Available Orders </Button>
                <Table
                  dataSource={customerDetails}
                  columns={columns}
                  rowKey="order_id"
                />
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
      <Footer />
    </>
  );
}
