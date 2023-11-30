<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
    :title="form.jobId ? $t('common.editBtn') : $t('common.addBtn')" draggable width="600">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="200px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="20" class="mb20">
          <el-form-item :label="titleChinese" prop="dynamicTitleCn">
            <el-input v-model="form.dynamicTitleCn" :placeholder="titlePlaceholder" />
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="titleEnglish" prop="dynamicTitleUk">
            <el-input v-model="form.dynamicTitleUk" :placeholder="titlePlaceholder" />
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="contextChinese" prop="dynamicContentCn">
            <el-input :rows="2" type="textarea" v-model="form.dynamicContentCn" :placeholder="titlePlaceholder" />
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="contextEnglish" prop="dynamicContentUk">
            <el-input :rows="2" type="textarea" v-model="form.dynamicContentUk" :placeholder="titlePlaceholder" />
          </el-form-item>
        </el-col>
        <el-col :span="20" class="mb20">
          <el-form-item :label="type" prop="dynamicTypeId">
            <el-select :placeholder="typePlaceholder" v-model="form.dynamicTypeId">
              <el-option :key="index" :label="item.name" :value="item.id" v-for="( item, index ) in  list "></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.store')" prop="storeId">
            <el-select v-model="form.storeId" multiple :placeholder="$t('shopList.nameSelect')" clearable>
              <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.image')" prop="pictureIds">
            <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
              @change="(_, fileList) => uploadChange('pictureIds', fileList)" />
          </el-form-item>
        </el-col>

        <!-- 到期时间 -->
        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.expiryTime')" prop="expireTime">
            <el-date-picker v-model="form.expireTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </el-col>

        <!-- 是否报名 -->
        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.register')" prop="whetherSignUp">
            <el-switch v-model="form.whetherSignUp" />
          </el-form-item>
        </el-col>


        <!-- 是否显示总人数 -->

        <div v-if="form.whetherSignUp">

          <el-col :span="20" class="mb20">
            <el-form-item :label="t('dynamic.showOrNotPersonNumber')" prop="showOrNotPersonNumber">
              <el-switch v-model="form.showOrNotPersonNumber" />
            </el-form-item>
          </el-col>


          <el-col :span="20" class="mb20">
            <el-form-item :label="t('dynamic.showActivityPersonNumber')" prop="showActivityPersonNumber">
              <el-switch v-model="form.showActivityPersonNumber" />
            </el-form-item>
          </el-col>
          <!-- 活动限制总人数 -->

          <el-col :span="20" class="mb20" v-if="form.showActivityPersonNumber">
            <el-form-item :label="t('dynamic.activityPersonNumber')" prop="activityPersonNumber">
              <el-input-number v-model="form.activityPersonNumber" :min="0" :precision="0" :step="1" />
            </el-form-item>
          </el-col>


          <el-col :span="20" class="mb20">
            <el-form-item :label="t('dynamic.expenses')" prop="charge">
              <el-switch v-model="form.charge" />
            </el-form-item>
          </el-col>

          <el-col :span="20" class="mb20" v-if="form.charge">
            <el-form-item :label="t('dynamic.expense') + '($)'" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :precision="2" :step="0.1" />
            </el-form-item>
          </el-col>


          <!--是否显示门票ID -->


          <el-col :span="20" class="mb20">
            <el-form-item :label="t('dynamic.showTicketId')" prop="showTicketId">
              <el-switch v-model="form.showTicketId" />
            </el-form-item>
          </el-col>

          <el-col :span="20" class="mb20" v-if="form.showTicketId">
            <el-form-item :label="t('tickets.tickets')" prop="ticketId">
              <el-cascader :options="options" v-model="form.ticketId" :props="cascaderProps" :show-all-levels="false" />
            </el-form-item>
          </el-col>


        </div>

      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button formDialogRef @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button formDialogRef type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="dynamic-form" setup>
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getDynamicById, AddDynamic, EditDynamic } from '/@/api/admin/dynamic';
import { useI18n } from 'vue-i18n';
import { useTranslateText } from './hooks/translate';
import upload from "/@/components/Upload/index.vue";

import { storeTicket } from '/@/api/operating/coupon'
const emit = defineEmits(['refresh']);
const options = ref([])
const props = defineProps<{ list: any[], storeNameList: any[] }>()

onMounted(async () => {


  await storeTicketApi()

})


const cascaderProps = {
  label: "label",
  value: 'value',
  children: 'children',
  emitPath: false
}

const storeTicketApi = async () => {
  const { data } = await storeTicket()
  options.value = data.map(item => {
    return {
      label: item.storeName,
      value: item.storeId,
      children: item.ticketTreeVOList.map(f => ({
        label: f.ticketName,
        value: f.ticketId,
      }))
    }
  })
  console.log(data);

}

const { t } = useI18n();

const { title,
  titlePlaceholder,
  titleChinese,
  titleEnglish,
  type,
  typePlaceholder,
  status,
  statusPlaceholder,
  contextChinese,
  contextEnglish, } = useTranslateText(t)

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const IMG_PROPS = {
  fileSize: 1,
  limit: 10,
  fileType: ['jpg', 'png', 'jpeg']

}

const defalut = {
  storeId: [],
  whetherSignUp: false,
  showOrNotPersonNumber: false,
  activityPersonNumber: 0,
  ticketId: '',
  showTicketId: false,
  amount: 0,
  charge: false,
  showActivityPersonNumber: false
}
// 提交表单数据
const form = reactive({
  ...defalut
});

const popoverVis = (bol: boolean) => {
  popoverVisible.value = bol;
};

const popoverVisible = ref(false);
// 定义校验规则
const dataRules = reactive({
  jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  jobGroup: [{ required: true, message: '任务组名不能为空', trigger: 'blur' }],
  jobType: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
  cronExpression: [{ required: true, message: 'cron不能为空', trigger: 'blur' }],
  misfirePolicy: [{ required: true, message: '策略不能为空', trigger: 'blur' }],
  executePath: [{ required: true, message: '执行路径不能为空', trigger: 'blur' }],
  className: [{ required: true, message: '执行文件不能为空', trigger: 'blur' }],
  methodName: [{ required: true, message: '执行方法不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true;
  form.jobId = '';

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
    Object.keys(defalut).map(item => {
      form[item] = defalut[item]
    })
  });

  // 获取sysJob信息
  if (id) {
    form.jobId = id;
    getsysJobData(id);
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => { });
  if (!valid) return false;

  console.log(form)

  try {
    loading.value = true;

    const pictureIds = form.pictureIds?.map(item => (item.id))
    const temp = {
      ...form,
      expireTime: form.expireTime,
      pictureIds,
      whetherSignUp: form.whetherSignUp ? 1 : 0,
      showOrNotPersonNumber: form.showOrNotPersonNumber ? 1 : 0,
      amount: form.charge ? form.amount : null,
      activityPersonNumber: form.showActivityPersonNumber ? form.activityPersonNumber : null,
      ticketId: form.showTicketId ? form.ticketId : null,

    }


    form.jobId ? await EditDynamic(temp) : await AddDynamic(temp);

    useMessage().success(t(form.jobId ? 'common.editSuccessText' : 'common.addSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error('任务初始化异常');
  } finally {
    loading.value = false;
  }
};

// 初始化表单数据
const getsysJobData = (id: string) => {
  // 获取数据
  getDynamicById(id).then((res: any) => {

    res.data.storeId = res.data.storeVOS.map(item => item.id)
    res.data.dynamicTypeId = res.data.dynamicTypeVO.id
    const pictureIds = res.data.pictureFile?.map((item: any) => ({ id: item.id, name: item.fileName }))
    if (res.data.amount) {
      form.charge = true
    }
    Object.assign(form, res.data);
    form.pictureIds = pictureIds
    form.whetherSignUp = res.data.whetherSignUp == 1 ? true : false
    form.showActivityPersonNumber = res.data.activityPersonNumber ? true : false
    form.showTicketId = res.data.ticketId ? true : false
  });
};

const uploadChange = (type: 'pictureIds' | 'videoIds', fileList: any[]) => {

  form[type] = fileList


}



// 暴露变量
defineExpose({
  openDialog,
});
</script>
