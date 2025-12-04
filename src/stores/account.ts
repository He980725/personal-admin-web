import { defineStore } from 'pinia'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import Token from '@/utils/token'

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

interface PermissionMenu {
  id?: string
  label?: string
  path: string
  type: string
  children: PermissionMenu[]
  perm?: string
  index?: string
  disabled?: boolean
  icon?: string
}

interface LoginParams {
  username: string
  password: string
}

interface InitData {
  id: string
  username: string
  permissionLists: PermissionMenu[]
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
      const filterMenuFn = (node?: PermissionMenu[]): PermissionMenu[] => {
        return (
          node
            ?.filter((item) => item.type === '1')
            .map((item) => ({
              ...item,
              children: item.children ? filterMenuFn(item.children) : [],
              index: item.path,
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
        permissionLists: [
          {
            id: '1',
            label: '主页管理',
            path: '/dashboard',
            type: '1',
            children: [
              {
                id: '2',
                label: '数据看板',
                path: '/dashboard/home',
                type: '1',
                children: [],
                perm: '',
                index: '/dashboard/home',
                disabled: false,
                icon: '',
              },
            ],
            perm: '',
            index: '/dashboard',
            disabled: false,
            icon: '',
          },
        ],
      }
      this.init(dataInfo)
      const tokenInfo = { token: `${userInfo.username} - ${Date.now()}` }
      Token.set(tokenInfo)
      return !!params
    },

    async logout(): Promise<boolean> {
      const res = { code: 1 } // 临时模拟接口返回，实际替换为真实请求

      if (res.code === 1) {
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
        this.permissionList = dataInfo.permissionLists
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
          if (item.type === '1') {
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
