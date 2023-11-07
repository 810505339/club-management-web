<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view ">

					<div class="flex h-full text-center">
						<div class="w-64 bg-[#141414]  h-full">

							<el-scrollbar max-height="800px">
								<div v-for="item, index in  ticketsList " :key="item.id">
									<div class="p-5" :class="activeId === item.id && 'bg-[rgba(64,158,255,0.2)]'" @click="active(item)"
										@dblclick="userDialogRef.openDialog(item.id)">
										<el-image class="w-52 h-32" fit="cover" :src="item.img" v-if="item.img" />
										<div v-else class="w-52 h-32 flex justify-center items-center bg-[#1d1d1f]">暂无封面</div>

										<div class="text-[#ffffff] text-center mt-3">{{ name }}:{{ item.name }}</div>
									</div>
								</div>
							</el-scrollbar>
							<div>
								<el-button type="primary" class="my-2" @click="userDialogRef.openDialog()">
									{{ $t('common.addBtn') }}
								</el-button>
							</div>


						</div>
						<div class="flex-auto h-full p-5">

							<el-row v-show="showSearch">
								<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
									<el-form-item :label="$t('goods.name')" prop="name">
										<el-select v-model="state.queryForm.lockFlag" :placeholder="$t('goods.nameSelect')">
											<el-option v-for="item in lock_flag" :key="item.id" :label="item.label" :value="item.value"
												clearable>
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
								<div class="mb-8" style="width: 100%">
									<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
										{{ $t('common.addBtn') }}
									</el-button>


									<right-toolbar v-model:showSearch="showSearch" :export="'sys_user_export'" @exportExcel="exportExcel"
										@queryTable="getDataList" class="ml10 mr20 " style="float: right" />
								</div>
							</el-row>
							<el-table stripe v-loading="state.loading" :data="state.dataList" @selection-change="handleSelectionChange"
								border :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
								<el-table-column :label="$t('common.index')" type="index" width="60" fixed="left" />
								<el-table-column :label="name" type="id" width="100" fixed="left" />
								<el-table-column :label="areaName" type="id" fixed="left" />
								<el-table-column :label="time" type="id" width="100" fixed="left" />
								<el-table-column :label="sum" type="id" fixed="left" />
								<el-table-column :label="price" type="id" fixed="left" />
								<el-table-column :label="duration" type="id" fixed="left" />
								<el-table-column :label="status" type="id" fixed="left" />
								<el-table-column :label="$t('common.action')" width="160" fixed="right">
									<template #default="scope">
										<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary"
											@click="userDialogRef.openDialog(scope.row.userId)">
											{{ $t('common.editBtn') }}
										</el-button>
										<el-tooltip :content="$t('goods.deleteDisabledTip')" :disabled="scope.row.userId !== '1'"
											placement="top">
											<span style="margin-left: 12px">
												<el-button icon="delete" v-auth="'sys_user_del'" :disabled="scope.row.username === 'admin'" text
													type="primary" @click="handleDelete([scope.row.userId])">{{ $t('common.delBtn') }}
												</el-button>
											</span>
										</el-tooltip>
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
import { useTranslateText } from './hooks/translate';
import userForm from "./form.vue";
import { getStoreName } from '/@/api/admin/store';
import { getTicketAll } from '/@/api/admin/commodity';
import { useUserInfo } from '/@/stores/userInfo';
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)


const { t } = useI18n();
const { name,
	areaName,
	time,
	state: status,
	sum,
	duration,
	price } = useTranslateText(t)

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

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		state: '',
		name: '',
	},
	pageList: async (pamars) => {
		await handleStoreNameList()
		// return await getAreaList(pamars)
	},
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);
function active(item: ITicket) {
	activeId.value = item.id
}
//跟新下拉门店名称
const handleStoreNameList = async () => {
	const { data } = await getStoreName()
	storeNameList.value = data


}

const handlegetTicketList = async () => {
	const { data } = await getTicketAll()
	ticketsList.value = data.map(item => {
		return {
			...item,
			img: item.pictureFileVOs[0] ? `${fileCommonUrl.value}/${item.pictureFileVOs[0]?.fileName}` : undefined
		}
	})
}

onMounted(async () => {
	await handlegetTicketList()
})

</script>
<style scoped>
:deep(.el-scrollbar) {
	height: 90%;
}
</style>
