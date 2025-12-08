import { defineStore } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import Token from '@/utils/token'
import { login, logout, getMenuOption } from '@/api/generalApi'
import type { MenuTree } from '@/axios/responseType'

interface UserInfo {
  id: string
  name: string
  accountNum: string
}

interface BreadcrumbItem {
  label: string
  path: string
  closable: boolean
  name?: string
}
interface MetaType {
  alwaysShow: boolean
  hidden: boolean
  icon: string
  keepAlive: boolean
  title: string
}

interface PermissionMenu {
  id?: string
  label?: string
  path: string
  routeType: number
  status: number
  children: PermissionMenu[]
  perm?: string
  index?: string
  disabled?: boolean
  icon?: string
  meta: MetaType
}

interface LoginParams {
  username: string
  password: string
}

interface InitData {
  id: string
  username: string
}

export const useAccountStore = defineStore('user', {
  state: (): {
    userInfo: UserInfo
    breadcrumbRecord: BreadcrumbItem[]
    permissionList: PermissionMenu[]
    lastClickMenuKey: string | null
  } => ({
    userInfo: {
      id: '',
      name: '',
      accountNum: '',
    },
    breadcrumbRecord: [{ label: '首页', path: '/dashboard', closable: false }],
    permissionList: [],
    lastClickMenuKey: null,
  }),

  getters: {
    getbreadcrumbRecord(state): BreadcrumbItem[] {
      return state.breadcrumbRecord
    },
    getUserInfo(state): UserInfo {
      return state.userInfo
    },
    getMenuList(state): PermissionMenu[] {
      const filterMenuFn = (node?: MenuTree[]): PermissionMenu[] => {
        return (
          node
            ?.filter((item) => item.status === 1)
            .map((item) => ({
              ...item,
              id: `${item.id}`,
              children: item.children.length > 0 ? filterMenuFn(item.children) : [],
              index: item.path,
              label: item.name,
            })) || []
        )
      }
      return filterMenuFn(state.permissionList)
    },
    currentIsReadonly(): boolean {
      return false
    },
  },

  actions: {
    async login(userInfo: LoginParams): Promise<boolean> {
      const params = { username: userInfo.username, password: userInfo.password }
      const dataInfo: InitData = {
        id: '1',
        username: params.username,
      }
      const { data } = await login(params)
      if (data.code === 200) {
        this.init(dataInfo)
        return true
      }
      return false
    },

    async logout(): Promise<boolean> {
      const res = await logout()

      if (res) {
        this.userInfo = { id: '', name: '', accountNum: '' }
        this.breadcrumbRecord = [{ label: '首页', path: '/dashboard', closable: false }]
        this.permissionList = []
        Token.remove()
        return true
      }
      return false
    },

    init(dataInfo: InitData): void {
      if (dataInfo) {
        this.userInfo.id = dataInfo.id
        this.userInfo.name = dataInfo.username
        this.userInfo.accountNum = dataInfo.username
      }
    },

    addBreadcrumb(tab: BreadcrumbItem): void {
      const exists = this.breadcrumbRecord.find((item: BreadcrumbItem) => item.path === tab.path)
      if (!exists) {
        this.breadcrumbRecord.push(tab)
      }
    },

    delBreadcrumb(tab: BreadcrumbItem): void {
      this.breadcrumbRecord = this.breadcrumbRecord.filter(
        (item: BreadcrumbItem) => item.name !== tab.name,
      )
    },
    async getRouterPermissionList(): Promise<void> {
      const res = await getMenuOption()
      console.log(res)

      this.permissionList = res.data?.map((x: MenuTree) => {
        return {
          ...x,
          label: x.name,
          index: x.path,
        }
      })
    },

    hasRouterPermission(path: string): boolean {
      if (this.permissionList.length === 0) {
        return false
      }
      const pathSegments = path.split('/').filter((segment) => segment)
      return (
        pathSegments.length > 0 &&
        this.permissionList.some((item: PermissionMenu) => item.path === `/${pathSegments[0]}`)
      )
    },

    hasPagePermission(path: string): boolean {
      const tempMenu: PermissionMenu[] = []
      const filterMenu = (node?: PermissionMenu[]): void => {
        node?.forEach((item) => {
          if (item.status === 1) {
            if (item.path === path) {
              tempMenu.push(...(item.children || []))
            } else if (item.children?.length > 0) {
              filterMenu(item.children)
            }
          }
        })
      }
      filterMenu(this.permissionList)
      let readonly = true
      if (tempMenu.length > 0) {
        readonly = !tempMenu.some((item) => item.perm?.endsWith('rw'))
      }
      return readonly
    },
  },

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userInfo', 'breadcrumbRecord'],
  } as PersistenceOptions,
})
