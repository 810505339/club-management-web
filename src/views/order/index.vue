<!--
 * @Author: yxx
 * @Date: 2023-09-24 18:00:38
 * @LastEditTime: 2023-12-27 21:01:52
 * @LastEditors: yxx
 * @Description: 
 * @FilePath: \club-management-web\src\views\order\index.vue
--> 
<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
					<el-form-item :label="$t('journal.shop')" prop="storeId">
						<el-select v-model="state.queryForm.storeId" :placeholder="$t('common.select') + $t('journal.shop')">
							<el-option v-for="item, index in storeList" :key="index" :label="item.name" :value="item.id" clearable>
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="$t('order.pay')" prop="status">
						<el-select v-model="state.queryForm.status" :placeholder="$t('common.select') + $t('order.pay')">
							<el-option v-for="item in optionsRoles" :key="item.value" :label="item.label" :value="item.value" clearable>
							</el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item :label="$t('order.state')" prop="lockFlag">
						<el-select v-model="state.queryForm.lockFlag" :placeholder="$t('common.select') + $t('order.state')">
							<el-option v-for="item in lock_flag" :key="item.id" :label="item.label" :value="item.value" clearable>
							</el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item :label="$t('order.type')" prop="orderType">
						<el-select v-model="state.queryForm.orderType" :placeholder="$t('common.select') + $t('order.type')">
							<el-option v-for="item in orderTypes" :key="item.value" :label="item.label" :value="item.value" clearable>
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
					<!-- <el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain v-auth="'sys_user_add'" class="ml10" icon="upload-filled" type="primary"
						@click="excelUploadRef.show()">
						{{ $t('common.importBtn') }}
					</el-button>

					<el-button plain v-auth="'sys_user_del'" :disabled="multiple" class="ml10" icon="Delete" type="primary"
						@click="handleDelete(selectObjs)">
						{{ $t('common.delBtn') }}
					</el-button> -->

					<right-toolbar v-model:showSearch="showSearch" @queryTable="getDataList" class="ml10 mr20"
						style="float: right" />
				</div>
			</el-row>
			<el-table stripe v-loading="state.loading" :data="state.dataList" border :cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle">
				<!-- <el-table-column :selectable="handleSelectable" type="selection" width="40" /> -->
				<!-- <el-table-column :label="$t('sysuser.index')" type="index" width="60" fixed="left" /> -->
				<el-table-column :label="$t('journal.shop')" prop="username" fixed="left" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('order.time')" prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('journal.order')" prop="gender" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.gender == 1 ? '男' : scope.row.gender == 2 ? '女' : '-' }}
					</template>
				</el-table-column>
				<el-table-column :label="$t('order.amount')" prop="phone" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('order.method')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-for="(item, index) in scope.row.postList" :key="index">{{ item.postName }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('order.info')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-for="(item, index) in scope.row.roleList" :key="index">{{ item.roleName }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('journal.userName')" show-overflow-tooltip>
					<template #default="scope">
						<el-switch v-model="scope.row.lockFlag" @change="changeSwitch(scope.row)" active-value="0"
							inactive-value="9"></el-switch>
					</template>
				</el-table-column>
				<el-table-column :label="$t('journal.userPhone')" prop="createTime" show-overflow-tooltip
					width="180"></el-table-column>
				<el-table-column :label="$t('order.pay')" prop="createTime" show-overflow-tooltip width="180"></el-table-column>
				<el-table-column :label="$t('order.state')" prop="createTime" show-overflow-tooltip width="180"></el-table-column>
				<el-table-column :label="$t('common.action')" width="160" fixed="right">
					<template #default="scope">
						<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary"
							@click="userDialogRef.openDialog(scope.row.userId)">
							{{ $t('common.detailBtn') }}
						</el-button>
						<el-tooltip :content="$t('sysuser.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
							<span style="margin-left: 12px">
								<el-button icon="delete" v-auth="'sys_user_del'" :disabled="scope.row.username === 'admin'" text
									type="primary" @click="handleDelete([scope.row.userId])">{{ $t('common.dispose') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
			</pagination>
		</div>

		<!-- <user-form ref="userDialogRef" :gender="gender" :lock_flag="lock_flag" @refresh="getDataList(false)" /> -->

		<upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx" url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { fetchList } from '/@/api/order/index';
import { deptTree } from '/@/api/admin/dept';
import { list } from '/@/api/admin/role';
import { getStoreName } from '/@/api/admin/store';

import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));

const { t } = useI18n();
// const { lock_flag } = useDict('lock_flag');
const gender = ref([
	{
		value: 1,
		label: '男',
	},
	{
		value: 2,
		label: '女',
	},
]);
// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const optionsRoles = ref([{
	label: '待支付',
	value: 'NOT_PAY'
}, {
	label: '已支付',
	value: 'PAY_SUCCESS'
}, {
	label: '支付失败',
	value: 'PAY_FAIL'
}, {
	label: '已取消',
	value: 'PAY_CANCEL'
}]);
const orderTypes = ref([{
	label: '门票',
	value: 'TICKET'
}, {
	label: '卡座',
	value: 'BOOTH'
}, {
	label: '拼酒局',
	value: 'WINE_PARTY'
}])
// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);
const storeList = ref([])
getStoreName().then(res => {
	storeList.value = res.data
})
// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		status: '',
		orderType: '',
	},
	pageList: fetchList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 部门树使用的数据
const deptData = reactive({
	queryList: (name: String) => {
		return deptTree({
			deptName: name,
		});
	},
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};

// 点击树
const handleNodeClick = (e: any) => {
	state.queryForm.deptId = e.id;
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/user/export', state.queryForm, 'users.xlsx');
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.username !== 'admin';
};

// 多选事件
const handleSelectionChange = (objs: { userId: string }[]) => {
	selectObjs.value = objs.map(({ userId }) => userId);
	multiple.value = !objs.length;
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

//表格内开关 (用户状态)
const changeSwitch = async (row: object) => {
	row.role = row.roleList.map((d) => d.roleId);
	row.post = row.postList.map((d) => d.postId);
	await putObj(row);
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};
</script>
