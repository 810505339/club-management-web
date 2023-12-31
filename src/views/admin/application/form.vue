<template>
  <el-dialog :close-on-click-modal="false" :title="(form.id ? $t('common.editBtn') : $t('common.addBtn')) + ' ' + type"
    width="600" draggable v-model="visible">
    <el-form :model="form" label-width="140px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="$t('application.table1')" prop="versionNumber">
        <el-input v-model="form.versionNumber" />
      </el-form-item>

      <el-form-item :label="$t('application.table2')" prop="versionIntroduce">
        <el-input v-model="form.versionIntroduce" show-word-limit type="textarea" />
      </el-form-item>

      <el-form-item :label="$t('application.table3')" prop="versionIntroduce">
        <el-radio-group v-model="form.isForceUpdate">
          <el-radio label="1">{{ t('common.yes') }}</el-radio>
          <el-radio label="0">{{ t('common.no') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('application.form1')" prop="sensitivenessOn">
        <el-switch v-model="form.sensitivenessOn" />
      </el-form-item>

      <el-form-item :label="type === 'ANDROID' ? $t('application.form2') : $t('application.form3')" prop="packageId">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.packageId" :disabled="form.id"
          @change="(_, fileList) => uploadChange('packageId', fileList)" />
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
import { addApplication, getApplicationById, editApplication } from '/@/api/admin/application';
import { useI18n } from 'vue-i18n';
import upload from "/@/components/Upload/index.vue";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const props = defineProps<{
  type: string
}>()

const IMG_PROPS = {
  fileSize: 1024,
  limit: 1,
}


const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典
const { grant_types, common_status } = useDict(
  'grant_types',
  'common_status',
);

// 提交表单数据
const form = reactive({
  id: undefined,
  versionNumber: '',
  versionIntroduce: '',
  isForceUpdate: '1',
  sensitivenessOn: true,
  packageId: []
});


// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true;
  form.id = undefined;
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

    const temp = {
      ...form,
      versionType: props.type,
      sensitivenessOn: form.sensitivenessOn ? '1' : '0',
      packageId: form.packageId.map(item => item.id)
    }
    form.id ? await editApplication(temp) : await addApplication(temp);
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
  getApplicationById(id).then((res: any) => {

    Object.assign(form, {
      ...res,
      sensitivenessOn: res.sensitivenessOn == '1' ? true : false,
      packageId: res.packageFile?.map((item: any) => ({ id: item.id, name: item.fileName }))

    });
  });
};

const uploadChange = (type: 'packageId', fileList: any[]) => {

  form[type] = fileList

}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
