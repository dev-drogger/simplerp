const learn = async () => {
  const obj = {
    monthlyRevenue: {
      value: "909987",
      link: "/",
    },
    todayOrders: {
      value: "0",
      link: "/orders",
    },
    pendingOrders: {
      value: "7",
      link: "/orders",
    },
    pendingShipments: {
      value: "7",
      link: "/shipments",
    },
  };

  Object.entries(obj).forEach((o) => {
    console.log(o);
  });
};

learn();
