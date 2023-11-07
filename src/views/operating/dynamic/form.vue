<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
    :title="form.jobId ? $t('common.editBtn') : $t('common.addBtn')" draggable width="600">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
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
            <el-select v-model="form.storeId" :placeholder="$t('shopList.nameSelect')" clearable>
              <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.register')" prop="whetherSignUp">
            <el-switch v-model="form.apply" />
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.expenses')" prop="charge">
            <el-switch v-model="form.charge" />
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20" v-if="form.charge">
          <el-form-item :label="t('dynamic.expense') + '($)'" prop="amount">
            <el-input-number v-model="form.amount" :precision="2" :step="0.1" />
          </el-form-item>
        </el-col>


        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.expiryTime')" prop="expireTime">
            <el-date-picker v-model="form.expireTime" type="datetime" />
          </el-form-item>
        </el-col>
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

const emit = defineEmits(['refresh']);
const props = defineProps<{ list: any[], storeNameList: any[] }>()


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

// 定义字典
const { misfire_policy, job_type } = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');

// 提交表单数据
const form = reactive({
  storeId: []
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
    const temp = { ...form, storeId: [form.storeId], expireTime: form.expireTime }


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

    res.data.storeId = res.data.storeVOS[0].id
    res.data.dynamicTypeId = res.data.dynamicTypeVO.id
    Object.assign(form, res.data);
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
