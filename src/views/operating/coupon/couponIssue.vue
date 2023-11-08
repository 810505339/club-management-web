<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" fullscreen title="发放" draggable>
		<el-form ref="dataFormRef" class="w-1/2" :model="form" :rules="dataRules" formDialogRef label-width="120px">
			<el-row :gutter="20">
				<el-col :span="24" class="mb20">
					{{ t("coupon.msg") }}
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.couponName')">
						{{ couponInfo.name }}
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.type')">
						{{ t('coupon.' + couponInfo.typeDetailDTO.type) }}
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.faceValue')" v-if="couponInfo.typeDetailDTO.type === 'CASH_VOUCHERS'"
						prop="typeDetailDTO.discount">
						抵扣{{ couponInfo.typeDetailDTO.discount }}
					</el-form-item>
					<el-form-item prop="typeDetailDTO.discount" v-if="couponInfo.typeDetailDTO.type === 'MAX_OUT_VOUCHERS'">
						<div class="flex flex-1">
							<span class="mr-10">满</span>{{ couponInfo.typeDetailDTO.doorSill }}
							<span class="mx-10">减</span>
							{{ couponInfo.typeDetailDTO.discount }}
						</div>
					</el-form-item>
					<el-form-item v-if="couponInfo.typeDetailDTO.type === 'DISCOUNT_VOUCHERS'">
						<template v-if="couponInfo.typeDetailDTO.doorSill">
							<span>满</span>
							{{ couponInfo.typeDetailDTO.doorSill }}
						</template>
						<span>打</span> {{ couponInfo.typeDetailDTO.discount }}折
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.surplusNumber')" prop="couponNumber">
						{{ couponInfo.surplusNumber }}
					</el-form-item>
				</el-col>
				<el-col v-if="couponInfo.blockReceive == 1" :span="24" class="mb20">
					<el-form-item :label="t('coupon.blockNumber')" prop="blockNumber">
						{{ couponInfo.blockNumber }}
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					{{ t("coupon.provideMode") }}
				</el-col>

				<!-- issueWay 发放方式,1:指定用户发放 ==手动发放，0:按条件发放===系统发放 -->
				<template v-if="couponInfo.issueWay == 0">
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.customerIsNew')" prop="customerIsNew">
							<el-radio-group v-model="form.customerIsNew">
								<el-radio label="1">{{ t('coupon.customerIsNew1') }}</el-radio>
								<el-radio label="0">{{ t('coupon.customerIsNew0') }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.behavior')" prop="behavior">
							<el-select v-model="form.behavior" :placeholder="t('common.select')">
								<el-option v-for="(item, index) in behaviorOption" :key="index" :label="item.label"
									:value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.gender')" prop="customerGender">
							<el-radio-group v-model="form.customerGender">
								<!-- <el-radio label="">全部</el-radio> -->
								<el-radio label="1">{{ t('coupon.gender1') }}</el-radio>
								<el-radio label="2">{{ t('coupon.gender1') }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</template>
				<template v-else>
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.customerInfos')" prop="customerInfos">
							<el-space wrap>
								<el-tag closable @close="closeUser(item)" type="info" v-for="(item, index) in form.customerInfos"
									:key=index>{{ item.name
									}}</el-tag>
								<el-button @click="userRef.openDialog(form.customerInfos || [])" type="primary">{{ t('common.select')
								}}</el-button>
							</el-space>


						</el-form-item>
					</el-col>

				</template>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.validType')" prop="validType">
						<el-radio-group v-model="form.validType">
							<el-radio label="1">{{ t('coupon.validType1') }}</el-radio>
							<el-radio label="0">{{ t('coupon.validType0') }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<template v-if="form.validType == 0">
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.effectiveDate')" prop="effectiveDate">
							<el-radio-group v-model="form.effectiveDate">
								<el-radio label="1">{{ t('coupon.effectiveDate1') }}</el-radio>
								<el-radio label="0">{{ t('coupon.effectiveDate0') }}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.validDay')" prop="validDay">
							<el-input-number :controls="false" v-model="form.validDay" :min="1" />
						</el-form-item>
					</el-col>
				</template>
				<template v-else>
					<el-col :span="24" class="mb20">
						<el-form-item :label="t('coupon.times')" prop="times">
							<el-date-picker v-model="form.times" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"
								value-format="YYYY-MM-DD HH:mm:ss" />
						</el-form-item>
					</el-col>
				</template>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.remark')" prop="issueWayRemark">
						<el-input v-model="form.issueWayRemark" type="textarea" />
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
	<User ref="userRef" @refresh="chooseUser" />
</template>

<script setup lang="ts" name="job-log">
import { getObj, couponIssue } from '/@/api/operating/coupon';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';
const emit = defineEmits(['refresh']);
const { t } = useI18n();
const visible = ref(false);
const dataFormRef = ref();
const User = defineAsyncComponent(() => import('./user.vue'));
const userRef = ref()
// 提交表单数据
const couponInfo: any = reactive({
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
	scopeDTOS: [],
	couponScopeVOS: [],
	issueWay: '1',
	useScopes: [],
	reserveTickets: [],
	shareWines: [],
	reserveBooths: [],
	activities: [],
	customerInfos: []
});
let form: any = reactive({
	couponId: '',
	customerIds: [],
	customerInfos: [],
	takeEffectTime: '',
	disabledTime: '',
	times: [],
	effectiveDate: '1',
	validDay: 1,
	validType: '1',
	customerIsNew: '1',
	customerGender: '',
	behavior: '',
	issueWayRemark: ''
});

const openDialog = (data: string) => {
	visible.value = true;
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
	getsysJobData(data.id)
};
const chooseUser = (data: any) => {
	form.customerInfos = data
}
const closeUser = (item: any) => {
	form.customerInfos = form.customerInfos.filter(d => d.id != item.id)
}
// 定义校验规则
const dataRules = reactive({
	name: [{ required: true, type: 'array', message: t('common.empty'), trigger: 'blur' }],
	customerInfos: [{ required: true, type: 'array', message: t('common.empty'), trigger: 'change' }],
	times: [{ required: true, message: t('common.empty'), trigger: 'blur' }],
	customerGender: [{ required: true, message: t('common.empty'), trigger: 'blur' }],
	behavior: [{ required: true, message: t('common.empty'), trigger: 'blur' }],
});
const behaviorOption = ref([
	{
		label: t('coupon.GENDER_AUTHENTICATION_SUCCESS'),
		value: 'GENDER_AUTHENTICATION_SUCCESS'
	}, {
		label: t('coupon.SHARE_WINE_SUCCESS'),
		value: 'SHARE_WINE_SUCCESS'
	}, {
		label: t('coupon.RESERVE_TICKET_SUCCESS'),
		value: 'RESERVE_TICKET_SUCCESS'
	}, {
		label: t('coupon.RESERVE_BOOTH_SUCCESS'),
		value: 'RESERVE_BOOTH_SUCCESS'
	},
])
const loading = ref(false)

// 初始化表单数据
const getsysJobData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		let _data = {
			...res.data,
			typeDetailDTO: res.data.couponTypeDetailVO,
			useScopes: []
		}
		res.data.couponScopeVOS.forEach(d => {
			if (d.useScope == 'ACTIVITY') {
				_data.activities = d.scopeIds
			}
			if (d.useScope == 'RESERVE_BOOTH') {
				_data.reserveBooths = d.scopeIds
			}
			if (d.useScope == 'SHARE_WINE') {
				_data.shareWines = d.scopeIds
			}
			if (d.useScope == 'RESERVE_TICKET') {
				_data.reserveTickets = d.scopeIds
			}
			_data.useScopes.push(d.useScope)
		});
		form.couponId = res.data.id
		Object.assign(couponInfo, _data);
	});
};
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => { });
	if (!valid) return false;
	try {
		loading.value = true;
		const temp = { ...form, takeEffectTime: form.times[0], disabledTime: form.times[1], customerIds: form.customerInfos.map(d => d.id) }


		await couponIssue(temp)

		useMessage().success(t('common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error('任务初始化异常');
	} finally {
		loading.value = false;
	}
}
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
