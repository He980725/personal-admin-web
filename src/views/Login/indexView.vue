<template>
  <div class="login-page">
    <div class="login-page-box">
      <img class="login-page-box_img" src="@/assets/images/login-left.png" alt="login-left" />
      <div class="login-page-box_form_box">
        <div class="login-page-box_form">
          <h3>
            <span>个人管理平台</span>
          </h3>
          <el-form :model="loginForm" label-width="0">
            <el-form-item>
              <el-input
                class="custom-input"
                v-model="loginForm.username"
                placeholder="请输入您的账号"
                prefix-icon="User"
                @keydown.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                class="custom-input"
                v-model="loginForm.password"
                type="password"
                placeholder="请输入您的密码"
                prefix-icon="Lock"
                show-password
                @keydown.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-btn"
                @click="handleLogin"
                :disabled="isCanLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <p class="login-tips">*如出现登录问题请联系管理员*</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'

interface LoginForm {
  username: string
  password: string
}
const router = useRouter()
const accountStore = useAccountStore()

const loginForm = ref<LoginForm>({
  username: 'admin',
  password: '1',
})
const isCanLogin = computed<boolean>(() => {
  return !loginForm.value.username || !loginForm.value.password
})

const handleLogin = async () => {
  if (loginForm.value.username && loginForm.value.password) {
    const res = await accountStore.login({
      username: loginForm.value.username,
      password: loginForm.value.password,
    })
    if (res) {
      ElMessage.success('登录成功')
      router.push({ path: '/dashboard' })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/images/login-bg.png') no-repeat center/100% 100%;

  &-box {
    width: 900px;
    display: flex;
    height: 488px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.12);
    border-radius: 73px 0px 73px 0px;

    &_img {
      width: 460px;
      height: 488px;
    }
    .login-page-box_form_box {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &_form {
      width: 342px;
      .icon-form {
        width: 16px;
      }
      h3 {
        height: 40px;
        display: flex;
        margin: 0 0 73px;
        align-items: center;
        justify-content: center;

        img {
          width: 40px;
          height: 40px;
        }

        span {
          font-weight: 600;
          color: #000000;
          font-size: var(--font-size-xxxxl);
        }
      }

      ::v-deep(.el-input) {
        height: 40px;
        font-size: 16px;
      }

      .get-code {
        padding: 0;
        height: 40px;
        width: 110px;
        font-size: var(--font-size-m);

        &:disabled {
          color: #d90514;
          background: #fbe6e7;
        }
      }
      /* 关键：调整前缀图标的大小 */
      .custom-input {
        /* 穿透 scoped 限制，修改 Element 内部类 */
        :deep(.el-input__prefix) {
          font-size: 18px; /* 调整图标大小（默认约16px） */
          width: 24px; /* 调整图标容器宽度 */
          height: 24px; /* 调整图标容器高度 */
        }

        /* 可选：调整显示密码图标的大小 */
        :deep(.el-input__suffix) {
          font-size: 18px;
        }
      }

      .login-btn {
        width: 100%;
        height: 46px;
        margin-top: 50px;
      }
      .login-tips {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
        margin-top: 9px;
        text-align: center;
      }
    }
  }
}
</style>
