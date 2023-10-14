<template>
  <el-drawer v-model="drawer" :title="$t('dynamic.statistics')" direction="rtl">


    <el-form ref="dataFormRef" :model="form" formDialogRef label-width="200px">
      <el-row :gutter="20">
        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.expenses')" prop="jobName">
            <el-switch v-model="form.jobName" />
          </el-form-item>
        </el-col>

        <el-col :span="20" class="mb20">
          <el-form-item :label="t('dynamic.registrations')" prop="jobName">
            <div class="text-[#d4d4d4]">0/100</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>





    <el-table :data="getDataList" style="width: 100%" v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
      :header-cell-style="tableStyle.headerCellStyle">

      <el-table-column align="center" :label="t('dynamic.userName')" />
      <el-table-column :label="t('dynamic.userPhone')" />

    </el-table>
    <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
  </el-drawer>
</template>

<script setup lang="ts" name="dynamic-drawer">
import { getActivity } from '/@/api/admin/dynamic';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
const drawer = ref(false)
// 获取国际化方法
const { t } = useI18n();




// 提交表单数据
const form = reactive({
  jobId: '',
  jobName: '',
  id: undefined

});

const state = reactive({
  loading: false,

})

/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);



function openDialog(id: string) {
  drawer.value = true
  // 获取sysJob信息
  if (id) {
    form.id = id;
    getItemData(id);
  }

}

// 初始化表单数据
const getItemData = (id: string) => {
  // 获取数据
  getActivity(id).then((res: any) => {
    Object.assign(form, res.data);
  });
};
defineExpose({
  openDialog,
});
</script>
