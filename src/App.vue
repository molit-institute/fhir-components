<script setup>
import PaginatedList from "./components/PaginatedList.vue";
</script>

<template>
  <PaginatedList fhirBaseUrl="https://fhir.molit.eu/fhir" resourceName="Patient" />
</template>

<style scoped></style>
