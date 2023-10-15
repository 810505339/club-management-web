<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
    draggable v-model="visible">
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('area.name')" prop="name">
        <el-input :placeholder="`${t('area.please')}${t('area.name')}`" v-model="form.name" />
      </el-form-item>

      <el-form-item :label="t('area.store')" prop="storeId">
        <el-select v-model="form.storeId" :placeholder="$t('area.nameSelect')" clearable>
          <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id" clearable>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('area.image')" prop="image" width="100">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />
      </el-form-item>

      <el-form-item :label="t('area.time')" prop="name">
        <div>
          <div class="flex my-2" v-for="timer in timerList" :key="timer.id">
            <el-select v-model="timer.weekDay" clearable class="mr-2">
              <el-option v-for="item, index in weekDayList" :key="index" :label="item.label" :value="item.value"
                clearable>
              </el-option>
            </el-select>
            <el-time-picker v-model="timer.time" is-range range-separator="To" start-placeholder="Start time"
              end-placeholder="End time" />
          </div>
          <el-button type="primary" @click="addTimer">{{ t('common.addBtn') }}</el-button>
        </div>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class=" dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
// import { addObj, getObj, putObj, validateclientId } from '/@/api/admin/client';
import { AddArea, EditArea } from '/@/api/admin/area';
import { getStoreName } from '/@/api/admin/store';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import upload from "/@/components/Upload/index.vue";
import { generateUUID } from '/@/utils/other';

const weekDayList = [
  {
    label: '星期一', value: '1'
  },
  {
    label: '星期二', value: '2'
  },
  {
    label: '星期三', value: '3'
  },
  {
    label: '星期四', value: '4'
  },
  {
    label: '星期五', value: '5'
  },
  {
    label: '星期六', value: '6'
  },
  {
    label: '星期天', value: '7'
  },
]



//图片props
const IMG_PROPS = {
  fileSize: 1,
  limit: 10,
  fileType: ['jpg', 'png', 'jpeg']

}


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
defineProps<{ storeNameList: any[] }>()

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const storeList = ref([])

// 定义字典
const { grant_types, common_status } = useDict(
  'grant_types',
  'common_status',
);

// 提交表单数据
const form = reactive({
  name: '',  //区域名称
  pictureIds: [], //图片文件ID
  videoIds: [],
  introduction: '',
  id: undefined, //区域ID
  address: '',
  storeId: '' //所属门店
});

//时间对象

type ITimer = {
  id: string, weekDay: string, time: [Date, Date]
}

const timerList = ref<ITimer[]>([])

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

async function getStoreList() {
  const { data } = await getStoreName()
  console.log(data);

  storeList.value = data

}

// 打开弹窗
const openDialog = async (id: string) => {

  await getStoreList()
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
    form.pictureIds = form.pictureIds?.map(item => (item.id))
    form.videoIds = form.videoIds?.map(item => (item.id))
    form.id ? await EditStore(form) : await AddStore(form);
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

const uploadChange = (type: 'pictureIds', fileList: any[]) => {

  form[type] = fileList

}


//添加时间
const addTimer = () => {
  const timer: ITimer = {
    id: `id_${generateUUID()}`,
    weekDay: '',
    time: [
      new Date(2016, 9, 10, 0, 0),
      new Date(2016, 9, 10, 0, 0),
    ]
  }
  timerList.value.push(timer)

}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
