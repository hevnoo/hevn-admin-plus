<template>
  <div class="search-form">
    <vxe-form :data="formData" :items="formItems">
      <template #btns>
        <vxe-button status="primary" @click="handleSearch">搜索</vxe-button>
        <vxe-button @click="handleReset">重置</vxe-button>
      </template>
    </vxe-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['search', 'reset'])

const formData = ref({
  username: '',
  email: '',
  status: ''
})

const formItems = [
  { field: 'username', title: '用户名', itemRender: { name: 'input' } },
  { field: 'email', title: '邮箱', itemRender: { name: 'input' } },
  { field: 'status', title: '状态', itemRender: { name: 'select', options: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ] } },
  { span: 24, align: 'center', itemRender: { name: '$buttons', children: [
    { props: { type: 'submit', content: '搜索', status: 'primary' }, events: { click: handleSearch } },
    { props: { type: 'reset', content: '重置' }, events: { click: handleReset } }
  ] } }
]

function handleSearch (){
  emit('search', formData.value)
}

function handleReset () {
  formData.value = {
    username: '',
    email: '',
    status: ''
  }
  emit('reset')
}

defineExpose({
  formData
})
</script>