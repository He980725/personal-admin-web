export type MenuTree = {
  id: number
  parentId: number
  name: string
  path: string
  component: string
  redirect: string
  meta: {
    title: string
    icon: string
    hidden: boolean
    keepAlive: boolean
    alwaysShow: boolean
  }
  sortOrder: number
  status: number
  routeType: number
  permission: string
  createTime: string
  updateTime: string
  children: MenuTree[]
}
