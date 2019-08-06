<template>
  <div>
    <div class="container-fluid">
      <molecular-report :resources="exampleReport" />
      <molecular-report :resources="exampleReport" variantType="CNV" />
      <!-- <questionnaire-renderer :questionnaire="questionnaire" :baseUrl="baseUrl" locale="de" mode="StepperQuestionnaire"></questionnaire-renderer> -->
    </div>
  </div>
</template>

<script>
import QuestionnaireRenderer from "@/components/QuestionnaireRenderer";
import PatientList from "@/components/PatientList";
import Patient from "@/components/resources/Patient-de-basis";
import examplePatient from "@/assets/fhir/resources/patient-example.json";
import exampleReport from "@/assets/fhir/resources/genomics-observation-example.json";
import exampleReport2 from "@/assets/fhir/resources/genomics-observation-example-2.json";
import MolecularReport from "@/components/MolecularReport";
import QuestionnaireList from "@/components/QuestionnaireList";
import QuestionnaireResponseList from "@/components/QuestionnaireResponseList";

export default {
  computed: {
    examplePatient() {
      return examplePatient;
    },

    exampleReport() {
      return [exampleReport, exampleReport2];
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
            linkId: "4",
            prefix: "4.",
            text: "Text Required",
            type: "text",
            required: true
          },
          {
            linkId: "2",
            text: "In den folgenden Fragen geht es um Tätigkeiten, die Sie vielleicht im Laufe eines normalen Tages ausüben.",
            type: "group",
            item: [
              {
                linkId: "2.1",
                prefix: "2.1",
                text: "Url",
                type: "url"
              },
              {
                linkId: "2.2",
                prefix: "2.2",
                text: "Url Required",
                type: "url",
                required: true
              }
            ]
          },
          {
            linkId: "3",
            prefix: "3.",
            text: "Text",
            type: "text"
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
            type: "decimal"
          },
          {
            linkId: "8",
            prefix: "8.",
            text: "Decimal Required",
            type: "decimal",
            required: true
          },
          {
            linkId: "9",
            prefix: "9.",
            text: "Integer",
            type: "integer"
          },
          {
            linkId: "10",
            prefix: "10.",
            text: "Integer Required",
            type: "integer",
            required: true
          },
          {
            linkId: "11",
            prefix: "11.",
            text: "Date",
            type: "date"
          },
          {
            linkId: "12",
            prefix: "12.",
            text: "Date Required",
            type: "date",
            required: true
          },
          {
            linkId: "13",
            prefix: "13.",
            text: "Time",
            type: "time"
          },
          {
            linkId: "14",
            prefix: "14.",
            text: "Time Required",
            type: "time",
            required: true
          },
          {
            linkId: "15",
            prefix: "15.",
            text: "DateTime",
            type: "dateTime"
          },
          {
            linkId: "16",
            prefix: "16.",
            text: "DateTime Required",
            type: "dateTime",
            required: true
          },
          {
            linkId: "17",
            prefix: "17.",
            text: "Boolean",
            type: "boolean"
          },
          {
            linkId: "18",
            prefix: "18.",
            text: "Boolean Required",
            type: "boolean",
            required: true
          },
          {
            linkId: "19",
            prefix: "19.",
            text: "Single-Choice",
            type: "choice",
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_answers1"
          },
          {
            linkId: "20",
            prefix: "20.",
            text: "Single-Choice Required",
            type: "choice",
            required: true,
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_answers1"
          },
          {
            linkId: "21",
            prefix: "21.",
            text: "Multiple-Choice?",
            type: "choice",
            repeats: true,
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_answers2"
          },
          {
            linkId: "22",
            prefix: "22.",
            text: "Multiple-Choice Required?",
            type: "choice",
            required: true,
            repeats: true,
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_answers2"
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
