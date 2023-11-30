<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view ">

					<div class="flex h-full text-center">

						<div class="flex-auto h-full p-5">

							<el-row v-show="showSearch">
								<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">

									<el-form-item :label="t('pool.search1')" prop="areaList">
										<el-select />
									</el-form-item>

									<el-form-item :label="t('pool.search2')" prop="areaList">
										<el-select />
									</el-form-item>

									<el-form-item :label="t('pool.search3')" prop="areaList">
										<el-input />
									</el-form-item>

									<el-form-item :label="t('pool.search4')" prop="areaList">
										<el-input />
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

							<el-table stripe v-loading="state.loading" :data="state.dataList" @selection-change="handleSelectionChange"
								border :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
								<el-table-column :label="$t('common.index')" type="index" width="60" fixed="left" />
								<el-table-column :label="t('pool.search3')" fixed="left">
									<template #default="scope">
										{{ scope.row['ticketVO'].name }}
									</template>
								</el-table-column>
								<el-table-column :label="t('pool.search2')" fixed="left">
									<template #default="scope">
										{{ scope.row['ticketVO'].areaVO.name }}
									</template>
								</el-table-column>
								<el-table-column :label="t('pool.search1')" width="300" fixed="left">
									<template #default="scope">
										{{ scope.row['beginTime'] }}~{{ scope.row['endTime'] }}
									</template>
								</el-table-column>
								<el-table-column :label="t('pool.table1')" props="ticketDetailNumber">
									<template #default="scope">
										{{ scope.row['ticketDetailNumber'] }}
									</template>
								</el-table-column>
								<el-table-column :label="t('pool.table2')" props="amount">
									<template #default="scope">
										{{ scope.row['amount'] }}
									</template>
								</el-table-column>
								<el-table-column :label="t('pool.table3')" width="300">
									<template #default="scope">
										{{ scope.row['disabledTime'] }}
									</template>
								</el-table-column>
								<el-table-column :label="t('pool.table4')">
									<template #default="scope">
										{{ scope.row['enabled'] == 1 ? $t('shopList.shelves') : $t('shopList.takedown') }}
									</template>
								</el-table-column>

								<el-table-column :label="t('pool.table5')">
									<template #default="scope">
										{{ scope.row['enabled'] == 1 ? $t('shopList.shelves') : $t('shopList.takedown') }}
									</template>
								</el-table-column>

								<el-table-column :label="t('pool.table6')">
									<template #default="scope">
										{{ scope.row['enabled'] == 1 ? $t('shopList.shelves') : $t('shopList.takedown') }}
									</template>
								</el-table-column>

							</el-table>
							<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
							</pagination>
						</div>
					</div>

				</div>
			</pane>
		</splitpanes>

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
const storeNameList = ref<any[]>([])
type ITicket = {
	id: string;
	img: string
}
const ticketsList = ref<ITicket[]>([])
const activeId = ref('235645682655')

const cascaderProps = {
	label: "name",
	value: 'id',
	children: 'list',
	checkStrictly: true
}

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		enabled: '',
		storeId: '',
		areaId: '',
		areaList: []
	},
	pageList: async (pamars) => {
		console.log(pamars)
		const temp = {
			...pamars,
			storeId: pamars?.areaList?.[0],
			areaId: pamars?.areaList?.[1]
		}
		// console.log(temp);
		return await getTicketDetail(temp)
	},
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);


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
