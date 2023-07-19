<script setup>
import { ref } from 'vue'

import PaginatedList from './components/PaginatedList.vue'
import DtDate from './components/DtDate.vue'

const date = ref(null)
</script>

<template>
  <DtDate v-model="date" :edit="true" :minValue="Date.now()" />
  <PaginatedList fhirBaseUrl="https://fhir.molit.eu/fhir" resourceName="Patient" />
</template>

<style scoped></style>
