<template>
  <div>
    <vxe-grid ref="vxeTable" v-bind="gridOptions" v-on="gridEvents">
      <!-- 工具栏 -->
      <template #toolbarButtons>
        <!-- <vxe-select v-model="selectRowSize" :options="dataOptions" @change="changeRowSizeEvent"></vxe-select> -->
        <vxe-button status="primary" icon="vxe-icon-add" @click="handleToolbar('add')">新增</vxe-button>
        <vxe-button status="error" icon="vxe-icon-delete" @click="handleToolbar('delete')">删除</vxe-button>
        <vxe-button status="success" icon="vxe-icon-save" @click="handleToolbar('save')">保存</vxe-button>
      </template>
      <!-- 操作列 -->
      <template #activeColumn="{ row }">
        <vxe-button mode="text" status="primary" icon="vxe-icon-edit" @click="handleActiveColumn('detail', row)"
          >详情</vxe-button
        >
        <vxe-button mode="text" status="error" icon="vxe-icon-delete" @click="handleActiveColumn('delete', row)"
          >删除</vxe-button
        >
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { VxeGridProps, VxeGridListeners } from "vxe-table";
import { api } from "@/api";

interface RowVO {
  id: number;
  name: string;
  nickname: string;
  role: string;
  sex: string;
  age: number;
  address: string;
}

const vxeTable = ref();

// 模拟后台接口
const delApi = (removeRecords: RowVO[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        result: [],
        msg: `delete，${removeRecords.length}条`,
      });
    }, 100);
  });
};

// 模拟后台接口
const saveApi = (insertRecords: RowVO[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        result: [],
        msg: `success, ${insertRecords.length}条`,
      });
    }, 100);
  });
};

const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: false,
  keepSource: true,
  minHeight: "auto",
  printConfig: {},
  importConfig: {},
  exportConfig: {},
  columnConfig: {
    resizable: true,
  },
  pagerConfig: {
    enabled: true,
    pageSize: 10,
    pageSizes: [10, 20, 30, 50, 100],
  },
  // editConfig: {
  //   trigger: "click",
  //   mode: "row",
  //   showStatus: true,
  // },
  toolbarConfig: {
    refresh: true,
    import: true,
    export: true,
    print: true,
    zoom: true,
    custom: true,
    // buttons: [
    //   { name: "新增", code: "myAdd", status: "primary" },
    //   { name: "删除", code: "myDel", status: "error" },
    //   { name: "保存", code: "mySave", status: "success" },
    // ],
    slots: {
      buttons: "toolbarButtons",
    },
  },
  proxyConfig: {
    props: {
      result: "data.data",
      total: "data.total",
    },
    ajax: {
      // 接收 Promise
      query: ({ page }) => {
        return api.getList("users", {
          page: page.currentPage,
          pageSize: page.pageSize,
          include: ["roles"],
        });
      },
      // body 对象： { removeRecords }
      delete: ({ body }) => {
        return delApi(body.removeRecords);
      },
      // body 对象： { insertRecords, updateRecords, removeRecords, pendingRecords }
      save: ({ body }) => {
        return saveApi(body.insertRecords);
      },
    },
  },
  columns: [
    { type: "checkbox", width: 50 },
    { type: "seq", width: 70 },
    { field: "username", title: "用户名", editRender: { autofocus: ".vxe-input--inner" } },
    { field: "nickname", title: "昵称", editRender: {} },
    { field: "email", title: "邮箱", editRender: {} },
    { field: "phone", title: "手机号", editRender: {} },
    { field: "role", title: "角色", editRender: {} },
    { field: "status", title: "状态", showOverflow: true, editRender: {} },
    { field: "activeColumn", title: "操作", fixed: "right", width: 200, slots: { default: "activeColumn" } },
  ],
});

const gridEvents: VxeGridListeners = {
  toolbarButtonClick(params) {
    console.log(params.code);
  },
};

const handleToolbar = (code) => {
  switch (code) {
    case "add":
      console.log(code);
      break;
    default:
      {
        console.log(code);
      }
      break;
  }
};

const handleActiveColumn = (code, row) => {
  switch (code) {
    case "detail":
      console.log(code, row);
      break;
    case "edit":
      console.log(code, row);
      break;
    case "delete":
      console.log(code, row);
      break;
    default:
      {
        console.log(code);
      }
      break;
  }
};

// // 不使用 proxyConfig 的话，需要手动处理：
// async function loadData() {
//      loading.value = true;
//      try {
//        const data = await fetchApi(current, pageSize);
//        tableData.value = data.result;
//        total.value = data.page.total;
//      } finally {
//        loading.value = false;
//      }
//    }
</script>

<style scoped lang="scss"></style>
