<template>
  <div class="scroll-wrapper">
    <el-scrollbar ref="scrollRef" @wheel.prevent="handleScroll">
      <div class="tab-box">
        <el-space wrap :size="5">
          <div
            class="tab"
            :class="{ 'tab-active': activeTab === tab.path }"
            v-for="(tab, tabIndex) in tabs"
            @click="handleClick(tab)"
            :key="tabIndex"
          >
            <div class="tab-point"></div>
            <div class="tab-label">{{ tab.label }}</div>
            <el-icon v-if="tab.closable" class="close-icon" @click.stop="closeTab(tabIndex)">
              <Close />
            </el-icon>
          </div>
        </el-space>
      </div>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useRoute, useRouter } from 'vue-router'
interface BreadcrumbItem {
  label: string
  path: string
  closable: boolean
  name?: string
}

const accountStore = useAccountStore()
const route = useRoute()
const router = useRouter()
const scrollRef = ref()
const tabs = computed<BreadcrumbItem[]>(() => {
  return accountStore.breadcrumbRecord
})
const activeTab = ref<string>('/home')
watchEffect(() => {
  activeTab.value = route.meta?.menuKey?.toString() || route.path
})
const closeTab = (index: number) => {
  if (index < tabs.value.length) {
    const targetTab = tabs.value[index]!
    tabs.value.splice(index, 1)
    if (tabs.value.length > 0 && activeTab.value === targetTab.path) {
      activeTab.value = tabs.value[tabs.value.length - 1]?.path || ''
    }
  }
}
const handleClick = (tab: BreadcrumbItem) => {
  accountStore.lastClickMenuKey = `${Date.now()}`
  router.push(tab.path)
}
const handleScroll = (e: WheelEvent) => {
  if (!scrollRef.value) return
  const scrollWrap = scrollRef.value.wrapRef
  const scrollStep = 60
  scrollWrap.scrollLeft += e.deltaY > 0 ? scrollStep : -scrollStep
}
</script>
<style scoped lang="scss">
.tab-box {
  height: 40px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  flex-shrink: 0;

  .el-space {
    display: flex;
    align-items: center;
    padding: 0 10px;
    flex-wrap: nowrap !important;
    flex-shrink: 0;
  }

  .tab {
    min-width: 30px;
    height: 22px;
    border: 1px solid #c0c4cc;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 2px;
    padding: 0 5px;
    margin: 5px 0;
    cursor: pointer;

    .tab-point {
      padding: 4px;
      border-radius: 50%;
      background-color: white;
      display: none;
    }
    .tab-label {
      display: flex;
      align-items: center;
      font-size: 12px;
      margin: 03px;
    }

    .el-icon {
      font-size: 12px;
      font-weight: bold;
      border-radius: 50%;
      padding: 3px;
    }
    .el-icon:hover {
      background-color: #c0c4cc;
    }
  }
  .tab-active {
    background-color: #409eff;
    color: white;

    .tab-point {
      display: block;
    }
  }
}
:deep(.el-scrollbar__wrap) {
  overflow-y: hidden !important;
}
:deep(.el-scrollbar__bar.is-vertical) {
  display: none !important;
}
:deep(.el-scrollbar__bar.is-horizontal) {
  height: 4px;
}
:deep(.el-scrollbar__thumb) {
  border-radius: 3px;
  transition: background-color 0.2s;
}
</style>
