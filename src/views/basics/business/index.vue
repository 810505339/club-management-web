<template>
  <div class="layout-padding">

    <splitpanes>
      <pane>
        <div class="layout-padding-auto  ">
          <div class="flex h-full  p-10">
            <el-tabs tab-position="left" class="h-full w-full">
              <el-tab-pane :label="t('bus.name')">
                <div class="p-5">
                  <div class="flex items-center justify-between">
                    <span>
                      {{ t('bus.text') }}
                      <span v-if="state.mod === 'EDIT'" class="text-[#3876F6]"> {{ state.RESERVE_LATEST_CANCEL_TIME
                      }}</span>
                      <span v-else><el-input-number v-model="state.RESERVE_LATEST_CANCEL_TIME" :min="0" :max="24"
                          class="w-10" /></span>
                      {{ t('bus.text_1') }}
                    </span>
                    <el-button type="primary" v-if="state.mod === 'EDIT'" @click="changeMod('mod', 'SURE')">{{
                      t('common.editBtn')
                    }}</el-button>

                    <el-button type="primary" v-else @click="changeMod('mod', 'EDIT')">{{
                      t('common.confirmButtonText') }}</el-button>
                  </div>
                  <div class="text-xs text-[#7F7F7F]">{{ t('bus.text_2') }}</div>
                </div>

              </el-tab-pane>
              <el-tab-pane :label="t('bus.time')">


                <div class="p-5">
                  <div class="flex items-center justify-between">
                    <span>
                      {{ t('bus.text_3') }}
                      <span v-if="state.mod_1 === 'EDIT'" class="text-[#3876F6]"> {{ state.ORDER_EXPIRATION_TIME }}</span>
                      <span v-else><el-input-number v-model="state.ORDER_EXPIRATION_TIME" :min="0" :max="1440"
                          class="w-10" /></span>
                      {{ t('bus.text_24') }}
                    </span>
                    <el-button type="primary" v-if="state.mod_1 === 'EDIT'" @click="changeMod('mod_1', 'SURE')">{{
                      t('common.editBtn')
                    }}</el-button>

                    <el-button type="primary" v-else @click="changeMod('mod_1', 'EDIT')">{{
                      t('common.confirmButtonText') }}</el-button>
                  </div>

                </div>
              </el-tab-pane>
              <el-tab-pane :label="t('bus.fight')">
                <el-scrollbar height="600">
                  <div class="p-5">
                    <div>
                      <div class="pl-4 border-l-4 border-[#3876F6] flex items-center justify-between">
                        <div>{{ t('bus.text_4') }}</div>
                        <div>
                          <el-button type="primary" v-if="state.fightMod === 'EDIT'"
                            @click="changeMod('fightMod', 'SURE')">{{
                              t('common.editBtn')
                            }}</el-button>

                          <el-button type="primary" v-else @click="changeMod('fightMod', 'EDIT')">{{
                            t('common.confirmButtonText') }}</el-button>
                        </div>
                      </div>
                      <div class="px-4 my-4 h-10 flex items-center" v-for="(item) in fightRender" :key="item.id">
                        <span class="w-40">{{ t(item.text) }}:</span>
                        <span v-if="state.fightMod === 'EDIT'">{{ item.value }}</span>
                        <el-input v-model="item.value" v-else></el-input>

                      </div>

                    </div>
                    <div class="pl-4 border-l-4 border-[#3876F6]">
                      <div>{{ t('bus.text_5') }}</div>
                    </div>
                    <div>
                      <div class=" h-10 px-4 my-4 "> {{ t('bus.text_13') }}
                        <span class="text-[#3876F6]" v-if="state.fightMod === 'EDIT'">{{
                          state.ORDER_WINE_PARTY_LATEST_TIME }}</span>
                        <el-input-number :min="0" :max="24" class="w-10" v-else
                          v-model="state.ORDER_WINE_PARTY_LATEST_TIME" />
                        {{
                          t('bus.text_14')
                        }}
                      </div>
                      <div class=" h-10 px-4 my-4 "> {{ t('bus.text_15') }}
                        <span class="text-[#3876F6]" v-if="state.fightMod === 'EDIT'">{{ state.ME_PAY_REMOVE_PERSON
                        }}</span>
                        <el-input-number :min="0" class="w-10" v-else v-model="state.ME_PAY_REMOVE_PERSON" />
                        {{
                          t('bus.text_16') }}
                      </div>
                      <div class="px-4 my-4 flex ">
                        <div class="pt-2"> {{ t('bus.text_17') }}</div>
                        <div class="ml-2">
                          <el-radio-group v-model="state.ORDER_WINE_AMOUNT" :disabled="state.fightMod === 'EDIT'">
                            <el-radio label="ORDER_WINE_PARTY_AMOUNT_LOWEST">{{ t('bus.text_18') }}</el-radio>
                            <el-radio label="ORDER_WINE_PARTY_AMOUNT_LOWEST_UP">
                              {{ t('bus.text_19') }}
                              <span v-if="state.fightMod === 'EDIT'" class="text-[#3876F6]"> {{
                                state.ORDER_WINE_PARTY_AMOUNT_LOWEST_UP
                              }}{{ state.ORDER_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS }}</span>
                              <el-input class="w-20" v-model="state.ORDER_WINE_PARTY_AMOUNT_LOWEST_UP" v-else>
                                <template #append>
                                  <el-select style="width: 70px" v-model="state.ORDER_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS">
                                    <el-option label="%" value="%" />
                                    <el-option label="$" value="$" />
                                  </el-select>
                                </template>
                              </el-input>

                            </el-radio>
                            <el-radio label="ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN">
                              {{ t('bus.text_20') }}
                              <span v-if="state.fightMod === 'EDIT'" class="text-[#3876F6]"> {{
                                state.ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN
                              }}{{ state.ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS }}</span>
                              <el-input v-model="state.ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN" v-else>
                                <template #append>
                                  <el-select style="width: 70px"
                                    v-model="state.ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS">
                                    <el-option label="%" value="%" />
                                    <el-option label="$" value="$" />
                                  </el-select>
                                </template>
                              </el-input>
                            </el-radio>
                            <el-radio label="ORDER_WINE_PARTY_AMOUNT_CUSTOM">
                              {{ t('bus.text_21') }}
                              <span v-if="state.fightMod === 'EDIT'" class="text-[#3876F6]"> {{
                                state.ORDER_WINE_PARTY_AMOUNT_CUSTOM
                              }}</span>
                              <el-input v-model="state.ORDER_WINE_PARTY_AMOUNT_CUSTOM" v-else>
                                <template #append>
                                  $
                                </template>
                              </el-input>
                            </el-radio>

                          </el-radio-group>
                        </div>

                      </div>

                    </div>
                    <div class="pl-4 border-l-4 border-[#3876F6]">
                      <div>{{ t('bus.text_6') }}</div>

                    </div>
                    <div class=" h-10 px-4 my-4">
                      {{ t('bus.text_22') }}
                      <span v-if="state.fightMod === 'EDIT'" class="text-[#3876F6]">{{
                        state.TEMPORARY_WINE_PARTY_LATEST_TIME }}</span>
                      <el-time-picker format="HH:mm" v-model="state.TEMPORARY_WINE_PARTY_LATEST_TIME_LABEL" v-else />


                    </div>
                    <div class="px-4 my-4 flex ">
                      <div class="pt-2"> {{ t('bus.text_17') }}</div>
                      <div class="ml-2">
                        <el-radio-group v-model="state.TEMPORARY_WINE_AMOUNT" :disabled="state.fightMod === 'EDIT'">
                          <el-radio label="TEMPORARY_WINE_PARTY_AMOUNT_LOWEST">{{ t('bus.text_18') }}</el-radio>
                          <el-radio label="TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP">
                            <span v-if="state.fightMod === 'EDIT'">{{ t('bus.text_19') }}</span>
                            <span v-if="state.fightMod === 'EDIT'">{{
                              state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP
                            }}{{ state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS }}</span>
                            <el-input class="w-20" v-model="state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP" v-else>
                              <template #append>
                                <el-select style="width: 70px"
                                  v-model="state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS">
                                  <el-option label="%" value="%" />
                                  <el-option label="$" value="$" />
                                </el-select>
                              </template>
                            </el-input>

                          </el-radio>
                          <el-radio label="TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN">
                            <span>{{ t('bus.text_20') }}</span>
                            <span v-if="state.fightMod === 'EDIT'" class="text-[#3876F6]">{{
                              state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN
                            }}{{ state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS }}</span>
                            <el-input v-model="state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN" v-else>
                              <template #append>
                                <el-select style="width: 70px"
                                  v-model="state.TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS">
                                  <el-option label="%" value="%" />
                                  <el-option label="$" value="$" />
                                </el-select>
                              </template>
                            </el-input>
                          </el-radio>
                          <el-radio label="TEMPORARY_WINE_PARTY_AMOUNT_CUSTOM">
                            <span>{{ t('bus.text_21') }}</span>

                            <span v-if="state.fightMod === 'EDIT'" class="text-[#3876F6]">{{
                              state.TEMPORARY_WINE_PARTY_AMOUNT_CUSTOM }}$</span>
                            <el-input v-model="state.TEMPORARY_WINE_PARTY_AMOUNT_CUSTOM" v-else>
                              <template #append>
                                $
                              </template>
                            </el-input>
                          </el-radio>

                        </el-radio-group>
                      </div>

                    </div>


                  </div>
                </el-scrollbar>


              </el-tab-pane>

            </el-tabs>
          </div>
        </div>
      </pane>
    </splitpanes>


  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { h } from 'vue'
import { getList, putbusiness } from '/@/api/admin/business';
import { ElInput } from 'element-plus'
import dayjs from 'dayjs'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
const { t } = useI18n();
// RESERVE_LATEST_CANCEL_TIME("预订最晚取消时间"),
// ORDER_EXPIRATION_TIME("订单过期时间"),
// SHARE_WINE_PARTY_AA_ZH("拼酒局AA制-中文"),
// SHARE_WINE_PARTY_AA_EN("拼酒局AA制-英文"),
// SHARE_WINE_PARTY_A_FREE_ZH("拼酒局男A女免-中文"),
// SHARE_WINE_PARTY_FREE_A_EN("拼酒局女A男免-英文"),
// SHARE_WINE_PARTY_ME_PAY_ZH("拼酒局我买单-中文"),
// SHARE_WINE_PARTY_ME_PAY_EN("拼酒局我买单-英文"),
// ORDER_WINE_PARTY_LATEST_TIME("预订酒局最晚锁定时间"),
// ME_PAY_REMOVE_PERSON("我买单踢人次数"),
// ORDER_WINE_PARTY_AMOUNT_LOWEST("预定酒局酒局价格-卡座最低消费金额"),
// ORDER_WINE_PARTY_AMOUNT_LOWEST_UP("预定酒局酒局价格-卡座最低消费金额上浮($)"),
// ORDER_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS("预定酒局酒局价格-卡座最低消费金额上浮(%)"),
// ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN("预定酒局酒局价格-卡座最低消费金额下调($)"),
// ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS("预定酒局酒局价格-卡座最低消费金额下调(%)"),
// ORDER_WINE_PARTY_AMOUNT_CUSTOM("预定酒局酒局价格-自定义"),
// TEMPORARY_WINE_PARTY_LATEST_TIME("临时酒局最晚锁定时间"),
// TEMPORARY_WINE_PARTY_AMOUNT_LOWEST("临时酒局酒局价格-卡座最低消费金额"),
// TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP("临时酒局酒局价格-卡座最低消费金额上浮($)"),
// TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS("临时酒局酒局价格-卡座最低消费金额上浮(%)"),
// TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN("临时酒局酒局价格-卡座最低消费金额下调($)"),
// TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS("临时酒局酒局价格-卡座最低消费金额下调(%)"),
// TEMPORARY_WINE_PARTY_AMOUNT_CUSTOM("临时酒局酒局价格-自定义"),
// ORDER_WINE_AMOUNT("预定酒局价格"),
// TEMPORARY_WINE_AMOUNT("临时酒局价格");
const state = ref({
  mod: 'EDIT',
  mod_1: 'EDIT',
  RESERVE_LATEST_CANCEL_TIME: 0,
  ORDER_EXPIRATION_TIME: 0,
  fightMod: 'EDIT',
  ORDER_WINE_PARTY_LATEST_TIME: 0,
  ME_PAY_REMOVE_PERSON: 0,
  ORDER_WINE_PARTY_AMOUNT_LOWEST: '',
  ORDER_WINE_PARTY_AMOUNT_LOWEST_UP: '',
  ORDER_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS: '%',
  ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN: '',
  ORDER_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS: '%',
  ORDER_WINE_PARTY_AMOUNT_CUSTOM: '',
  TEMPORARY_WINE_PARTY_LATEST_TIME: '',
  TEMPORARY_WINE_PARTY_LATEST_TIME_LABEL: dayjs('00:00', 'HH:mm'),
  TEMPORARY_WINE_PARTY_AMOUNT_LOWEST: '',
  TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP: '',
  TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_UP_UNITS: '%',
  TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN: '',
  TEMPORARY_WINE_PARTY_AMOUNT_LOWEST_DOWN_UNITS: '%',
  TEMPORARY_WINE_PARTY_AMOUNT_CUSTOM: '',
  ORDER_WINE_AMOUNT: '',
  TEMPORARY_WINE_AMOUNT: '',
})

let formList = [] //拿到返回给后端


const fightRender = ref([
  { id: 0, text: 'bus.text_7', value: '', key: 'SHARE_WINE_PARTY_AA_ZH' },
  { id: 1, text: 'bus.text_8', value: '', key: 'SHARE_WINE_PARTY_AA_EN' },
  { id: 2, text: 'bus.text_9', value: '', key: 'SHARE_WINE_PARTY_A_FREE_ZH' },
  { id: 3, text: 'bus.text_10', value: '', key: 'SHARE_WINE_PARTY_FREE_A_EN' },
  { id: 4, text: 'bus.text_11', value: '', key: 'SHARE_WINE_PARTY_ME_PAY_ZH', },
  { id: 5, text: 'bus.text_12', value: '', key: 'SHARE_WINE_PARTY_ME_PAY_EN' },
])




const getListApi = async () => {
  const { data } = await getList()
  formList = data
  fightRender.value = fightRender.value.map(f => {
    f.value = data.find((item: any) => item.configType === f.key)!.configValue!
    return f
  })

  data.forEach((element: any) => {
    Object.keys(state.value).forEach(s => {
      if (s === element.configType) {
        state.value[s] = element.configValue
      }
    })
  });
  state.value.TEMPORARY_WINE_PARTY_LATEST_TIME_LABEL = dayjs(data.find((item: any) => item.configType === 'TEMPORARY_WINE_PARTY_LATEST_TIME')!.configValue!, 'HH:mm')



}



const changeMod = async (key: string, value: 'EDIT' | 'SURE') => {
  state.value[key] = value
  if (value === 'EDIT') {
    formList.forEach((element: any) => {
      Object.keys(state.value).forEach(s => {

        if (element.configType === s) {
          element.configValue = `${state.value[s]}`
          console.log(s, state.value[s], element)
        }
      })
      fightRender.value.forEach(f => {
        if (element.configType === f.key) {
          element.configValue = f.value
        }
      })

    });
    let tempList = []

    switch (key) {
      case 'mod':
        tempList = formList.filter(f => f.configType === 'RESERVE_LATEST_CANCEL_TIME')
        break;
      case 'mod_1':
        tempList = formList.filter(f => f.configType === 'ORDER_EXPIRATION_TIME')
        break;
      case 'fightMod':
        tempList = formList.filter(f => f.configType != 'RESERVE_LATEST_CANCEL_TIME' && f.configType != 'ORDER_EXPIRATION_TIME')
        break;

    }


    await putbusiness(tempList)
  }
}

onMounted(async () => {
  await getListApi()
})
</script>
<style scoped>
:deep(.el-tabs__header) {
  width: 200px;
  border-right: 0.5px rgba(242, 242, 242, 1) solid;
}

:deep(.el-tabs__nav-scroll .el-tabs__item) {
  text-align: center;
}

:deep(.el-input-number) {
  width: 170px;
}

:deep(.el-radio-group) {
  display: flex;
  flex-direction: column;
  align-items: start;

}

:deep(.el-radio) {
  margin-bottom: 10px;
}

:deep(.el-input-group) {
  width: 150px;
  margin-left: 20px;
}
</style>
