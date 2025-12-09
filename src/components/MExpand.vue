<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item name="defaultName">
      <template #title>
        <div class="title-box" @click.stop @mousedown.stop>
          <slot name="header"></slot>
        </div>
      </template>

      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close-expand', 'update:modelValue'])
const activeNames = ref<Array<string>>(props.modelValue ? ['defaultName'] : [])

watch(
  () => props.modelValue,
  (newVal) => {
    activeNames.value = newVal ? ['defaultName'] : []
  },
)

const handleChange = (val: Array<string>) => {
  activeNames.value = val
  emit('update:modelValue', val.length > 0)
  emit('close-expand', val)
}
</script>

<style lang="scss" scoped>
.el-collapse {
  width: 100%;
  :deep(.el-collapse-item__header) {
    padding: 0 !important;
    border-radius: 6px;
    border-bottom: 1px solid var(--el-collapse-border-color);
    transition: all var(--el-transition-duration);

    .el-collapse-item__title {
      margin-left: 10px;
      font-weight: 500;
      font-size: 16px;
    }

    .el-collapse-item__arrow {
      margin: 0 10px;
    }
    .title-box {
      cursor: default;
    }
  }
  :deep(.el-collapse-item__header.is-active) {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
}
</style>
