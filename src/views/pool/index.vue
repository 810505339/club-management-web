<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view ">

			<div class="flex  text-center">

				<div class="flex-auto p-5">

					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">

							<el-form-item :label="t('pool.search1')" prop="partyMode">
								<el-select v-model="state.queryForm.partyMode">

									<el-option v-for="item in modeList" :key="item.winePartyMode" :label="item.modeName"
										:value="item.winePartyMode" />
								</el-select>
							</el-form-item>

							<el-form-item :label="t('pool.search2')" prop="areaList">
								<el-select />
							</el-form-item>

							<el-form-item :label="t('pool.search3')" prop="partyName" fixed="right">
								<el-input v-model="state.queryForm.partyName" />
							</el-form-item>

							<el-form-item :label="t('pool.search4')" prop="playerName" fixed="right">
								<el-input v-model="state.queryForm.playerName" />
							</el-form-item>


							<el-form-item>
								<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8 flex items-center">
							<div v-for="item, index in stateList" :key="index" class="mr-2">
								<span>{{ item.label }}:</span>
								<span :class="item.color" class="ml-2 font-bold">{{ item.num }}</span>
							</div>
						</div>
					</el-row>

					<el-scrollbar height="500px">

						<el-table stripe :data="state.dataList" style="width: 100%" v-loading="state.loading"
							:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
							<el-table-column :label="$t('common.index')" type="index" width="60" fixed="left" />
							<el-table-column :label="t('pool.search3')" fixed="left" prop="partyName" />
							<el-table-column :label="t('pool.search2')" prop="partyType" />
							<el-table-column :label="t('pool.search1')" width="300" prop="partyMode.modeName" />
							<el-table-column :label="t('pool.table1')" prop="partyPlayerNumber">
								<template #default="{ row }">
									<div class="text-[#759BFFFF] cursor-pointer" @click="userDialogRef.openDialog(row.id)">
										{{ row['partyPlayerNumber'] }}</div>
								</template>
							</el-table-column>
							<el-table-column :label="t('pool.table2')" prop="areaBooth" />
							<el-table-column :label="t('pool.table3')" prop="drinksMeal" />
							<el-table-column :label="t('pool.table4')" prop="partyAmount" />
							<el-table-column :label="t('pool.table5')" prop="partyTime" fixed="right" width="300" />
							<el-table-column :label="t('pool.table6')" prop="promoterName" fixed="right" width="300" />
						</el-table>
						<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
						</pagination>

					</el-scrollbar>


				</div>
			</div>

		</div>

		<user-form ref="userDialogRef" @refresh="handlegetTicketList" />

		<upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx" url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';

import userForm from "./form.vue";
import { getStoreName } from '/@/api/admin/store';
import { getTicketAll, getTicketDetail, updateEnabledByTicketDetail } from '/@/api/admin/commodity';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { storeAreaTree } from '/@/api/operating/coupon';
import useAllModel from './hooks/useAllModel';
import { wineList } from '/@/api/admin/pool';
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)
const options = ref([])
const { t } = useI18n();

//拼局中：15    待入场：100    已入场：123   拼局失败：333
const stateList = [
	{ label: t('pool.state1'), num: '15', color: 'text-[#759BFFFF]' },
	{ label: t('pool.state2'), num: '100', color: 'text-[#E6A055FF]' },
	{ label: t('pool.state3'), num: '123', color: 'text-[#CAF16CFF]' },
	{ label: t('pool.state4'), num: '333', color: 'text-[]' },
]

const enabledList = [
	{ label: '上架', value: '1' },
	{ label: '下架', value: '0' },
]
const queryRef = ref();
// 定义变量内容
const userDialogRef = ref();
const showSearch = ref(true);
const { modeList } = useAllModel()


// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		partyType: '',
		partyMode: '',
		status: '',
		partyName: '',
		playerName: '',

	},
	pageList: wineList
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);


//点击下架
const handleTakedown = async (row: any) => {

	//scope.row['enabled'] == 1 ? '上架' : '下架'
	//shelves: '上架',
	//	takedown: '下架',
	const enabled = row.enabled == 1 ? '0' : '1'

	if (row.enabled == 1) {
		await useMessageBox().confirm(t('shopList.sureTakedown'))
	}
	//1:下架,0:正常
	await updateEnabledByTicketDetail({
		id: row.id,
		enabled: enabled
	})
	useMessage().success(t('common.optSuccessText'));

	getDataList();


}

const getstoreAreaTree = async () => {
	const { data } = await storeAreaTree({ type: 0 })
	options.value = data
}


const handleDelete = async (id: string) => {

}



onMounted(async () => {
	await getstoreAreaTree()
})

</script>
<style scoped>
:deep(.el-scrollbar) {
	height: 90%;
}
</style>
