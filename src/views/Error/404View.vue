<template>
  <div class="not-found-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <div class="not-found-content">
      <!-- 404数字动画 -->
      <div class="number-container">
        <span class="number">4</span>
        <div class="circle-animation">
          <div class="circle"></div>
          <div class="circle-inner"></div>
        </div>
        <span class="number">4</span>
      </div>

      <!-- 错误信息 -->
      <h1 class="title">页面未找到</h1>
      <p class="subtitle">抱歉，您访问的页面不存在或已被移除</p>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button type="primary" size="large" @click="handleGoHome" class="home-btn">
          <el-icon>
            <home-filled />
          </el-icon>

          返回首页
        </el-button>
        <el-button size="large" @click="handleGoBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const handleGoHome = () => {
  router.push('/')
}

// 返回上一页
const handleGoBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.not-found-content {
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 404数字样式 */
.number-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.number {
  font-size: 12rem;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff, #69b1ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(64, 158, 255, 0.2);
  animation: numberPulse 4s infinite ease-in-out;
}

.number:first-child {
  animation-delay: 0s;
}

.number:last-child {
  animation-delay: 0.5s;
}

/* 中间圆圈动画 */
.circle-animation {
  position: relative;
  width: 100px;
  height: 100px;
}

.circle {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #409eff;
  opacity: 0.8;
  animation: circlePulse 3s infinite ease-out;
}

.circle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background-color: #409eff;
  animation: circleInnerPulse 3s infinite ease-in-out;
}

/* 标题样式 */
.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease-out;
}

.subtitle {
  font-size: 1.1rem;
  color: #606266;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

/* 按钮样式 */
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(144, 147, 153, 0.2);
}

/* 动画定义 */
@keyframes circlePulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

@keyframes circleInnerPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.9);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) scale(0.9);
  }
}

@keyframes numberPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .number {
    font-size: 8rem;
  }

  .circle-animation {
    width: 80px;
    height: 80px;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .actions {
    flex-direction: column;
    align-items: center;
  }

  .el-button {
    width: 80%;
  }

  .search-box {
    width: 90%;
  }

  .links-row {
    display: flex;
    flex-wrap: wrap;
  }

  .el-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 480px) {
  .number {
    font-size: 6rem;
  }

  .circle-animation {
    width: 60px;
    height: 60px;
  }
}
</style>
