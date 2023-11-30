<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    top="10px" draggable v-model="visible">
    <el-form :model="form" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="ticketsDemo" prop="name">
        <el-select v-model="form.ticketId">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>


      <el-form-item :label="time" prop="time">
        <el-date-picker :end-placeholder="$t('syslog.inputEndPlaceholderTip')"
          :start-placeholder="$t('syslog.inputStartPlaceholderTip')" range-separator="To" type="daterange"
          value-format="YYYY-MM-DD" v-model="form.time" />
      </el-form-item>

      <el-form-item :label="duration" prop="duration">
        <el-date-picker :append-to-body="false" :end-placeholder="$t('syslog.inputEndPlaceholderTip')"
          :start-placeholder="$t('syslog.inputStartPlaceholderTip')" range-separator="To" type="datetimerange"
          value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" v-model="form.duration" :popper-options="{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [10, -100],
                },
              },
            ],
          }" />
      </el-form-item>



      <el-form-item :label="sum" prop="ticketDetailNumber">
        <el-input-number :step="1" :min="0" v-model="form.ticketDetailNumber" />
      </el-form-item>
      <el-form-item :label="price + '($)'" prop="amount">
        <el-input-number :precision="2" :step="0.01" :min="0.00" v-model="form.amount" />
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
import { addTicket, putTicket, getTicketById, deleteTicketByIds, getTicketAll, addTicketDetail, getsTicketDetailById } from '/@/api/admin/commodity'
import upload from "/@/components/Upload/index.vue";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
//图片props
const IMG_PROPS = {
  fileSize: 1,
  limit: 1,
  fileType: ['jpg', 'png', 'jpeg']
}



const { t } = useI18n();
const {
  time,
  sum,
  duration,
  price,
  ticketsDemo
} = useTranslateText(t)

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

defineProps<{ storeNameList: any[] }>()


//提交表单数据
const form = reactive({
  id: undefined,
  ticketId: '',
  beginTime: '',
  endTime: '',
  enabledTime: '',
  disabledTime: '',
  ticketDetailNumber: 0,
  amount: 0,
  time: [],
  duration: [],
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

const options = ref<{ id: string, name: string }[]>([])



const getTicketAllApi = async () => {
  const { data } = await getTicketAll()
  options.value = data
}

// 打开弹窗
const openDialog = async (id: string) => {

  await getTicketAllApi()
  visible.value = true;
  form.ticketId = '';

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysOauthClientDetails信息
  if (id) {
    loading.value = true;
    form.ticketId = id;
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
      beginTime: form.time[0],
      endTime: form.time[1],
      enabledTime: form.duration[0],
      disabledTime: form.duration[1],
    }
    form.ticketId ? await addTicketDetail(temp) : await addTicketDetail(temp);

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
  const { data } = await getsTicketDetailById(id)



  Object.assign(form, {
    ...data,
  });
  form.time = [data.beginTime, data.endTime];
  form.duration = [data.enabledTime, data.disabledTime]
  form.id = data?.ticketVO?.id

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
