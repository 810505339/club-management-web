<template>
  <base-view v-model:form="state.form" @submit="submit" />
</template>

<script setup lang="ts">
import baseView from './components/base.vue';
const state = ref({
  form: {
    agreementNameZh: '',
    agreementNameEn: '',
    agreementContentEn: '',
    agreementContentZh: '',
    type: 'TICKET_RESERVE_RULE'
  }
})

function submit(form: any) {
  Object.assign(state.value.form, form)
  //请求接口
}

</script>
