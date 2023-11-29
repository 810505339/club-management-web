<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="700"
    draggable v-model="visible">
    <el-form :model="form" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('area.name')" prop="name">
        <el-input :placeholder="`${t('area.please')}${t('area.name')}`" v-model="form.name" />
      </el-form-item>

      <el-form-item :label="t('area.store')" prop="storeId">
        <el-select v-model="form.storeId" :placeholder="$t('area.nameSelect')" clearable>
          <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id" clearable>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('area.image')" prop="pictureIds" width="100">
        <upload v-bind="IMG_PROPS" class="w-full" :model-value="form.pictureIds"
          @change="(_, fileList) => uploadChange('pictureIds', fileList)" />
      </el-form-item>

      <el-form-item :label="t('area.deckimage')" prop="seatPicture" width="100" class="mb-2">
        <upload v-bind="ITEM_IMG_PROPS" class="w-full" :model-value="form.seatPicture"
          @change="(_, fileList) => uploadChange('seatPicture', fileList)" />
      </el-form-item>

      <el-form-item :label="t('area.time')" prop="businessDateDTOList">
        <div>
          <div class="flex my-2" v-for="timer in  7 " :key="timer">
            <div class="flex ">
              <el-select class="mr-2" v-model="form.businessDateDTOList[timer - 1].weekDay">
                <el-option v-for=" item, index  in  weekDayList " :key="index" :label="item.label" :value="item.value"
                  :disabled="true">
                </el-option>
              </el-select>

              <el-time-picker v-model="form.businessDateDTOList[timer - 1].beginTime" class="mr-4" format='HH:mm:ss'
                value-format='HH:mm:ss' />
              <el-time-picker v-model="form.businessDateDTOList[timer - 1].endTime" format='HH:mm:ss'
                value-format='HH:mm:ss' />
            </div>


          </div>


        </div>
      </el-form-item>

      <el-form-item :label="t('area.deck')" prop="boothDTOList">
        <div>
          <div v-for="item in form.boothDTOList" :key="item.id" class="my-5">
            <div>

              <el-form-item :label="t('area.deckname')" prop="item.name" width="100" class="mb-2">
                <el-input v-model="item.name" />
              </el-form-item>
              <el-form-item :label="t('area.capacity')" prop="item.name" width="100" class="mb-2">
                <el-input-number v-model="item.maxAccommodate" :step="1" :min="1" />
              </el-form-item>
              <el-form-item :label="t('area.spend')" prop="item.minConsumption" width="100" class="mb-2">
                <el-input-number v-model="item.minConsumption" :precision="2" :step="0.01" :min="0.00" />
              </el-form-item>
              <el-form-item :label="t('area.reservation')" prop="item.reservation" width="100" class="mb-2">
                <el-input-number v-model="item.reserveAmount" :precision="2" :step="0.01" :min="0.00" />
              </el-form-item>
            </div>

          </div>

          <div class="mt-2">
            <el-button type="primary" @click="addDeck">{{ t('common.addBtn') }}</el-button>
          </div>
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
import { AddArea, EditArea, getAreaById } from '/@/api/admin/area';
import { getStoreName } from '/@/api/admin/store';
import { useI18n } from 'vue-i18n';
import upload from "/@/components/Upload/index.vue";
import { generateUUID } from '/@/utils/other';
import dayjs from 'dayjs';


//图片props
const IMG_PROPS = {
  fileSize: 1,
  limit: 10,
  fileType: ['jpg', 'png', 'jpeg']
}

const ITEM_IMG_PROPS = {
  fileSize: 1,
  limit: 1,
  fileType: ['jpg', 'png', 'jpeg']
}


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
defineProps<{ storeNameList: any[] }>()

const { t } = useI18n();



const weekDayList = Array.from({ length: 7 },
  (_, index) => ({ label: t(`common.week${index + 1}`), value: index + 1, disabled: false }))


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

type IboothDTOListItem = {
  id: string,
  name: string,

  maxAccommodate: string,
  minConsumption: string,
  reserveAmount: string
}

const createTimer = (weekDay: number) => {
  return {
    areaId: `${generateUUID()}`,
    weekDay: weekDay,
    endTime: '',
    beginTime: '',
    disabled: false
  }
}

// 提交表单数据
const form = reactive<{ boothDTOList: IboothDTOListItem[], businessDateDTOList: ITimer[], name: string, id: string | undefined, storeId: string, pictureIds: any[], seatPicture: any[] }>({
  name: '',  //区域名称
  pictureIds: [], //图片文件ID
  seatPicture: [], //卡座图片
  id: undefined, //区域ID
  storeId: '', //所属门店
  boothDTOList: [],
  businessDateDTOList: Array.from({ length: 7 }, (_, index) => createTimer(index + 1)),

});

//时间对象

type ITimer = {
  areaId: string, weekDay: string, beginTime: Date, endTime: Date, disabled: boolean
}




// 定义校验规则
// const dataRules = ref({
//   name: [
//     { required: true, message: `${t('shopList.name')}${t('common.empty')}`, trigger: 'blur' },

//   ],
//   introduce: [

//   ],
//   address: [
//     { required: true, message: `${t('shopList.address')}${t('common.empty')}`, trigger: 'blur' },
//   ],
// });

async function getStoreList() {
  const { data } = await getStoreName()

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
    await getStoreDetail(id);
  }
};

// 提交
const onSubmit = async () => {
  // const valid = await dataFormRef.value.validate().catch(() => {
  // });
  // if (!valid) return false;
  console.log(form);
  try {
    loading.value = true;

    const temp = {
      ...form,
      pictureIds: form.pictureIds.map(item => item.id),
      seatPicture: form.pictureIds.map(item => item.id),
      boothDTOList: form.boothDTOList.map(item => {
        return {
          ...item,
        }
      })

    }


    form.id ? await EditArea(temp) : await AddArea(temp);
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
    ;
  data.storeId = data.storeVO.id
  data.pictureIds = data?.pictureFIleVOs?.map((item: any) => ({ id: item.id, name: item.fileName }))
  data.seatPicture = data?.seatPictureFileVO?.map((item: any) => ({ id: item.id, name: item.fileName }))
  data.businessDateDTOList = data.businessDateVOS
  data.boothDTOList = data.boothVOS.map((item: any) => {
    return {
      ...item,
    }
  })

  Object.assign(form, data)



};

const uploadChange = (type: string, fileList: any[]) => {


  form[type] = fileList

}


//添加时间
const addTimer = () => {

  let flag = false
  const len = form.businessDateDTOList.length - 1
  const lastItem = form.businessDateDTOList[len]
  flag = Object.values(form.businessDateDTOList[len]).some(item => {
    return item === ''
  })

  flag = lastItem.endWeekDay < lastItem.beginWeekDay

  if (flag) {
    useMessage().error(t('common.please'))
    return
  }

  const timer: ITimer = createTimer()
  lastItem.disabled = true
  weekDayList.forEach((item) => {
    if (item.value <= lastItem.endWeekDay) {
      item.disabled = true
    }
  })

  form.businessDateDTOList.push(timer)

}

const deleteTimer = (id: string) => {
  form.businessDateDTOList = form.businessDateDTOList.filter((timer) => (timer.id != id))
  const len = form.businessDateDTOList.length - 1
  const lastItem = form.businessDateDTOList[len]
  lastItem.disabled = false
  weekDayList.forEach((item) => {
    if (item.value >= lastItem.endWeekDay) {
      item.disabled = false
    }
  })

}

//添加卡座
const addDeck = () => {
  form.boothDTOList.push(
    {
      id: `${generateUUID()}`,
      name: '',
      maxAccommodate: '0',
      minConsumption: '0',
      reserveAmount: '0'
    }
  )
}




// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style>
.el-form-item .el-form-item {
  margin-bottom: 10px;
}
</style>
