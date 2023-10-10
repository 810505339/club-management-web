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





    <el-table :data="state.dataList" style="width: 100%" v-loading="state.loading" border
      :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">

      <el-table-column align="center" :label="t('dynamic.userName')" />
      <el-table-column :label="t('dynamic.userPhone')" />

    </el-table>
    <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
  </el-drawer>
</template>

<script setup lang="ts" name="dynamic-drawer">
import { pageList } from '/@/api/admin/menu';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n';
const drawer = ref(true)
// 获取国际化方法
const { t } = useI18n();

/** 搜索表单信息 */
const queryForm = reactive({
  deptId: '',
  username: '',
  phone: '',
  role: '',
  lockFlag: '',
});

/** 表格状态变量 */
const state = reactive<BasicTableProps>({
  queryForm,
  pageList: pageList,
});


// 提交表单数据
const form = reactive({
  jobId: '',
  jobName: '',
});


/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

function openDialog() {
  drawer.value = true
}
defineExpose({
  openDialog,
});
</script>
