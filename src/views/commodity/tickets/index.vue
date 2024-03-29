<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view ">

					<div class="flex h-full text-center">

						<div class="flex-auto h-full p-5">

							<el-row v-show="showSearch">
								<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">

									<el-form-item :label="areaName" prop="areaList">
										<el-cascader :options="options" :props="cascaderProps" v-model="state.queryForm.areaList"
											:show-all-levels="false" />
									</el-form-item>

									<el-form-item :label="$t('area.state')" prop="enabled">
										<el-select v-model="state.queryForm.enabled" :placeholder="$t('area.stateSelect')" clearable>
											<el-option v-for="item, index in enabledList" :key="index" :label="item.label"
												:value="item.value">
											</el-option>
										</el-select>
									</el-form-item>


									<el-form-item>
										<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
										<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
									</el-form-item>
								</el-form>
							</el-row>
							<el-row>
								<div class="mb8">
									<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary"
										@click="userDialogRef.openDialog()">
										{{ $t('common.shelves') + t('tickets.tickets') }}
									</el-button>



								</div>
							</el-row>

							<el-table stripe v-loading="state.loading" :data="state.dataList"
								@selection-change="handleSelectionChange" border :cell-style="tableStyle.cellStyle"
								:header-cell-style="tableStyle.headerCellStyle">
								<el-table-column :label="$t('common.index')" type="index" width="60" fixed="left" />
								<el-table-column :label="name" fixed="left">
									<template #default="scope">
										{{ scope.row['ticketVO'].name }}
									</template>
								</el-table-column>
								<el-table-column :label="areaName" fixed="left">

									<template #default="scope">
										{{ scope.row['ticketVO'].areaVO.name }}
									</template>
								</el-table-column>
								<el-table-column :label="time" width="300" fixed="left">

									<template #default="scope">
										{{ scope.row['beginTime'] }}~{{ scope.row['endTime'] }}
									</template>
								</el-table-column>
								<el-table-column :label="sum" props="ticketDetailNumber">

									<template #default="scope">
										{{ scope.row['ticketDetailNumber'] }}
									</template>
								</el-table-column>
								<el-table-column :label="price" props="amount">

									<template #default="scope">
										{{ scope.row['amount'] }}
									</template>
								</el-table-column>
								<el-table-column :label="duration" width="300">

									<template #default="scope">
										{{ scope.row['disabledTime'] }}
									</template>
								</el-table-column>
								<el-table-column :label="status">

									<template #default="scope">
										{{ scope.row['enabled'] == 1 ? $t('shopList.shelves') : $t('shopList.takedown') }}
									</template>
								</el-table-column>
								<el-table-column :label="$t('common.action')" width="180" fixed="right">

									<template #default="scope">


										<div v-if="scope.row['enabled'] == 0">

											<el-button icon="Top" text type="primary" @click="handleTakedown(scope.row)">
												{{ $t('shopList.shelves') }}
											</el-button>
											<!-- 
											<el-button icon="edit-pen" text type="primary" @click="userDialogRef.openDialog(scope.row.id)">
												{{ $t('common.editBtn') }}
											</el-button>


											<el-tooltip :content="$t('goods.deleteDisabledTip')" :disabled="scope.row.userId !== '1'"
												placement="top">
												<span style="margin-left: 12px">
													<el-button icon="delete" :disabled="scope.row.username === 'admin'" text type="primary"
														@click="handleDelete(scope.row.id)">{{ $t('common.delBtn') }}
													</el-button>
												</span>
											</el-tooltip> -->

										</div>




										<el-button icon="Bottom" text type="primary" @click="handleTakedown(scope.row)" v-else>
											{{ $t('shopList.takedown') }}
										</el-button>


									</template>
								</el-table-column>
							</el-table>
							<pagination v-bind="state.pagination" @current-change="currentChangeHandle"
								@size-change="sizeChangeHandle">
							</pagination>
						</div>
					</div>

				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" @refresh="getDataList" />

		<upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx" url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useTranslateText } from './hooks/translate';
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
const { name,
	areaName,
	time,
	state: status,
	sum,
	duration,
	price } = useTranslateText(t)
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
