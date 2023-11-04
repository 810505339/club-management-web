<!--
 * @Author: yxx
 * @Date: 2023-10-16 22:00:46
 * @LastEditTime: 2023-11-04 20:06:14
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\views\operating\adv\banner\info.vue
-->
<template>
  <el-drawer v-model="drawer" :title="t('common.detailBtn')" direction="rtl" destroy-on-close>

    <el-form :model="bannerInfo" label-width="120px">
      <el-form-item :label="t('banner.id')">
        {{ bannerInfo.id }}
      </el-form-item>
      <el-form-item :label="t('banner.type')">
        {{ bannerInfo.type == 0 ? t('banner.imageH5') : t('banner.image') }}
      </el-form-item>
      <el-form-item :label="t('banner.banner')">
        <el-image class="h-60 my-2 rounded-md" fit="cover" v-for="item in bannerInfo.pictureFile" :key="item.id"
          :src="`${fileCommonUrl}/${item.fileName}`" />
      </el-form-item>
      <el-form-item :label="t('banner.introduce')">
        {{ bannerInfo.weightiness }}
      </el-form-item>
      <el-form-item :label="t('banner.time')">
        {{ bannerInfo.validityTime }}
      </el-form-item>
      <el-form-item :label="t('banner.address')">
        {{ bannerInfo.dynamicStateId }}
      </el-form-item>
      <el-form-item :label="t('banner.name')">
        <template v-for="(item, index) in bannerInfo.storeVOS">{{ item.name }}&nbsp;</template>
      </el-form-item>
      <el-form-item :label="t('banner.number')">
        {{ bannerInfo.click_number }}
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts" name="shop-list-info">
import { useI18n } from 'vue-i18n'
import { getCarouselId } from '/@/api/operating/banner';
import { useUserInfo } from '/@/stores/userInfo'
const drawer = ref(false)
const { t } = useI18n()
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)

const bannerInfo: any = reactive({

})
async function open(id: string) {
  await getInfo(id)
  drawer.value = true
}

const getInfo = async (id: string) => {
  const { data } = await getCarouselId(id)
  console.log(data)
  Object.assign(bannerInfo, data)

}
defineExpose({
  open
})


</script>
