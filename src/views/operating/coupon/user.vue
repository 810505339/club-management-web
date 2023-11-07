<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="$t('common.queryBtn')" draggable>
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
					<el-table stripe v-loading="state.loading" :data="state.dataList" border
						@selection-change="handleSelectionChange" :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">
						<el-table-column align="center" type="selection" width="40" />
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

					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<template #footer>
			<span class="dialog-footer">
				<el-button formDialogRef @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button formDialogRef type="primary" @click="onSubmit" :disabled="multiple">{{ $t('common.confirmButtonText')
				}}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemUser" setup>
import { getUserList } from '/@/api/admin/user';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
// 动态引入组件 
const visible = ref(false)
const { t } = useI18n();
const emit = defineEmits(['refresh']);
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
/** 选中的行 */
const selectedRows = ref([]);
/** 是否可以多选 */
const multiple = ref(true);
// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);


/** 行选中事件 */
const handleSelectionChange = (rows: any) => {
	selectedRows.value = rows;
	multiple.value = !rows.length;
};

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

const openDialog = (data) => {
	visible.value = true;
	console.log(data)
	getDataList();
	selectedRows.value = data
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};

const onSubmit = () => {
	emit('refresh', selectedRows.value)
	visible.value = false;
}

// 暴露变量
defineExpose({
	openDialog,
});


</script>
