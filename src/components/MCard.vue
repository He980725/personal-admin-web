<template>
  <el-card
    :class="[
      'custom-card',
      props.cardType,
      { 'no-shadow': !props.showShadow, 'no-border': !props.bordered },
    ]"
    :shadow="props.showShadow ? props.shadowType : 'never'"
    :body-style="props.bodyStyle"
    :style="props.customStyle"
  >
    <!-- 卡片头部 -->
    <template #header v-if="props.showHeader">
      <div class="card-header flex">
        <slot name="header"></slot>
      </div>
    </template>

    <!-- 卡片主体内容 -->
    <div class="card-body">
      <slot></slot>
    </div>

    <!-- 卡片底部 -->
    <template #footer v-if="props.showFooter">
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
// 定义卡片的属性
const props = defineProps({
  // 是否显示头部
  showHeader: {
    type: Boolean,
    default: false,
  },

  // 是否显示底部
  showFooter: {
    type: Boolean,
    default: false,
  },

  // 是否显示阴影
  showShadow: {
    type: Boolean,
    default: false,
  },

  // 阴影类型
  shadowType: {
    type: String as () => 'always' | 'hover' | 'never',
    default: 'hover',
  },

  // 卡片类型，用于自定义样式
  cardType: {
    type: String,
    default: '',
  },

  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({}),
  },

  // 卡片内容样式
  bodyStyle: {
    type: Object,
    default: () => ({}),
  },

  // 是否显示边框
  bordered: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.custom-card {
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 6px;
}
.no-border {
  border: none;
}

/* 头部样式 */
:deep(.el-card__header) {
  padding: 0 10px;
}
.card-header {
  padding: 5px 0;
}

.header-title {
  font-weight: 500;
}

.title-text {
  margin: 0;
  font-size: 16px;
  line-height: 1;
}
:deep(.el-card__body) {
  padding: 0;
}

/* 主体内容样式 */
.card-body {
  padding: 12px;
}

/* 底部样式 */
:deep(.el-card__footer) {
  padding: 0 10px;
}
.card-footer {
  padding: 5px 0;
}

/* 预设卡片类型样式 */
.custom-card.success {
  border-left: 3px solid #52c41a;
}

.custom-card.warning {
  border-left: 3px solid #faad14;
}

.custom-card.danger {
  border-left: 3px solid #ff4d4f;
}

.custom-card.info {
  border-left: 3px solid #1890ff;
}
</style>
