/**
 * 递归查找数组中的元素（支持嵌套子数组）
 * @param arr 要查找的数组（支持嵌套结构）
 * @param key 匹配的键名（null 表示直接匹配元素本身）
 * @param value 要匹配的值（与 key 对应，或直接匹配元素）
 * @param childKey 子数组的字段名（默认 'children'）
 * @returns 找到返回对应元素，未找到返回 null
 */
//
export function findItemInArray<T extends object, K extends keyof T = keyof T>(
  arr: T[] = [],
  key: K | null,
  value: T[keyof T] | string,
  childKey: K = 'children' as K,
): T | null {
  for (const item of arr) {
    if ((key && item[key] === value) || (!key && item === value)) {
      return item
    }
    if (Array.isArray(item[childKey]) && item[childKey] && item[childKey].length > 0) {
      const found = findItemInArray(item[childKey], key, value, childKey)
      if (found) return found
    }
  }

  return null
}
export function flatToTree<T extends object, K extends keyof T = keyof T>(
  flatArr: T[] = [],
  idKey: K = 'id' as K,
  parentKey: K = 'parentId' as K,
): T[] {
  if (!Array.isArray(flatArr)) return []
  type TreeItem = T & { children: TreeItem[] }
  const map = new Map<T[K], TreeItem>()
  const tree: TreeItem[] = []

  for (const node of flatArr) {
    const treeNode: TreeItem = {
      ...node,
      children: [],
    }
    map.set(treeNode[idKey], treeNode)
  }

  for (const node of flatArr) {
    const treeNode = map.get(node[idKey])!
    if (node[parentKey] && map.has(node[parentKey])) {
      const parentNode = map.get(node[parentKey])!
      parentNode.children.push(treeNode)
    } else {
      tree.push(treeNode)
    }
  }

  return tree
}
