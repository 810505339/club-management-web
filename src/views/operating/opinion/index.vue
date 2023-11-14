<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<right-toolbar @queryTable="getDataList" class="ml10" style="float: right; margin-right: 20px" />
				</div>
			</el-row>
			<el-table stripe :data="state.dataList" style="width: 100%" v-loading="state.loading" border
				:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
				<el-table-column :label="t('opinion.index')" fixed="left" type="index" />
				<el-table-column :label="t('opinion.name')" fixed="left" prop="feedbackPerson" show-overflow-tooltip />
				<el-table-column :label="t('opinion.phone')" prop="phoneNumber" show-overflow-tooltip />
				<el-table-column :label="t('opinion.time')" prop="feedbackTime" show-overflow-tooltip />
				<el-table-column :label="t('opinion.msg')" prop="content" show-overflow-tooltip />
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemSysJob" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, } from '/@/api/operating/opinion';
import { useI18n } from 'vue-i18n';


// 获取国际化方法
const { t } = useI18n();


/** 搜索表单信息 */
const queryForm = reactive({});




/** 表格状态变量 */
const state = reactive<BasicTableProps>({
	queryForm,
	pageList: fetchList,
});

/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);


</script>
