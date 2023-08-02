<script setup>
import { ref } from 'vue'

import PaginatedList from './components/PaginatedList.vue'
import DtDate from './components/DtDate.vue'

const date = ref(null)
</script>

<template>
  <DtDate v-model="date" :edit="true" :minValue="Date.now()" label="date" />
  <PaginatedList fhirBaseUrl="https://fhir.molit.eu/fhir" resourceName="Task" :pageCount="2" />
</template>

<style scoped></style>
