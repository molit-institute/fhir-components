<template>
  <div>
    <legend>Patient</legend>
    <button type="button" class="btn btn-primary" @click="showPatientSelector">Patient auswählen</button>
    <resource-selector
      v-if="patientSelector"
      resourceName="Patient"
      :fhirBaseUrl="fhirBaseUrl"
      :queryParams="patientQueryParams"
      :searchAttributes="patientSearchAttributes"
      :titleAttribute="patientTitleAttribute"
      :subtitleAttributes="patientSubtitleAttributes"
      @update="patientUpdated"
      @cancel="patientCanceled"
      @error="error"
    ></resource-selector>
  </div>
</template>

<script>
import ResourceSelector from "./ResourceSelector";

export default {
  data() {
    return {
      fhirBaseUrl: "https://fhir.molit.eu/r4",
      patientQueryParams: {
        _sort: "family"
      },
      patientSearchAttributes: [
        {
          name: "Name",
          value: "name"
        }
      ],
      patientTitleAttribute: {
        value: "name",
        type: "HumanName"
      },
      patientSubtitleAttributes: [
        {
          name: "Birth date",
          value: "birthDate",
          type: "date"
        },
        {
          name: "Gender",
          value: "gender",
          type: "gender"
        }
      ],
      patient: null,
      document: {
        resourceType: "bundle",
        type: "document"
      },
      patientSelector: false
    };
  },

  methods: {
    patientUpdated(patient) {
      this.patient = patient;
    },

    patientCanceled() {
      this.patientSelector = false;
    },

    error(e) {
      console.error("error", e);
    },

    showPatientSelector() {
      this.patientSelector = true;
    }
  },

  components: {
    ResourceSelector
  }
};
</script>

<style lang="scss" scoped>
</style>
