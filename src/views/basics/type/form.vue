<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-form :model="form" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">

      <el-form-item :label="t('type.name')" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getDynamicTypeById, AddDynamicType, EditDynamicType } from '/@/api/admin/basics'
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);


// 提交表单数据
const form = reactive({
  id: '',
  name: ''
});

// 定义校验规则
const dataRules = ref({
  clientId: [
    { required: true, message: '编号不能为空', trigger: 'blur' },
    { validator: rule.validatorLowercase, trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        validateclientId(rule, value, callback, form.id !== '');
      },
      trigger: 'blur',
    },
  ],
  clientSecret: [
    { required: true, message: '密钥不能为空', trigger: 'blur' },
    { validator: rule.validatorLower, trigger: 'blur' },
  ],
  scope: [{ required: true, message: '域不能为空', trigger: 'blur' }],
  authorizedGrantTypes: [{ required: true, message: '授权模式不能为空', trigger: 'blur' }],
  accessTokenValidity: [
    { required: true, message: '令牌时效不能为空', trigger: 'blur' },
    { type: 'number', min: 1, message: '令牌时效不能小于一小时', trigger: 'blur' },
  ],
  refreshTokenValidity: [
    { required: true, message: '刷新时效不能为空', trigger: 'blur' },
    { type: 'number', min: 1, message: '刷新时效不能小于两小时', trigger: 'blur' },
  ],
  autoapprove: [{ required: true, message: '自动放行不能为空', trigger: 'blur' }],
  webServerRedirectUri: [{ required: true, message: '回调地址不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true;
  form.id = '';
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysOauthClientDetails信息
  if (id) {
    form.id = id;
    getsysOauthClientDetailsData(id);
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    form.id ? await EditDynamicType(form) : await AddDynamicType(form);
    useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// 初始化表单数据
const getsysOauthClientDetailsData = (id: string) => {
  // 获取数据
  getDynamicTypeById(id).then((res: any) => {
    Object.assign(form, res.data);
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
