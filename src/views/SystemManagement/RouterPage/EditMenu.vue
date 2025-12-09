<template>
  <m-card :bordered="false">
    <el-form
      :model="addMenuForm"
      :rules="addMenuRules"
      ref="addMenuFromRef"
      size="default"
      label-width="80PX"
      label-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="上级菜单" prop="parentId">
            <el-cascader
              v-model="addMenuForm.parentId"
              placeholder="请选择活动上级菜单"
              :options="parentMenuOption"
              :props="{ checkStrictly: true, emitPath: false }"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="addMenuForm.routeType" :disabled="type !== 'Add'">
              <el-radio label="菜单" :value="1"></el-radio>
              <el-radio label="按钮" :value="2"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="addMenuForm.routeType !== 3 ? '路由名称' : '按钮名称'" prop="name">
            <el-input v-model="addMenuForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="addMenuForm.routeType !== 3 ? '菜单标题' : '按钮标题'" prop="title">
            <el-input v-model="addMenuForm.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="addMenuForm.routeType !== 3">
          <el-form-item label="路由地址" :prop="addMenuForm.routeType !== 3 ? 'path' : ''">
            <el-input v-model="addMenuForm.path"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="addMenuForm.routeType === 3">
          <el-form-item label="按钮权限" :prop="addMenuForm.routeType === 3 ? 'permission' : ''">
            <el-input v-model="addMenuForm.permission"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="order">
            <el-input-number
              v-model="addMenuForm.sortOrder"
              controls-position="right"
              @change="handleChange"
              :min="1"
              :max="10"
              style="width: 70%"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单状态" prop="status">
            <el-radio-group v-model="addMenuForm.status">
              <el-radio label="启用" :value="1"></el-radio>
              <el-radio label="禁用" :value="0"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row v-if="type !== 'Add'">
      <el-col :span="12">
        <MDescription label="创建人：">{{ descriptionInfo?.createBy }}</MDescription>
      </el-col>
      <el-col :span="12">
        <MDescription label="创建时间：">
          {{ dateFormatter(descriptionInfo?.createTime) }}
        </MDescription>
      </el-col>
    </el-row>
    <el-row v-if="type !== 'Add'">
      <el-col :span="12">
        <MDescription label="更新人：">{{ descriptionInfo?.updateBy }}</MDescription>
      </el-col>
      <el-col :span="12">
        <MDescription label="更新时间：">
          {{ dateFormatter(descriptionInfo?.updateTime) }}
        </MDescription>
      </el-col>
    </el-row>
  </m-card>
  <div style="display: flex; justify-content: end; margin-top: 15px">
    <span>
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="submitForm"> 确 定 </el-button>
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import {
  getRouterDetail,
  type RouterItemParams,
  createRouter,
  editRouter,
} from '@/api/systemManagementApi/routerPageApi'
import { ElMessage } from 'element-plus'
import { MDescription, MCard } from '@/components'
import { dateFormatter } from '@/utils/formatter'

const props = defineProps({
  parentMenuOption: {
    type: Array,
    default: () => [{ label: '主菜单', value: 0, children: [] }],
  },
  id: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: 'Add',
  },
})
const emits = defineEmits(['close-button'])
const addMenuForm = ref<RouterItemParams>({
  id: null,
  parentId: 0,
  name: '',
  path: '',
  component: null,
  redirect: null,
  title: null,
  icon: null,
  sortOrder: null,
  hidden: null,
  keepAlive: null,
  alwaysShow: null,
  status: null,
  routeType: null,
  permission: null,
})
const addMenuRules = ref({
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
  name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
  title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请选择显示排序', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  permission: [{ required: true, message: '请输入按钮权限', trigger: 'blur' }],
  routeType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择菜单状态', trigger: 'change' }],
})
const addMenuFromRef = ref()
const parentMenuOption = computed(() => {
  return props.parentMenuOption
})
const descriptionInfo = ref()
const handleChange = () => {}
const resetForm = async () => {
  if (addMenuFromRef.value) {
    await addMenuFromRef.value.resetFields()
  }
  emits('close-button')
}
const submitForm = async () => {
  if (addMenuFromRef.value) {
    await addMenuFromRef.value
      .validate()
      .then(async () => {
        try {
          const res =
            props.type === 'Add'
              ? await createRouter({ ...addMenuForm.value })
              : await editRouter({ ...addMenuForm.value, id: props.id })
          if (res.code === 200) {
            ElMessage.success(props.type === 'Add' ? '创建成功！' : '菜单更新成功！')
            resetForm()
          }
        } catch (error) {
          console.log(error)
        }
      })
      .catch(() => {
        ElMessage.error('表单填写有误，请检查')
      })
  }
}
const getDetail = async () => {
  const res = await getRouterDetail({ id: ~~props.id })
  if (res.code === 200) {
    addMenuForm.value = { ...res.data }
    addMenuForm.value.title = res.data.meta?.title
  }
}
watchEffect(async () => {
  if (props.type === 'Edit') {
    await getDetail()
  }
})
</script>
