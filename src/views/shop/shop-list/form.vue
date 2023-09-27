<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('shopList.name')" prop="clientId">
        <el-input :placeholder="`${t('shopList.please')}${t('shopList.name')}`" v-model="form.clientId" />
      </el-form-item>
      <el-form-item :label="t('shopList.introduce')" prop="clientSecret">
        <el-input type="textarea" :placeholder="`${t('shopList.please')}${t('shopList.introduce')}`"
          v-model="form.clientSecret" />
      </el-form-item>
      <el-form-item :label="t('shopList.address')" prop="scope">
        <el-input type="textarea" :placeholder="`${t('shopList.please')}${t('shopList.address')}`" v-model="form.scope" />
      </el-form-item>
      <el-form-item :label="t('shopList.image')" prop="authorizedGrantTypes">
        <el-upload v-model:file-list="fileList" class="w-full"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" list-type="picture">
          <el-button type="primary" icon="upload">{{ t('common.upload') }}</el-button>
          <template #tip>
            <div class="el-upload__tip">
              JPG/PNG/JPEG{{ $t('common.fileUpload') }}1MB
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item :label="t('shopList.video')" prop="scope">
        <el-upload v-model:file-list="fileList" class="w-full"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" list-type="picture">
          <el-button type="primary" icon="upload">{{ t('common.upload') }}</el-button>
          <template #tip>
            <div class="el-upload__tip">
              mp4{{ $t('common.fileUpload') }}20MB
            </div>
          </template>
        </el-upload>
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
import { addObj, getObj, putObj, validateclientId } from '/@/api/admin/client';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import { UploadUserFile } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
])

// 定义字典
const { grant_types, common_status } = useDict(
  'grant_types',
  'common_status',
);

// 提交表单数据
const form = reactive({
  id: '',
  clientId: '',
  clientSecret: '',
  scope: '',
  authorizedGrantTypes: [] as string[],
  webServerRedirectUri: '',
  authorities: '',
  accessTokenValidity: 43200,
  refreshTokenValidity: 2592001,
  autoapprove: 'true',
  delFlag: '',
  createBy: '',
  updateBy: '',
  createTime: '',
  updateTime: '',
  tenantId: '',
  onlineQuantity: '1',
  captchaFlag: '1',
  encFlag: '1',
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
    form.id ? await putObj(form) : await addObj(form);
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
  getObj(id).then((res: any) => {
    Object.assign(form, res.data);
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
