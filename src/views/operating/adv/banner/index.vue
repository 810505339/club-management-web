<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">

							<el-form-item :label="$t('banner.state')" prop="enabled">
								<el-select v-model="state.queryForm.enabled" :placeholder="$t('banner.stateSelect')">
									<el-option v-for="item, index in enabledList" :key="index" :label="item.label" :value="item.value"
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
						<div class="mb8" style="width: 100%">
							<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
								{{ $t('common.addBtn') }}
							</el-button>
							<right-toolbar v-model:showSearch="showSearch" @queryTable="getDataList" class="ml10 mr20 "
								style="float: right" />
						</div>
					</el-row>
					<el-table stripe v-loading="state.loading" :data="state.dataList" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :label="$t('banner.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('banner.banner')" prop="id" width="110">
							<template #default="scope">
								<el-image :preview-src-list="[`${fileCommonUrl}/${item.fileName}`]" preview-teleported
									class="w-20 h-20 my-2 rounded-md" fit="cover" v-for="item in scope.row.pictureFile" :key="item.id"
									:src="`${fileCommonUrl}/${item.fileName}`" />
							</template>
						</el-table-column>
						<el-table-column :label="$t('banner.introduce')" prop="weightiness" width="100" />
						<el-table-column :label="$t('banner.time')" prop="validityTime" width="170" />
						<el-table-column :label="$t('banner.address')" prop="address" />

						<el-table-column :label="$t('banner.state')" prop="enabled" width="100">
							<template #default="scope">
								<el-tag class="ml-2" :type="scope.row['enabled'] == 1 ? 'success' : 'danger'">{{ scope.row['enabled'] == 0
									?
									$t('banner.takedown') : $t('banner.shelves') }} </el-tag>

							</template>
						</el-table-column>

						<el-table-column :label="$t('banner.name')" prop="storeVOS">
							<template #default="scope">
								<span v-for="item in scope.row.storeVOS" :key="item.id">
									{{ item.name }} &nbsp;
								</span>
							</template>
						</el-table-column>
						<el-table-column :label="$t('banner.number')" prop="click_number" />
						<el-table-column :label="$t('common.action')" width="300" fixed="right">
							<template #default="scope">
								<el-button text type="primary" @click="useInfoRef.open(scope.row.id)">
									{{ $t('common.detailBtn') }}
								</el-button>

								<el-button v-auth="'sys_user_edit'" v-if="scope.row['enabled'] == 0" text type="primary"
									@click="userDialogRef.openDialog(scope.row.id)">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-button text type="primary" @click="handleTakedown(scope.row)" v-if="scope.row['enabled'] == 0">
									{{ $t('banner.shelves') }}
								</el-button>
								<el-button text type="primary" @click="handleTakedown(scope.row)" v-else>
									{{ $t('banner.takedown') }}
								</el-button>
								<el-tooltip :content="$t('banner.deleteDisabledTip')" v-if="scope.row['enabled'] == 0"
									:disabled="scope.row.userId !== '0'" placement="top">
									<span style="margin-left: 12px">
										<el-button v-auth="'sys_user_del'" :disabled="scope.row.username === 'admin'" text type="primary"
											@click="handleDelete([scope.row.id])">{{ $t('common.delBtn') }}
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

		<user-form ref="userDialogRef" @refresh="getDataList(false)" />
		<info ref="useInfoRef" />
		<upload-excel ref="excelUploadRef" :title="$t('banner.importUserTip')" temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import" @refreshDataList="getDataList" />
	</div>
</template>

<script lang="ts" name="banner" setup>
import { fetchList, updateEnabled, deleteCarouselByIds } from '/@/api/operating/banner';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo'
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)
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


// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		enabled: '',
	},

	pageList: async (pamars) => {
		return await fetchList(pamars)
	},
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);
// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.enabled = '';
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
		await deleteCarouselByIds(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//点击下架
const handleTakedown = async (row: any) => {

	if (row.enabled == 1) {
		await useMessageBox().confirm(t('banner.sureTakedown'))
	}
	//1:下架,0:正常
	await updateEnabled({
		id: row.id,
	})
	useMessage().success(t('common.optSuccessText'));

	getDataList();


}

</script>
