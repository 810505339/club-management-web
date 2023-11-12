<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view ">


					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('goods.name')" prop="name">

							</el-form-item>
							<el-form-item>
								<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8">
							<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
								{{ $t('common.addBtn') }}
							</el-button>



						</div>
					</el-row>

					<el-table stripe v-loading="state.loading" :data="state.dataList" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">

						<el-table-column :label="$t('common.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="name" fixed="left" prop="name">

						</el-table-column>
						<el-table-column :label="areaName" prop="areaVO.name" fixed="left">

						</el-table-column>
						<el-table-column :label="detail" prop="description" fixed="left">

						</el-table-column>

						<el-table-column :label="image" fixed="left">
							<template #default="scope">

								<el-image :preview-src-list="[`${fileCommonUrl}/${item.fileName}`]" preview-teleported
									class="w-20 h-20 my-2 rounded-md" fit="cover" v-for="item in scope.row.pictureFileVOs" :key="item.id"
									:src="`${fileCommonUrl}/${item.fileName}`" />
							</template>
						</el-table-column>



						<el-table-column :label="$t('common.action')" width="160" fixed="right">
							<template #default="scope">


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

		<user-form ref="userDialogRef" @refresh="handlegetTicketList" />

		<upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx" url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="tickets-demo" setup>
import { useI18n } from 'vue-i18n';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useTranslateText } from './hooks/translate';
import userForm from "./form.vue";
import { getStoreName } from '/@/api/admin/store';
import { getTicketAll, updateEnabled, getTicket, deleteTicketByIds } from '/@/api/admin/commodity';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)


const { t } = useI18n();
const { name,
	areaName,
	state: status,
	image,
	detail } = useTranslateText(t)

const queryRef = ref();
// 定义变量内容
const userDialogRef = ref();
const showSearch = ref(true);




// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		state: '',
		name: '',
	},
	pageList: async (pamars) => {

		return await getTicket(pamars)
	},
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

//跟新下拉门店名称
// const handleStoreNameList = async () => {
// 	const { data } = await getStoreName()
// 	storeNameList.value = data


// }
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await deleteTicketByIds(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
}

</script>
