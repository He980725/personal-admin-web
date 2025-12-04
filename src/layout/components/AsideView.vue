<template>
  <div ref="menuBoxRef" id="aside-menu" :class="{ collapsed: iscollapaed }">
    <header @click="$route.path !== '/bot-manager' && $router.push('/bot-manager')">
      <div class="title-container">
        <h3 class="full-title">{{ asideTitle }}</h3>
      </div>
    </header>
    <el-scrollbar ref="scrollbarRef" style="height: calc(100vh - 60px)">
      <el-menu
        :default-active="activeMenu"
        router
        @select="handleMenuSelect"
        :collapse="iscollapaed"
        :collapse-transition="false"
        background-color="rgba(0, 0, 0, 0.2)"
        text-color="rgba(255, 255, 255, 0.65)"
      >
        <template v-for="(item, index) in menuList" :key="index">
          <el-sub-menu
            v-if="item.children.length > 0"
            :index="item.index"
            :disabled="item.disabled"
          >
            <template #title>
              <component :is="item.icon" style="width: 1em; height: 1em; margin-right: 8px" />
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item
              v-for="(child, cIndex) in item.children"
              :key="cIndex"
              :index="child.index"
              :disabled="child.disabled"
            >
              {{ child.label }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.index" :disabled="item.disabled">
            <component :is="item.icon" style="width: 1em; height: 1em; margin-right: 8px" />
            <template #title>{{ item.label }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useAccountStore } from '@/stores/account'
import { findItemInArray } from '@/utils/array'
import { useRoute } from 'vue-router'

const route = useRoute()
const accountStore = useAccountStore()
const menuList = computed(() => {
  return accountStore.getMenuList || []
})
const scrollbarRef = ref()
const menuBoxRef = ref()
const activeMenu = computed(() => {
  if (!menuList.value?.find((x) => x.index === route.path)) {
    const tempIndex = route.meta?.menuKey || route.path
    return tempIndex
  }
  return '/dashboard'
})
const iscollapaed = ref(false)
const asideTitle = ref('管理平台')
const collapsedFn = () => {
  iscollapaed.value = !iscollapaed.value
  asideTitle.value = iscollapaed.value ? 'Dipal' : 'Dipal管理平台'
}
const handleMenuSelect = async (key: string) => {
  const targetRoute = findItemInArray(menuList.value, 'index', key, 'children')

  if (targetRoute) {
    accountStore.addBreadcrumb({
      label: targetRoute.label!,
      path: targetRoute.index!,
      closable: true,
    })
    accountStore.lastClickMenuKey = `${Date.now()}`
  }
}

let observer: MutationObserver | null = null
onMounted(() => {
  if (menuBoxRef.value) {
    observer = new MutationObserver(async () => {
      await nextTick()
      scrollbarRef.value?.update()
    })

    observer.observe(menuBoxRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

defineExpose({
  collapsedFn,
})
</script>
<style lang="scss" scoped>
#aside-menu {
  width: var(--layout-menu-width);
  height: 100vh;
  background-color: var(--layout-background-color);
  background: url('@/assets/images/menu-bg.png') no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.collapsed {
    width: 64px !important;
  }

  .el-menu {
    border: none !important;
  }
  // 没有子菜单
  :deep(.el-menu-item.is-active) {
    background-color: rgb(24, 144, 255) !important;
    color: white !important;
  }
  :deep(.el-menu-item:not(.is-active):hover) {
    color: white;
  }
  // 有子菜单
  :deep(.el-sub-menu .el-menu-item.is-active) {
    background-color: rgb(24, 144, 255) !important;
    color: white !important;
  }
  :deep(.el-sub-menu__title:hover) {
    color: white !important;
    font-weight: 500 !important;
  }
  :deep(.el-sub-menu.is-active .el-sub-menu__title) {
    color: white !important;
    font-weight: 500 !important;
  }
  .el-submenu .el-submenu__children {
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    overflow: hidden;
    opacity: 1;
  }
  /* 折叠状态下子菜单的过渡效果 */
  .el-submenu .el-submenu__children:not(.is-disabled) {
    max-height: 0;
    transition:
      max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    opacity: 0;
  }

  /* 展开状态 */
  .el-submenu.is-opened .el-submenu__children:not(.is-disabled) {
    max-height: 1000px;
    opacity: 1;
  }

  /* 菜单项的过渡效果 */
  .el-menu-item,
  .el-submenu__title {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  header {
    width: 100%;
    display: flex;
    cursor: pointer;
    align-items: center;
    height: 60px;
    color: #ffffff;
    font-size: 20px;
    font-weight: 500;
    justify-content: center;
    img {
      width: 28px;
      height: 28px;
      margin-right: 8px;
    }
    h3 {
      color: #fff;
      font-size: 20px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      text-align: center;
    }
    // 标题动画容器：解决文字切换时的"跳动"问题
    .title-container {
      position: relative;
      width: auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    // 标题核心样式 + 过渡动画
    .full-title {
      margin: 0;
      color: #fff;
      font-size: 20px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      text-align: center;
      white-space: nowrap; // 防止标题换行
      // 关键：文字切换时的平滑过渡（覆盖内容变化的生硬感）
      transition:
        opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      // // 文字切换动画
      // transition:
      //   opacity 0.2s ease,
      //   transform 0.2s ease;
    }

    // 折叠状态下的标题微调（可选：优化短标题居中效果）
    &:has(#aside-menu.collapsed) .full-title {
      font-size: 18px; // 短标题略小，视觉更协调
    }
    // 文字切换时的过渡效果
    .full-title.transitioning {
      opacity: 0;
      transform: scale(0.65);
    }
  }
}
</style>
