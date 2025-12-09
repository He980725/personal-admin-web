<template>
  <div class="description-box">
    <span class="title">{{ props.label }}</span>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  label: String,
  value: String,
})
</script>
<style lang="scss" scoped>
.description-box {
  color: #606266;
  font-size: 14px;
  margin-bottom: 15px;
  display: flex;
  .title {
    font-weight: bold;
    flex-shrink: 0;
  }
  .content {
    flex: 1 auto;
  }
}
</style>
