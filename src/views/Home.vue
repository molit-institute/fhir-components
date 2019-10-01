<template>
  <div>
    <div class="container-fluid">
      <!-- <molecular-report :resources="exampleReport" /> -->
      <!-- <molecular-report :resources="exampleReport" variantType="CNV" /> -->
      <questionnaire-renderer
        @finished="toSummary($event)"
        @updated="updateQR($event)"
        v-if="show_renderer"
        :questionnaireResponse="qr"
        :questionnaire="questionnaire"
        :baseUrl="baseUrl"
        :lastQuestion="lastQuestion"
        locale="de"
        mode="GroupedQuestionnaire"
        :editMode="edit"
        :startQuestion="indexQuestion"
      ></questionnaire-renderer>
      <div class="row" v-if="show_summary">
        <div class="col-sm-6" style="background-color:lightgrey;cursor:pointer;">
          <div v-if="show_summary" v-on:click="backToRenderer()">
            <pre>{{ this.qr }}</pre>
          </div>
        </div>
        <div class="col-sm-6" >
          <div>
            <div v-for="(item, index) in getItemList(this.questionnaire)" :key="item.linkId">
              {{ item.text }}
              <div>
                <pre style="cursor:pointer;" v-on:click="editQuestion(item)">
            {{ getItemList(qr)[index].answer }}
            </pre
                >
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
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
import questionnaireResponseController from "./../util/questionnaireResponseController";

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
      show_renderer: true,
      show_summary: false,
      lastQuestion: false,
      qr: null,
      edit: false,
      indexQuestion: null,
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
            prefix: "1",
            text: "Bitte wählen Sie bei den folgenden Fragen die Zahl zwischen 1 und 7 an die am besten auf Sie zutrifft",
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
                text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Zusammensein oder Ihre gemeinsamen Unternehmungen mit anderen Menschen beeinträchtigt?",
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
    getItemList(object) {
      return questionnaireResponseController.createItemList(object);
    },
    test(resource) {
      console.log(resource);
    },
    updateQR(newqr) {
      this.qr = newqr;
    },
    editQuestion(question) {
      this.show_summary = false;
      this.edit = true;
      this.indexQuestion = question;
      this.show_renderer = true;
    },

    toSummary(newQr) {
      this.qr = newQr;
      this.show_renderer = false;
      this.edit = false;
      this.index = null;
      this.show_summary = true;
      this.indexQuestion = null;
    },
    backToRenderer() {
      this.show_summary = false;
      this.lastQuestion = true;
      this.show_renderer = true;
      this.edit = false;
      this.indexQuestion = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  margin-bottom: 2rem;
}
</style>
