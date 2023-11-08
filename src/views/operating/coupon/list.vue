<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('ranking.userName')" prop="customerName">
						<el-input :placeholder="$t('common.please') + $t('ranking.userName')" clearable
							v-model="state.queryForm.customerName" />
					</el-form-item>
					<el-form-item :label="$t('opinion.phone')" prop="phoneNumber">
						<el-input :placeholder="$t('common.please') + $t('opinion.phone')" clearable
							v-model="state.queryForm.phoneNumber" />
					</el-form-item>
					<el-form-item :label="$t('coupon.couponName')" prop="couponName">
						<el-input :placeholder="$t('common.please') + $t('coupon.couponName')" clearable
							v-model="state.queryForm.couponName" />
					</el-form-item>
					<el-form-item :label="t('coupon.gender')" prop="gender">
						<el-select :placeholder="t('common.select') + t('coupon.gender')" v-model="state.queryForm.gender">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in genderOption"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('coupon.useState')" prop="useState">
						<el-select :placeholder="t('common.select') + t('coupon.useState')" v-model="state.queryForm.useState">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in useStateOption"></el-option>
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
				<el-table-column label="#" fixed="left" width="60px" type="index" show-overflow-tooltip />
				<el-table-column :label="t('ranking.userName')" width="120px" prop="customerName" show-overflow-tooltip />
				<el-table-column :label="t('opinion.phone')" width="170px" prop="phoneNumber" show-overflow-tooltip />
				<el-table-column :label="t('coupon.gender')" width="60px" prop="gender" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.gender == 1 ? t('coupon.gender1') : t('coupon.gender2') }}
					</template>

				</el-table-column>
				<el-table-column :label="t('coupon.index')" width="180px" prop="id" show-overflow-tooltip />

				<el-table-column :label="t('coupon.issueDate')" width="170px" prop="issueDate" show-overflow-tooltip />
				<el-table-column :label="t('coupon.issuePerson')" prop="issuePerson" show-overflow-tooltip />
				<el-table-column :label="t('coupon.validity')" width="300px" prop="createBy" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.takeEffectTime }} - {{ scope.row.takeEffectTime }}
					</template>
				</el-table-column>
				<el-table-column :label="t('coupon.useState')" width="130px" prop="useState" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.useState == 1 ? t('coupon.useState1') : t('coupon.useState0') }}

					</template>
				</el-table-column>
				<el-table-column :label="t('coupon.useTime')" width="170px" prop="useTime" show-overflow-tooltip />
				<el-table-column :label="t('coupon.couponState')" width="130px" prop="useState" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.couponState ? t('coupon.' + scope.row.couponState) : '-' }}

					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="scope">
						<template v-if="scope.row.useState == 0 && scope.row.couponState == 'NORMAL'">
							<el-button v-auth="'job_sys_job_start_job'" @click="handleDelete(scope.row, 1)" text
								type="primary">回收</el-button>
							<el-button v-auth="'job_sys_job_start_job'" @click="handleDelete(scope.row, 2)" text
								type="primary">作废</el-button>
						</template>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<el-dialog v-model="dialogVisible" :title="form.couponCustomerHandle == 1 ? '回收' : '作废'" width="500px">
			<el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px">

				<el-form-item :label="t('ranking.userName')">
					{{ form.customerName }}
				</el-form-item>
				<el-form-item :label="t('opinion.phone')">
					{{ form.phoneNumber }}
				</el-form-item>
				<el-form-item :label="t('coupon.index')">
					{{ form.couponCustomerId }}
				</el-form-item>
				<el-form-item :label="t('coupon.couponName')">
					{{ form.couponName }}
				</el-form-item>
				<el-form-item :label="t('coupon.couponStateRemark')" prop="couponStateRemark">
					<el-input v-model="form.couponStateRemark" type="textarea" maxlength="200" autocomplete="off" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="toUpdateEnabled(ruleFormRef)">{{ t('common.confirmButtonText') }}</el-button>
					<el-button :loading="btnLoading" @click="resetForm(ruleFormRef)">{{ t('common.cancelButtonText') }}</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="systemSysJob" setup>

import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { getList, couponCustomerState } from '/@/api/operating/coupon';
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const btnLoading = ref(false)
// 获取国际化方法
const { t } = useI18n();
const useStateOption = ref([
	{
		label: t('coupon.useState1'),
		value: '1'
	}, {
		label: t('coupon.useState0'),
		value: '0'
	}
])
const genderOption = ref([
	{
		label: t('coupon.gender1'),
		value: '1'
	}, {
		label: t('coupon.gender2'),
		value: '2'
	}
])
const dialogVisible = ref(false)
const form = ref({
	customerName: null,
	phoneNumber: null,
	couponName: null,
	couponCustomerId: null,
	couponStateRemark: '',
	couponCustomerHandle: null
})
const rules = reactive<FormRules<RuleForm>>({
	couponStateRemark: [
		{ required: true, message: t('common.please'), trigger: 'blur' },
	],
})
/** 审核操作 */
const handleDelete = (row, type) => {
	form.value = {
		...row,
		couponCustomerId: row.id,
		couponStateRemark: '',
		couponCustomerHandle: type
	}

	dialogVisible.value = true


};
const toUpdateEnabled = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async (valid) => {
		if (valid) {
			try {
				btnLoading.value = true
				await couponCustomerState(form.value);
				btnLoading.value = false
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
		return await getList(pamars)
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





</script>
