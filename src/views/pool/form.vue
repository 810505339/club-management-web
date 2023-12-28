<template>
  <el-dialog :close-on-click-modal="false" :title="$t('pool.table1')" width="940" draggable v-model="visible">
    <header></header>
    <section class="flex flex-row gap-5 h-[450px]">
      <div class="flex-1 relative">
        <div class="absolute z-10 h-[120px] w-[440px]  rounded-t-xl boy-bg">
          <img :src="boy" class="absolute z-10  right-0 top-0" />
        </div>
        <div class="absolute z-20 top-24 right-0 left-0">
          <play-list :playerList="person.boy" />
        </div>
      </div>
      <div class=" flex-1 relative">
        <div class="absolute z-10 h-[120px] w-[440px]  rounded-t-xl girls-bg">
          <img :src="girls" class="absolute z-10 right-0 top-0" />

        </div>

        <div class="absolute z-20 top-24 right-0 left-0">
          <play-list :playerList="person.girls" />
        </div>


      </div>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>

      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import { useI18n } from 'vue-i18n';
import boy from '/@/assets/home/boy.png'
import girls from '/@/assets/home/girls.png'
import type1 from '/@/assets/home/type1.png'
import type2 from '/@/assets/home/type2.png'
import type3 from '/@/assets/home/type3.png'
import { winePartyBusiness } from '/@/api/admin/pool';
import playList from './playList.vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

const visible = ref(false);
const loading = ref(false);

const person = ref({
  girls: [],
  boy: []
})


// 打开弹窗
const openDialog = async (id: string) => {
  visible.value = true;
  const { data } = await winePartyBusiness(id);

  person.value.boy = data.playerDetails.filter((p) => (p.gender == '1'))

  person.value.girls = data.playerDetails.filter((p) => (p.gender == '2'))

  console.log(data, 'person');

  // 重置表单数据
  nextTick(() => {

  });


};




// 暴露变量
defineExpose({
  openDialog,
});
</script>

<style scoped>
.boy-bg {
  background: linear-gradient(180deg, rgba(44, 114, 255, 0.25) 0%, rgba(44, 114, 255, 0) 100%);
}

.girls-bg {
  background: linear-gradient(180deg, rgba(255, 98, 163, 0.25) 0%, rgba(255, 98, 163, 0) 100%);
}

.item-bg {
  background: #15171A linear-gradient(270deg, rgba(44, 114, 255, 0.15) 0%, rgba(44, 114, 255, 0) 100%);
}
</style>
