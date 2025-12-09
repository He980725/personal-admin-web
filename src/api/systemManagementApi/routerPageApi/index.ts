import service from '@/axios/index'

type GetRouterListParams = {
  name: string | null
  title: string | null
  path: string | null
  status: string | null
  routeType: string | null
  parentId: number | null
}
type DeleteRouterParams = {
  id: number
}
type GetRouterDetail = {
  id: number
}
export type RouterItemParams = {
  id?: number | null
  parentId: number
  name: string
  path: string
  component: string | null
  redirect: string | null
  title: string | null
  icon: string | null
  sortOrder: number | null
  hidden: number | null
  keepAlive: number | null
  alwaysShow: number | null
  status: number | null
  routeType: number | null
  permission: string | null
}
export const getRouterList = async (params: GetRouterListParams) => {
  const res = await service({
    method: 'get',
    url: `/route/list`,
    params,
  })
  return res.data
}

export const deleteRouter = async (params: DeleteRouterParams) => {
  const res = await service({
    method: 'get',
    url: `/route/delete/${params.id}`,
  })
  return res.data
}

export const getRouterDetail = async (params: GetRouterDetail) => {
  const res = await service({
    method: 'get',
    url: `/route/${params.id}`,
  })
  return res.data
}
export const editRouter = async (params: RouterItemParams) => {
  const res = await service({
    method: 'post',
    url: `/route/update/${params.id}`,
    data: params,
  })
  return res.data
}
export const createRouter = async (params: RouterItemParams) => {
  const res = await service({
    method: 'post',
    url: `/route`,
    data: params,
  })
  return res.data
}
