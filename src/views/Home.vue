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
        mode="StepperQuestionnaire"
        :editMode="edit"
        :startQuestion="indexQuestion"
      ></questionnaire-renderer>
      <div class="row" v-if="show_summary">
        <div class="col-sm-6" style="background-color:lightgrey;cursor:pointer;">
          <div v-if="show_summary" v-on:click="backToRenderer()">
            <pre>{{ this.qr }}</pre>
          </div>
        </div>
        <div class="col-sm-6">
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
            prefix: "1. ",
            text: "Wie würden Sie Ihren Gesundheitszustand im Allgemeinen beschreiben?",
            type: "choice",
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers1",
            required: true
          },
          {
            linkId: "2",
            prefix: "2. ",
            text: "Sind sie bei mittelschweren Tätigkeiten, z.B. einen Tisch verschieben, staubsaugen, kegeln eingeschränkt",
            type: "choice",
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers2",
            required: true
          },
          {
            linkId: "3",
            prefix: "3. ",
            text: "Sind sie dabei eingeschränkt mehrere Treppenabsätze zu steigen",
            type: "choice",
            answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers2",
            required: true
          },
          // {
          //   linkId: "4",
          //   prefix: "4. ",
          //   text: "Haben Sie in den vergangenen 4 Wochen aufgrund Ihrer körperlichen Gesundheit ihre Ziele erreichen können?",
          //   type: "choice",
          //   answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers3",
          //   required: true
          // },

          // {
          //   linkId: "5",
          //   prefix: "5. ",
          //   text: "Konnten Sie in den vergangenen 4 Wochen aufgrund Ihrer seelischen Gesundheit ihre Ziele erreichen?",
          //   type: "choice",
          //   answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers3",
          //   required: true
          // },
          // {
          //   linkId: "6",
          //   prefix: "6. ",
          //   text: "Inwieweit haben Schmerzen in den vergangenen 4 Wochen Ihre Alltagstätigkeiten (im Beruf und zu Hause) beeinträchtigt?",
          //   type: "choice",
          //   answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers4",
          //   required: true
          // },
          // {
          //   linkId: "7",
          //   prefix: "7. ",
          //   text: "Wie oft fühlten Sie sich in den vergangenen 4 Wochen entmutigt und traurig?",
          //   type: "choice",
          //   answerValueSet: "http://molit.eu/fhir/ValueSet/DEMO_GL_answers5",
          //   required: true
          // }
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
      this.lastQuestion = false;
      this.show_renderer = true;
    },

    toSummary(newQr) {
      this.qr = newQr;
      this.show_renderer = false;
      this.edit = false;
      this.index = null;
      this.show_summary = true;
      this.indexQuestion = null;
      this.lastQuestion = false;
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
