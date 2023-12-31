<template>
	<el-dialog v-model="visible" :close-on-click-modal="false"
		:title="form.jobId ? $t('common.editBtn') : $t('refund.refund')" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">

			<el-form-item :label="t('refund.userName1')" prop="jobName">
				<el-select v-model="form.jobName" multiple filterable remote reserve-keyword :placeholder="t('common.searchKey')"
					remote-show-suffix :remote-method="remoteMethod" :loading="loading">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

			<el-form-item :label="t('refund.amount')" prop="jobGroup">
				<el-input-number v-model="form.jobGroup" :placeholder="t('common.please')" />
			</el-form-item>

			<el-form-item :label="t('refund.reason')" prop="methodName">
				<el-input v-model="form.remark" :placeholder="t('common.please')" type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button formDialogRef @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button formDialogRef type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SysJobDialog" setup>
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/daemon/job';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);
const Crontab = defineAsyncComponent(() => import('/@/components/Crontab/index.vue'));

const { t } = useI18n();
interface ListItem {
	value: string
	label: string
}
const options = ref<ListItem[]>([])
const remoteMethod = (query: string) => {
	if (query) {
		loading.value = true
		setTimeout(() => {
			loading.value = false
			options.value = list.value.filter((item) => {
				return item.label.toLowerCase().includes(query.toLowerCase())
			})
		}, 200)
	} else {
		options.value = []
	}
}
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典
const { misfire_policy, job_type } = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');

// 提交表单数据
const form = reactive({
	jobId: '',
	jobName: '',
	jobGroup: '',
	jobType: '',
	executePath: '',
	className: '',
	methodName: '',
	methodParamsValue: '',
	cronExpression: '',
	misfirePolicy: '',
	jobStatus: '',
	jobExecuteStatus: '',
	remark: '',
});

const popoverVis = (bol: boolean) => {
	popoverVisible.value = bol;
};

const popoverVisible = ref(false);
// 定义校验规则
const dataRules = reactive({
	jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
	jobGroup: [{ required: true, message: '任务组名不能为空', trigger: 'blur' }],
	jobType: [{ required: true, message: '任务类型不能为空', trigger: 'blur' }],
	cronExpression: [{ required: true, message: 'cron不能为空', trigger: 'blur' }],
	misfirePolicy: [{ required: true, message: '策略不能为空', trigger: 'blur' }],
	executePath: [{ required: true, message: '执行路径不能为空', trigger: 'blur' }],
	className: [{ required: true, message: '执行文件不能为空', trigger: 'blur' }],
	methodName: [{ required: true, message: '执行方法不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.jobId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取sysJob信息
	if (id) {
		form.jobId = id;
		getsysJobData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;

	try {
		loading.value = true;
		form.jobId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.jobId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error('任务初始化异常');
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getsysJobData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
