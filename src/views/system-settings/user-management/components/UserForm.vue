<template>
  <vxe-form
    ref="formRef"
    :data="formData"
    :items="formItems"
    :rules="formRules"
    :disabled="type === 'view'"
  >
    <template #footer>
      <template v-if="type !== 'view'">
        <vxe-button status="primary" @click="handleSubmit">确定</vxe-button>
        <vxe-button @click="handleCancel">取消</vxe-button>
      </template>
    </template>
  </vxe-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api/modules/general'

const props = defineProps({
  type: String,
  data: Object
})

const emit = defineEmits(['submit'])

const formData = ref({
  username: '',
  nickname: '',
  email: '',
  status: 1,
  roleIds: []
})

const formItems = [
  { field: 'username', title: '用户名', itemRender: { name: 'input' } },
  { field: 'nickname', title: '昵称', itemRender: { name: 'input' } },
  { field: 'email', title: '邮箱', itemRender: { name: 'input' } },
  { field: 'status', title: '状态', itemRender: { name: 'select', options: [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 }
  ] } },
  { field: 'roleIds', title: '角色', itemRender: { name: 'select', options: [], multiple: true } }
]

const formRules = {
  username: [{ required: true, message: '请输入用户名' }],
  email: [{ required: true, message: '请输入邮箱' }]
}

const handleSubmit = async () => {
  try {
    if (props.type === 'add') {
      await api.create('users', formData.value)
    } else if (props.type === 'edit') {
      await api.update('users', { ...formData.value, id: props.data.id })
    }
    emit('submit')
  } catch (err) {
    console.error(err)
  }
}

const handleCancel = () => {
  formData.value = {
    username: '',
    nickname: '',
    email: '',
    status: 1,
    roleIds: []
  }
}

onMounted(() => {
  if (props.data) {
    formData.value = { ...props.data }
  }
})
</script>