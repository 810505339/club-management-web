<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="消费" name="0">
					<el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
						v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :label="t('ranking.ranking')" fixed="left" width="80px" type="index" />


						<el-table-column :label="t('ranking.userName')" fixed="left" prop="jobName" show-overflow-tooltip />
						<el-table-column :label="t('ranking.amount')" prop="jobGroup" show-overflow-tooltip />

					</el-table>

				</el-tab-pane>
				<el-tab-pane label="畅销商品" name="1">

					<el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
						v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :label="t('ranking.ranking')" fixed="left" width="80px" type="index" />

						<el-table-column :label="t('ranking.product')" fixed="left" prop="jobName" show-overflow-tooltip />
						<el-table-column :label="t('ranking.shop')" prop="jobGroup" show-overflow-tooltip />
						<el-table-column :label="t('ranking.number')" prop="jobGroup" show-overflow-tooltip />
					</el-table>

				</el-tab-pane>
			</el-tabs>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>


	</div>
</template>

<script lang="ts" name="systemSysJob" setup>
import { pageList, putObj } from '/@/api/admin/user';

import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, runJobRa, shutDownJobRa, startJobRa } from '/@/api/daemon/job';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('0')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

// 获取国际化方法
const { t } = useI18n();

/** 表单弹窗引用 */
const formDialogRef = ref();
/** 作业日志引用 */
const jobLogRef = ref();

/** 搜索表单信息 */
const queryForm = reactive({
	jobName: '',
	jobGroup: '',
	jobStatus: '',
	jobExecuteStatus: '',
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
	pageList: pageList,
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

/** 导出Excel */
const exportExcel = () => {
	downBlobFile('/job/sys-job/export', state.queryForm, 'job.xlsx');
};

/** 查看作业日志 */
const handleJobLog = (row) => {
	jobLogRef.value.openDialog(row.jobId);
};

/** 编辑作业 */
const handleEditJob = (row) => {
	const jobStatus = row.jobStatus;
	if (jobStatus === '1' || jobStatus === '3') {
		formDialogRef.value.openDialog(row.jobId);
	} else {
		useMessage().error('运行中定时任务不可修改，请先暂停后操作');
	}
};

/** 启动作业 */
const handleStartJob = async (row) => {
	const jobStatus = row.jobStatus;
	if (jobStatus === '1' || jobStatus === '3') {
		try {
			await useMessageBox().confirm(`即将发布或启动(任务名称: ${row.jobName}), 是否继续?`);
		} catch {
			return;
		}

		try {
			await startJobRa(row.jobId);
			getDataList();
			useMessage().success(t('common.optSuccessText'));
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		useMessage().error('定时任务已运行');
	}
};

/** 暂停作业 */
const handleShutDownJob = async (row) => {
	const jobStatus = row.jobStatus;
	if (jobStatus === '2') {
		try {
			await useMessageBox().confirm(`即将暂停(任务名称: ${row.jobName}), 是否继续?`);
		} catch {
			return;
		}

		try {
			await shutDownJobRa(row.jobId);
			getDataList();
			useMessage().success(t('common.optSuccessText'));
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	} else {
		useMessage().error('已暂停，不要重复操作');
	}
};

/** 运行作业 */
const handleRunJob = async (row) => {
	try {
		await useMessageBox().confirm(`立刻执行一次任务(任务名称: ${row.jobName}), 是否继续?`);
	} catch {
		return;
	}

	try {
		await runJobRa(row.jobId);
		getDataList();
		useMessage().success(t('common.optSuccessText'));
	} catch (err: any) {
		useMessage().error('运行失败');
	}
};

/** 删除操作 */
const handleDelete = async (row) => {
	if (!row) {
		selectedRows.value.forEach(handleDelete);
		return;
	}

	const { jobId, jobName } = row;
	try {
		await useMessageBox().confirm(`${t('common.delConfirmText')}(任务名称:${jobName})`);
	} catch {
		return;
	}

	try {
		await delObj(jobId);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (error: any) {
		useMessage().error('删除失败');
	}
};
</script>
