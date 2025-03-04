export default {
  formWidth: { type: String, default: "350px" },
  labelWidth: { type: String, default: "100px" },
  labelPosition: { type: String, default: "right" },
  suffix: { type: String, default: "" },
  inline: { type: Boolean, default: false },
  size: { type: String, default: "default" },
  // formSettings: {
  //   type: Object,
  //   default: {
  //     width: "100%",
  //     labelWidth: "100px",
  //     inline: false,
  //     size: "default",
  //   },
  // },
  formData: { type: Object, default: { username: "" } },
  formItems: {
    type: Array,
    default: [
      {
        field: "username",
        title: "用户名",
        span: 24,
        itemRender: {
          name: "input",
          props: { type: "text", clearable: true },
        },
      },
    ],
  },
  formRules: {
    type: Object,
    default: {
      // nickname: [
      //   { required: true, message: "请输入名称" },
      //   { min: 1, max: 10, message: "长度在 1 到 10 个字符" },
      // ],
      // sex: [{ required: true, message: "请选择性别" }],
      // age: [
      //   { required: true, message: "请输入年龄" },
      //   {
      //     validator({ itemValue }) {
      //       // 自定义校验
      //       if (Number(itemValue) > 35 || Number(itemValue) < 18) {
      //         return new Error("年龄在 18 ~ 35 之间");
      //       }
      //     },
      //   },
      // ],
      // date: [{ required: true, message: "必填校验" }],
    },
  },
  buttons: {
    type: Array,
    default: [
      // {
      //   type: "submit",
      //   status: "primary",
      //   content: "提交",
      // },
      // {
      //   type: "reset",
      //   status: "",
      //   content: "重置",
      // },
      // {
      //   type: "close", //cancel
      //   status: "info",
      //   content: "关闭",
      // },
    ],
  },
};
