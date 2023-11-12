<template>
	<div class="layout-padding">
		<splitpanes>
			<pane>
				<el-scrollbar class="layout-padding-auto" height="500">
					<el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef"
						style="max-width: 1024px">
						<el-form-item :label="t('agreement.namechina')" prop="webServerRedirectUri">
							<el-input :placeholder="t('common.please') + t('agreement.namechina')"
								v-model="form.webServerRedirectUri" />
						</el-form-item>
						<el-form-item :label="t('agreement.nameenglish')" prop="webServerRedirectUri">
							<el-input :placeholder="t('common.please') + t('agreement.nameenglish')"
								v-model="form.webServerRedirectUri" />
						</el-form-item>
						<el-form-item :label="t('agreement.contextenglish')" prop="webServerRedirectUri">
							<QuillEditor theme="snow" style="width: 100%; height: 300px;" />
						</el-form-item>
						<el-form-item :label="t('agreement.contextchina')" prop="webServerRedirectUri">
							<QuillEditor theme="snow" style="width: 100%; height: 300px;" />
						</el-form-item>
						<el-form-item>
							<el-button type="primary">保存</el-button>
						</el-form-item>
					</el-form>

				</el-scrollbar>
			</pane>
		</splitpanes>


	</div>
</template>

<script lang="ts" name="agreement" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const form = reactive({
	name: '',
	context: '',
	englishName: '',
	englishContext: ''
})


</script>

<style scoped>
:deep(.ql-editor) {
	color: #fff;
}

:deep(.ql-snow) {
	width: 100%;
}

.layout-padding-view {
	overflow: scroll;
	display: flex;

}
</style>
