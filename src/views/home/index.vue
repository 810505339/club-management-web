<template>
  <div class="flex p-2.5 absolute inset-0 ">
    <div class="flex-auto border border-[#FFFFFF40] bg-[#00000040] rounded-xl mr-5 overflow-hidden py-6 pl-6">
      <header>
        <div class="flex items-center">
          <label class="text-[#CFD3DCFF] text-xl font-semibold mr-5">工作台</label>
          <div class="py-[4px] px-[10px] rounded-2xl   text-xs items-center justify-center cursor-pointer mr-[5px]"
            :class="[activeClass(0)]" @click="changeActive(0)">
            卡座实时概况
          </div>
          <div class="py-[4px] px-[10px] text-xs rounded-2xl flex items-center justify-center  cursor-pointer"
            :class="[activeClass(1)]" @click="changeActive(1)">数据看板</div>
        </div>
        <div class="mt-10">
          <el-form inline>
            <el-form-item :label="$t('shopList.name')" prop="name">
              <el-select v-model="state.name" :placeholder="$t('shopList.nameSelect')">
                <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.name"
                  clearable>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查看时间" prop="time">
              <el-date-picker v-model="state.time" type="datetimerange" range-separator="To" class="w-10"
                start-placeholder="Start date" end-placeholder="End date" format="YYYY-MM-DD" />
            </el-form-item>
          </el-form>

        </div>
      </header>

      <el-scrollbar height="450px" class="pr-6 pb-5">
        <div class="py-10">
          <div class="flex h-[300px] gap-6">
            <div class="w-1/3 rounded-3xl bg-[#72AA3D80]  text-[#CAF16CFF] p-6 flex flex-col ">
              <header class="text-base font-semibold">订单及流水统计</header>
              <div class="text-xs font-semibold">订单总量 <span class="text-white text-2xl ml-2">517,563,254</span> </div>
              <div class="text-xs font-semibold">流水总计 <span class="text-white text-2xl ml-2">17,563,254.23</span></div>
              <div ref="dom" class="flex-auto"></div>
            </div>
            <div class="w-1/3 rounded-3xl bg-[#CB7B2480] p-6  text-[#EBB77FFF] flex flex-col ">
              <header class="text-base font-semibold">酒水套餐排行榜</header>
              <div class="mt-5">
                <div v-for="item, index in 9" :key="item" class="flex justify-center items-center">
                  <span class="bg-[#EBB77F]  h-4 py-1 px-1.5 rounded-lg flex items-center   text-[#000000] text-xs">No.{{
                    index + 1
                  }}</span>
                  <div class="flex-auto ml-4">
                    <div class="truncate">商品名称商品名称商商品名称商品名称商商品名称商品名称商</div>
                  </div>
                  <span class="flex-shrink-0 font-bold text-lg text-white ml-4">$ 452,054.54</span>
                </div>
              </div>
            </div>
            <div class="w-1/3 rounded-3xl bg-[#3F4FD780] p-6 text-[#D5DFFFFF]">
              <header class="text-base font-semibold">区域偏好数据</header>
              <div class="mt-5">
                <div class="text-xs">数据来源：用户预订卡座、拼酒局时选择的区域</div>
                <div></div>
              </div>

            </div>
          </div>
          <div class="flex h-[320px] gap-6 mt-5">
            <div class="w-1/3 rounded-3xl bg-[#8645BD80] p-6"></div>
            <div class="w-1/3 rounded-3xl bg-[#BB2B5D80] p-6"></div>
            <div class="w-1/3 rounded-3xl bg-[#278BA880]  p-6 flex flex-col">
              <header class="text-base font-semibold">拼酒局数据概况</header>
              <div class="text-xs font-semibold">拼酒局总次数 <span class="text-white text-2xl ml-2">517,563,254</span> </div>
              <div class="text-xs font-semibold">拼酒局成功率 <span class="text-white text-2xl ml-2">56.23%</span></div>
              <div ref="dom5" class="flex-auto"></div>
            </div>
          </div>
        </div>
      </el-scrollbar>



    </div>
    <div class="w-[300px] border border-[#FFFFFF40] bg-[#00000040]  rounded-xl overflow-hidden">1</div>
  </div>
</template>

<script setup lang="ts" name="home">
import { getStoreName } from '/@/api/admin/store'
import dayjs from 'dayjs'
import { useStackedChatOptions } from './eCharts/stackedChat'

const dom = ref<HTMLElement>()
const dom5 = ref<HTMLElement>()
const active = ref(0)
const storeNameList = ref<any[]>([])
onMounted(() => {
  if (dom.value && dom5.value) {
    useStackedChatOptions(dom.value)
    useStackedChatOptions(dom5.value)
  }
})

const state = ref({
  name: '',
  time: [
    dayjs(),
    dayjs(),
  ]
})
const activeClass = (index: number) => {
  return active.value == index ? 'bg-[#409EFFFF]' : 'border'
}

const changeActive = (index: number) => {
  active.value = index
}

//跟新下拉门店名称
const handleStoreNameList = async () => {
  const { data } = await getStoreName()
  storeNameList.value = data
}

handleStoreNameList()


</script>

<style scoped lang="scss">
:deep(.el-date-editor) {
  width: 300px !important;
}
</style>
