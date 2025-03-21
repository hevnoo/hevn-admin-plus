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
        <vxe-button status="primary" @click="handleAddDialog">新增角色</vxe-button>
        <vxe-button status="danger" :disabled="!selectedRows.length" @click="handleBatchDelete"
          >批量删除</vxe-button
        >
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <!-- <vxe-button mode="text" status="primary" @click="handleViewDialog(row)">详情</vxe-button> -->
        <vxe-button mode="text" status="primary" @click="handleMenuPermissionsDialog(row)"
          >菜单权限</vxe-button
        >
        <vxe-button mode="text" status="primary" @click="handleEditDialog(row)">编辑</vxe-button>
        <vxe-button mode="text" status="error" @click="handleDelete(row)">删除</vxe-button>
      </template>

      <!-- column -->
      <template #buttons="{ row }">
        <el-tag
          v-for="button in row.buttons"
          :key="button.id"
          :type="
            button.value === 'add'
              ? 'success'
              : button.value === 'edit'
              ? 'warning'
              : button.value === 'delete'
              ? 'danger'
              : 'primary'
          "
          size="large"
          style="margin-right: 10px"
          >{{ button.name }}</el-tag
        >
      </template>
    </vxe-grid>

    <!-- 弹窗容器 -->
    <FormDialog
      v-model:showFormDialog="dialogConfig.show"
      :type="dialogConfig.type"
      :rowData="dialogConfig.data"
      @success="handleDialogSuccess"
    />
    <MenuPermissionsDialog
      v-model:showMenuPermissionsDialog="dialogConfig.menuPermissionsConfig.show"
      :rowData="dialogConfig.menuPermissionsConfig.data"
      :menuOptions="dialogConfig.menuPermissionsConfig.menuOptions"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { api } from "@/api";
import { SearchForm, FormDialog, MenuPermissionsDialog } from "./components";
import type { VxeGridInstance } from "vxe-table";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import { arrayToTree } from "@/utils";

const xGrid = ref<VxeGridInstance>();
const loading = ref(false);
const tableData = ref([]);
const selectedRows = ref([]);

// 弹窗配置
const dialogConfig = reactive<any>({
  show: false,
  type: "", // add, edit, view
  data: null,
  menuPermissionsConfig: {
    show: false,
    data: null,
    menuOptions: [],
  },
});
const cellRenders = {
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
    { field: "name", title: "角色名称" },
    { field: "value", title: "角色值" },
    { field: "description", title: "描述" },
    {
      field: "buttons",
      title: "按钮",
      slots: { default: "buttons" },
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

const loadMenuOptions = async () => {
  const res = await api.getList("menu", {
    orderBy: [{ order: "asc" }, { createtime: "desc" }],
  });
  dialogConfig.menuPermissionsConfig.menuOptions = Array.isArray(res.data.data)
    ? arrayToTree(res.data.data)
    : [];
};

// 加载数据
const loadData = async (params: any = {}) => {
  loading.value = true;
  try {
    const res = await api.getList("roles", {
      where: {
        name: { contains: params.name },
        value: { contains: params.value },
      },
      page: params.page || gridOptions.pagerConfig.currentPage,
      pageSize: params.pageSize || gridOptions.pagerConfig.pageSize,
      include: ["buttons"],
    });

    tableData.value = Array.isArray(res.data.data) ? res.data.data : [];

    // 如果需要处理分页
    if (xGrid.value) {
      gridOptions.pagerConfig.total = res.data.total || 0;
    }

    // 加载菜单选项
    loadMenuOptions();
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

// 菜单权限
const handleMenuPermissionsDialog = (row) => {
  dialogConfig.menuPermissionsConfig.data = row;
  dialogConfig.menuPermissionsConfig.show = true;
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
        const res = await api.delete("roles", { id: row.id });
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
        const res = await api.delete("roles", ids);
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
