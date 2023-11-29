<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('journal.shop')" prop="username">
						<el-input v-model="state.queryForm.username" :placeholder="$t('common.please') + $t('journal.shop')"
							clearable />
					</el-form-item>

					<el-form-item :label="$t('pending.area')" prop="role">
						<el-select v-model="state.queryForm.role" multiple :placeholder="$t('common.select') + $t('pending.area')">
							<el-option v-for="item in optionsRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId"
								clearable> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="'状态'" prop="jobStatus">
						<el-select :placeholder="t('job.inputjobStatusTip')" v-model="state.queryForm.jobStatus">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in job_status"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="'到店时间'" prop="jobName">
						<el-date-picker v-model="state.queryForm.jobName" type="datetimerange" range-separator="-"
							:start-placeholder="$t('common.inputTimeTip1')" :end-placeholder="$t('common.inputTimeTip2')" />
					</el-form-item>

					<el-form-item :label="$t('pending.phone')" prop="lockFlag">
						<el-input v-model="state.queryForm.lockFlag" :placeholder="$t('common.please') + $t('pending.phone')" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">

					<right-toolbar @queryTable="getDataList" class="ml10" style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch" />
				</div>
			</el-row>
			<el-table stripe :data="state.dataList" style="width: 100%" v-loading="state.loading"
				:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
				<el-table-column :label="$t('journal.shop')" prop="username" fixed="left" show-overflow-tooltip />
				<el-table-column :label="$t('pending.area')" prop="name" show-overflow-tooltip />
				<el-table-column :label="$t('pending.booth')" prop="gender" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.gender == 1 ? '男' : scope.row.gender == 2 ? '女' : '-' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('pending.name')" prop="phone" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('pending.phone')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-for="(item, index) in scope.row.postList" :key="index">{{ item.postName }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="'订单号'" prop="jobExecuteStatus" show-overflow-tooltip>

				</el-table-column>
				<el-table-column :label="'预订人数'" prop="jobStatus" show-overflow-tooltip>

				</el-table-column>

				<el-table-column :label="'到店时间'" prop="jobGroup" show-overflow-tooltip width="120" />
				<el-table-column :label="'支付定金'" prop="jobStatus" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="job_status" :value="scope.row.jobStatus"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="'备注'" prop="startTime" show-overflow-tooltip width="120" />
				<el-table-column :label="'状态'" prop="jobExecuteStatus" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="job_execute_status" :value="scope.row.jobExecuteStatus"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="100">
					<template #default="scope">
						<el-button @click="handleJobLog(scope.row)" text type="primary">操作记录</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
		<job-log ref="jobLogRef"></job-log>
	</div>
</template>

<script lang="ts" name="systemSysJob" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, runJobRa, shutDownJobRa, startJobRa } from '/@/api/daemon/job';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import { list } from '/@/api/admin/role';
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const JobLog = defineAsyncComponent(() => import('./job-log.vue'));

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
const optionsRoles = ref([]) as any;
list().then((res) => {
	optionsRoles.value = res.data;
});
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
	pageList: fetchList,
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
