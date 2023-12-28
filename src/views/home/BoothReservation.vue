<!--
 * @Author: yxx
 * @Date: 2023-11-29 21:34:54
 * @LastEditTime: 2023-12-27 23:13:34
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\views\home\BoothReservation.vue
-->
<template>
  <el-scrollbar class="booth-reservation">
    <el-form inline>
      <el-form-item :label="$t('shopList.name')" prop="name">
        <el-select v-model="state.name" :placeholder="$t('shopList.nameSelect')">
          <el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.name" clearable>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡座使用概况：" prop="time">
        <template v-for="item in 6" :key="item">
          使用中 <el-tag class="mx-1" effect="dark" round>
            100
          </el-tag>
        </template>
      </el-form-item>
    </el-form>

    <el-tabs type="card" v-model="activeName">
      <el-tab-pane label="Lounge" name="Lounge"> </el-tab-pane>
      <el-tab-pane label="Lounge Hip-Hop" name="Lounge Hip-Hop"> </el-tab-pane>
      <el-tab-pane label="Dance Club" name="Dance Club"> </el-tab-pane>
    </el-tabs>
    <div class="flex px-[20px] ">
      <div class="mr-[40px]">
        <div class="text-[16px] mb-[20px]">{{ activeName }} 座位平面图</div>
        <img class="w-[375px] h-[580px]" :src="getImageUrl('booth')" alt="">
      </div>
      <div class="flex-1">
        <div class="mb-[20px]"> 卡座使用概况：
          <template v-for="item in 6">
            使用中 <el-tag class="mx-1" effect="dark" round>
              100
            </el-tag>
          </template>
        </div>
        <div class="flex flex-wrap">
          <div class="grid-content green">
            <div class="flex text-[16px] justify-between font-bold">
              <div>
                <span>01</span><span class="title">使用中</span>
              </div>
              <el-button size="small" round @click="dialogVisible = true">详情</el-button>
            </div>
            <div class="flex justify-between mt-[15px] items-center">
              <div class="font-bold">使用人数：4 <span class="text-[rgba(207,211,220,0.50)]">/ 6</span></div>
              <el-button type="success" size="small" plain round>释放卡座</el-button>
            </div>
          </div>
          <div class="grid-content blue">
            <div class="flex text-[16px] justify-between font-bold">
              <div> <span>01</span><span class="title">空闲</span></div>
            </div>
            <div class="flex justify-between  mt-[15px]">
              <div class="font-bold">最大容纳人数：4 </div>
            </div>
          </div>
          <div class="grid-content red">
            <div class="flex text-[16px] justify-between font-bold">
              <div>
                <span>01</span><span class="title">锁定</span>
              </div>
              <el-button size="small" round>详情</el-button>
            </div>
            <div class="flex justify-between  mt-[15px]">
              <div class="font-bold">预定人数：4 <span class="text-[rgba(207,211,220,0.50)]">/ 6</span></div>

            </div>
          </div>
          <div class="grid-content yellow">
            <div class="flex text-[16px] justify-between font-bold">
              <div>
                <span>01</span><span class="title">待付款</span>
              </div>
              <el-button size="small" round>详情</el-button>
            </div>
            <div class="flex justify-between  mt-[15px]">
              <div class="font-bold">预定人数：4 <span class="text-[rgba(207,211,220,0.50)]">/ 6</span></div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="详情">
      <div class="detail">
        <div class="title-line">卡座信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div><span>区域：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div><span>卡座号：</span>C1</div>
          </el-col>
          <el-col :span="8">
            <div><span>已到场/总人数：</span>4/6</div>
          </el-col>
        </el-row>
        <div class="title-line">入场时间</div>
        <el-row>
          <el-col :span="12" v-for="i in 4">
            <div class="mb-[10px]">李先生 13888888888 2023/12/23 20:30:45 门票*1</div>
          </el-col>
        </el-row>

        <div class="title-line">订单信息</div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="mb-[10px]"><span>预订人：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>手机号：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>订单ID：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>下单时间：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>订单类型：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>支付方式：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>实付金额：</span>lounge</div>
          </el-col>
          <el-col :span="8">
            <div class="mb-[10px]"><span>酒水信息：</span>lounge</div>
          </el-col>
        </el-row>
        <div class="title-line">备注</div>
        <div>哈哈哈哈哈哈哈哈哈哈哈</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>

        </span>
      </template>
    </el-dialog>

  </el-scrollbar>
</template>

<script setup lang="ts" name="home">
import { getStoreName } from '/@/api/admin/store'
import dayjs from 'dayjs'
import { useStackedChatOptions } from './eCharts/stackedChat'
import commonFunction from '/@/utils/commonFunction';
const { getImageUrl } = commonFunction();
const dom = ref<HTMLElement>()
const dom5 = ref<HTMLElement>()
const active = ref(0)
const storeNameList = ref<any[]>([])
const activeName = ref('Lounge')
const dialogVisible = ref(false)
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
.booth-reservation {
  .grid-content {
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 20px;
    margin-bottom: 10px;
    // min-height: 160px;
    min-width: 240px;
    margin: 10px;

    .title {
      margin-left: 10px;
    }

    &.green {

      .title {
        color: #67C23A;
      }

      background: rgba(0, 0, 0, 0.25) linear-gradient(180deg, rgba(103, 194, 58, 0.5) 0%, rgba(103, 194, 58, 0) 100%);
    }

    &.red {

      .title {
        color: #F56C6C;
      }

      background: rgba(0, 0, 0, 0.25) linear-gradient(180deg, rgba(245, 108, 108, 0.5) 0%, rgba(245, 108, 108, 0) 100%);
    }

    &.blue {

      .title {
        color: #409EFF;
      }


      background: rgba(0, 0, 0, 0.25) linear-gradient(180deg, rgba(64, 158, 255, 0.5) 0%, rgba(64, 158, 255, 0) 100%);
    }

    &.yellow {

      .title {
        color: #E6A23C;
      }


      background: rgba(0, 0, 0, 0.25) linear-gradient(180deg, rgba(230, 162, 60, 0.5) 0%, rgba(230, 162, 60, 0) 100%);
    }
  }

  .detail {
    >div {
      margin: 10px 0;
      font-size: 12px;
    }

    span {
      display: inline-block;
      width: 120px;
      text-align: right;
    }

    .title-line {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      margin: 20px 0;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 14px;
        background: #409EFF;
        border-radius: 2px;
        margin-right: 10px;
      }
    }
  }

}
</style>
