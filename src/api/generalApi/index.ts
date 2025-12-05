import service from '@/axios/index'

interface LoginParams {
  username: string
  password: string
}
export const login = (params: LoginParams) => {
  return service({
    method: 'post',
    url: `/auth/login`,
    data: params,
  })
}
export const logout = () => {
  return service({
    method: 'post',
    url: `/auth/logout`,
  })
}
