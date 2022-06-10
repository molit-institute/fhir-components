<template>
  <div>
    <div class="container mt-4">
      <button @click="toogleResourceSelector" class="btn btn-primary">Select</button>
      <resource-selector
        :fhirBaseUrl="baseUrl"
        :resourceName="'Patient'"
        :titleAttribute="titleAttribute"
        :subtitleAttributes="subtitleAttributes"
        :searchAttributes="searchAttributes"
        v-if="showResourceSelector"
        @cancel="toogleResourceSelector"
      />
    </div>
  </div>
</template>

<script>
import ResourceSelector from "@/components/ResourceSelector";

export default {
  data() {
    return {
      baseUrl: "https://fhir.molit.eu/fhir/",
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
      ],
      showResourceSelector: false
    };
  },

  methods: {
    toogleResourceSelector() {
      this.showResourceSelector = !this.showResourceSelector;
    }
  },

  components: {
    ResourceSelector
  }
};
</script>

<style lang="scss" scoped></style>
