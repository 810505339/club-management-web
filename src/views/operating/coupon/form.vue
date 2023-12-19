<!--
 * @Author: yxx
 * @Date: 2023-09-24 11:45:01
 * @LastEditTime: 2023-12-20 00:15:34
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
					<el-form-item v-if="form.typeDetailDTO.type === 'DISCOUNT_VOUCHERS'">
						<span class="mr-10">{{ t('coupon.doorSill') }}</span>
						<el-input-number class="flex-1" :controls="false" v-model="form.typeDetailDTO.doorSill" :min="1" :max="99" />
						<span class="mx-10">折扣</span> <el-input-number class="flex-1" :controls="false"
							v-model="form.typeDetailDTO.discount" :min="1" />
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
						<el-input-number v-model="form.couponNumber" clearable />
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
						<el-input v-model="form.useExplain" type="textarea" clearable />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.remark')" prop="remark">
						<el-input v-model="form.remark" type="textarea" clearable />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					{{ t("coupon.scopeDTOS") }}
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.storeId')" prop="storeId">
						<el-select v-model="form.storeId" :placeholder="t('common.select') + t('coupon.storeId')"
							@change="changeStoreId()">
							<el-option v-for="(item, index) in storeOption" :key="index" :label="item.name"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('coupon.scopeDTOS')" prop="scopeDTO.useScopes">
						<el-select :disabled="!form.storeId" v-model="form.scopeDTO.useScopes"
							:placeholder="t('common.select') + t('coupon.scopeDTOS')" multiple>
							<el-option v-for="(item, index) in useScopeOption" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<!-- 预定门票 -->
				<el-col v-if="form.scopeDTO.useScopes.includes('RESERVE_TICKET')" :span="24" class="mb20">
					<el-form-item :label="t('coupon.useScope1')" prop="scopeDTO.ticketIds">
						<!-- <el-cascader v-model="form.reserveTickets" :options="reserveTicket" :props="props" collapse-tags
							:show-all-levels="false" clearable /> -->
						<el-select v-model="form.scopeDTO.ticketIds" multiple :placeholder="t('common.select')">
							<el-option v-for="(item, index) in reserveTicket" :key="index" :label="item.name"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>

				</el-col>
				<!-- 拼酒局 -->
				<el-col v-if="form.scopeDTO.useScopes.includes('SHARE_WINE')" :span="24" class="mb20">
					<el-form-item :label="t('coupon.useScope2')" prop="scopeDTO.winePartyModes">
						<!-- <el-cascader v-model="form.shareWines" :options="shareWine" :props="props" collapse-tags
							:show-all-levels="false" clearable /> -->
						<el-select v-model="form.scopeDTO.winePartyModes" multiple :placeholder="t('common.select')">
							<el-option v-for="(item, index) in shareWine" :key="index" :label="item.description"
								:value="item.winePartyMode"></el-option>
						</el-select>
					</el-form-item>

				</el-col>
				<!-- 预定卡座 -->
				<el-col v-if="form.scopeDTO.useScopes.includes('RESERVE_BOOTH')" :span="24" class="mb20">

					<el-form-item :label="t('coupon.useScope3')" prop="scopeDTO.boothIds">
						<el-cascader v-model="form.scopeDTO.boothIds" :options="reserveBooth" :props="props" collapse-tags
							:show-all-levels="false" clearable />
						<!-- <el-select v-model="form.reserveBooths" multiple :placeholder="t('common.select')">
							<el-option v-for="(item, index) in reserveBooth" :key="index" :label="item.label"
								:value="item.value"></el-option>
						</el-select> -->
					</el-form-item>
				</el-col>
				<!-- 活动 -->
				<el-col v-if="form.scopeDTO.useScopes.includes('ACTIVITY')" :span="24" class="mb20">
					<el-form-item :label="t('coupon.useScope4')" prop="scopeDTO.activityIds">
						<!-- <el-cascader v-model="form.activities" :options="activity" :props="props" collapse-tags
							:show-all-levels="false" clearable /> -->
						<el-select multiple v-model="form.scopeDTO.activityIds" :placeholder="t('common.select')">
							<el-option v-for="(item, index) in activity" :key="index" :label="item.activityTitle"
								:value="item.activityId"></el-option>
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
import { addObj, getObj, putObj, getActivityByStoreId, getTicketByStoreId, getAreaBoothById, getWinePartyMode } from '/@/api/operating/coupon';
import { getStoreName } from '/@/api/admin/store';

import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);

const { t } = useI18n();
const props = {
	multiple: true,
	emitPath: false
}
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const reserveTicket: any = ref([])
const shareWine: any = ref([])
const reserveBooth: any = ref([])
const activity: any = ref([])
const storeOption: any = ref([])
const typeOption = ref([
	{
		label: t('coupon.CASH_VOUCHERS'),
		value: 'CASH_VOUCHERS'
	}, {
		label: t('coupon.MAX_OUT_VOUCHERS'),
		value: 'MAX_OUT_VOUCHERS'
	}, {
		label: t('coupon.DISCOUNT_VOUCHERS'),
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
const form: any = reactive({
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
	storeId: null,
	scopeDTO: {
		ticketIds: [],
		winePartyModes: [],
		boothIds: [],
		activityIds: [],
		useScopes: [],
	},
	issueWay: '1',


});



// 定义校验规则
const dataRules = reactive({
	name: [{ required: true, message: t('coupon.couponName') + t('common.empty'), trigger: 'blur' }],
	'typeDetailDTO.type': [{ required: true, message: t('coupon.type') + t('common.empty'), trigger: 'change' }],
	'typeDetailDTO.discount': [{ required: true, message: t('common.empty'), trigger: 'blur' }],
	'typeDetailDTO.doorSill': [{ required: true, message: t('common.empty'), trigger: 'blur' }],
	blockNumber: [{ required: true, message: t('coupon.blockNumber') + t('common.empty'), trigger: 'blur' }],
	useExplain: [{ required: true, message: t('coupon.useExplain') + t('common.empty'), trigger: 'blur' }],
	storeId: [{ required: true, message: t('coupon.storeId') + t('common.empty'), trigger: 'change' }],
	'scopeDTO.useScopes': [{ required: true, message: t('coupon.scopeDTOS') + t('common.empty'), trigger: 'change' }],
	'scopeDTO.ticketIds': [{ required: true, message: t('common.select'), trigger: 'change' }],
	'scopeDTO.winePartyModes': [{ required: true, message: t('common.select'), trigger: 'change' }],
	'scopeDTO.boothIds': [{ required: true, message: t('common.select'), trigger: 'change' }],
	'scopeDTO.activityIds': [{ required: true, message: t('common.select'), trigger: 'change' }],
});
const toGetStoreActivity = () => {
	getActivityByStoreId(form.storeId).then((res: any) => {
		activity.value = res.data
		// res.data.forEach((d, i) => {
		// 	activity.value.push({
		// 		label: d.storeName,
		// 		value: d.storeId
		// 	})
		// 	if (d.activityTreeVOList?.length) {
		// 		activity.value[i].children = d.activityTreeVOList.map(dd => {
		// 			let _a = {
		// 				label: dd.activityTitle,
		// 				value: dd.activityId,
		// 			}
		// 			return _a
		// 		})
		// 	}
		// });
	})
}
//门票
const toStoreTicket = () => {
	getTicketByStoreId(form.storeId).then(res => {
		reserveTicket.value = res.data
		// res.data.forEach((d, i) => {
		// 	reserveTicket.value.push({
		// 		label: d.name,
		// 		value: d.id
		// 	})
		// 	if (d.ticketTreeVOList?.length) {
		// 		reserveTicket.value[i].children = d.ticketTreeVOList.map(dd => {
		// 			let _a = {
		// 				label: dd.ticketName,
		// 				value: dd.ticketId,
		// 			}
		// 			return _a
		// 		})
		// 	}
		// });
	})
}
getWinePartyMode().then(res => {
	shareWine.value = res.data


})
const toGetAreaBoothById = () => {
	getAreaBoothById(form.storeId).then(res => {
		res.data.forEach((d, i) => {
			reserveBooth.value.push({
				label: d.name,
				value: d.id
			})
			if (d.list?.length) {
				reserveBooth.value[i].children = d.list.map(dd => {
					let _a = {
						label: dd.name,
						value: dd.id,
					}
					return _a
				})
			}
		});
		// reserveBooth.value = res.data
	})
}
getStoreName().then(res => {
	storeOption.value = res.data
})
const changeStoreId = (type?: number) => {
	console.log(type)
	if (!type) {
		form.scopeDTO = {
			ticketIds: [],
			winePartyModes: [],
			boothIds: [],
			activityIds: []
		}
	}
	toGetStoreActivity()
	toStoreTicket()
	toGetAreaBoothById()
}

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
		// form.scopeDTOS = form.useScopes.map(d => {
		// 	let _a = {
		// 		useScope: d,
		// 		scopeIds: []
		// 	}
		// 	if (d === 'ACTIVITY') {
		// 		_a.scopeIds = form.activities
		// 	}
		// 	if (d == 'RESERVE_BOOTH') {
		// 		_a.scopeIds = form.reserveBooths
		// 	}
		// 	if (d == 'SHARE_WINE') {
		// 		_a.scopeIds = form.shareWines
		// 	}
		// 	if (d == 'RESERVE_TICKET') {
		// 		_a.scopeIds = form.reserveTickets
		// 	}
		// 	return _a
		// })
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
		let _data = {
			...res.data,
			typeDetailDTO: res.data.couponTypeDetailVO,
			scopeDTO: res.data.couponScopeVO
		}

		// res.data.couponScopeVOS.forEach(d => {
		// 	if (d.useScope == 'ACTIVITY') {
		// 		_data.activities = d.scopeIds
		// 	}
		// 	if (d.useScope == 'RESERVE_BOOTH') {
		// 		_data.reserveBooths = d.scopeIds
		// 	}
		// 	if (d.useScope == 'SHARE_WINE') {
		// 		_data.shareWines = d.scopeIds
		// 	}
		// 	if (d.useScope == 'RESERVE_TICKET') {
		// 		_data.reserveTickets = d.scopeIds
		// 	}
		// 	_data.useScopes.push(d.useScope)
		// });
		Object.assign(form, _data);
		changeStoreId(1)
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
