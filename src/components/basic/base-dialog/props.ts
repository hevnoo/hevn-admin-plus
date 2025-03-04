export default {
  showDialog: { type: Boolean, default: false },
  title: { type: String, default: "提示" },
  width: { type: String, default: "800px" },
  height: { type: String, default: "600px" },
  clickModal: { type: Boolean, default: false },
  // footer
  mode: { type: String, default: "" },
  position: { type: String, default: "right" },
  buttons: {
    type: Array,
    default: [
      {
        label: "取消",
        value: "cancel",
        type: "info",
        prev: ["edit", "detail", "add"],
      },
      // { label: "重置", value: "reset", type: "", prev: [] },
      // {
      //   label: "确认",
      //   value: "confirm",
      //   type: "primary",
      //   prev: ["detail"],
      // },
      // {
      //   label: "提交",
      //   value: "submit",
      //   type: "primary",
      //   prev: ["edit", "add"],
      // },
    ],
  },
};
