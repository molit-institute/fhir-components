<template>
  <div class="container">
    <resource-selector :fhirBaseUrl="baseUrl" :resourceName="'Patient'" :titleAttribute="titleAttribute" :subtitleAttributes="subtitleAttributes" :searchAttributes="searchAttributes" />
  </div>
</template>

<script>
import ResourceSelector from "@/components/ResourceSelector";

export default {
  data() {
    return {
      baseUrl: "https://fhir.molit.eu/r4/",
      searchAttributes: [
        {
          name: "Name",
          value: "name"
        }
      ],
      titleAttribute: {
        value: "name",
        type: "HumanName"
      },
      subtitleAttributes: [
        {
          name: "Geburtsdatum",
          value: "birthDate",
          type: "Date"
        }
      ]
    };
  },

  components: {
    ResourceSelector
  }
};
</script>
