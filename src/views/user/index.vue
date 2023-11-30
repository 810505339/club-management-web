<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('clientUser.name')" prop="username">
								<el-input v-model="state.queryForm.name" :placeholder="$t('clientUser.inputUsernameTip')" clearable />
							</el-form-item>
							<el-form-item :label="$t('clientUser.phone')" prop="phone">
								<el-input v-model="state.queryForm.phone" :placeholder="$t('clientUser.inputPhoneTip')" clearable />
							</el-form-item>
							<el-form-item :label="$t('clientUser.gender')" prop="gender">
								<el-select v-model="state.queryForm.gender" :placeholder="$t('clientUser.inputPhoneRole')">
									<el-option v-for="item in gender" :key="item.value" :label="item.label" :value="item.value" clearable />
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-table stripe v-loading="state.loading" :data="state.dataList" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">

						<el-table-column :label="$t('clientUser.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('clientUser.name')" prop="name" show-overflow-tooltip></el-table-column>

						<el-table-column :label="$t('clientUser.gender')" prop="gender" show-overflow-tooltip>
							<template #default="scope">
								{{ scope.row.gender == 1 ? '男' : scope.row.gender == 2 ? '女' : '-' }}
							</template>
						</el-table-column>
						<el-table-column :label="$t('clientUser.phone')" prop="phone" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('clientUser.poolOrder')" prop="poolOrder" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('clientUser.orderConsume')" prop="orderConsume"
							show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('clientUser.createTime')" prop="createTime" show-overflow-tooltip
							width="180"></el-table-column>
						<el-table-column :label="$t('common.action')" prop="createTime" show-overflow-tooltip width="180">
							<template #default="scope">
								<el-button text type="primary">
									{{ t('suer.consume') }}
								</el-button>
								<el-button text type="primary">
									{{ t('suer.bottle') }}
								</el-button>
							</template>
						</el-table-column>

					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" :gender="gender" :lock_flag="lock_flag" @refresh="getDataList(false)" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { getUserList } from '/@/api/admin/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));

const { t } = useI18n();
const { lock_flag } = useDict('lock_flag');
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




// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		name: '',
		phone: '',
		gender: '',
		lockFlag: '',
	},
	pageList: getUserList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);



// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};



// // 导出excel
// const exportExcel = () => {
// 	downBlobFile('/admin/user/export', state.queryForm, 'users.xlsx');
// };



</script>
