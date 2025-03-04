export default {
  cols: {
    type: Array,
    default: [
      { title: "字段1", field: "name" },
      {
        title: "字段2",
        field: "age",
        type: "v-html",
        formatter({ cellValue, row, column }: any) {
          return "-" + cellValue + "-";
        },
        render({ cellValue, row, column }: any) {
          return `<div style="color: aqua">${cellValue}</div>`;
        },
      },
    ],
  },
  data: {
    type: Array,
    default: [
      { name: "data1", age: "data1" },
      { name: "data2", age: "data2" },
    ],
  },
  showSelection: { type: Boolean, default: false }, //显示勾选框
  showIndex: { type: Boolean, default: false },
  fixedColumnNum: { type: Number, default: 0 }, //左起冻结列数
  rowButtons: { type: Array, default: [{ label: "详情" }] },
  actionColWidth: { type: String, default: "150" }, //操作列宽度
  //
  border: { type: Boolean, default: false },
  size: { type: String, default: "medium" },
  resizable: { type: Boolean, default: true },
  stripe: { type: Boolean, default: false },
  checkboxConfig: { type: Object, default: {} },
  loading: { type: Boolean, default: false },
  // 树形
  showTree: { type: Boolean, default: false },
  titleField: { type: String, default: "name" },
  defaultExpandAll: { type: Boolean, default: false },
  // styles
  maxHeight: { type: String, default: "" },
  transparentBackground: { type: Boolean, default: false }, //透明背景色
  rowStyle: { type: Object, default: {} }, //行样式
  cellStyle: { type: Object, default: {} }, //单元格样式
  showHeader: { type: Boolean, default: true },
  headerRowStyle: { type: Object, default: {} },
  headerCellStyle: { type: Object, default: {} },
  hoverStyle: { type: Object, default: {} }, //悬停行样式
  currentStyle: { type: Object, default: {} }, //选中行样式
  curHoverStyle: { type: Object, default: {} }, //选中行悬停样式
  //排序配置
  sortArray: { type: Array, default: [] },
  multipleSort: { type: Boolean, default: true },
  //合并 return { rowspan: 0, colspan: 0 }
  spanMethod: { type: Function, default: null },
  //用于临时合并
  mergeCells: {
    type: Array,
    default: [{ row: 0, col: 0, rowspan: 0, colspan: 0 }],
  },
  /*
    [{ row: 0, col: 0, rowspan: 0, colspan: 0 }]
    row：表示合并单元格的起始行索引。
    col：表示合并单元格的起始列索引。
    rowspan：表示合并的行数，即合并的单元格跨越的行数。
    colspan：表示合并的列数，即合并的单元格跨越的列数。
  */
  //分页配置
  enablePager: { type: Boolean, default: true },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  pageSizes: { type: Array, default: [10, 20, 30, 50, 100] },
  total: { type: Number, default: 0 },
  pagerAlign: { type: String, default: "right" },
  pagerCount: { type: Number, default: 5 },
  pagerAutoHidden: { type: Boolean, default: false },
  pagerLayout: {
    type: Array,
    default: [
      "PrevJump",
      "PrevPage",
      "JumpNumber",
      "NextPage",
      "NextJump",
      "Sizes",
      "FullJump",
      "Total",
    ],
  },
};
