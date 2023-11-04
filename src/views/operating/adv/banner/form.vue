<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-tabs v-model="form.type" class="demo-tabs">
      <el-tab-pane :label="t('banner.image')" name="1"> </el-tab-pane>
      <el-tab-pane :label="t('banner.imageH5')" name="0"> </el-tab-pane>
    </el-tabs>
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">


      <el-form-item :label="t('banner.banner')" prop="pictureIds">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds" :limit="1"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />

      </el-form-item>
      <el-form-item :label="t('banner.name')" prop="storeIds">
        <el-select v-model="form.storeIds" :placeholder="$t('shopList.nameSelect')" multiple>
          <el-option v-for="item, index in storeList" :key="index" :label="item.name" :value="item.id" clearable>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('banner.address')">
        <el-radio-group v-model="form.jump" class="ml-4">
          <el-radio label="1" size="large">是</el-radio>
          <el-radio label="0" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.jump == 1" label=" " prop="dynamicStateId">
        <el-select v-model="form.dynamicStateId" :placeholder="$t('common.select') + $t('banner.dynamicStateId')">
          <el-option v-for="item, index in dynamicState" :key="index" :label="item.name" :value="item.id" clearable>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('banner.introduce')" prop="weightiness">
        <el-input-number min="1" max="9999" :step="1" :placeholder="`${t('banner.please')}${t('banner.introduce')}`"
          v-model="form.weightiness" />
      </el-form-item>
      <el-form-item :label="t('banner.time')" prop="validityTime">
        <el-date-picker v-model="form.validityTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="`${t('common.select')}${t('banner.time')}`" />
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
// import { addObj, getObj, putObj, validateclientId } from '/@/api/admin/client';
import { getStoreName, getStoreById } from '/@/api/admin/store';
import { fetchList, } from '/@/api/operating/dynamic';

import { addCarousel, getCarouselId, EditCarousel } from '/@/api/operating/banner';

import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import upload from "/@/components/Upload/index.vue";

const storeList = ref([])

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
  storeIds: []
});

// 定义校验规则
const dataRules = ref({
  dynamicStateId: [
    { required: true, type: 'array', message: `${t('banner.address')}${t('common.empty')}`, trigger: 'change' },
  ],
  pictureIds: [
    { required: true, type: 'array', message: `${t('banner.image')}${t('common.empty')}`, trigger: 'blur' },
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
const openDialog = async (id: string) => {
  visible.value = true;
  form.id = undefined;
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });
  let { data } = await getStoreName()
  storeList.value = data
  await fetchList({
    current: 1,
    size: 10
  }).then(res => {
    dynamicState.value = res.data.records
  })

  // 获取sysOauthClientDetails信息
  if (id) {
    form.id = id;
    getStoreDetail(id);
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
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

// 初始化表单数据
const getStoreDetail = async (id: string) => {
  // 获取数据

  let { data } = await getCarouselId(id)
  data.pictureIds = data.pictureFile?.map((item: any) => ({ id: item.id, name: item.fileName }))
  data.storeIds = data.storeVOS?.map((item: any) => (item.id))
  Object.assign(form, data)

};

const uploadChange = (type: 'pictureIds' | 'videoIds', fileList: any[]) => {

  form[type] = fileList

}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
