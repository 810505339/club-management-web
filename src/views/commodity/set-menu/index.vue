<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('goods.name')" prop="name">
								<el-input v-model="state.queryForm.lockFlag" :placeholder="$t('common.please') + $t('goods.name')" />

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
						<el-table-column :label="$t('common.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('goods.id')" prop="id" width="100" fixed="left" />
						<el-table-column :label="$t('goods.name')" prop="name" fixed="left" />
						<el-table-column :label="$t('goods.image')" fixed="left">
							<template #default="scope">
								<el-image v-for="img in scope.row['pictureFileVOs']" :key="img.id" class="w-40 m-2" fit="cover"
									:src="`${fileCommonUrl}/${img.fileName}`" />
							</template>
						</el-table-column>
						<el-table-column :label="$t('goods.introduce')" prop="introduction" fixed="left" />
						<el-table-column :label="$t('common.action')" fixed="right">
							<template #default="scope">

								<el-button icon="Top" text type="primary" @click="handleTakedown(scope.row)"
									v-if="scope.row['enabled'] == 0">
									{{ $t('shopList.shelves') }}
								</el-button>
								<el-button icon="Bottom" text type="primary" @click="handleTakedown(scope.row)" v-else>
									{{ $t('shopList.takedown') }}
								</el-button>


								<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary"
									@click="userDialogRef.openDialog(scope.row.id)">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-tooltip :content="$t('goods.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
									<span style="margin-left: 12px">
										<el-button icon="delete" v-auth="'sys_user_del'" :disabled="scope.row.username === 'admin'" text
											type="primary" @click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}
										</el-button>
									</span>
								</el-tooltip>
							</template>
						</el-table-column>
					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" :lock_flag="lock_flag" @refresh="getDataList(false)" />

		<upload-excel ref="excelUploadRef" :title="$t('goods.importUserTip')" temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>

import { getdrinksMealList, deletedrinksMealByIds } from '/@/api/admin/commodity';
import { list } from '/@/api/admin/role';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
import { useUserInfo } from '/@/stores/userInfo';
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
const { lock_flag } = useDict('lock_flag');
// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const optionsRoles = ref([]) as any;
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)


// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		state: '',
		name: '',
	},
	pageList: getdrinksMealList,
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




// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await deletedrinksMealByIds(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//点击下架
const handleTakedown = async (row: any) => {


	const enabled = row.enabled == 1 ? '0' : '1'



	if (row.enabled == 1) {
		await useMessageBox().confirm(t('shopList.sureTakedown'))
	}

	useMessage().success(t('common.optSuccessText'));

	getDataList();
}
</script>
