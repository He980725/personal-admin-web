<template>
  <div
    class="my-page"
    :class="[
      props.direction === 'vertical' ? 'vertical' : 'horizontal',
      props.wrap ? 'wrap' : '',
      `size-${props.size}`,
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  direction: {
    type: String,
    default: 'vertical',
    validator: (val: string) => ['horizontal', 'vertical'].includes(val),
  },
  size: {
    type: String,
    default: 'default',
    validator: (val: string) => ['small', 'default', 'large'].includes(val) || val.includes('px'),
  },
  wrap: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="scss">
.my-page {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: var(--gap, 8px);
}

.horizontal {
  flex-direction: row;
}

.vertical {
  flex-direction: column;
}

.wrap {
  flex-wrap: wrap;
}

.size-small {
  --gap: 4px;
}

.size-default {
  --gap: 8px;
}

.size-large {
  --gap: 16px;
}

/* 处理自定义间距 */
:deep([size^='px']) {
  --gap: v-bind(size);
}
</style>
