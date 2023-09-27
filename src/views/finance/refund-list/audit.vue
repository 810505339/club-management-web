<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="$t('common.audit')" draggable>

		<el-form :model="form" label-width="120px">

			<el-form-item :label="$t('common.audit')">
				<el-radio-group v-model="form.resource">
					<el-radio :label="$t('common.agree')" />
					<el-radio :label="$t('common.disagree')" />
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('refund.reason1')">
				<el-input v-model="form.desc" type="textarea" :placeholder="$t('refund.inputReasonTip')" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts" name="job-log">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/daemon/job-log';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';

const { t } = useI18n();
const visible = ref(false);
const form = reactive({
	name: '',
	region: '',
	date1: '',
	date2: '',
	delivery: false,
	type: [],
	resource: '',
	desc: '',
})
const onSubmit = () => {
	console.log('submit!')
}
const { job_execute_status } = useDict('job_type', 'job_execute_status');

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
	pageList: fetchList,
	createdIsNeed: false,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const openDialog = (id: string) => {
	visible.value = true;
	// state.queryForm.jobId = id;
	// getDataList();
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
