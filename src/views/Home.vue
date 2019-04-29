<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <span class="navbar-brand mb-0 h1">@molit/fhir-components</span>
    </nav>
    <div class="container">
      <h2>Demo</h2>
      <h3>Settings</h3>
      <patient-list :fhirBaseUrl="'https://fhir.molit.eu/r4'" :viewBehavior="'event'" @view="test" />
      <questionnaire-list :fhirBaseUrl="'https://fhir.molit.eu/r4'" />
      <questionnaire-response-list :fhirBaseUrl="'https://fhir.molit.eu/r4'" />
      <patient :resource="examplePatient" />
    </div>
  </div>
</template>

<script>
import PatientList from "@/components/PatientList";
import Patient from "@/components/resources/Patient-de-basis";
import examplePatient from "@/assets/fhir/resources/patient-example.json";
import QuestionnaireList from "@/components/QuestionnaireList";
import QuestionnaireResponseList from "@/components/QuestionnaireResponseList";

export default {
  computed: {
    examplePatient() {
      return examplePatient;
    }
  },

  components: {
    PatientList,
    Patient,
    QuestionnaireList,
    QuestionnaireResponseList
  },

  methods: {
    test(resource) {
      console.log(resource);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  margin-bottom: 2rem;
}
</style>
