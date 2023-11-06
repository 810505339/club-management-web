<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('coupon.couponName')" prop="name">
						<el-input :placeholder="$t('common.please') + $t('coupon.couponName')" @keyup.enter="getDataList" clearable
							v-model="state.queryForm.name" />
					</el-form-item>
					<!-- <el-form-item :label="t('coupon.couponStatus')" prop="jobStatus">
						<el-select :placeholder="t('common.select') + t('coupon.couponStatus')" v-model="state.queryForm.status">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in statusOption"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item :label="t('coupon.auditStatus')" prop="auditState">
						<el-select :placeholder="t('common.select') + t('coupon.auditStatus')" v-model="state.queryForm.auditState">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in auditStateOption"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button v-auth="'job_sys_job_add'" @click="formDialogRef.openDialog()" class="ml10" icon="folder-add"
						type="primary">
						{{ $t('common.addBtn') }}
					</el-button>

					<right-toolbar @queryTable="getDataList" class="ml10" style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch" />
				</div>
			</el-row>
			<el-table stripe :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
				v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle">
				<el-table-column :label="t('coupon.index')" fixed="left" width="180px" prop="id" show-overflow-tooltip />
				<el-table-column :label="t('coupon.couponName')" width="120px" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('coupon.nominalValue')" prop="jobGroup" show-overflow-tooltip />
				<el-table-column :label="t('coupon.createdTime')" width="170px" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="t('coupon.provideMode')" width="120px" prop="issueWay" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.issueWay == 1 ? t('coupon.issueWay1') : t('coupon.issueWay2') }}
					</template>

				</el-table-column>
				<el-table-column :label="t('coupon.number')" prop="startTime" width="200px" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.useNumber || 0 }}/ {{ scope.row.surplusNumber || 0 }}/ {{ scope.row.couponNumber || 0 }}
					</template>
				</el-table-column>


				<el-table-column :label="t('coupon.auditStatus')" width="170px" prop="auditState" show-overflow-tooltip>
					<template #default="scope">
						{{ t('coupon.' + scope.row.auditState) }}
					</template>
				</el-table-column>

				<el-table-column :label="t('coupon.creator')" prop="createBy" show-overflow-tooltip />
				<el-table-column :label="t('coupon.couponStatus')" width="170px" prop="status" show-overflow-tooltip>
					<!-- <template #default="scope">

					</template> -->
				</el-table-column>

				<el-table-column :label="$t('common.action')" fixed="right" width="300">
					<template #default="scope">




						<el-button v-auth="'job_sys_job_edit'" @click="handleEditJob(scope.row)" text type="primary">{{
							$t('common.editBtn') }} </el-button>

						<el-button v-auth="'job_sys_job_start_job'" @click="handleRunJob(scope.row)" text
							type="primary">执行</el-button>

						<el-button v-auth="'job_sys_job_del'" @click="handleDelete(scope.row)" text type="primary">{{
							$t('common.delBtn') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
	</div>
</template>

<script lang="ts" name="systemSysJob" setup>

import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, runJobRa, shutDownJobRa, startJobRa } from '/@/api/daemon/job';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { fetchList, updateEnabled } from '/@/api/operating/coupon';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// 获取国际化方法
const { t } = useI18n();
const statusOption = ref([
	{
		label: t('coupon.status1'),
		value: '1'
	}, {
		label: t('coupon.status1'),
		value: '0'
	},
])
const auditStateOption = ref([
	{
		label: t('coupon.FIRST_INSTANCE'),
		value: 'FIRST_INSTANCE'
	}, {
		label: t('coupon.SECOND_INSTANCE'),
		value: 'SECOND_INSTANCE'
	}, {
		label: t('coupon.THIRD_INSTANCE'),
		value: 'THIRD_INSTANCE'
	}, {
		label: t('coupon.ALREADY_PASSED'),
		value: 'ALREADY_PASSED'
	}, {
		label: t('coupon.REJECTED'),
		value: 'REJECTED'
	}
])
/** 表单弹窗引用 */
const formDialogRef = ref();
/** 作业日志引用 */
const jobLogRef = ref();

/** 搜索表单信息 */
const queryForm = reactive({
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
	pageList: async (pamars) => {
		return await fetchList(pamars)
	},
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
