import service from '@/axios/index'

interface LoginParams {
  username: string
  password: string
}
export const login = async (params: LoginParams) => {
  const res = await service({
    method: 'post',
    url: `/auth/login`,
    data: params,
  })
  return res.data
}
export const logout = async () => {
  const res = await service({
    method: 'post',
    url: `/auth/logout`,
  })
  return res.data
}
export const getMenuOption = async () => {
  const res = await service({
    method: 'get',
    url: `/route/tree`,
  })
  return res.data
}
