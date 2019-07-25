<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <span class="navbar-brand mb-0 h1">@molit/fhir-components</span>
    </nav>
    <div class="container-fluid">
      <molecular-report :resource="exampleReport" />
      <questionnaire-renderer :questionnaire="questionnaire" :baseUrl="baseUrl" locale="de" mode="StepperQuestionnaire"></questionnaire-renderer>
    </div>
  </div>
</template>

<script>
import QuestionnaireRenderer from "@/components/QuestionnaireRenderer";
import PatientList from "@/components/PatientList";
import Patient from "@/components/resources/Patient-de-basis";
import examplePatient from "@/assets/fhir/resources/patient-example.json";
import exampleReport from "@/assets/fhir/resources/genomics-observation-example.json";
import MolecularReport from "@/components/MolecularReport";
import QuestionnaireList from "@/components/QuestionnaireList";
import QuestionnaireResponseList from "@/components/QuestionnaireResponseList";

export default {
  computed: {
    examplePatient() {
      return examplePatient;
    },

    exampleReport() {
      return exampleReport;
    }
  },
  data() {
    return {
      baseUrl: "https://fhir.molit.eu/r4/",
      questionnaire: {
        resourceType: "Questionnaire",
        id: "7854",
        meta: {
          versionId: "1",
          lastUpdated: "2019-07-25T12:13:10.582+00:00"
        },
        title: "Hallo Welt",
        status: "draft",
        item: [
          {
            linkId: "Frage1",
            text: "Hallo, wie geht's?",
            type: "choice",
            answerOption: [
              {
                valueString: "gut."
              },
              {
                valueString: "geht."
              },
              {
                valueString: "muss."
              }
            ]
          },
          {
            linkId: "Frage2",
            text: "Was los?",
            type: "choice",
            enableWhen: [
              {
                question: "Frage1",
                operator: "=",
                answerString: "muss."
              }
            ],
            answerOption: [
              {
                valueString: "nix."
              },
              {
                valueString: "frag nicht."
              }
            ]
          }
        ]
      }
    };
  },

  components: {
    QuestionnaireRenderer,
    PatientList,
    Patient,
    MolecularReport,
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
