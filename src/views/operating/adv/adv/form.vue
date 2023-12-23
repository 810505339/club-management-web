<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-tabs v-model="form.type" class="demo-tabs">
      <el-tab-pane :label="t('banner.image')" name="1"> </el-tab-pane>
      <el-tab-pane :label="t('banner.imageH5')" name="0"> </el-tab-pane>
    </el-tabs>
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('adv.name')" prop="name">
        <el-input :placeholder="`${t('adv.please')}${t('adv.name')}`" maxlength="30" v-model="form.name" />
      </el-form-item>
      <el-form-item :label="t('adv.description')">
        <el-input type="textarea" :placeholder="`${t('adv.please')}${t('adv.description')}`" v-model="form.description"
          maxlength="200" />
      </el-form-item>
      <el-form-item :label="t('adv.time')" prop="validityTime">
        <el-date-picker v-model="form.validityTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="`${t('common.select')}${t('adv.time')}`" />
      </el-form-item>
      <el-form-item :label="t('adv.image')" prop="pictureIds">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />

      </el-form-item>

      <el-form-item :label="t('banner.address')">
        <el-radio-group v-model="form.jump" class="ml-4">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="0" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.jump == 1" label=" " prop="dynamicStateId">
        <el-select v-model="form.dynamicStateId" :placeholder="$t('common.select') + $t('banner.dynamicStateId')">
          <el-option v-for="item, index in dynamicState" :key="index" :label="item.dynamicTitleCn" :value="item.id"
            clearable>
          </el-option>
        </el-select>
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
import { fetchList, } from '/@/api/operating/dynamic';

// import { addObj, getObj, putObj, validateclientId } from '/@/api/admin/client';
import { addCarousel, EditCarousel, getObj } from '/@/api/operating/adv';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import upload from "/@/components/Upload/index.vue";



//图片props
const IMG_PROPS = {
  fileSize: 1,
  limit: 10,
  fileType: ['jpg', 'png', 'jpeg']

}
//视频props
const VIDEO_PROPS = {
  limit: 1,
  fileSize: 20,
  fileType: ['mp4'],

}

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

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
  id: '',
  type: '1',
  jump: '1',
  dynamicStateId: '',
  pictureIds: '',
  weightiness: 1,
  validityTime: '',
  storeIds: [],
  localType: null
});

// 定义校验规则
const dataRules = ref({
  name: [
    { required: true, message: `${t('banner.introduce')}${t('common.empty')}`, trigger: 'blur' },
  ],
  dynamicStateId: [
    { required: true, message: `${t('banner.address')}${t('common.empty')}`, trigger: 'change' },
  ],
  pictureIds: [
    { required: true, type: 'array', message: `${t('banner.image')}${t('common.empty')}`, trigger: 'change' },
  ],
  weightiness: [
    { required: true, message: `${t('banner.introduce')}${t('common.empty')}`, trigger: 'blur' },
  ],
  validityTime: [
    { required: true, message: `${t('banner.time')}${t('common.empty')}`, trigger: 'blur' },
  ],
  storeIds: [
    { required: true, type: 'array', message: `${t('banner.name')}${t('common.empty')}`, trigger: 'change' },
  ],
});
const dynamicState = ref([])
// 打开弹窗
const openDialog = async (type: string) => {
  visible.value = true;
  form.localType = type;
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });
  await fetchList({
    current: 1,
    size: 10
  }).then(res => {
    dynamicState.value = res.data.records
  })

};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    console.log(form);
    const pictureIds = form.pictureIds?.map(item => (item.id))
    form.id ? await EditCarousel({ ...form, pictureIds }) : await addCarousel({ ...form, pictureIds });
    useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

const uploadChange = (type: 'pictureIds' | 'videoIds', fileList: any[]) => {

  form[type] = fileList

}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
