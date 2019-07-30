<template>
  <div>
    <div class="container-fluid">
      <molecular-report :resource="exampleReport" />
      <questionnaire-renderer :questionnaire="questionnaire" :baseUrl="baseUrl" locale="de" mode="FullQuestionnaire"></questionnaire-renderer>
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
        identifier: [
          {
            system: "eu.molit.questionic",
            value: "demo-questionnaire"
          }
        ],
        title: "Test Fragebogen",
        status: "active",
        subjectType: ["Patient"],
        date: "2019-04-26T00:00:00+02:00",
        publisher: "MOLIT Institut",
        description: "Dieser Fragebogen wurde zu Testzwecken erstellt und sollte nicht außerhalb der Testumgebung genutzt werden.",
        item: [
          {
            linkId: "1",
            prefix: "1.",
            text: "Hallo dies ist ein Test-Fragebogen und dies hier nur eine Frage vom Typ `Display`",
            type: "display"
          },
          {
            linkId: "17",
            prefix: "17.",
            text: "Boolean",
            type: "boolean"
          },
          {
            linkId: "18.1",
            prefix: "18.",
            text: "Group",
            type: "group",
            enableWhen: [
              {
                question: "17",
                operator: "=",
                answerBoolean: true
              }
            ],
            item: [
              {
                linkId: "18",
                prefix: "18.",
                text: "Boolean Required",
                type: "boolean",
                required: true
              },
              {
                linkId: "3",
                prefix: "3.",
                text: "Text",
                type: "text",
                enableWhen: [
                  {
                    question: "18",
                    operator: "=",
                    answerBoolean: true
                  }
                ]
              },
              {
                linkId: "5",
                prefix: "5.",
                text: "String",
                type: "string"
              },
              {
                linkId: "6",
                prefix: "6.",
                text: "String Required",
                type: "string",
                required: true
              },
              {
                linkId: "7",
                prefix: "7.",
                text: "Decimal",
                type: "decimal",
                enableWhen: [
                  {
                    question: "6",
                    operator: "=",
                    answerString: "huhu"
                  }
                ]
              }
            ]
          },

          {
            linkId: "8",
            prefix: "8.",
            text: "Decimal Required",
            type: "decimal",
            required: true
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
