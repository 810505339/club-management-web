<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>


				<div class="layout-padding-auto layout-padding-view">
					<el-tabs v-model="state.queryForm.localType" @tab-click="handleClick">
						<el-tab-pane :label="t('adv.adv1')" name="1"> </el-tab-pane>
						<el-tab-pane :label="t('adv.adv2')" name="0"> </el-tab-pane>
					</el-tabs>
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary"
								@click="userDialogRef.openDialog(state.queryForm.localType)">
								{{ $t('common.addBtn') }}
							</el-button>
							<right-toolbar v-model:showSearch="showSearch" @queryTable="getDataList" class="ml10 mr20 "
								style="float: right" />
						</div>
					</el-row>
					<el-table stripe v-loading="state.loading" :data="state.dataList" border :cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle">
						<el-table-column :label="$t('adv.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('adv.name')" prop="name" width="100" />
						<el-table-column :label="$t('adv.time')" prop="validityTime" width="170" />
						<el-table-column :label="$t('adv.image')" prop="address">
							<template #default="scope">
								<el-image :preview-src-list="[`${fileCommonUrl}/${item.fileName}`]" preview-teleported
									class="w-20 h-20 my-2 rounded-md" fit="cover" v-for="item in scope.row.pictureFile" :key="item.id"
									:src="`${fileCommonUrl}/${item.fileName}`" />
							</template></el-table-column>
						<el-table-column :label="$t('adv.state')" prop="enabled" width="100">
							<template #default="scope">
								<el-tag class="ml-2" :type="scope.row['enabled'] == 1 ? 'success' : 'danger'">{{ scope.row['enabled'] == 0
									?
									$t('adv.takedown') : $t('adv.shelves') }} </el-tag>

							</template>
						</el-table-column>
						<el-table-column :label="$t('adv.number')" prop="click_number" />
						<el-table-column :label="$t('common.action')" width="100" fixed="right">
							<template #default="scope">
								<el-button text type="primary" @click="useInfoRef.open(scope.row.id)">
									{{ $t('common.detailBtn') }}
								</el-button>
								<el-button text type="primary" @click="handleTakedown(scope.row)" v-if="scope.row['enabled'] == 0">
									{{ $t('adv.shelves') }}
								</el-button>
								<el-button text type="primary" @click="handleTakedown(scope.row)" v-else>
									{{ $t('adv.takedown') }}
								</el-button>
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
import type { TabsPaneContext } from 'element-plus'
import { fetchList, updateEnabled } from '/@/api/operating/adv';
import { list } from '/@/api/admin/role';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo'
const store = useUserInfo()
const fileCommonUrl = computed(() => store.userInfos.fileCommonUrl)
// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const info = defineAsyncComponent(() => import('./info.vue'))

const { t } = useI18n();
// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const useInfoRef = ref();
const showSearch = ref(true);
const optionsRoles = ref([]) as any;


// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		enabled: '',
		name: '',
		localType: '1'
	},
	pageList: async (pamars) => {
		// await handleStoreNameList()
		return await fetchList(pamars)
	},
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

list().then((res) => {
	optionsRoles.value = res.data;
});

const handleClick = (tab: TabsPaneContext) => {
	state.queryForm.localType = tab.props.name
	getDataList();
}

//点击下架
const handleTakedown = async (row: any) => {
	if (row.enabled == 1) {
		await useMessageBox().confirm(t('adv.sureTakedown'))
	}
	//1:下架,0:正常
	await updateEnabled({
		id: row.id,
	})
	useMessage().success(t('common.optSuccessText'));
	getDataList();

}

</script>
