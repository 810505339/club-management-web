<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('journal.shop')" prop="storeId">
						<el-select v-model="state.queryForm.storeId" :placeholder="$t('common.select') + $t('journal.shop')">
							<el-option v-for="item, index in storeList" :key="index" :label="item.name" :value="item.id" clearable>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('param.status')" prop="status">
						<el-select :placeholder="t('common.select') + t('param.status')" v-model="state.queryForm.status">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in statusOption"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('broadcast.type')" prop="upperScreenType">
						<el-select :placeholder="t('common.select') + t('broadcast.type')" v-model="state.queryForm.upperScreenType">
							<el-option :key="index" :label="item.label" :value="item.value"
								v-for="(item, index) in upperScreenTypes"></el-option>
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
				<el-table-column :label="t('job.index')" fixed="left" type="index" />
				<el-table-column :label="t('refund.person')" prop="applicantId" show-overflow-tooltip />
				<el-table-column :label="t('sysuser.phone')" prop="contact" show-overflow-tooltip />
				<el-table-column :label="t('journal.shop')" prop="storeVO" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.storeVO.name }}
					</template>
				</el-table-column>
				<!-- <el-table-column :label="t('broadcast.type')" prop="upperScreenType" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.storeVO.upperScreenType == 1 ? t('broadcast.type2') : t('broadcast.type1') }}
					</template>
				</el-table-column> -->
				<el-table-column :label="t('broadcast.upperScreenContent')" prop="upperScreenContent" show-overflow-tooltip>
					<!-- <template #default="scope">
						{{ scope.row.storeVO.upperScreenType == 1 ? t('broadcast.type2') : t('broadcast.type1') }}
					</template> -->
				</el-table-column>
				<el-table-column :label="t('sysuser.lockFlag')" prop="broadcastState" show-overflow-tooltip>
					<template #default="scope">
						<el-tag class="ml-2" :type="scope.row['enabled'] == 1 ? 'success' : 'danger'">{{ scope.row['enabled'] == 0
							?
							$t('banner.takedown') : $t('banner.shelves') }} </el-tag>

					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" fixed="right" width="120">
					<template #default="scope">
						<el-button text type="primary">{{ t('common.download') }}</el-button>
						<el-button v-auth="'job_sys_job_del'" @click="handleDelete(scope.row)" text type="primary">{{
							$t('common.dispose') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<el-dialog v-model="dialogVisible" :title="t('common.audit')" width="500px">
			<el-form :model="form" :rules="rules" ref="ruleFormRef" label-width="100px">
				<el-form-item :label="t('common.audit')" prop="state">
					<el-radio-group v-model="form.state" class="ml-4">
						<el-radio label="1"> {{ t('message.evaluation.status4') }}</el-radio>
						<el-radio label="0">{{ t('message.evaluation.status3') }} </el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.state == 0" :label="t('message.evaluation.reason')" prop="msg">
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

<script lang="ts" name="broadcast" setup>

import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, updateEnabled } from '/@/api/operating/broadcast';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { getStoreName } from '/@/api/admin/store';
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
// 获取国际化方法
const { t } = useI18n();

const storeList = ref([])
getStoreName().then(res => {
	storeList.value = res.data
})

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const JobLog = defineAsyncComponent(() => import('./job-log.vue'));
const statusOption = ref([
	{
		label: t('message.evaluation.status1'),
		value: 0
	}, {
		label: t('message.evaluation.status2'),
		value: 1
	}, {
		label: t('message.evaluation.status3'),
		value: 2
	}
])
const upperScreenTypes = ref([
	{
		label: t('broadcast.type1'),
		value: 0
	}, {
		label: t('broadcast.type2'),
		value: 1
	},
])

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
/** 行选中事件 */
const handleSelectionChange = (rows: any) => {
	selectedRows.value = rows;
	multiple.value = !rows.length;
};
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

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	dialogVisible.value = false
}

</script>
