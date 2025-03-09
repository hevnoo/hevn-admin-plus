<template>
  <div class="user-management">
    <!-- 搜索表单组件 -->
    <SearchForm ref="searchFormRef" @search="handleSearch" @reset="handleReset" />

    <!-- 表格部分 -->
    <vxe-grid
      ref="xGrid"
      v-bind="gridOptions"
      v-on="gridEvents"
      :data="tableData"
      :loading="loading"
      @page-change="handlePageChange"
    >
      <!-- 工具栏 -->
      <template #toolbar_buttons>
        <vxe-button status="primary" @click="handleAddDialog">新增用户</vxe-button>
        <vxe-button status="danger" :disabled="!selectedRows.length" @click="handleBatchDelete"
          >批量删除</vxe-button
        >
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <vxe-button mode="text" status="primary" @click="handleViewDialog(row)">详情</vxe-button>
        <vxe-button mode="text" status="primary" @click="handleEditDialog(row)">编辑</vxe-button>
        <vxe-button mode="text" status="error" @click="handleDelete(row)">删除</vxe-button>
      </template>

      <!-- column -->
      <template #roles="{ row }">
        <span style="color: #67c23a">
          <!-- white-space: pre-line -->
          {{ row.roles.map((role) => role.name).join(",\n") }}
        </span>
      </template>
      <template #avatar="{ row }">
        <BaseImage :url="SERVER_URL + row.avatar" :srcList="[`${SERVER_URL}${row.avatar}`]" :align="'left'" />
      </template>
    </vxe-grid>

    <!-- 弹窗容器 -->
    <FormDialog
      v-model:showFormDialog="dialogConfig.show"
      :type="dialogConfig.type"
      :rowData="dialogConfig.data"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { api } from "@/api";
import { SearchForm, FormDialog } from "./components";
import { BaseImage } from "@/components/basic";
import type { VxeGridInstance } from "vxe-table";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { SERVER_URL } from "@/config";

const xGrid = ref<VxeGridInstance>();
const loading = ref(false);
const tableData = ref([]);
const selectedRows = ref([]);

// 弹窗配置
const dialogConfig = reactive<any>({
  show: false,
  type: "", // add, edit, view
  data: null,
});
const cellRenders = {
  // avatarUrlCellRender: reactive<any>({
  //   name: "VxeImage",
  //   props: {
  //     // circle: true,
  //     width: 36,
  //     height: 36,
  //     fit: "cover",
  //     src: ({ row }) => {
  //       return SERVER_URL + row.avatar;
  //     },
  //   },
  // }),
  statusCellRender: reactive<any>({
    name: "VxeSwitch",
    props: {
      openLabel: "", //启用
      closeLabel: "", //禁用
      activeValue: true,
      inactiveValue: false,
    },
    events: {
      change: async ({ row }) => {
        try {
          await api.update("users", row.id, { status: row.status });
          // 更新成功提示
        } catch (error) {
          // 处理错误
          row.status = !row.status; // 如果失败，回滚状态
        }
      },
    },
  }),
};
// 表格配置
const gridOptions = reactive({
  border: false,
  stripe: true,
  loading: true,
  showOverflow: true,
  // height: 500,
  // size: "medium", // mini, small, medium, large
  columnConfig: {
    resizable: true,
    // align: "center",
  },
  rowConfig: {
    isHover: true,
  },
  checkboxConfig: {
    checkField: "checked",
    // labelField: 'id',
    highlight: true,
    range: true, // 是否支持范围选择
    checkMethod: ({ row }) => {
      return !row.isSystem; // 可选择的校验方法，根据需要调整
    },
  },
  pagerConfig: {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
    // layouts: ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']
  },
  toolbarConfig: {
    refresh: true,
    export: true,
    zoom: true,
    custom: true,
    slots: {
      buttons: "toolbar_buttons",
    },
  },
  columns: [
    { type: "checkbox", width: 50 },
    { type: "seq", width: 60, align: "left" },
    { field: "username", title: "用户名" },
    { field: "nickname", title: "昵称" },
    { field: "email", title: "邮箱" },
    { field: "phone", title: "手机号" },
    {
      field: "avatar",
      title: "头像",
      // cellRender: cellRenders.avatarUrlCellRender,
      slots: { default: "avatar" },
    },
    {
      field: "roles",
      title: "角色",
      slots: { default: "roles" },
    },
    {
      field: "status",
      title: "状态",
      width: 100,
      cellRender: cellRenders.statusCellRender,
    },
    {
      field: "createtime",
      title: "创建时间",
      formatter: ({ cellValue }) => {
        if (!cellValue) return "--";
        return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      field: "operation",
      title: "操作",
      fixed: "right",
      width: 200,
      slots: { default: "operation" },
    },
  ],
});

// 在gridOptions中添加事件监听
const gridEvents = {
  "checkbox-change": handleSelectionChange,
  "checkbox-all": handleSelectionChange,
};

// 加载数据
const loadData = async (params: any = {}) => {
  loading.value = true;
  try {
    const res = await api.getList("users", {
      where: {
        username: { contains: params.username },
        email: { contains: params.email },
        status: params.status,
      },
      page: params.page,
      pageSize: params.pageSize,
      include: ["roles"],
    });

    tableData.value = Array.isArray(res.data.data) ? res.data.data : [];

    // 如果需要处理分页
    if (xGrid.value) {
      gridOptions.pagerConfig.total = res.data.total || 0;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// 搜索处理
function handleSearch(formData) {
  loadData(formData);
}

const handleReset = () => {
  loadData();
};

// 分页处理
const handlePageChange = (params) => {
  gridOptions.pagerConfig.currentPage = params.currentPage;
  gridOptions.pagerConfig.pageSize = params.pageSize;
  loadData({ page: params.currentPage, pageSize: params.pageSize });
};

// 新增
const handleAddDialog = () => {
  dialogConfig.type = "add";
  dialogConfig.data = null;
  dialogConfig.show = true;
};

// 编辑
const handleEditDialog = (row) => {
  dialogConfig.type = "edit";
  dialogConfig.data = row;
  dialogConfig.show = true;
};

// 查看
const handleViewDialog = (row) => {
  dialogConfig.type = "view";
  dialogConfig.data = row;
  dialogConfig.show = true;
};

// 删除
const handleDelete = async (row) => {
  try {
    ElMessageBox.confirm("确认要删除吗？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const res = await api.delete("users", { id: row.id });
        if (res.data.code === 200) {
          loadData();
          ElMessage({
            message: "删除成功",
            type: "success",
            plain: true,
          });
        } else {
          ElMessage.error("删除失败");
        }
      })
      .catch(() => {});
  } catch (err) {
    console.error(err);
  }
};

// 批量删除
const handleBatchDelete = async () => {
  try {
    ElMessageBox.confirm("确认要删除吗？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const ids = selectedRows.value.map((row: any) => row.id);
        const res = await api.delete("users", ids);
        if (res.data.code === 200) {
          loadData();
          ElMessage({
            message: "批量删除成功",
            type: "success",
            plain: true,
          });
        } else {
          ElMessage.error("批量删除失败");
        }
      })
      .catch(() => {});
  } catch (err) {
    console.error(err);
  }
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  loadData();
};

// 添加选择行事件处理
function handleSelectionChange({ checked, records }) {
  selectedRows.value = records;
}

// 初始化
loadData();
</script>

<style lang="scss">
// 选中行高亮样式
.vxe-table--render-default .vxe-body--row.row--checked {
  background-color: rgba(64, 158, 255, 0.1);
  &:hover {
    background-color: rgba(64, 158, 255, 0.1);
  }
}
</style>
