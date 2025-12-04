import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建 Pinia 实例
const store = createPinia()

// 安装持久化插件
store.use(piniaPluginPersistedstate)

export default store
