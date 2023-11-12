<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row class="ml10" v-show="showSearch">
        <el-form :inline="true" :model="state.queryForm" ref="queryRef">
          <el-form-item :label="title" prop="name">
            <el-input :placeholder="titlePlaceholder" @keyup.enter="getDataList" clearable
              v-model="state.queryForm.name" />
          </el-form-item>
          <el-form-item :label="type" prop="dynamicTypeId">
            <el-select :placeholder="typePlaceholder" v-model="state.queryForm.dynamicTypeId">
              <el-option :key="index" :label="item.name" :value="item.id"
                v-for="( item, index ) in  dynamicTypeList "></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('area.state')" prop="enabled">
            <el-select v-model="state.queryForm.enabled" :placeholder="$t('area.stateSelect')">
              <el-option v-for="item, index in enabledList" :key="index" :label="item.label" :value="item.value"
                clearable>
              </el-option>
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
      <el-table stripe :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
        v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
        :header-cell-style="tableStyle.headerCellStyle">
        <el-table-column align="center" type="selection" width="40" />
        <el-table-column :label="titleChinese" fixed="left" prop="dynamicTitleCn" width="120" />
        <el-table-column :label="titleEnglish" fixed="left" prop="dynamicTitleUk" width="120" />
        <el-table-column :label="contextChinese" prop="dynamicContentCn" show-overflow-tooltip width="300" />
        <el-table-column :label="contextEnglish" prop="dynamicContentUk" show-overflow-tooltip width="300" />


        <el-table-column :label="type" prop="dynamicTypeVO" show-overflow-tooltip width="120">
          <template #default="scope">
            {{ scope.row['dynamicTypeVO']?.name }}
          </template>
        </el-table-column>
        <el-table-column :label="t('dynamic.register')" prop="apply" show-overflow-tooltip width="120">
          <template #default="scope">
            {{ scope.row['apply'] == 1 ? t('common.yes') : t('common.no') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('dynamic.expenses')" prop="charge" show-overflow-tooltip width="120">
          <template #default="scope">
            {{ scope.row['charge'] == 1 ? t('common.yes') : t('common.no') }}
          </template>
        </el-table-column>

        <el-table-column :label="t('dynamic.expiryTime')" prop="expireTime" show-overflow-tooltip width="120" />

        <el-table-column :label="t('dynamic.status')" show-overflow-tooltip width="120">
          <template #default="scope">
            {{ scope.row['enabled'] == 1 ? $t('shopList.shelves') : $t('shopList.takedown') }}
          </template>
        </el-table-column>
        <el-table-column :label="t('dynamic.store')" prop="nextTime" show-overflow-tooltip width="120">
          <template #default="scope">
            {{ scope.row['storeVOS']?.[0]?.name }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('common.action')" fixed="right" width="300">
          <template #default="scope">

            <el-button icon="Top" text type="primary" @click="handleTakedown(scope.row)" v-if="scope.row['enabled'] == 0">
              {{ $t('shopList.shelves') }}
            </el-button>
            <el-button icon="Bottom" text type="primary" @click="handleTakedown(scope.row)" v-else>
              {{ $t('shopList.takedown') }}
            </el-button>

            <el-button v-auth="'job_sys_job_del'" text type="primary" @click="formDialogRef.openDialog(scope.row.id)">{{
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

    <dynamic-from ref="formDialogRef" :list="dynamicTypeList" :storeNameList="storeNameList" />
    <dynamic-drawer ref="formDrawerRef" />
  </div>
</template>

<script lang="ts" name="systemSysJob" setup>



import { BasicTableProps, useTable } from '/@/hooks/table';

import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { getDynamicList, updateEnabled, deleteDynamic, getDynamicTypeList } from '/@/api/admin/dynamic';
import dynamicFrom from './form.vue';
import dynamicDrawer from './drawer.vue';
import { useTranslateText } from './hooks/translate';
import { getStoreName } from '/@/api/admin/store';




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

const dynamicTypeList = ref<any[]>([]);
const storeNameList = ref<any[]>([])

async function getDynamicListApi() {
  const { data } = await getDynamicTypeList()
  const { data: storeData } = await getStoreName()
  storeNameList.value = storeData
  dynamicTypeList.value = data.records



}

onMounted(async () => {
  await getDynamicListApi()
})

const enabledList = [
  { label: '上架', value: '1' },
  { label: '下架', value: '0' },
]


/** 搜索表单信息 */
const queryForm = reactive({
  enabled: '',
  name: '',

});
/** 是否展示搜索表单 */
const showSearch = ref(true);

// 多选变量
/** 选中的行 */
const selectedRows = ref([]);
/** 是否可以多选 */
const multiple = ref(true);


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
