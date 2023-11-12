<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('journal.shop')" prop="storeId">

						<el-select v-model="state.queryForm.storeId" :placeholder="$t('common.select') + $t('journal.shop')">
							<el-option v-for="item, index in storeList" :key="index" :label="item.name" :value="item.id" clearable>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('param.status')" prop="auditState">
						<el-select :placeholder="t('common.select') + t('param.status')" v-model="state.queryForm.auditState">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in evaluationStatus"></el-option>
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
			<el-table stripe :data="state.dataList" style="width: 100%" v-loading="state.loading" border
				:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
				<el-table-column :label="t('evaluation.index')" fixed="left" type="index" />
				<el-table-column :label="t('evaluation.ID')" prop="id" show-overflow-tooltip />
				<el-table-column :label="t('evaluation.model')" prop="storeVO" show-overflow-tooltip />
				<el-table-column :label="t('evaluation.time')" prop="jobStatus" show-overflow-tooltip />
				<el-table-column :label="t('journal.shop')" prop="storeVO" show-overflow-tooltip />
				<el-table-column :label="t('evaluation.initiator')" prop="initiatorVO" show-overflow-tooltip />
				<el-table-column :label="t('evaluation.appraiser')" prop="appraiserVO" show-overflow-tooltip />
				<el-table-column :label="t('evaluation.msg')" prop="commentContent" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" fixed="right" width="80">
					<template #default="scope">
						<el-button v-if="scope.row.auditState === 'IN_AUDIT'" v-auth="'job_sys_job_del'"
							@click="handleDelete(scope.row)" text type="primary">{{
								$t('common.audit') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" :title="t('common.audit')" width="500px">
			<el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px">
				<el-form-item :label="t('common.audit')" prop="reqDTO.auditAction">
					<el-radio-group v-model="form.reqDTO.auditAction" class="ml-4">
						<el-radio label="PASS"> {{ t('message.evaluation.status4') }}</el-radio>
						<el-radio label="REJECT">{{ t('message.evaluation.status3') }} </el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.reqDTO.auditAction == 'REJECT'" :label="t('message.evaluation.reason')"
					prop="reqDTO.remark">
					<el-input v-model="form.reqDTO.remark" type="textarea" autocomplete="off" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="toUpdateEnabled(ruleFormRef)">{{ t('common.confirmButtonText') }}</el-button>
					<el-button @click="resetForm(ruleFormRef)">{{ t('common.cancelButtonText') }}</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="evaluation" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { fetchList, updateEnabled } from '/@/api/operating/evaluation';
import { getStoreName } from '/@/api/admin/store';
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
// 获取国际化方法
const { t } = useI18n();


/** 搜索表单信息 */
const queryForm = reactive({
	storeId: '',
	auditAction: null
});
/** 是否展示搜索表单 */
const showSearch = ref(true);
const evaluationStatus = ref([
	{
		label: t('message.evaluation.status1'),
		value: 'IN_AUDIT'
	}, {
		label: t('message.evaluation.status2'),
		value: 'PASS'
	}, {
		label: t('message.evaluation.status3'),
		value: 'REJECT'
	}
])
// 多选变量
/** 选中的行 */
const selectedRows = ref([]);
const storeList = ref([])
getStoreName().then(res => {
	storeList.value = res.data
})


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
const dialogVisible = ref(false)
const form = ref(
	{
		reqDTO: {
			taskId: null,
			remark: '',
			auditAction: 'PASS'
		},
		commentId: null
	})
const rules = reactive<FormRules<RuleForm>>({
	'reqDTO.remark': [
		{ required: true, message: t('common.please'), trigger: 'blur' },
	],
})
/** 审核操作 */
const handleDelete = (row) => {
	form.value = {
		reqDTO: {
			taskId: row.taskId,
			remark: '',
			auditAction: 'PASS'
		},
		commentId: row.id
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

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	dialogVisible.value = false
}
</script>
