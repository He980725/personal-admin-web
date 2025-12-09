<template>
  <div class="custom-table-container">
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="table"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      class="custom-table"
      :row-key="table.rowKey"
      :header-cell-style="headerStyle"
      :header-cell-class-name="
        (params: HeaderCellParams) => {
          setHeaderClass(params)
        }
      "
    >
      <!-- 复选框列 -->
      <el-table-column
        v-if="table.showSelection"
        type="selection"
        width="55"
        :reserve-selection="table.reserveSelection"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="table.showIndex"
        type="index"
        :label="table.indexLabel"
        :width="table.indexWidth"
        :index="table.indexMethod"
      />

      <!-- 动态列 -->
      <template v-for="column in table.columns" :key="column.prop || column.label">
        <el-table-column v-bind="column" :formatter="column.formatter || defaultFormatter">
          <template #default="scope" v-if="column.slot">
            <slot :name="column.slot" :scope="scope" :row="scope.row" :index="scope.index"></slot>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="table.showActionColumn && table.data?.length! > 0"
        :label="table.actionColumnLabel"
        :width="table.actionColumnWidth"
        fixed="right"
      >
        <template #default="scope">
          <slot name="action" v-bind="scope">
            <!-- 默认操作按钮 -->
            <el-button
              :disabled="scope.row.isHiddenAction"
              v-if="table.defaultActions!.includes('edit')"
              type="text"
              size="small"
              icon="Edit"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              :disabled="scope.row.isHiddenAction"
              v-if="table.defaultActions!.includes('delete')"
              type="text"
              size="small"
              icon="Delete"
              @click="handleDelete(scope.row)"
              :style="scope.row.isHiddenAction ? { color: '' } : { color: '#f56c6c' }"
            >
              删除
            </el-button>
            <el-dropdown
              v-if="table.defaultActions!.includes('more')"
              :disabled="scope.row.isHiddenAction"
            >
              <el-button type="text" size="small"> 更多 </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleMoreAction(scope.row, 'view')">
                    查看
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleMoreAction(scope.row, 'export')">
                    导出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div
      v-if="table.showPagination && table.total! > 0"
      class="table-pagination"
      :style="{ textAlign: table.paginationAlign }"
    >
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="table.pageSizes"
        :total="table.total"
        :layout="table.paginationLayout"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, useAttrs, type CSSProperties } from 'vue'
import { ElMessageBox, type TableInstance } from 'element-plus'

// 类型定义
interface TableColumn {
  prop?: string
  label?: string
  slot?: string
  formatter?: (
    row: Record<string, unknown>,
    column: TableColumn,
    cellValue: unknown,
    index: number,
  ) => string | number
  [key: string]: unknown
}

interface TableAttrs {
  showSelection?: boolean
  reserveSelection?: boolean
  showIndex?: boolean
  indexLabel?: string
  indexWidth?: number | string
  indexMethod?: (index: number) => number
  columns?: TableColumn[]
  showActionColumn?: boolean
  actionColumnLabel?: string
  actionColumnWidth?: number | string
  defaultActions?: string[]
  data?: Record<string, unknown>[]
  showPagination?: boolean
  total?: number
  paginationAlign?: 'left' | 'center' | 'right'
  pageSizes?: number[]
  paginationLayout?: string
  pageSize?: number
  [key: string]: unknown
}

interface SortChangeParams {
  prop: string
  order: 'ascending' | 'descending' | null
}

interface HeaderCellParams {
  column: TableColumn & { order?: string | null }
  columnIndex: number
}

const table = useAttrs() as TableAttrs

const currentPage = ref<number>(1)
const pageSize = ref<number>(0)
const sortField = new Map<string, string | null>()

const headerStyle = ref<CSSProperties>({
  fontSize: '15px',
})

const emit = defineEmits<{
  (e: 'selection-change', val: Record<string, unknown>[]): void
  (e: 'page-change', val: number): void
  (e: 'page-size-change', val: number): void
  (e: 'sort-change', val: string[]): void
  (e: 'refresh'): void
  (e: 'search'): void
  (e: 'edit', row: Record<string, unknown>): void
  (e: 'delete', row: Record<string, unknown>): void
  (e: 'more-action', row: Record<string, unknown>, action: string): void
}>()

const tableRef = ref<TableInstance | null>(null)

const handleSelectionChange = (val: Record<string, unknown>[]): void => {
  emit('selection-change', val)
}

const handlePageChange = (val: number): void => {
  currentPage.value = val
  emit('page-change', val)
}

const handlePageSizeChange = (val: number): void => {
  pageSize.value = val
  emit('page-size-change', val)
}

const handleSortChange = (val: SortChangeParams): void => {
  const hadProp = sortField.has(val.prop)
  if (hadProp && val.order === null) {
    sortField.delete(val.prop)
  }
  sortField.set(
    val.prop,
    val.order === 'ascending' ? 'asc' : val.order === 'descending' ? 'desc' : null,
  )
  const tempField: string[] = []
  sortField.forEach((value, key) => {
    if (value) {
      tempField.push(`${key},${value}`)
    }
  })

  emit('sort-change', tempField)
}

const handleEdit = (row: Record<string, unknown>): void => {
  emit('edit', row)
}

const handleDelete = (row: Record<string, unknown>): void => {
  ElMessageBox.confirm('当前操作会删除此条记录，是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      emit('delete', row)
    })
    .catch(() => {})
}

const handleMoreAction = (row: Record<string, unknown>, action: string): void => {
  emit('more-action', row, action)
}

const defaultFormatter = (
  row: Record<string, unknown>,
  column: TableColumn,
  cellValue: unknown,
): string | number | boolean => {
  // 处理空值
  if (cellValue === null || cellValue === undefined || cellValue === '') {
    return '-'
  }
  // 处理布尔值
  if (typeof cellValue === 'boolean') {
    return cellValue ? '是' : '否'
  }
  return cellValue as string | number | boolean
}

const initTable = (): void => {
  pageSize.value = table.pageSize ?? 10
}

const clearAllSort = (): void => {
  if (tableRef.value) {
    tableRef.value.clearSort()
    const headerCells = document.querySelectorAll('.el-table__header .is-sortable')
    headerCells.forEach((cell) => {
      // 移除升序/降序类名（这些类名控制图标显示）
      cell.classList.remove('ascending', 'descending')
    })
  }

  sortField.clear()
}

const clearAllSelection = (): void => {
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

function setHeaderClass(params: HeaderCellParams): void {
  if (sortField.has(params.column.property as string)) {
    const sortValue = sortField.get(params.column.property as string)
    params.column.order =
      sortValue === 'asc' ? 'ascending' : sortValue === 'desc' ? 'descending' : null
  }
}

const resetTable = (): void => {
  clearAllSort()
  clearAllSelection()
}

onMounted(() => {
  initTable()
})

defineExpose({
  getTableRef: (): TableInstance | null => tableRef.value,
  resetTable,
})
</script>

<style lang="scss" scoped>
.custom-table-container {
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  .el-table {
    :deep(.cell) {
      color: var(--color-text-primary) !important;
    }
  }
}

.table-action-bar {
  width: 100%;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: end;
}

.empty-state {
  margin: 40px 0;
  text-align: center;
}

.custom-table {
  width: 100%;
}
:deep(.el-table__cell.cell) {
  font-size: 25px;
}
</style>
