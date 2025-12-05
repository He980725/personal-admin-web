import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus'
import router from '@/router'

//定义通用响应数据类型
interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
  timestamp?: string
}
// 扩展AxiosResponse，指定data为ApiResponse类型
type CustomAxiosResponse<T = unknown> = AxiosResponse<ApiResponse<T>>

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean
}

// 加载状态管理
let loadingInstance: LoadingInstance | null = null
let requestCount: number = 0

const showLoading = () => {
  if (requestCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.1)',
    })
  }
  requestCount++
}

const hideLoading = () => {
  requestCount--
  if (requestCount === 0) {
    loadingInstance?.close()
  }
}

//创建Axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: CustomInternalAxiosRequestConfig): CustomInternalAxiosRequestConfig => {
    if (config.showLoading !== false) {
      showLoading()
    }
    return config
  },
  (error: AxiosError) => {
    hideLoading()
    ElMessage.error('请求参数错误')
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: CustomAxiosResponse): CustomAxiosResponse => {
    hideLoading()

    const { data } = response
    const { code, msg } = data

    // TODO 自定义业务逻辑错误处理
    if (code !== 200) {
      // 未登录或  失效
      if (code === 401) {
        router.push('/login')
        ElMessage.error('登录已过期，请重新登录')
      } else {
        ElMessage.error(msg || '操作失败')
      }
    }

    return response
  },
  (error: AxiosError) => {
    hideLoading()

    let errorMsg = '网络异常，请稍后重试'
    if (error.response) {
      errorMsg = error.message || errorMsg
    } else if (error.message.includes('timeout')) {
      errorMsg = '请求超时'
    }

    ElMessage.error(errorMsg)
    return Promise.reject(error)
  },
)

export default service
