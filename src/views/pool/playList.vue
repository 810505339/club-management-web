<template>
  <div class="grid grid-cols-2 gap-2.5 pl-3.5">
    <div class="  box-border p-2.5 rounded-xl item-bg relative border border-[#4A2434] text-[#FF88B9FF]"
      v-for="item in playerList" :key="item.phoneNumber">
      <div class="absolute -z-10 right-0 bottom-0 flex justify-center items-center">
        <img :src="getImgByType('type1')" />
      </div>
      <div class="text-base font-bold">{{ item.name }}</div>
      <div class="text-xs mt-2.5 flex items-center justify-between">
        <span> {{ item.phoneNumber }}</span>
        <span class=" text-[#16191FFF] bg-[#FED753FF] rounded-xl border border-[#FED753] px-2">{{ item.playerType
        }}</span>


      </div>
      <div class="text-xs mt-2.5">
        <UseClipboard v-slot="{ copy }" :source="item.orderNo">
          <div @click="copy()">
            订单：{{ item.orderNo }}
            <el-icon class="text-white text-base">
              <CopyDocument />
            </el-icon>
          </div>
        </UseClipboard>


      </div>
      <div class="text-white text-base font-bold mt-2.5">${{ item.payAmount }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type1 from '/@/assets/home/type1.png'
import type2 from '/@/assets/home/type2.png'
import type3 from '/@/assets/home/type3.png'
import { UseClipboard } from '@vueuse/components'
export type IPlayerItem = {
  phoneNumber: string,
  name: string,
  payAmount: string,
  playerType: string,
  orderNo: string

}

const props = defineProps<{
  playerList: Array<IPlayerItem>
}>()


function getImgByType(type: string) {
  return {
    type1: type1,
    type2: type2,
    type3: type3
  }[type]
}
</script>
