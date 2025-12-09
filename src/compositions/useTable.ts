import { ref, reactive, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { dateFormatter } from '@/utils/formatter'

// 定义表格列的类型（适配 Element Plus TableColumn 核心属性）
export interface TableColumn {
  // 基础属性（可根据你的业务扩展）
  prop: string
  label: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
  // 自定义日期格式化属性
  dateFormat?: string
  // 表格列格式化函数（Element Plus 标准签名）
  formatter?: (
    row: Record<string, unknown>,
    column: TableColumn,
    cellValue: string,
  ) => string | number | null
  // 其他自定义属性
  [key: string]: unknown
}

// 定义表格配置的核心类型
export interface TableConfig {
  // 表格数据
  data: Record<string, unknown>[]
  // 加载状态
  loading: boolean
  // 是否显示边框
  border: boolean
  // 是否显示选择框
  showSelection: boolean
  // 是否保留选择状态
  reserveSelection: boolean
  // 是否显示序号列
  showIndex: boolean
  // 序号列标题
  indexLabel: string
  // 序号生成方法
  indexMethod: (index: number) => number
  // 是否显示操作列
  showActionColumn: boolean
  // 操作列标题
  actionColumnLabel: string
  // 操作列宽度
  actionColumnWidth: number | string
  // 默认操作项
  defaultActions: ('edit' | 'delete' | string)[]
  // 是否显示分页
  showPagination: boolean
  // 分页布局
  paginationLayout: string
  // 分页对齐方式
  paginationAlign: 'left' | 'center' | 'right'
  // 每页条数
  pageSize: number
  // 总条数
  total: number
  // 可选每页条数
  pageSizes: number[]
  // 表格列配置
  columns: TableColumn[]
  //属性数据 rowKey
  rowKey?: string
}

/**
 * 表格组合式函数
 * @param params 基础配置参数（优先级低于 options）
 * @param options 覆盖配置参数（优先级更高）
 * @returns 响应式的表格配置对象
 */
export function useTable(
  params: Partial<TableConfig> = {},
  options: Partial<TableConfig> = {},
): TableConfig & {
  columns: TableColumn[] // 覆盖原有 columns 的类型，适配 computed 的 getter/setter
} {
  // 初始化列配置，默认空数组
  const initialColumns: TableColumn[] = params.columns || []
  const columns = ref<TableColumn[]>(initialColumns)

  // 计算属性：处理列的日期格式化
  const columnsComputed: ComputedRef<TableColumn[]> = computed(() => {
    return columns.value.map((item) => {
      const tempCol: TableColumn = {
        ...item,
      }

      // 如果配置了日期格式化，添加 formatter 函数
      if (item.dateFormat) {
        tempCol.formatter = (row, column, cellValue) => {
          if (!cellValue) return '-' // 空值显示占位符
          // 假设 dateFormatter 类型为 (date: any, format: string) => string
          return dateFormatter(cellValue, item.dateFormat!)
        }
      }

      return tempCol
    })
  })

  // 表格默认配置
  const tableConfig: TableConfig = {
    data: [],
    loading: true,
    border: true,
    showSelection: false,
    reserveSelection: false,
    showIndex: false,
    indexLabel: '序号',
    indexMethod: (index) => index + 1,
    showActionColumn: false,
    actionColumnLabel: '操作',
    actionColumnWidth: 200,
    defaultActions: ['edit', 'delete'],
    showPagination: true,
    paginationLayout: 'total, sizes, prev, pager, next, jumper',
    paginationAlign: 'right',
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 50, 100],
    // 合并参数（优先级：options > params > 默认值）
    ...params,
    ...options,
    // 列配置单独处理，避免覆盖 computed 逻辑
    columns: initialColumns,
  }

  // 创建响应式表格对象，自定义 columns 的 getter/setter
  const table = reactive<
    TableConfig & {
      columns: TableColumn[]
    }
  >({
    ...tableConfig,
    get columns() {
      return columnsComputed.value
    },
    set columns(val) {
      columns.value = val
    },
  })

  // 初始化列配置（确保首次赋值生效）
  if (initialColumns.length > 0) {
    table.columns = initialColumns
  }

  return table
}
