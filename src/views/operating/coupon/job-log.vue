<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="操作记录" draggable>
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<el-col v-for="(item, index) in couponLogVOS" :key="index" :span="24" class="mb10">
					{{ item.createTime }}：{{ t('coupon.' + item.userBehavior) }}，{{ item.remark }}
				</el-col>
			</el-row>
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="job-log">
import { getObj, } from '/@/api/operating/coupon';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const visible = ref(false);

const couponLogVOS: any = ref([])
const openDialog = (id: string) => {
	visible.value = true;
	getObj(id).then(res => {
		couponLogVOS.value = res.data.couponLogVOS
	})
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
