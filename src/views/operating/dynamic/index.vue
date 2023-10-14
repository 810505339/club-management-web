<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row class="ml10" v-show="showSearch">
        <el-form :inline="true" :model="state.queryForm" ref="queryRef">
          <el-form-item :label="title" prop="jobName">
            <el-input :placeholder="titlePlaceholder" @keyup.enter="getDataList" clearable
              v-model="state.queryForm.jobName" />
          </el-form-item>
          <el-form-item :label="type" prop="jobStatus">
            <el-select :placeholder="typePlaceholder" v-model="state.queryForm.jobStatus">
              <el-option :key="index" :label="item.label" :value="item.value"
                v-for="( item, index ) in  job_status "></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="status" prop="jobExecuteStatus">
            <el-select :placeholder="statusPlaceholder" v-model="state.queryForm.jobExecuteStatus">
              <el-option :key="index" :label="item.label" :value="item.value"
                v-for="( item, index ) in  job_execute_status "></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="getDataList" icon="Search" type="primary">{{ t('common.queryBtn') }} </el-button>
            <el-button @click="resetQuery" icon="Refresh">{{ t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button v-auth="'job_sys_job_add'" @click="formDialogRef.openDialog()" class="ml10" icon="folder-add"
            type="primary">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button plain v-auth="'job_sys_job_del'" :disabled="multiple" @click="handleDelete(undefined)" class="ml10"
            icon="Delete" type="primary">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar :export="'job_sys_job_add'" @exportExcel="exportExcel" @queryTable="getDataList" class="ml10"
            style="float: right; margin-right: 20px" v-model:showSearch="showSearch" />
        </div>
      </el-row>
      <el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
        v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
        :header-cell-style="tableStyle.headerCellStyle">
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

            <el-button icon="Top" text type="primary" @click="handleTakedown(scope.row)" v-if="scope.row['enabled'] == 0">
              {{ $t('shopList.shelves') }}
            </el-button>
            <el-button icon="Bottom" text type="primary" @click="handleTakedown(scope.row)" v-else>
              {{ $t('shopList.takedown') }}
            </el-button>
            <el-button v-auth="'job_sys_job_del'" text type="primary">{{
              $t('common.detailBtn') }} </el-button>
            <el-button v-auth="'job_sys_job_del'" text type="primary">{{
              $t('common.edit') }} </el-button>
            <el-button v-auth="'job_sys_job_del'" text type="primary">{{
              $t('common.delBtn') }} </el-button>
            <el-button v-auth="'job_sys_job_del'" text type="primary" @click="formDrawerRef.openDialog(scope.row.id)">{{
              $t('dynamic.statistics') }} </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
    </div>
    <dynamic-from ref="formDialogRef" />
    <dynamic-drawer ref="formDrawerRef" />
  </div>
</template>

<script lang="ts" name="systemSysJob" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';

import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { getDynamicList, updateEnabled, deleteDynamic } from '/@/api/admin/dynamic';
import dynamicFrom from './form.vue';
import dynamicDrawer from './drawer.vue';
import { useTranslateText } from './hooks/translate';




// 获取国际化方法
const { t } = useI18n();

const { title,
  titlePlaceholder,
  titleChinese,
  titleEnglish,
  type,
  typePlaceholder,
  status,
  statusPlaceholder,
  contextChinese,
  contextEnglish, } = useTranslateText(t)

/** 表单弹窗引用 */
const formDialogRef = ref();
const formDrawerRef = ref();


/** 搜索表单信息 */
const queryForm = reactive({
  deptId: '',
  username: '',
  phone: '',
  role: '',
  lockFlag: '',
});
/** 是否展示搜索表单 */
const showSearch = ref(true);

// 多选变量
/** 选中的行 */
const selectedRows = ref([]);
/** 是否可以多选 */
const multiple = ref(true);

/** 查询字典 */
const { job_status, job_execute_status, misfire_policy, job_type } = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');

/** 表格状态变量 */
const state = reactive<BasicTableProps>({
  queryForm,
  pageList: getDynamicList,
});

/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

/** 重置查询表单 */
const resetQuery = () => {
  Object.keys(queryForm).forEach((key) => (queryForm[key] = ''));
  getDataList();
};

/** 行选中事件 */
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows;
  multiple.value = !rows.length;
};


//点击下架
const handleTakedown = async (row: any) => {

  //scope.row['enabled'] == 1 ? '上架' : '下架'
  //shelves: '上架',
  //	takedown: '下架',
  const enabled = row.enabled == 1 ? '0' : '1'

  if (row.enabled == 1) {
    await useMessageBox().confirm(t('shopList.sureTakedown'))
  }
  //1:下架,0:正常
  await updateEnabled({
    id: row.id,
    enabled: enabled
  })
  useMessage().success(t('common.optSuccessText'));

  getDataList();


}


// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm(t('common.delConfirmText'));
  } catch {
    return;
  }

  try {
    await deleteDynamic(ids);
    getDataList();
    useMessage().success(t('common.delSuccessText'));
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};



</script>
