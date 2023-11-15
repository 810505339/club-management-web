<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('shopList.name')" prop="storeId">
								<el-select v-model="state.queryForm.storeId" :placeholder="$t('area.nameSelect')" clearable>
									<el-option v-for="item, index in storeNameList" :key="index" :label="item.name" :value="item.id"
										clearable>
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item :label="$t('area.state')" prop="enabled">
								<el-select v-model="state.queryForm.enabled" :placeholder="$t('area.stateSelect')" clearable>
									<el-option v-for="item, index in enabledList" :key="index" :label="item.label" :value="item.value">
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
						<div class="mb8" style="width: 100%">
							<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
								{{ $t('common.addBtn') }}
							</el-button>


							<right-toolbar v-model:showSearch="showSearch" :export="'sys_user_export'" @exportExcel="exportExcel"
								@queryTable="getDataList" class="ml10 mr20 " style="float: right" />
						</div>
					</el-row>
					<el-table stripe v-loading="state.loading" :data="state.dataList" @selection-change="handleSelectionChange"
						border :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :label="$t('area.index')" prop="index" width="60" fixed="left" />
						<el-table-column :label="$t('area.id')" prop="id" width="100" fixed="left" />
						<el-table-column :label="$t('area.name')" prop="name" fixed="left" />
						<el-table-column :label="$t('area.store')" prop="store" width="100" fixed="left">
							<template #default="scope">
								{{ scope.row['storeVO']?.name }}
							</template>
						</el-table-column>

						<el-table-column :label="$t('area.time')" prop="time" fixed="left">
							<template #default="scope">
								<div v-for="item, index in timerFormat(scope.row['businessDateVOS'])" :key="index" class="my-2">
									{{ item }}
								</div>
							</template>
						</el-table-column>
						<el-table-column :label="$t('area.decks')" prop="decks" width="100" fixed="left">
							<template #default="scope">
								{{ scope.row['boothQuantity'] }}
							</template>
						</el-table-column>

						<el-table-column :label="$t('area.state')" prop="enabled" width="100" fixed="left">
							<template #default="scope">
								<div>
									{{ scope.row['enabled'] == 1 ? '上架' : '下架' }}
								</div>
							</template>
						</el-table-column>
						<el-table-column :label="$t('common.action')" width="300" fixed="right">
							<template #default="scope">
								<el-button icon="InfoFilled" text type="primary" @click="useInfoRef.open(scope.row.id)">
									{{ $t('common.detailBtn') }}
								</el-button>


								<el-button icon="Top" text type="primary" @click="handleTakedown(scope.row)"
									v-if="scope.row['enabled'] == 0">
									{{ $t('shopList.shelves') }}
								</el-button>

								<span else>
									<el-button icon="Bottom" text type="primary" @click="handleTakedown(scope.row)">
										{{ $t('shopList.takedown') }}
									</el-button>
									<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary"
										@click="userDialogRef.openDialog(scope.row.id)">
										{{ $t('common.editBtn') }}
									</el-button>
									<el-tooltip :content="$t('area.deleteDisabledTip')" :disabled="scope.row.userId !== '1'"
										placement="top">
										<span style="margin-left: 12px">
											<el-button icon="delete" text type="primary" @click="handleDelete([scope.row.id])">{{
												$t('common.delBtn') }}
											</el-button>
										</span>
									</el-tooltip>
								</span>

							</template>
						</el-table-column>
					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" :storeNameList="storeNameList" @refresh="getDataList(false)" />
		<info ref="useInfoRef" />

		<upload-excel ref="excelUploadRef" :title="$t('area.importUserTip')" temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>


<script lang="ts" name="systemUser" setup>
import { getAreaList, updateEnabled, deleteAreaByIds } from '/@/api/admin/area';
import { getStoreName } from '/@/api/admin/store';
import { list } from '/@/api/admin/role';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
import { weekdayFormat } from '/@/utils/formatTime';
import info from './info.vue'
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));


const enabledList = [
	{ label: '上架', value: '1' },
	{ label: '下架', value: '0' },
]
const { t } = useI18n();
// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const useInfoRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const optionsRoles = ref([]) as any;
const storeNameList = ref<any[]>([])


// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		enabled: '',

	},
	pageList: async (pamars) => {
		await handleStoreNameList()
		return await getAreaList(pamars)
	},
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);


list().then((res) => {
	optionsRoles.value = res.data;
});
// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};



// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/user/export', state.queryForm, 'users.xlsx');
};

//跟新下拉门店名称
const handleStoreNameList = async () => {
	const { data } = await getStoreName()
	storeNameList.value = data
	console.log(data);

}



// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await deleteAreaByIds(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//点击下架
const handleTakedown = async (row: any) => {

	//scope.row['enabled'] == 1 ? '上架' : '下架'
	//shelves: '上架',
	//	takedown: '下架',


	if (row.enabled == 1) {
		await useMessageBox().confirm(t('shopList.sureTakedown'))
	}
	//1:下架,0:正常
	await updateEnabled({ id: row.id })
	useMessage().success(t('common.optSuccessText'));

	getDataList();


}


//初始化时间
function timerFormat(list: any[]) {

	return list.map((item) => {
		return `${weekdayFormat(Number(item.beginWeekDay), t)}  ${item.beginTime}~${weekdayFormat(Number(item.beginWeekDay), t)}  ${item.endTime}`
	})

}
</script>
