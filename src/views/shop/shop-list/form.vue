<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('shopList.name')" prop="name">
        <el-input :placeholder="`${t('shopList.please')}${t('shopList.name')}`" v-model="form.name" />
      </el-form-item>
      <el-form-item :label="t('shopList.introduce')" prop="introduction">
        <el-input type="textarea" :placeholder="`${t('shopList.please')}${t('shopList.introduce')}`"
          v-model="form.introduction" />
      </el-form-item>
      <el-form-item :label="t('shopList.address')" prop="address">
        <el-input type="textarea" :placeholder="`${t('shopList.please')}${t('shopList.address')}`"
          v-model="form.address" />
      </el-form-item>

      <el-form-item :label="t('shopList.contact')" prop="contact">
        <el-input :placeholder="`${t('shopList.please')}${t('shopList.contact')}`" v-model="form.contactNumber" />
      </el-form-item>
      <el-form-item :label="t('shopList.image')" prop="pictureIds">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />

      </el-form-item>

      <el-form-item :label="t('shopList.video')" prop="videoIds">
        <upload v-bind="VIDEO_PROPS" class="w-full" :model-value="form.videoIds"
          @change="(_, fileList) => uploadChange('videoIds', fileList)" />
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
import { AddStore, EditStore, getStoreById } from '/@/api/admin/store';
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
  name: '',
  pictureIds: [],
  videoIds: [],
  introduction: '',
  id: undefined,
  address: '',
  contactNumber: ''
});

// 定义校验规则
const dataRules = ref({
  name: [
    { required: true, message: `${t('shopList.name')}${t('common.empty')}`, trigger: 'blur' },

  ],
  introduce: [

  ],
  address: [
    { required: true, message: `${t('shopList.address')}${t('common.empty')}`, trigger: 'blur' },
  ],
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
    console.log(form);
    const pictureIds = form.pictureIds?.map(item => (item.id))
    const videoIds = form.videoIds?.map(item => (item.id))
    form.id ? await EditStore({ ...form, pictureIds, videoIds }) : await AddStore({ ...form, pictureIds, videoIds });
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
  let { data } = await getStoreById(id)
  data.pictureIds = data.pictureFileVOs?.map((item: any) => ({ id: item.id, name: item.fileName }))
  data.videoIds = data.videoFileVOs?.map((item: any) => ({ id: item.id, name: item.fileName }))
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
