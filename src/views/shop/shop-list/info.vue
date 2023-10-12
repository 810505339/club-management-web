<template>
  <el-drawer v-model="drawer" :title="t('common.detailBtn')" direction="rtl" destroy-on-close>
    <div class="text-[#fff]">
      <el-form :model="userInfo" label-width="120px">
        <el-form-item :label="t('shopList.id')" prop="id">
          {{ userInfo.id }}
        </el-form-item>
        <el-form-item :label="t('shopList.name')" prop="name">
          {{ userInfo.name }}
        </el-form-item>
        <el-form-item :label="t('shopList.introduce')" prop="introduction">
          {{ userInfo.introduction }}
        </el-form-item>
        <el-form-item :label="t('shopList.address')" prop="address">
          {{ userInfo.name }}
        </el-form-item>
        <el-form-item :label="t('shopList.image')" prop="pictureIds">
          <el-image class="w-60 my-2 rounded-md" fit="cover" v-for="item in userInfo.pictureFileVOs" :key="item.id"
            :src="`${fileCommonUrl}/${item.fileName}`" />
        </el-form-item>
        <el-form-item :label="t('shopList.video')" prop="videoIds">
          <video :src="`${fileCommonUrl}/${userInfo?.videoFileVOs?.[0]?.fileName}`" controls
            class="w-60 h-40 my-2 rounded-md" v-if="userInfo.videoFileVOs" />
        </el-form-item>


      </el-form>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="shop-list-info">
import { useI18n } from 'vue-i18n'
import { getStoreById } from '/@/api/admin/store'
import { useUserInfo } from '/@/stores/userInfo'
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
  const { data } = await getStoreById(id)
  console.log(data)
  Object.assign(userInfo, data)

}
defineExpose({
  open
})


</script>
