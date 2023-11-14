<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('info.title')" prop="title">
						<el-input :placeholder="$t('common.please') + $t('info.title')" @keyup.enter="getDataList" clearable
							v-model="state.queryForm.title" />
					</el-form-item>
					<el-form-item :label="t('info.message')" prop="content">
						<el-input :placeholder="$t('common.please') + $t('info.message')" @keyup.enter="getDataList" clearable
							v-model="state.queryForm.content" />
					</el-form-item>
					<el-form-item :label="t('info.time')" prop="jobExecuteStatus">
						<el-date-picker v-model="state.queryForm.pushTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
							:placeholder="$t('common.select') + $t('info.time')" />
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
			<el-table stripe :data="state.dataList" v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle">
				<el-table-column :label="t('info.index')" fixed="left" type="index" width="60" />
				<el-table-column :label="t('info.title')" fixed="left" prop="title" show-overflow-tooltip />
				<el-table-column :label="t('info.message')" fixed="left" prop="content" show-overflow-tooltip />
				<el-table-column :label="t('info.createTime')" prop="createTime" width="170" show-overflow-tooltip />
				<el-table-column :label="t('info.time')" prop="pushTime" width="170" show-overflow-tooltip>

				</el-table-column>
				<el-table-column :label="t('info.type')" prop="type" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.type == 0 ? t('info.type2') : t('info.type1') }}
					</template>
				</el-table-column>
				<el-table-column :label="t('info.state')" prop="enabled" show-overflow-tooltip>

					<template #default="scope">
						{{ scope.row.enabled == 0 ? t('info.enabled0') : scope.row.enabled == 1 ? t('info.enabled1') :
							scope.row.enabled
								== 2 ? t('info.enabled2') : '' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="scope">
						<template v-if="scope.row.canDeleteEdit">
							<el-button v-auth="'job_sys_job_edit'" @click="handleEditJob(scope.row)" text type="primary">{{
								$t('common.editBtn') }} </el-button>
							<el-button v-auth="'job_sys_job_del'" @click="handleDelete([scope.row.id])" text type="primary">{{
								$t('common.delBtn') }} </el-button>
						</template>

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
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { fetchList, deleteObj } from '/@/api/operating/info';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

// 获取国际化方法
const { t } = useI18n();

/** 表单弹窗引用 */
const formDialogRef = ref();
/** 作业日志引用 */
const jobLogRef = ref();

/** 搜索表单信息 */
const queryForm: any = reactive({
	title: '',
	content: '',
	pushTime: '',
});
/** 是否展示搜索表单 */
const showSearch = ref(true);



/** 表格状态变量 */
const state = reactive<BasicTableProps>({
	queryForm,
	pageList: async (pamars) => {
		return await fetchList(pamars)
	},
});

/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

/** 重置查询表单 */
const resetQuery = () => {
	Object.keys(queryForm).forEach((key) => (queryForm[key] = ''));
	getDataList();
};
/** 编辑作业 */
const handleEditJob = (row: any) => {
	formDialogRef.value.openDialog(row.id);
};


/** 删除操作 */
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await deleteObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (error: any) {
		useMessage().error('删除失败');
	}
};
</script>
