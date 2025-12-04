<template>
  <el-container style="height: 100vh; width: 100vw">
    <el-aside :class="{ collapsed: isCollapsedFlag }">
      <Aside ref="asideRef" />
    </el-aside>
    <el-container style="height: 100vh; display: flex; flex-direction: column">
      <el-header>
        <HeaderView @collapsedFn="isCollapsed" />
        <Breadcrumb />
      </el-header>

      <el-main>
        <el-scrollbar ref="scrollbarRef" class="scrollbar-container">
          <div class="container-box" ref="containerRef">
            <router-view :key="routerKey" v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
              </keep-alive>
              <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
            </router-view>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Aside from './components/AsideView.vue'
import Breadcrumb from './components/BreadcrumbView.vue'
import HeaderView from './components/HeaderView.vue'
import { useAccountStore } from '@/stores/account'
const accountStore = useAccountStore()
const router = useRouter()
const route = useRoute()
const scrollbarRef = ref()
const asideRef = ref()
const isCollapsedFlag = ref(false)
const fromRoute = ref()
const routerKey = ref()
// 路由切换时更新滚动条状态
watch(
  () => route.path,
  async () => {
    routerKey.value = accountStore.lastClickMenuKey
    await nextTick(() => {
      scrollbarRef.value?.update()
      const scrollWrap = scrollbarRef.value?.wrapRef
      if (scrollWrap) {
        scrollWrap.scrollTop = 0
      }
    })
  },
  { immediate: true },
)
router.afterEach((to, from) => {
  fromRoute.value = from
})
const isCollapsed = () => {
  console.log('侧边栏折叠状态改变')
  isCollapsedFlag.value = !isCollapsedFlag.value
  nextTick(() => {
    asideRef.value?.collapsedFn()
    scrollbarRef.value?.update()
  })
}
const containerRef = ref(null)
let observer: MutationObserver | null = null
onMounted(() => {
  if (containerRef.value) {
    observer = new MutationObserver(async () => {
      await nextTick()
      scrollbarRef.value?.update()
    })

    observer.observe(containerRef.value, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
<style lang="scss" scoped>
.el-aside {
  width: var(--layout-menu-width);
  height: 100vh;
  overflow-x: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &.collapsed {
    width: 64px !important;
  }
}
.el-header {
  height: var(--layout-header-height);
  line-height: 60px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 0 !important;
}
.el-main {
  flex: 1;
  overflow: hidden;
  margin: 0;
  padding: 13px 3px;
  background-color: #f0f2f5;
  height: calc(100vh - var(--layout-header-height));
  box-sizing: border-box;
}

.el-scrollbar__wrap {
  height: 100%;
  overflow-x: hidden;
}

.el-scrollbar {
  overflow: auto;
}
:deep(.el-scrollbar__view) {
  height: 100%;
}
.container-box {
  min-height: 100%;
  // background-color: white;
  margin: 0 10px;
}
</style>
