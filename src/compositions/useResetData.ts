import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * @template T - 初始化函数返回值的类型
 * @param initFunction - 无参数的初始化函数，返回需要重置的初始数据
 * @returns 包含响应式数据 searchData 和重置方法 reset 的对象
 */
export function useResetData<T>(initFunction: () => T) {
  const searchData: Ref<T | null> = ref(null)
  const reset = (): void => {
    searchData.value = initFunction()
  }
  reset()
  return {
    searchData,
    reset,
  }
}
