<template>
  <div class="chart-box">
    <div v-if="showHeader" class="header">
      <slot name="header"></slot>
    </div>
    <VChart class="chart" :option="option" autoresize />
    <div v-if="showFooter" class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { ref, computed } from 'vue'

const props = defineProps({
  options: { type: Object, required: true },
  showHeader: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: false },
})

// 注册必须的组件
echarts.use([
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  BarChart,
  PieChart,
  LineChart,
  RadarChart,
  ScatterChart,
])

//   provide(THEME_KEY, 'dark');

const defaultOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
})

const option = computed(() => {
  return { ...defaultOption.value, ...props.options }
})
</script>

<style scoped>
.chart-box {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;

  .chart {
    flex: 1;
  }
}
</style>
