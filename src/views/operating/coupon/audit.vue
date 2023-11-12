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


					<right-toolbar @queryTable="getDataList" class="ml10" style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch" />
				</div>
			</el-row>
			<el-table stripe :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%"
				v-loading="state.loading" border :cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle">
				<el-table-column :label="t('coupon.index')" fixed="left" width="180px" prop="id" show-overflow-tooltip />
				<el-table-column :label="t('coupon.couponName')" width="120px" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('coupon.nominalValue')" prop="type" width="200px" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row?.couponTypeDetailVO.type ? '【' + t('coupon.' + scope.row.couponTypeDetailVO.type) + '】' : '-' }}

						{{ scope.row?.couponTypeDetailVO.type == 'CASH_VOUCHERS' ?
							`抵扣${scope.row?.couponTypeDetailVO.discount}` : scope.row?.couponTypeDetailVO.type ==
								'MAX_OUT_VOUCHERS' ? `满${scope.row?.couponTypeDetailVO.doorSill}减${scope.row?.couponTypeDetailVO.discount}`
								: scope.row?.couponTypeDetailVO.type ==
									'DISCOUNT_VOUCHERS' ?
									`${scope.row?.couponTypeDetailVO.doorSill ? '满' + scope.row?.couponTypeDetailVO.doorSill + '打' :
										''}${scope.row?.couponTypeDetailVO.discount}折`
									:
									''
						}}
					</template></el-table-column>
				<el-table-column :label="t('coupon.createdTime')" width="170px" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="t('coupon.provideMode')" width="120px" prop="issueWay" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.issueWay == 1 ? t('coupon.issueWay1') : t('coupon.issueWay2') }}
					</template>
				</el-table-column>
				<el-table-column :label="t('coupon.creator')" prop="createBy" show-overflow-tooltip />
				<el-table-column :label="t('coupon.auditStatus')" width="170px" prop="auditState" show-overflow-tooltip>
					<template #default="scope">
						{{ t('coupon.' + scope.row.auditState) }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="scope">
						<template v-if="scope.row.auditState == 'IN_AUDIT'">
							<el-button v-auth="'job_sys_job_edit'" @click="handleDelete(scope.row)" text type="primary">{{
								$t('common.audit') }} </el-button>
						</template>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />
		<CouponIssueDialog @refresh="getDataList()" ref="couponIssueDialogRef" />
		<el-dialog v-model="dialogVisible" :title="t('common.audit')" width="500px">
			<el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px">
				<el-form-item :label="t('common.audit')" prop="state">
					<el-radio-group v-model="form.state" class="ml-4">
						<el-radio label="1"> {{ t('message.evaluation.status4') }}</el-radio>
						<el-radio label="0">{{ t('message.evaluation.status3') }} </el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="t('message.evaluation.reason')" prop="msg">
					<el-input v-model="form.msg" type="textarea" autocomplete="off" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="toUpdateEnabled(ruleFormRef)">{{ t('common.confirmButtonText') }}</el-button>
					<el-button @click="resetForm(ruleFormRef)">{{ t('common.cancelButtonText') }}</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="systemSysJob" setup>

import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, runJobRa, shutDownJobRa, startJobRa } from '/@/api/daemon/job';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { getCouponAudit, updateEnabled } from '/@/api/operating/coupon';
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const CouponIssueDialog = defineAsyncComponent(() => import('./couponIssue.vue'));

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
const dialogVisible = ref(false)
const form = ref({
	id: null,
	msg: '',
	state: '1'
})
const rules = reactive<FormRules<RuleForm>>({
	msg: [
		{ required: true, message: t('common.please'), trigger: 'blur' },
	],
})
/** 审核操作 */
const handleDelete = (row) => {
	form.value = {
		id: row.id,
		msg: '',
		state: '1'
	}

	dialogVisible.value = true


};
const toUpdateEnabled = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async (valid) => {
		if (valid) {
			try {
				updateEnabled(form.value);
				getDataList();
				useMessage().success(t('common.optSuccessText'));
				dialogVisible.value = false
			} catch (error: any) {
				// useMessage().error('删除失败');
			}
		}
	})

}

/** 表单弹窗引用 */
const formDialogRef = ref();
/** 作业日志引用 */
const couponIssueDialogRef = ref();

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
		return await getCouponAudit(pamars)
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

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	dialogVisible.value = false
}

/** 编辑作业 */
const handleEditJob = (row) => {
	formDialogRef.value.openDialog(row.id);
};




/** 运行作业 */
const handleRunJob = async (row, type) => {
	if (type) {
		couponIssueDialogRef.value.openDialog(row);
	} else {
		try {
			await useMessageBox().confirm(`立刻执行一次任务(任务名称: ${row.jobName}), 是否继续?`);
		} catch {
			return;
		}

		try {
			await runJobRa(row.id);
			getDataList();
			useMessage().success(t('common.optSuccessText'));
		} catch (err: any) {
			useMessage().error('运行失败');
		}
	}

};


</script>
