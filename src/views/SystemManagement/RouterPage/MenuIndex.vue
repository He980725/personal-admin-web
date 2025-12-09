<template>
  <m-page>
    <m-expand>
      <template #header>菜单管理</template>
      <el-form label-position="right" :model="searchData" size="default">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="菜单名称">
              <el-input v-model="searchData!.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-select v-model="searchData!.status" placeholder="请选择" clearable>
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="display: flex; justify-content: end">
            <el-button plain type="danger" icon="RefreshRight" @click="resetSearch">重置</el-button>
            <el-button plain type="primary" icon="Search" @click="getTableData">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </m-expand>
    <m-card showHeader>
      <!-- 操作按钮 -->
      <template #header>
        <div class="operation-buttons">
          <div class="left-button">
            <el-button plain type="primary" icon="Plus" @click="handleCreate"> 新建 </el-button>
          </div>
        </div>
      </template>
      <MTable v-bind="table" @edit="handleEdit" @delete="handleDelete">
        <template #statusSlot="scope">
          <span>{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
        </template>
      </MTable>
    </m-card>
  </m-page>

  <el-drawer
    :title="drawerTitle"
    v-model="isShowDrawer"
    destroy-on-close
    :close-on-click-modal="false"
    size="50%"
  >
    <EditMenu
      :parentMenuOption="parentMenuOption"
      @close-button="closeDialog"
      :id="editID"
      :type="modelType"
    ></EditMenu>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { MExpand, MPage, MTable, MCard } from '@/components'
import { useTable, useResetData } from '@/compositions/index'
import { getRouterList, deleteRouter } from '@/api/systemManagementApi/routerPageApi'
import EditMenu from './EditMenu.vue'
import { ElMessage } from 'element-plus'
import type { MenuTree } from '@/axios/responseType'
import { flatToTree } from '@/utils/array'

type ParentMenuOption = { label: string; value: number | string; children: ParentMenuOption[] }
const { reset: _reset, searchData } = useResetData(() => ({
  name: null,
  title: null,
  path: null,
  status: null,
  routeType: null,
  parentId: null,
}))
const resetSearch = async () => {
  _reset()
  await getTableData()
}
const columns = [
  {
    label: '菜单名称',
    prop: 'name',
  },
  {
    label: '排序',
    prop: 'order',
  },
  {
    label: '组件路径',
    prop: 'path',
  },
  {
    label: '状态',
    prop: 'status',
    slot: 'statusSlot',
  },
]
const tempTableData = ref<MenuTree[]>([])
const table = useTable({ columns }, { rowKey: 'id', border: false, showActionColumn: true })
const showAddMenuDialog = ref(false)
const isShowDrawer = ref(false)
const drawerTitle = ref('菜单编辑')
const editID = ref<number>(0)
const parentMenuOption = ref<ParentMenuOption[]>([
  { label: '主菜单', value: '0', children: <ParentMenuOption[]>[] },
])
const modelType = ref<string>('Add')

const handleCreate = () => {
  modelType.value = 'Add'
  drawerTitle.value = `新建菜单`
  editID.value = 0
  isShowDrawer.value = true
}
const handleEdit = (row: MenuTree | Record<string, unknown>) => {
  modelType.value = 'Edit'
  drawerTitle.value = `菜单编辑 - ${row?.name}`
  editID.value = ~~row.id!
  isShowDrawer.value = true
}
const handleDelete = async (row: MenuTree | Record<string, unknown>) => {
  const res = await deleteRouter({ id: ~~row.id! })
  if (res) {
    ElMessage.success('删除成功')
    await getTableData()
  }
}
const getTableData = async () => {
  const res = await getRouterList({
    name: searchData.value?.name || null,
    title: searchData.value?.title || null,
    path: searchData.value?.path || null,
    status: searchData.value?.status || null,
    routeType: searchData.value?.routeType || null,
    parentId: searchData.value?.parentId || null,
  })
  table.data = flatToTree(res.data, 'id', 'parentId')
  tempTableData.value = flatToTree(res.data, 'id', 'parentId')
  initOption()
}
const initOption = () => {
  function initItem(targetArr: MenuTree[], level = 1): ParentMenuOption[] {
    const tempArr: ParentMenuOption[] = []
    const tempLevel: number = --level

    targetArr.forEach((item) => {
      const option: ParentMenuOption = {
        label: item.name,
        value: item.id,
        children: <ParentMenuOption[]>[],
      }
      if (item?.children && item.children?.length > 0 && tempLevel >= 1) {
        option.children = initItem(item.children, tempLevel)
      }
      tempArr.push(option)
    })
    return tempArr
  }
  parentMenuOption.value = [{ label: '主菜单', value: 0, children: [] }]
  parentMenuOption.value.push(...initItem(tempTableData.value, 2))
}
const closeDialog = async () => {
  showAddMenuDialog.value = false
  isShowDrawer.value = false
  await getTableData()
}

onMounted(async () => {
  await getTableData()
})
</script>

<style lang="scss" scoped>
.operation-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
  .el-button {
    margin: 0;
  }
  .left-button,
  .right-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    :not(:first-child) {
      margin-left: 20px;
    }
  }
}
</style>
