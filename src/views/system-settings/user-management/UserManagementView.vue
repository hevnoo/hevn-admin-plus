<template>
  <div class="user-management">
    <!-- 搜索表单组件 -->
    <SearchForm
      ref="searchFormRef"
      @search="handleSearch"
      @reset="handleReset"
    />
    
    <!-- 表格部分 -->
    <vxe-grid
      ref="xGrid"
      v-bind="gridOptions"
      v-on="gridEvents"
      :data="tableData"
      :loading="loading"
    >
      <!-- 工具栏 -->
      <template #toolbar_buttons>
        <vxe-button status="primary" @click="handleAdd">新增用户</vxe-button>
        <vxe-button 
          status="danger" 
          :disabled="!selectedRows.length"
          @click="handleBatchDelete"
        >批量删除</vxe-button>
      </template>

      <!-- 操作列 -->
      <template #operation="{ row }">
        <vxe-button mode="text" status="primary" @click="handleView(row)">详情</vxe-button>
        <vxe-button mode="text" status="primary" @click="handleEdit(row)">编辑</vxe-button>
        <vxe-button mode="text" status="error"  @click="handleDelete(row)">删除</vxe-button>
      </template>
    </vxe-grid>

    <!-- 弹窗容器 -->
    <UserDialog
      v-model:show="dialogConfig.show"
      :type="dialogConfig.type"
      :data="dialogConfig.data"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { api } from '@/api'
import { SearchForm, UserDialog } from './components'
import type { VxeGridInstance } from 'vxe-table'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const xGrid = ref<VxeGridInstance>()
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])

// 弹窗配置
const dialogConfig = reactive({
  show: false,
  type: '',  // add, edit, view
  data: null
})

// 表格配置
const gridOptions = reactive({
  border: false,
  showOverflow: true,
  height: 500,
  columnConfig: {
    resizable: true
  },
  checkboxConfig: {
    checkField: 'checked',
    checkMethod: ({ row }) => {
      return !row.isSystem // 可选择的校验方法，根据需要调整
    }
  },
  pagerConfig: {
    total: 0,
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
      buttons: 'toolbar_buttons'
    }
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', width: 60 },
    { field: 'username', title: '用户名' },
    { field: 'nickname', title: '昵称' },
    { field: 'email', title: '邮箱' },
    { field: 'status', title: '状态' },
    { field: 'createtime', title: '创建时间',formatter: ({ cellValue }) => {
        if (!cellValue) return '--'
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } },
    { 
      field: 'operation',
      title: '操作',
      fixed: 'right',
      width: 200,
      slots: { default: 'operation' }
    }
  ]
})

// 在gridOptions中添加事件监听
const gridEvents = {
  'checkbox-change': handleSelectionChange,
  'checkbox-all': handleSelectionChange
}

// 加载数据
const loadData = async (params = {}) => {
  loading.value = true
  try {
    const res = await api.getList('users', {
      ...params,
      include: ['roles']
    })
    // 确保tableData是一个数组
    tableData.value = Array.isArray(res.data.data) ? res.data.data : []
    
    // 如果需要处理分页
    if (xGrid.value) {
      gridOptions.pagerConfig.total = res.data.total || 0
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 搜索处理
function handleSearch(formData){
  loadData(formData)
}

const handleReset = () => {
  loadData()
}

// 新增
const handleAdd = () => {
  dialogConfig.type = 'add'
  dialogConfig.data = null
  dialogConfig.show = true
}

// 编辑
const handleEdit = (row) => {
  dialogConfig.type = 'edit'
  dialogConfig.data = row
  dialogConfig.show = true
}

// 查看
const handleView = (row) => {
  dialogConfig.type = 'view'
  dialogConfig.data = row
  dialogConfig.show = true
}

// 删除
const handleDelete = async (row) => {
  try {
    await api.delete('users', { id: row.id })
    ElMessage({
    message: '删除成功',
    type: 'success',
    plain: true,
  })
    loadData()
  } catch (err) {
    console.error(err)
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    const ids = selectedRows.value.map(row => row.id)
    await api.delete('users', { ids })
    ElMessage({
    message: '批量删除成功',
    type: 'success',
    plain: true,
  })
    loadData()
  } catch (err) {
    console.error(err)
  }
}

// 弹窗成功回调
const handleDialogSuccess = () => {
  loadData()
}

// 添加选择行事件处理
function handleSelectionChange ({ checked, records }) {
  selectedRows.value = records
}

// 初始化
loadData()
</script>