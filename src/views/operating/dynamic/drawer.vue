<template>
  <el-drawer v-model="drawer" title="I am the title" direction="rtl">
    <el-table :data="state.dataList" style="width: 100%" v-loading="state.loading" border
      :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
      <el-table-column align="center" type="selection" width="40" />
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
