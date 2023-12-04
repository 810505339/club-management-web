<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">

					<el-row>
						<div style="width: 100%">
							<el-radio-group v-model="state.queryForm.type">
								<el-radio-button label="ANDROID" />
								<el-radio-button label="IOS" />
							</el-radio-group>
						</div>
						<el-button type="primary" class="my-5" @click="userDialogRef.openDialog()">新增版本</el-button>
					</el-row>

					<el-table v-loading="state.loading" :data="state.dataList" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">

						<el-table-column :label="$t('sysuser.index')" type="index" width="60" fixed="left" />
						<el-table-column label="版本号" prop="versionNumber" width="60" fixed="left" />
						<el-table-column label="版本介绍" type="index" width="320" fixed="left" />
						<el-table-column label="是否强制更新" type="index" width="120" fixed="left" />
						<el-table-column label="跟新人" type="index" width="120" fixed="left" />
						<el-table-column label="更新时间" type="index" width="120" fixed="left" />
						<el-table-column :label="$t('common.action')" fixed="right">
							<el-button text type="primary" icon="edit-pen">{{ t('common.editBtn') }}</el-button>
						</el-table-column>
					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle">
					</pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" @refresh="getDataList(false)" />

		<upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx" url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useI18n } from 'vue-i18n'
import { getApplicationPage } from '/@/api/admin/application'

// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));


const { t } = useI18n();


// 定义变量内容
const userDialogRef = ref();
// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		type: 'ANDROID'
	},
	pageList: getApplicationPage,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);


</script>
