<template>
  <div class="flex p-2.5 absolute inset-0 ">
    <div class="flex-auto border border-[#FFFFFF40] bg-[#00000040] rounded-xl mr-5 overflow-hidden p-6">
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

      <el-scrollbar height="450px">

        <div class="flex h-[300px] gap-6">
          <div class="flex-1 rounded-3xl bg-[#72AA3D80]  text-[#CAF16CFF] p-6 flex flex-col">
            <header class="text-base font-semibold">订单及流水统计</header>
            <div class="text-xs font-semibold">订单总量 <span class="text-white text-2xl ml-2">517,563,254</span> </div>
            <div class="text-xs font-semibold">流水总计 <span class="text-white text-2xl ml-2">17,563,254.23</span></div>
            <div ref="dom" class="flex-auto"></div>
          </div>
          <div class="flex-1 rounded-3xl bg-[#CB7B2480] p-6  text-[#EBB77FFF]">
            <header class="text-base font-semibold">订单及流水统计</header>
            <div>
              <div v-for="item, index in 10" :key="item" class="flex justify-center">
                <span class="bg-[#EBB77F] rounded-2xl py-1 px-1.5 text-[#000000] text-sx">No.{{ index + 1 }}</span>
                <div class="overflow-hidden  flex-auto ">
                  <div class="text-overflow">商品名称商品名称商商品名称商品名称商商品名称商品名称商</div>
                </div>
                <span class="flex-shrink-0 font-bold text-lg">$ 452,054.54</span>
              </div>
            </div>
          </div>
          <div class="flex-1 rounded-3xl bg-[#3F4FD780] p-6 "></div>
        </div>

        <div class="flex h-[320px] gap-6 mt-5">
          <div class="flex-1 rounded-3xl bg-[#8645BD80]"></div>
          <div class="flex-1 rounded-3xl bg-[#BB2B5D80]"></div>
          <div class="flex-1 rounded-3xl bg-[#278BA880]"></div>
        </div>

      </el-scrollbar>



    </div>
    <div class="w-[300px] border border-[#FFFFFF40] bg-[#00000040]  rounded-xl overflow-hidden">1</div>
  </div>
</template>

<script setup lang="ts" name="home">
import { getStoreName } from '/@/api/admin/store'
import dayjs from 'dayjs'
import { useOptions } from './eCharts/stackedChat'

const dom = ref<HTMLElement>()
const active = ref(0)
const storeNameList = ref<any[]>([])
onMounted(() => {
  if (dom.value) {
    useOptions(dom.value)
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
