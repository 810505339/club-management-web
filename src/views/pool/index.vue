<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-row>
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('sysuser.username')" prop="username">
								<el-input v-model="state.queryForm.username" :placeholder="$t('sysuser.inputUsernameTip')" clearable />
							</el-form-item>
							<el-form-item :label="$t('sysuser.phone')" prop="phone">
								<el-input v-model="state.queryForm.phone" :placeholder="$t('sysuser.inputPhoneTip')" clearable />
							</el-form-item>
							<el-form-item :label="$t('sysuser.role')" prop="role">
								<el-select v-model="state.queryForm.role" multiple :placeholder="$t('sysuser.inputPhoneRole')">
									<el-option v-for="item in optionsRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId"
										clearable> </el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="$t('sysuser.lockFlag')" prop="lockFlag">
								<el-select v-model="state.queryForm.lockFlag" :placeholder="$t('sysuser.inputLockFlag')">
									<el-option v-for="item in lock_flag" :key="item.id" :label="item.label" :value="item.value" clearable>
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
							<el-button plain v-auth="'sys_user_add'" class="ml10" icon="upload-filled" type="primary"
								@click="excelUploadRef.show()">
								{{ $t('common.importBtn') }}
							</el-button>

							<el-button plain v-auth="'sys_user_del'" :disabled="multiple" class="ml10" icon="Delete" type="primary"
								@click="handleDelete(selectObjs)">
								{{ $t('common.delBtn') }}
							</el-button>

							<right-toolbar v-model:showSearch="showSearch" :export="'sys_user_export'" @exportExcel="exportExcel"
								@queryTable="getDataList" class="ml10 mr20" style="float: right" />
						</div>
					</el-row>
					<el-table v-loading="state.loading" :data="state.dataList" @selection-change="handleSelectionChange" border
						:cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :selectable="handleSelectable" type="selection" width="40" />
						<el-table-column :label="$t('sysuser.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('sysuser.username')" prop="username" fixed="left"
							show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.name')" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.gender')" prop="gender" show-overflow-tooltip>
							<template #default="scope">
								{{ scope.row.gender == 1 ? '男' : scope.row.gender == 2 ? '女' : '-' }}
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.phone')" prop="phone" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.post')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.postList" :key="index">{{ item.postName }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.role')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.roleList" :key="index">{{ item.roleName }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.lockFlag')" show-overflow-tooltip>
							<template #default="scope">
								<el-switch v-model="scope.row.lockFlag" @change="changeSwitch(scope.row)" active-value="0"
									inactive-value="9"></el-switch>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.createTime')" prop="createTime" show-overflow-tooltip
							width="180"></el-table-column>
						<el-table-column :label="$t('common.action')" width="160" fixed="right">
							<template #default="scope">
								<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary"
									@click="userDialogRef.openDialog(scope.row.userId)">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-tooltip :content="$t('sysuser.deleteDisabledTip')" :disabled="scope.row.userId !== '1'"
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
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" :gender="gender" :lock_flag="lock_flag" @refresh="getDataList(false)" />

		<upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx" url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { delObj, pageList, putObj } from '/@/api/admin/user';
import { deptTree } from '/@/api/admin/dept';
import { list } from '/@/api/admin/role';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const { t } = useI18n();

const userDialogRef = ref();

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		deptId: '',
		username: '',
		phone: '',
		role: '',
		lockFlag: '',
	},
	pageList: pageList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);




const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};




// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};


</script>
