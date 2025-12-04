<template>
  <header class="common-header">
    <div class="header-left">
      <!-- 折叠Icon -->

      <el-icon class="expand-icon" :class="{ 'is-expanded': !isExpand }" @click="expandFn">
        <fold />
      </el-icon>

      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧功能区 -->
    <div class="header-right">
      <!-- 用户信息 -->
      <el-dropdown placement="bottom-end" trigger="click">
        <div class="user-info" @click.stop>
          <el-avatar class="user-avatar">
            <img src="https://picsum.photos/id/1005/200/200" alt="用户头像" />
          </el-avatar>
          <span class="user-name">{{ userInfo.name }}</span>
          <el-icon class="arrow-icon">
            <arrow-down-bold />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="User">个人中心</el-dropdown-item>
            <el-dropdown-item icon="Setting" @click="showEditPasswordDialog"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item icon="Help">帮助中心</el-dropdown-item>
            <el-dropdown-item divided icon="SwitchButton" @click="handleLogout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
  <div>
    <el-dialog
      class="custom-password-dialog"
      title="修改密码"
      v-model="editPasswordDialog"
      width="330px"
      :close-on-click-modal="false"
      :append-to-body="false"
      @close="resetForm()"
    >
      <el-form :model="editPassForm" :rules="passRules" ref="ruleFormRef">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="editPassForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldPass">
          <el-input
            v-model="editPassForm.oldPass"
            placeholder="请输入原密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPass">
          <el-input
            v-model="editPassForm.newPass"
            placeholder="请输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPass">
          <el-input
            v-model="editPassForm.confirmPass"
            placeholder="请再次输入新密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="form-actions">
          <el-button @click="resetForm()">取消</el-button>
          <el-button type="primary" @click="submitForm()">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useAccountStore } from '@/stores/account'
// import { adminEditPassword } from '@/api/systemManagement/adminApi/index'

interface EditPassForm {
  username: string
  oldPass: string
  newPass: string
  confirmPass: string
}

const accountStore = useAccountStore()
const userInfo = accountStore.getUserInfo
const router = useRouter()
const route = useRoute()
const emits = defineEmits(['collapsedFn'])

const breadcrumbList = computed(() => {
  if (route.matched.length > 0) {
    return route.matched.map((item) => item.name).filter(Boolean)
  }
  return [{ label: '首页', path: '/home', closable: false }]
})
const ruleFormRef = ref<FormInstance>()
const editPasswordDialog = ref<boolean>(false)
const editPassForm = ref<EditPassForm>({
  username: userInfo.name,
  oldPass: '',
  newPass: '',
  confirmPass: '',
})
const passRules = ref({
  oldPass: [{ required: true, message: '请输原密码', trigger: 'blur' }],
  newPass: [
    {
      required: true,
      validator: (value: string) => {
        if (value == '') return new Error('请输入新密码')
        if (editPassForm.value.oldPass && value === editPassForm.value.oldPass)
          return new Error('新密码不能与原密码相同')
        return true
      },
      trigger: 'blur',
    },
  ],
  confirmPass: [
    {
      required: true,
      validator: (value: string) => {
        if (value === '') return new Error('请再次输入新密码')
        if (editPassForm.value.newPass && value !== editPassForm.value.newPass)
          return new Error('两次输入密码不一致')
        return true
      },
      trigger: 'blur',
    },
  ],
})
const formLabelWidth = ref('80px')

const handleLogout = async () => {
  ElMessageBox.confirm('是否确认退出登录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await accountStore.logout()
      if (res) {
        ElMessage.success('已退出登录')
        router.push('/login')
      }
    })
    .catch(() => {})
}
const showEditPasswordDialog = () => {
  editPasswordDialog.value = true
}
const resetForm = async () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields()
  }
  editPasswordDialog.value = false
}
const submitForm = async () => {
  if (ruleFormRef.value) {
    await ruleFormRef.value
      .validate()
      .then(async () => {
        try {
          // const res = await adminEditPassword({
          //   oldPassword: editPassForm.value.oldPass,
          //   newPassword: editPassForm.value.newPass,
          // })
          if (true) {
            ElMessage.success('修改密码成功，请重新登录')
            await accountStore.logout()
            router.push('/login')
          }
        } catch (error) {
          console.log(error)
        }
      })
      .catch((err) => {
        ElMessage.error('表单填写有误，请检查', err)
      })
  }
}
const isExpand = ref<boolean>(true)
const expandFn = () => {
  isExpand.value = !isExpand.value
  emits('collapsedFn')
}
</script>

<style lang="scss" scoped>
.common-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 10px;
  background-color: var(--el-color-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;

  /* 左侧区域 */
  .header-left {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .expand-icon {
      font-size: 30px;
      cursor: pointer;
      transition: transform 0.3s ease-in-out; /* 动画过渡效果 */
    }

    .expand-icon:hover {
      color: #409eff; /* Element Plus 主题色 */
    }
    .expand-icon.is-expanded {
      transform: rotateY(180deg); /* 旋转180度 */
    }
    .breadcrumb {
      font-size: 16px;
    }
  }
  /* 右侧区域 */
  .header-right {
    display: flex;
    align-items: center;
    gap: 15px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 5px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .user-info:hover {
      background-color: var(--el-color-primary-light-9);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
    }

    .arrow-icon {
      font-size: 16px;
      color: var(--el-text-color-secondary);
    }
  }
}
:deep(.custom-password-dialog) {
  .el-dialog__header {
    line-height: normal !important;
  }
  .el-dialog__title {
    font-size: 20px !important;
    font-weight: 600 !important;
  }
  .el-dialog__body {
    padding: 20px 30px 0 15px;
    font-size: 18px !important;
  }
  .el-form-item__label {
    font-size: 14px;
  }
  .el-input__inner {
    height: 24px;
    font-size: 14px;
  }
  .form-actions {
    .el-form-item__content {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
}
</style>
