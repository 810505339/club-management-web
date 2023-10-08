<template>
  <el-drawer v-model="drawer" title="I am the title" direction="rtl">
    <el-table :data="state.dataList" style="width: 100%" v-loading="state.loading" border
      :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
      <el-table-column align="center" type="selection" width="40" />
      <el-table-column :label="titleChinese" fixed="left" type="index" width="120" />
      <el-table-column :label="titleEnglish" fixed="left" type="index" width="120" />
      <el-table-column :label="contextChinese" prop="jobName" show-overflow-tooltip width="300" />
      <el-table-column :label="contextEnglish" prop="jobName" show-overflow-tooltip width="300" />
      <el-table-column :label="type" prop="jobGroup" show-overflow-tooltip width="120" />
      <el-table-column :label="t('dynamic.register')" prop="jobStatus" show-overflow-tooltip width="120">
        <template #default="scope">
          <dict-tag :options="job_status" :value="scope.row.jobStatus"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('dynamic.expenses')" prop="jobExecuteStatus" show-overflow-tooltip width="120">
        <template #default="scope">
          <dict-tag :options="job_execute_status" :value="scope.row.jobExecuteStatus"></dict-tag>
        </template>
      </el-table-column>

      <el-table-column :label="t('dynamic.expiryTime')" prop="startTime" show-overflow-tooltip width="120" />

      <el-table-column :label="t('dynamic.status')" prop="previousTime" show-overflow-tooltip width="120" />
      <el-table-column :label="t('dynamic.store')" prop="nextTime" show-overflow-tooltip width="120" />

      <el-table-column :label="$t('common.action')" fixed="right" width="300">
        <template #default="scope">


          <el-button v-auth="'job_sys_job_del'" text type="primary">{{
            $t('common.shelves') }} </el-button>
          <el-button v-auth="'job_sys_job_del'" text type="primary">{{
            $t('common.takedown') }} </el-button>
          <el-button v-auth="'job_sys_job_del'" text type="primary">{{
            $t('common.detailBtn') }} </el-button>
          <el-button v-auth="'job_sys_job_del'" text type="primary">{{
            $t('common.edit') }} </el-button>
          <el-button v-auth="'job_sys_job_del'" text type="primary">{{
            $t('common.delBtn') }} </el-button>
          <el-button v-auth="'job_sys_job_del'" text type="primary" @click="formDrawerRef.openDialog">{{
            $t('dynamic.statistics') }} </el-button>
        </template>
      </el-table-column>
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

/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

function openDialog() {
  drawer.value = true
}
defineExpose({
  openDialog,
});
</script>
