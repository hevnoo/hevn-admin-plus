<template>
  <vxe-modal
    v-model="showDialog"
    :title="dialogTitle"
    :width="600"
    :mask-closable="false"
    :show-footer="type !== 'view'"
    @close="handleClose"
  >
    <user-form
      ref="formRef"
      :type="type"
      :data="data"
      @submit="handleSubmit"
    />
  </vxe-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UserForm from './UserForm.vue'
import { useMessage } from '@/hooks/useMessage'

const props = defineProps({
  show: Boolean,
  type: String,
  data: Object
})

const emit = defineEmits(['update:show', 'success'])
const { message } = useMessage()

const showDialog = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const dialogTitle = computed(() => {
  const titles = {
    add: '新增用户',
    edit: '编辑用户',
    view: '用户详情'
  }
  return titles[props.type]
})

const handleClose = () => {
  showDialog.value = false
}

const handleSubmit = async () => {
  message.success('操作成功')
  handleClose()
  emit('success')
}
</script>