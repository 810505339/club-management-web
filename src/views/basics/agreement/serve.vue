<template>
  <base-view v-model:form="state.form" />
</template>

<script setup lang="ts">
import baseView from './components/base.vue';
const state = ref({
  form: {
    agreementNameZh: '',
    agreementNameEn: '',
    agreementContentEn: '',
    agreementContentZh: '',
    type: 'SERVICE_AGREEMENT'
  }
})



</script>
