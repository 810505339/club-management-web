<template>
  <el-dialog :close-on-click-modal="false" width="800" title="数据统计" draggable v-model="visible">
    <div>
      <div class="flex ">
        <div class="w-1 rounded bg-[#409EFFFF] h-5 items-center"></div>
        <div class="ml-5">基本信息</div>
      </div>
      <div class="grid   grid-cols-3 gap-4 mt-[10px] mb-[30px]">
        <div v-for="info in infos" :key="info.key">
          <span>{{ info.title }}:</span>
          <span class="ml-2 text-sm font-semibold">{{ info.value }}</span>
        </div>
      </div>
      <div class="flex mb-[10px]">
        <div class="w-1 rounded bg-[#409EFFFF] h-5 items-center"></div>
        <div class="ml-5">酒水偏好</div>
      </div>
      <div class="text-center  mb-[30px]" v-if="drinksMealList === null || drinksMealList?.length <= 0">暂无数据</div>
      <div class="flex items-center space-x-20 mb-[30px]" v-else>
        <div v-for="drinksMeal, i in drinksMealList" :key="i" class="relative">
          <img :src="drinksMeal?.image" />
          <span class="absolute top-[50%] transform -translate-y-1/2 right-10">{{ drinksMeal.drinksMealName }}</span>
        </div>
      </div>

      <div class="flex items-center ">
        <div class="flex-1 h-36">
          <div class="flex mb-[10px]">
            <div class="w-1 rounded bg-[#409EFFFF] h-5 items-center"></div>
            <div class="ml-5">区域偏好</div>
          </div>
          <div ref="areaPreference" class="flex-auto h-full"></div>

        </div>
        <div class="flex-1 h-36">
          <div class="flex mb-[10px]">
            <div class="w-1 rounded bg-[#409EFFFF] h-5 items-center"></div>
            <div class="ml-5">来店方式</div>
          </div>
          <div ref="enterStore" class="flex-auto h-full"></div>
        </div>


      </div>

    </div>
  </el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { getUserConsumption } from '/@/api/admin/user';
import drinksMeal1 from '/@/assets/user/drinksMeal1.png'
import drinksMeal2 from '/@/assets/user/drinksMeal2.png'
import drinksMeal3 from '/@/assets/user/drinksMeal3.png'
import usePieOptions from '/@/views/home/eCharts/pie'

const visible = ref(false);
const infos = ref([
  {
    title: '用户姓名',
    value: '',
    key: 'customerName'
  },
  {
    title: '性别',
    value: '',
    key: 'gender'
  },
  {
    title: '联系电话',
    value: '',
    key: 'phone'
  },
  {
    title: '累计消费',
    value: '',
    key: 'consumptionTotal'
  },
  {
    title: '拼酒局次数',
    value: '',
    key: 'winePartyCount'
  },
  {
    title: '拼酒成功率',
    value: '',
    key: 'successPercent'
  },
]) //基本信息
const drinksMealList = ref([]) //酒水套餐偏好
const drinksMealImage = [drinksMeal1, drinksMeal2, drinksMeal3]

const res = ref({})
const areaPreference = ref() //区域偏好
const enterStore = ref() //来店方式

const { setOption: setOption } = usePieOptions(areaPreference, {})
const { setOption: setOption_1 } = usePieOptions(enterStore, {})
const openDialog = async (id: string) => {
  visible.value = true

  await getUserConsumptionApi(id)
}

const getUserConsumptionApi = async (id: string) => {
  const res = await getUserConsumption(id)



  res.gender = res.gender === 1 ? '男' : '女'
  res.consumptionTotal = '$' + res.consumptionTotal


  infos.value = infos.value.map(info => {
    return {
      ...info,
      value: res[info.key]
    }
  });
  drinksMealList.value = res.drinksMealPreferences?.sort((a, b) => a.ranking - b.ranking).map(drink => {
    return {
      ...drink,
      image: drinksMealImage[drink.ranking - 1]
    }
  })

  res.value = res

  nextTick(() => {


    setOption(res.value.areaPreferences?.map(area => ({ name: area.areaName, value: area.areaPercent })) ?? [])
    setOption_1(res.value.enterStores?.map(enter => ({ name: enter.type, value: enter.wayPercent })) ?? [])
  })

}



// 暴露变量
defineExpose({
  openDialog,
});
</script>
