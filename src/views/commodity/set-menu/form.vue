<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('goods.name')" prop="name">
        <el-input :placeholder="`${t('common.please')}${t('goods.name')}`" v-model="form.name" />
      </el-form-item>

      <el-form-item :label="t('goods.image')" prop="pictureIds">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />
      </el-form-item>


      <el-form-item :label="t('area.store')" prop="storeIds">
        <el-select v-model="form.storeIds" multiple :placeholder="$t('area.nameSelect')" clearable>
          <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id" clearable>
          </el-option>
        </el-select>
      </el-form-item>




      <el-form-item :label="t('goods.introduce')" prop="introduction">
        <el-input type="textarea" :placeholder="`${t('common.please')}${t('goods.introduce')}`"
          v-model="form.introduction" />
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
import { AdddrinksMeal, EditdrinksMeal, getAreaById } from '/@/api/admin/commodity';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import upload from "/@/components/Upload/index.vue";
import { getStoreName } from '/@/api/admin/store';



//图片props
const IMG_PROPS = {
  fileSize: 1,
  limit: 10,
  fileType: ['jpg', 'png', 'jpeg']

}

const storeNameList = ref<any[]>([])
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
  introduction: '',
  id: undefined,
  storeIds: []
});

// 定义校验规则
const dataRules = ref({
  name: [
    { required: true, message: `${t('shopList.name')}${t('common.empty')}`, trigger: 'blur' },

  ],
  introduction: [

  ],
  address: [
    { required: true, message: `${t('shopList.address')}${t('common.empty')}`, trigger: 'blur' },
  ],
});

// 打开弹窗
const openDialog = async (id: string) => {
  visible.value = true;
  loading.value = true;
  form.id = undefined;
  await handleStoreNameList()
  loading.value = false;
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();

  });

  // 获取sysOauthClientDetails信息
  if (id) {
    form.id = id;
    await getStoreDetail(id);
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
    console.log(form);
    const pictureIds = form.pictureIds?.map(item => (item.id))
    form.id ? await EditdrinksMeal({ ...form, pictureIds }) : await AdddrinksMeal({ ...form, pictureIds });
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
  let { data } = await getAreaById(id)
  data.pictureIds = data.pictureFileVOs?.map((item: any) => ({ id: item.id, name: item.fileName }))
  Object.assign(form, data)

};

const uploadChange = (type: 'pictureIds', fileList: any[]) => {

  form[type] = fileList

}

//跟新下拉门店名称
const handleStoreNameList = async () => {
  const { data } = await getStoreName()
  storeNameList.value = data
  console.log(data);

}


// 暴露变量
defineExpose({
  openDialog,
});
</script>
