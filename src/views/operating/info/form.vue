<template>
	<el-dialog v-model="visible" :close-on-click-modal="false"
		:title="form.jobId ? $t('common.editBtn') : $t('common.addBtn')" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-form-item :label="t('info.title')" prop="title">
				<el-input v-model="form.title" :placeholder="$t('common.please') + t('info.title')" />
			</el-form-item>
			<el-form-item :label="t('info.message')" prop="content">
				<el-input v-model="form.content" type="textarea" :placeholder="$t('common.please') + t('info.message')" />
			</el-form-item>
			<el-form-item :label="t('info.type')" prop="type">
				<el-select v-model="form.type" :placeholder="$t('common.select') + t('info.type')">
					<el-option v-for="(item, index) in types" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="form.type == 1" :label="t('info.time')" prop="pushTime">
				<el-date-picker v-model="form.pushTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
					:placeholder="$t('common.select') + $t('info.time')" />
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
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { addObj, getObj, putObj } from '/@/api/operating/info';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const types = ref([
	{ "label": t('info.type1'), "value": "1" },
	{ "label": t('info.type2'), "value": "0" }
])
// 提交表单数据
const form: any = reactive({
	id: null,
	title: '',
	content: '',
	type: '1',
	pushTime: '',
});


// 定义校验规则
const dataRules = reactive({
	title: [{ required: true, message: `${t('info.title')}${t('common.empty')}`, trigger: 'blur' }],
	content: [{ required: true, message: `${t('info.message')}${t('common.empty')}`, trigger: 'blur' }],
	pushTime: [{ required: true, message: `${t('info.time')}${t('common.empty')}`, trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	// form.id = 0;

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取sysJob信息
	if (id) {
		form.id = id;
		getsysJobData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
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
