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
              <el-select v-model="parmas.storeId" :placeholder="$t('shopList.nameSelect')">
                <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id"
                  clearable>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="查看时间" prop="time">
              <el-date-picker type="datetimerange" range-separator="To" class="w-10" start-placeholder="Start date"
                end-placeholder="End date" format="YYYY-MM-DD" @change="change" />
            </el-form-item>
          </el-form>

        </div>
      </header>

      <!-- <BoothReservation v-show="active === 0" class="mt-10" /> -->


      <el-scrollbar height="450px" class="pr-6 pb-5" v-show="active === 0">
        <div class="py-10">
          <div class="flex h-[320px] gap-6">
            <div class="w-1/3 rounded-3xl bg-[#72AA3D80]  text-[#CAF16CFF] p-6 flex flex-col relative">
              <img :src="cardIcon1" class="absolute z-10 right-5 top-10" />
              <header class="text-base font-semibold">订单及流水统计</header>
              <div class="text-xs font-semibold">订单总量 <span class="text-white text-2xl ml-2">{{
                resList[0]?.orderTotalCount }}</span> </div>
              <div class="text-xs font-semibold">流水总计 <span class="text-white text-2xl ml-2">{{
                resList[0]?.saleTotalAmount }}</span></div>
              <div ref="dom" class="flex-auto"></div>
            </div>
            <div class="w-1/3 rounded-3xl bg-[#CB7B2480] py-6  text-[#EBB77FFF] flex flex-col relative">
              <img :src="cardIcon2" class="absolute z-10 right-5 top-10" />
              <header class="text-base font-semibold px-6">酒水套餐排行榜</header>
              <el-scrollbar>
                <div class="mt-5 px-6">
                  <div v-for="item, index in resList[1]" :key="item" class="flex justify-center items-center">
                    <span
                      class="bg-[#EBB77F]  h-4 py-1 px-1.5 rounded-lg flex items-center   text-[#000000] text-xs">No.{{
                        index + 1
                      }}</span>
                    <div class="flex-auto ml-4">
                      <div class="truncate">{{ item.drinksMealName }}</div>
                    </div>
                    <span class="flex-shrink-0 font-bold text-lg text-white ml-4">$ {{ item.amount }}</span>
                  </div>
                </div>
              </el-scrollbar>

            </div>
            <div class="w-1/3 rounded-3xl bg-[#3F4FD780] p-6 text-[#D5DFFFFF] flex flex-col relative">
              <img :src="cardIcon3" class="absolute z-10 right-5 top-10" />
              <header class="text-base font-semibold">区域偏好数据</header>
              <div class="mt-5">
                <div class="text-xs">数据来源：用户预订卡座、拼酒局时选择的区域</div>
              </div>
              <div ref="dom3" class="flex-auto"></div>
            </div>
          </div>
          <div class="flex h-[320px] gap-6 mt-5">
            <div class="w-1/3 rounded-3xl bg-[#8645BD80] p-6 text-[#E6C9FFFF] flex flex-col relative">
              <img :src="cardIcon4" class="absolute z-10 right-5 top-10" />
              <header class="text-base font-semibold">用户性别、年龄占比</header>
              <div class="text-xs flex items-center justify-between mt-2.5">
                <span>用户性别构成</span>
                <span>共计:{{ resList[3]?.customerTotalCount }}人</span>
              </div>
              <div ref="sexDom" class="h-20 w-full"></div>
              <div ref="dom4" class="flex-auto" />

            </div>
            <div class="w-1/3 rounded-3xl bg-[#BB2B5D80] p-6 text-[#FEB6CBFF] flex flex-col relative">
              <img :src="cardIcon5" class="absolute z-10 right-5 top-10" />
              <header class="text-base font-semibold">用户来店方式占比</header>
              <div ref="dom5" class="flex-auto"></div>
            </div>
            <div class="w-1/3 rounded-3xl bg-[#278BA880]  p-6 flex text=[#98DCEAFF] flex-col relative">
              <img :src="cardIcon6" class="absolute z-10 right-5 top-10" />
              <header class="text-base font-semibold">拼酒局数据概况</header>
              <div class="text-xs font-semibold">拼酒局总次数 <span class="text-white text-2xl ml-2">{{
                resList[5]?.winePartyTotalCount }}</span> </div>
              <div class="text-xs font-semibold">拼酒局成功率 <span class="text-white text-2xl ml-2">{{
                resList[5]?.successRateTotal }}</span></div>
              <div ref="dom6" class="flex-auto"></div>
            </div>
          </div>
        </div>
      </el-scrollbar>



    </div>

    <div>
      <el-scrollbar height="100%">
        <div class="w-[400px] mr-2.5 border border-[#FFFFFF40] bg-[#00000040]  rounded-xl  relative p-6 ">
          <img class="absolute z-10 left-0 right-0 top-0" :src="userBg" />
          <div class="relative z-20">
            <header>
              <div class="flex flex-row justify-between">
                <div>
                  <div class="text-white text-[32px] font-bold">Sherlock Holmes</div>
                  <div class="text-base text-[#CFD3DC]">系统管理员</div>
                </div>
                <div>
                  <el-avatar :size="128" :src="'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                </div>
              </div>
              <div class="text-[#E6A055FF] text-base">
                Sharp tools make good work.
              </div>
            </header>
            <section class="mt-6">
              <header class="text-[#CFD3DC] text-xl font-bold">待办事项</header>
              <div class="">
                <div v-for="todo, index in todos" :key="index" class="h-[118px]  relative py-4 px-5 my-2.5 cursor-pointer"
                  :class="[todo.color]">
                  <img class="absolute z-10 left-0 right-0 top-0" :src="todo.bg" />
                  <div class="relative z-20 ">
                    <div class="text-sm">{{ todo.title }}</div>
                    <div class="mt-6">
                      <span class="text-5xl font-bold">{{ todo.num }}</span>
                      <span class="text-sm font-normal">{{ todo.sub }}</span>
                    </div>
                    <div class="absolute z-30 w-8 h-8 right-0 top-[50%] -translate-x-1/2">
                      <img :src="todo.icon" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

      </el-scrollbar>
    </div>

  </div>
</template>

<script setup lang="ts" name="home">
import { getStoreName } from '/@/api/admin/store'
import dayjs from 'dayjs'
import { useStackedChatOptions } from './eCharts/stackedChat'
import useBarOptions from './eCharts/bar'
import usePieOptions from './eCharts/pie'
import usehorizontalBarOptions from './eCharts/horizontalBar'
import BoothReservation from './BoothReservation.vue'

import cardIcon1 from '/@/assets/home/card_1.png'
import cardIcon2 from '/@/assets/home/card_2.png'
import cardIcon3 from '/@/assets/home/card_3.png'
import cardIcon4 from '/@/assets/home/card_4.png'
import cardIcon5 from '/@/assets/home/card_5.png'
import cardIcon6 from '/@/assets/home/card_6.png'

import todoIcon1 from '/@/assets/home/todo1_bg.png'
import todoIcon2 from '/@/assets/home/todo2_bg.png'
import todoIcon3 from '/@/assets/home/todo3_bg.png'
import todoIcon4 from '/@/assets/home/todo4_bg.png'
import todoIcon5 from '/@/assets/home/todo5_bg.png'

import btn1 from '/@/assets/home/btn1.png'
import btn2 from '/@/assets/home/btn2.png'
import btn3 from '/@/assets/home/btn3.png'
import btn4 from '/@/assets/home/btn4.png'
import btn5 from '/@/assets/home/btn5.png'



import userBg from '/@/assets/home/userBg.png'

import useRequest from './hooks/useRequest'
import useParmas from './hooks/useParmas'

const todos = [
  { title: '待处理订单', num: '2534', sub: '个', icon: btn1, bg: todoIcon1, color: 'text-[#E6A055FF]' },
  { title: '拼酒局评论', num: '2534', sub: '条', icon: btn2, bg: todoIcon2, color: 'text-[#3ADBCBFF]' },
  { title: '广播申请', num: '2534', sub: '条', icon: btn3, bg: todoIcon3, color: 'text-[#FF6035FF]' },
  { title: '退款审核', num: '2534', sub: '条', icon: btn4, bg: todoIcon4, color: 'text-[#759BFFFF]' },
  { title: '优惠券审核', num: '2534', sub: '条', icon: btn5, bg: todoIcon5, color: 'text-[#FAAD14FF]' },
]


const dom = ref<HTMLElement>()

const { params } = useParmas()
console.log(params)

const { setOption } = useStackedChatOptions(dom)

const dom3 = ref<HTMLElement>()

const { setOption: setDom3Option } = useBarOptions(dom3)
const dom4 = ref<HTMLElement>()
const { setOption: setDom4Option } = usePieOptions(dom4, {
  radius: ['40%', '70%'],
  legend: {
    orient: 'vertical',
    x: 'left',
    y: 'center',
    textStyle: {
      color: '#fff'
    },
    width: 400
  },
  grid: {
    bottom: '10%',
    left: '10%'

  },
  center: ['70%', '50%']

})
const dom5 = ref<HTMLElement>()
const { setOption: setDom5Option } = usePieOptions(dom5, {})
const dom6 = ref<HTMLElement>()
const { setOption: setDom6Option } = useStackedChatOptions(dom6)
const sexDom = ref<HTMLElement>()
const { setOption: setSexDomOption } = usehorizontalBarOptions(sexDom)
const active = ref(0)
const storeNameList = ref<any[]>([])

const parmas = ref({
  beginDate: '',
  endDate: '',
  storeId: '1729135883314356225',
})

const { resList } = useRequest(parmas)

const change = (value: any[]) => {
  parmas.value.beginDate = dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss')
  parmas.value.endDate = dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')
}

watch(() => resList.value, (newValue) => {
  console.log(newValue, 'newValue');

  const data1 = newValue[0].orderSaleDateVOS
  const data3 = newValue[2]
  const data4 = newValue[3]
  const data5 = newValue[4]
  const data6 = newValue[5]?.winePartyDateVOS
  setOption({
    xData: data1.map(n => (n.dataDate)), yData: [
      { name: '订单', data: data1.map(n => (n.orderCount)) },
      { name: '流水', data: data1.map(n => (n.amount)) }]
  })
  setDom3Option({
    xData: data3.map(n => (n.areaName)), yData: data3.map(n => (n.count))

  })

  setDom5Option(data5.map(d => ({ name: d.enterWay, value: d.totalCount })))


  setDom6Option({
    xData: data6.map(n => (n.dataDate)), yData: [
      { name: '总成功率', data: data6.map(n => (n.successRate)) },
      { name: '总次数', data: data6.map(n => (n.winePartyCount)) }]
  })

  setSexDomOption(data4?.customerGenderVOS.map(c => ({
    name: c.gender,
    data: [c.count]
  })))

  setDom4Option(data4?.customerAgeVOS?.map(c => ({ name: c.ageSection, value: c.count })))



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
