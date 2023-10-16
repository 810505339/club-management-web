<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
								{{ $t('common.addBtn') }}
							</el-button>
							<right-toolbar v-model:showSearch="showSearch" :export="'sys_user_export'" @exportExcel="exportExcel"
								@queryTable="getDataList" class="ml10 mr20 " style="float: right" />
						</div>
					</el-row>
					<el-table v-loading="state.loading" :data="state.dataList" @selection-change="handleSelectionChange" border
						:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :label="$t('adv.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('adv.name')" prop="id" width="100" fixed="left" />
						<el-table-column :label="$t('adv.time')" prop="name" width="100" fixed="left" />
						<el-table-column :label="$t('adv.image')" prop="address" fixed="left" />
						<el-table-column :label="$t('adv.state')" prop="enabled" width="100" fixed="left">
							<template #default="scope">
								<div>
									{{ scope.row['enabled'] == 1 ? '上架' : '下架' }}
								</div>
							</template>
						</el-table-column>
						<el-table-column :label="$t('adv.number')" prop="address" fixed="left" />
						<!-- <el-table-column :label="$t('adv.createTime')" prop="createTime" show-overflow-tooltip width="180" /> -->
						<el-table-column :label="$t('common.action')" width="100" fixed="right">
							<template #default="scope">
								<el-button text type="primary" @click="useInfoRef.open(scope.row.id)">
									{{ $t('common.detailBtn') }}
								</el-button>
								<!-- <el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary"
									@click="userDialogRef.openDialog(scope.row.id)">
									{{ $t('common.editBtn') }}
								</el-button> -->
								<el-button text type="primary" @click="handleTakedown(scope.row)" v-if="scope.row['enabled'] == 0">
									{{ $t('adv.shelves') }}
								</el-button>
								<el-button text type="primary" @click="handleTakedown(scope.row)" v-else>
									{{ $t('adv.takedown') }}
								</el-button>
								<!-- <el-tooltip :content="$t('adv.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
									<span style="margin-left: 12px">
										<el-button icon="delete" v-auth="'sys_user_del'" :disabled="scope.row.username === 'admin'" text
											type="primary" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}
										</el-button>
									</span>
								</el-tooltip> -->
							</template>
						</el-table-column>
					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" @refresh="getDataList(false)" />
		<info ref="useInfoRef" />
		<upload-excel ref="excelUploadRef" :title="$t('adv.importUserTip')" temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="banner" setup>
import { getStoreList, updateEnabled, getStoreName, deleteStoreByIds } from '/@/api/admin/store';
import { list } from '/@/api/admin/role';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const info = defineAsyncComponent(() => import('./info.vue'))

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
		name: '',
	},
	pageList: async (pamars) => {
		await handleStoreNameList()
		return await getStoreList(pamars)
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
		await deleteStoreByIds(ids);
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
	const enabled = row.enabled == 1 ? '0' : '1'

	if (row.enabled == 1) {
		await useMessageBox().confirm(t('adv.sureTakedown'))
	}
	//1:下架,0:正常
	await updateEnabled({
		id: row.id,
		enabled: enabled
	})
	useMessage().success(t('common.optSuccessText'));

	getDataList();


}

</script>
