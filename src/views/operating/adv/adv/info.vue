<!--
 * @Author: yxx
 * @Date: 2023-10-16 22:00:46
 * @LastEditTime: 2023-11-04 20:06:59
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\views\operating\adv\adv\info.vue
-->
<template>
  <el-drawer v-model="drawer" :title="t('common.detailBtn')" direction="rtl" destroy-on-close>

    <el-form :model="advInfo" label-width="120px">
      <el-form-item :label="t('adv.id')" prop="id">
        {{ advInfo.id }}
      </el-form-item>
      <el-form-item :label="t('adv.type')">
        {{ advInfo.type == 0 ? t('banner.imageH5') : t('banner.image') }}
      </el-form-item>
      <el-form-item :label="t('adv.name')" prop="name">
        {{ advInfo.name }}
      </el-form-item>
      <el-form-item :label="t('adv.description')" prop="name">
        {{ advInfo.description }}
      </el-form-item>
      <el-form-item :label="t('adv.time')" prop="validityTime">
        {{ advInfo.validityTime }}
      </el-form-item>

      <el-form-item :label="t('adv.image')" prop="pictureIds">
        <el-image class="h-60 my-2 rounded-md" fit="cover" v-for="item in advInfo.pictureFile" :key="item.id"
          :src="`${fileCommonUrl}/${item.fileName}`" />
      </el-form-item>
      <el-form-item :label="t('adv.address')" prop="address">
        <template v-for="(item, index) in advInfo.storeVOS">{{ item.name }}&nbsp;</template>
      </el-form-item>
      <el-form-item :label="t('banner.number')">
        {{ advInfo.click_number }}
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts" name="shop-list-info">
import { useI18n } from 'vue-i18n'
import { getCarouselId } from '/@/api/operating/adv';
import { useUserInfo } from '/@/stores/userInfo'
const drawer = ref(false)
const { t } = useI18n()
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)

const advInfo: any = reactive({
  name: '',
  type: null,
  pictureFile: [],
  storeVOS: [],
  introduction: '',
  id: null,

})
async function open(id: string) {
  await getInfo(id)
  drawer.value = true
}

const getInfo = async (id: string) => {
  const { data } = await getCarouselId(id)
  console.log(data)
  Object.assign(advInfo, data)

}
defineExpose({
  open
})


</script>
