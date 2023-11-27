<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-form :model="form" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="$t(name)" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item :label="areaName" prop="areaList">
        <el-cascader :options="options" v-model="form.areaList" :props="cascaderProps" :show-all-levels="false" />
      </el-form-item>

      <el-form-item :label="detail" prop="description">
        <el-input v-model="form.description" :rows="2" type="textarea" />
      </el-form-item>
      <el-form-item :label="image" prop="pictureIds">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import { useTranslateText } from './hooks/translate';
import { storeAreaTree } from '/@/api/operating/coupon'
import { addTicket, putTicket, getTicketById, deleteTicketByIds } from '/@/api/admin/commodity'
import upload from "/@/components/Upload/index.vue";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
//图片props
const IMG_PROPS = {
  fileSize: 1,
  limit: 1,
  fileType: ['jpg', 'png', 'jpeg']
}

const cascaderProps = {
  label: "name",
  value: 'id',
  children: 'list',
}

const { t } = useI18n();
const {
  name,
  areaName,
  time,
  state,
  sum,
  duration,
  price,
  detail,
  image
} = useTranslateText(t)

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

defineProps<{ storeNameList: any[] }>()


type IForm = {
  id: undefined | string;
  name: string;
  storeId: string;
  description: string
  pictureIds: any[]
  areaId: string
  areaList: any[]
}
// 提交表单数据
const form = reactive<IForm>({
  id: undefined,
  storeId: '',
  name: '',
  description: '',
  pictureIds: [],
  areaList: [],
  areaId: ''
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

const options = ref([])



const getstoreAreaTree = async () => {
  const { data } = await storeAreaTree({ type: 0 })
  options.value = data
}

// 打开弹窗
const openDialog = async (id: string) => {

  await getstoreAreaTree()
  visible.value = true;
  form.id = '';

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysOauthClientDetails信息
  if (id) {
    loading.value = true;
    form.id = id;
    await getInfo(id);
    loading.value = false;
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    const temp = {
      ...form,
      pictureIds: form.pictureIds.map(item => item.id),
      storeId: Number(form.areaList[0]),
      areaId: String(form.areaList[1])
    }
    form.id ? await putTicket(temp) : await addTicket(temp);

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
const getInfo = async (id: string) => {
  const { data } = await getTicketById(id)



  Object.assign(form, {
    ...data,
    areaList: [data.areaVO.storeVO.id, data.areaVO.id],
    pictureIds: data.pictureFileVOs.map((item) => ({ name: item.fileName, url: item.fileUrl, id: item.id }))

  });


};


const uploadChange = (type: 'pictureIds', fileList: any[]) => {
  form[type] = fileList
}

const handleDelete = async () => {

  await useMessageBox().confirm('确认删除')
  const { data } = await deleteTicketByIds([form.id])
  if (data) {
    visible.value = false
    emit('refresh')

  }
}


// 暴露变量
defineExpose({
  openDialog,
});
</script>
