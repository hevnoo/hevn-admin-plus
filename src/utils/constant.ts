import { v4 as uuidv4 } from "uuid";

const menuList = [
  {
    id: uuidv4(),
    name: "home",
    path: "/home",
    meta: {
      title: "首页",
      icon: "HomeFilled",
    },
  },
  {
    id: uuidv4(),
    name: "register",
    path: "/register",
    meta: {
      title: "挂号信息",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "drugs",
    path: "/drugs",
    meta: {
      title: "药品信息",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "doctor",
    path: "/doctor",
    meta: {
      title: "医师信息",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "patient",
    path: "/patient",
    meta: {
      title: "病人信息",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "charge",
    path: "/charge",
    meta: {
      title: "缴费信息",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "pgm",
    path: "/pgm",
    meta: {
      title: "取药票单",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "recipel",
    path: "/recipel",
    meta: {
      title: "处方信息",
      icon: "Goods",
    },
  },
  {
    id: uuidv4(),
    name: "pay",
    path: "/pay",
    meta: {
      title: "支付凭据",
      icon: "Goods",
    },
  },

  //   {
  //     id: uuidv4(),
  //     name: "order",
  //     path: "/order",
  //     meta: {
  //       title: "订单管理",
  //       icon: "Document",
  //     },
  //     children: [
  //       {
  //         id: uuidv4(),
  //         name: "orderList",
  //         path: "/order/orderList",
  //         meta: {
  //           title: "订单列表",
  //           icon: "List",
  //           keepAlive: true,
  //         },
  //       },
  //       {
  //         id: uuidv4(),
  //         name: "collect",
  //         path: "/order/collect",
  //         meta: {
  //           title: "汇总清单",
  //           icon: "Tickets",
  //           keepAlive: true,
  //         },
  //       },
  //     ],
  //   },
];

const deptList = [
  { label: "科室1", value: "dept1" },
  { label: "科室2", value: "dept2" },
  { label: "科室3", value: "dept3" },
  { label: "科室4", value: "dept4" },
  { label: "科室5", value: "dept5" },
];

const storageList = [
  { label: "1号药柜", value: "dept1" },
  { label: "2号药柜", value: "dept2" },
  { label: "3号药柜", value: "dept3" },
  { label: "4号药柜", value: "dept4" },
];

export { menuList, deptList, storageList };
