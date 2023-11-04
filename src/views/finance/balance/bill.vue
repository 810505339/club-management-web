<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" fullscreen :title="t('balance.bill')" draggable>
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="t('bill.type')" prop="jobStatus">
						<el-select :placeholder="t('bill.inputTypeTip')" v-model="state.queryForm.jobStatus">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in job_status"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('bill.time')" prop="jobName">
						<el-date-picker v-model="state.queryForm.jobName" type="datetimerange" range-separator="-"
							:start-placeholder="$t('common.inputTimeTip1')" :end-placeholder="$t('common.inputTimeTip2')" />
						<!-- <el-input :placeholder="$t('bill.inputTimeTip')" clearable v-model="state.queryForm.jobName" /> -->
					</el-form-item>
					<el-form-item :label="t('bill.number')" prop="jobStatus">
						<el-input :placeholder="t('bill.inputNumberTip')" v-model="state.queryForm.jobStatus" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8 w-[100%]">
					<right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right; margin-right: 20px"
						@queryTable="getDataList"></right-toolbar>
				</div>
			</el-row>
			<el-table stripe :data="state.dataList" v-loading="state.loading" class="w-[100%]"
				@selection-change="handleSelectionChange" border :cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle">
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" :label="t('bill.index')" width="80" />
				<el-table-column prop="jobName" :label="t('bill.type')" show-overflow-tooltip />
				<el-table-column prop="jobMessage" :label="t('bill.number')" show-overflow-tooltip />
				<el-table-column prop="executeTime" :label="t('bill.balance1')" show-overflow-tooltip />
				<el-table-column prop="exceptionInfo" :label="t('bill.balance2')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="t('bill.time')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="t('bill.remark')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="t('bill.order')" show-overflow-tooltip />

			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="job-log">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList, putObj } from '/@/api/admin/user';

import { fetchList, delObjs } from '/@/api/daemon/job-log';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';

const { t } = useI18n();
const visible = ref(false);
/** 查询字典 */
const { job_execute_status, job_status } = useDict('job_type', 'job_execute_status', 'job_status');


// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		jobId: '',
	},
	pageList: pageList,
	createdIsNeed: false,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const openDialog = (id: string) => {
	visible.value = true;
	state.queryForm.jobId = id;
	getDataList();
};

// 多选事件
const handleSelectionChange = (objs: { jobLogId: string }[]) => {
	selectObjs.value = objs.map(({ jobLogId }) => jobLogId);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
