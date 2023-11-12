<template>
  <div class="layout-padding">
    <splitpanes>
      <pane>
        <div class="layout-padding-auto layout-padding-view">
          <el-form :model="form" formDialogRef label-width="120px" ref="dataFormRef" style="max-width: 1024px">
            <el-form-item :label="t('agreement.namechina')" prop="webServerRedirectUri">
              <el-input :placeholder="t('common.please') + t('agreement.namechina')" v-model="form.agreementNameZh" />
            </el-form-item>
            <el-form-item :label="t('agreement.nameenglish')" prop="webServerRedirectUri">
              <el-input :placeholder="t('common.please') + t('agreement.nameenglish')" v-model="form.agreementNameEn" />
            </el-form-item>
            <el-form-item :label="t('agreement.contextchina')" prop="webServerRedirectUri">
              <QuillEditor theme="snow" style="width: 100%; height: 300px;" v-model:content="form.agreementContentEn"
                contentType="html" />
            </el-form-item>
            <el-form-item :label="t('agreement.contextenglish')" prop="webServerRedirectUri">
              <QuillEditor theme="snow" style="width: 100%; height: 300px;" v-model:content="form.agreementContentZh"
                contentType="html" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleClick">保存</el-button>
            </el-form-item>
          </el-form>

        </div>
      </pane>
    </splitpanes>


  </div>
</template>

<script lang="ts" name="agreement" setup>
import { useI18n } from 'vue-i18n'
import { getList, putAgreement } from '/@/api/admin/agreement'
import { useMessage } from '/@/hooks/message'

const { t } = useI18n()

const props = defineProps<{
  form: {

    agreementNameZh: string,
    agreementNameEn: string,
    agreementContentEn: string,
    agreementContentZh: string,
    type: string
  }
}>()

const form = ref(props.form)


const emits = defineEmits(['submit', 'update:form'])

async function handleClick() {

  const { data } = await putAgreement(form.value)
  if (data) {
    useMessage().success(t('common.optSuccessText'))
  }

}

async function getApi() {
  const { data } = await getList(form.value)
  form.value = data[0]

}

onMounted(async () => {
  await getApi()

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
