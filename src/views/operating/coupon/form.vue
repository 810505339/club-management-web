<!--
 * @Author: yxx
 * @Date: 2023-09-24 11:45:01
 * @LastEditTime: 2023-11-05 19:46:53
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\views\operating\coupon\form.vue
-->
<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')"
		draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="24" class="mb20">
					{{ t("coupon.msg") }}
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.couponName')" prop="name">
						<el-input v-model="form.name" :placeholder="t('common.please') + t('coupon.couponName')" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					{{ t("coupon.rule") }}
				</el-col>


				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.type')" prop="typeDetailDTO.type">
						<el-select v-model="form.typeDetailDTO.type" :placeholder="t('common.select') + t('coupon.type')">
							<el-option v-for="(item, index) in typeOption" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.faceValue')" v-if="form.typeDetailDTO.type === 'CASH_VOUCHERS'"
						prop="typeDetailDTO.discount">
						<el-input-number :controls="false" v-model="form.typeDetailDTO.discount" :min="1" />
					</el-form-item>
					<el-form-item prop="typeDetailDTO.discount" v-if="form.typeDetailDTO.type === 'MAX_OUT_VOUCHERS'">
						<div class="flex flex-1">
							<span class="mr-10">满</span>
							<el-input-number class="flex-1" :controls="false" v-model="form.typeDetailDTO.doorSill" :min="1" />
							<span class="mx-10">减</span>
							<el-input-number class="flex-1" :controls="false" v-model="form.typeDetailDTO.discount" :min="1" />
						</div>
					</el-form-item>
					<el-form-item :label="t('coupon.doorSill')" v-if="form.typeDetailDTO.type === 'DISCOUNT_VOUCHERS'"
						prop="typeDetailDTO.doorSill">
						<el-input-number class="flex-1" :controls="false" v-model="form.typeDetailDTO.doorSill" :min="0" />
					</el-form-item>
				</el-col>
				<!-- <el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.blockReceive')" prop="blockReceive">
						<el-radio-group v-model="form.blockReceive">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>

					</el-form-item>
				</el-col> -->
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.couponNumber')" prop="couponNumber">
						<el-input-number v-model="form.couponNumber" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.blockReceive')" prop="blockReceive">
						<el-radio-group v-model="form.blockReceive">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>

					</el-form-item>
				</el-col>
				<el-col v-if="form.blockReceive == 1" :span="24" class="mb20">
					<el-form-item :label="t('coupon.blockNumber')" prop="blockNumber">
						<el-input-number v-model="form.blockNumber" :min="1" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.useExplain')" prop="useExplain">
						<el-input v-model="form.useExplain" type="textarea" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.remark')" prop="remark">
						<el-input v-model="form.remark" type="textarea" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					{{ t("coupon.scopeDTOS") }}
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.scopeDTOS')" prop="scopeDTOS.useScope">
						<el-select v-model="form.scopeDTOS.useScope" :placeholder="t('common.select') + t('coupon.scopeDTOS')">
							<el-option v-for="(item, index) in useScopeOption" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<!-- 预定门票 -->
				<el-col v-if="form.scopeDTOS.useScope == 'RESERVE_TICKET'" :span="24" class="mb20">


				</el-col>
				<!-- 拼酒局 -->
				<el-col v-if="form.scopeDTOS.useScope == 'SHARE_WINE'" :span="24" class="mb20">


				</el-col>
				<!-- 预定卡座 -->
				<el-col v-if="form.scopeDTOS.useScope == 'RESERVE_BOOTH'" :span="24" class="mb20">


				</el-col>
				<!-- 活动 -->
				<el-col v-if="form.scopeDTOS.useScope == 'ACTIVITY'" :span="24" class="mb20">
					<el-form-item prop="scopeDTOS.scopeIds">
						<el-select v-model="form.scopeDTOS.scopeIds" multiple :placeholder="t('common.select')">
							<el-option v-for="(item, index) in useScopeOption" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>

				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.issueWay')" prop="issueWay">
						<el-radio-group v-model="form.issueWay">
							<el-radio label="1">{{ t('coupon.issueWay1') }}</el-radio>
							<el-radio label="0">{{ t('coupon.issueWay2') }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
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
import { addObj, getObj, putObj } from '/@/api/operating/coupon';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const typeOption = ref([
	{
		label: t('coupon.typeOption1'),
		value: 'CASH_VOUCHERS'
	}, {
		label: t('coupon.typeOption2'),
		value: 'MAX_OUT_VOUCHERS'
	}, {
		label: t('coupon.typeOption3'),
		value: 'DISCOUNT_VOUCHERS'
	},
])
const useScopeOption = ref([
	{
		label: t('coupon.useScope1'),
		value: 'RESERVE_TICKET'
	}, {
		label: t('coupon.useScope2'),
		value: 'SHARE_WINE'
	}, {
		label: t('coupon.useScope3'),
		value: 'RESERVE_BOOTH'
	}, {
		label: t('coupon.useScope4'),
		value: 'ACTIVITY'
	},
])
// 提交表单数据
const form = reactive({
	id: '',
	name: '',
	typeDetailDTO: {
		type: '',
		discount: '',
		doorSill: ''
	},
	blockReceive: '1',
	couponNumber: null,
	blockNumber: 1,
	useExplain: null,
	remark: null,
	scopeDTOS: {
		useScope: null,
		scopeIds: []
	},
	issueWay: '1'
});



// 定义校验规则
const dataRules = reactive({
	name: [{ required: true, message: t('coupon.couponName') + t('common.empty'), trigger: 'blur' }],
	'typeDetailDTO.type': [{ required: true, message: t('coupon.type') + t('common.empty'), trigger: 'change' }],
	'typeDetailDTO.discount': [{ required: true, message: t('common.empty'), trigger: 'blur' }],
	'typeDetailDTO.doorSill': [{ required: true, message: t('common.empty'), trigger: 'blur' }],
	blockNumber: [{ required: true, message: t('coupon.blockNumber') + t('common.empty'), trigger: 'blur' }],
	useExplain: [{ required: true, message: t('coupon.useExplain') + t('common.empty'), trigger: 'blur' }],
	'scopeDTOS.useScope': [{ required: true, message: t('coupon.scopeDTOS') + t('common.empty'), trigger: 'change' }],
	'scopeDTOS.scopeIds': [{ required: true, message: t('common.select'), trigger: 'change' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

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
