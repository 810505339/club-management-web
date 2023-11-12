<template>
  <div class="layout-padding">
    <splitpanes>
      <pane>
        <div class="layout-padding-auto layout-padding-view ">
          <div class="flex h-full  p-10">
            <el-tabs tab-position="left" class="h-full w-full">
              <el-tab-pane :label="t('bus.name')">
                <div class="p-5">
                  <div class="flex items-center justify-between">
                    <span>
                      {{ t('bus.text') }}
                      <span v-if="state.mod === 'EDIT'" class="text-[#3876F6]"> {{ state.hour }}</span>
                      <span v-else><el-input-number v-model="state.hour" :min="0" class="w-10" /></span>
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
                      <span v-if="state.mod_1 === 'EDIT'" class="text-[#3876F6]"> {{ state.minute }}</span>
                      <span v-else><el-input-number v-model="state.hour" :min="0" class="w-10" /></span>
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
                    <div> {{ t('bus.text_13') }} <span class="text-[#3876F6]">5</span>{{ t('bus.text_14') }}</div>
                    <div> {{ t('bus.text_15') }} <span class="text-[#3876F6]">5</span>{{ t('bus.text_16') }}</div>
                    <div>

                    </div>

                  </div>
                  <div class="pl-4 border-l-4 border-[#3876F6]">
                    <div>{{ t('bus.text_6') }}</div>
                  </div>

                </div>

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
import { getList } from '/@/api/admin/business';
import { ElInput } from 'element-plus'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
const { t } = useI18n();
const state = ref({
  mod: 'EDIT',
  mod_1: 'EDIT',
  hour: 0,
  minute: 0,
  fightMod: 'EDIT',
  modeType: 'RESERVE_LATEST_CANCEL_TIME',
  mode_1Type: 'ORDER_EXPIRATION_TIME'
})


const fightRender = ref([
  { id: 0, text: 'bus.text_7', value: 'q123' },
  { id: 1, text: 'bus.text_8', value: '123' },
  { id: 2, text: 'bus.text_9', value: '123' },
  { id: 3, text: 'bus.text_10', value: '123' },
  { id: 4, text: 'bus.text_11', value: '123' },
  { id: 5, text: 'bus.text_12', value: '123' },
])




const getListApi = async () => {
  const { data } = await getList()
  const { modeType, mode_1Type } = state.value
  state.value.hour = data.find((item: any) => item.configType === modeType)!.configValue!
  state.value.minute = data.find((item: any) => item.configType === mode_1Type)!.configValue!

}



const changeMod = (key: string, value: 'EDIT' | 'SURE') => {
  state.value[key] = value
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
  width: 150px;
}
</style>
