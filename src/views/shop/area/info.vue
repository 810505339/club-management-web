<template>
  <el-drawer v-model="drawer" :title="t('common.detailBtn')" direction="rtl" destroy-on-close size="50%">
    <div class="text-[#fff]">
      <el-form :model="userInfo" label-width="120px">
        <el-form-item :label="t('area.id')" prop="id">
          {{ userInfo.id }}
        </el-form-item>
        <el-form-item :label="t('area.name')" prop="name">
          {{ userInfo.name }}
        </el-form-item>
        <el-form-item :label="t('area.store')" prop="storeVO">
          {{ userInfo.storeVO.name }}
        </el-form-item>
        <el-form-item :label="$t('area.image')" prop="pictureIds" width="100">
          <el-image class=" my-2 rounded-md" fit="cover" v-for="item in userInfo.pictureFIleVOs" :key="item.id"
            :src="`${fileCommonUrl}/${item.fileName}`" />
        </el-form-item>
        <el-form-item :label="t('area.deckimage')" prop="pictureIds" width="100">
          <el-image class=" my-2 rounded-md" fit="cover" v-for="item in userInfo.seatPictureFileVO" :key="item.id"
            :src="`${fileCommonUrl}/${item.fileName}`" />
        </el-form-item>



        <el-form-item :label="t('area.time')" prop="businessDateVOS">
          <div v-for="item, index in timerFormat(userInfo.businessDateVOS)" :key="index" class="my-2">
            {{ item }}
          </div>
        </el-form-item>

        <el-form-item :label="t('area.deck')" prop="boothDTOList">
          <el-table :data="userInfo.boothVOS" style="width: 100%">

            <el-table-column prop="name" :label="t('area.deckname')" />
            <el-table-column prop="maxAccommodate" :label="t('area.capacity')" />

            <!-- <el-table-column prop="minConsumption" :label="t('area.spend')" /> -->
            <el-table-column prop="reserveAmount" :label="t('area.reservation')" />
          </el-table>



        </el-form-item>


      </el-form>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="shop-list-info">
import { useI18n } from 'vue-i18n'
import { getAreaById } from '/@/api/admin/area'
import { useUserInfo } from '/@/stores/userInfo'
import { weekdayFormat } from '/@/utils/formatTime'
const drawer = ref(false)
const { t } = useI18n()
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)

const userInfo = reactive({
  name: '',
  pictureFileVOs: [],
  videoFileVOs: [],
  introduction: '',
  id: undefined,
  address: ''

})
async function open(id: string) {
  await getInfo(id)
  drawer.value = true
}

const getInfo = async (id: string) => {
  const { data } = await getAreaById(id)
  console.log(data)
  Object.assign(userInfo, data)

}

//初始化时间
function timerFormat(list: any[]) {

  return list.map((item) => {
    return `${weekdayFormat(Number(item.weekDay), t)}  ${item.beginTime}~${weekdayFormat(Number(item.weekDay), t)}  ${item.endTime}`
  })

}
defineExpose({
  open
})


</script>
<style scoped>
:deep(.el-form-item__content) {
  display: block
}
</style>
