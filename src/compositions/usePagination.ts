import { ref } from 'vue'
export function usePagination(fetchApi = () => {}) {
  const page = ref<number>(1)
  const size = ref<number>(10)
  const sort = ref<Array<object>[]>([])

  const handelPageChange = async (val: number) => {
    page.value = val
    await fetchApi()
  }
  const handelPageSizeChange = async (val: number) => {
    size.value = val
    await fetchApi()
  }
  const handelSortChange = async (val: Array<object>[]) => {
    sort.value = val || []
    await fetchApi()
  }

  const getPaginationParams = () => {
    return {
      page: page.value,
      size: size.value,
      sort: sort.value,
    }
  }

  return {
    page,
    size,
    sort,
    handelPageChange,
    handelPageSizeChange,
    handelSortChange,
    getPaginationParams,
  }
}
