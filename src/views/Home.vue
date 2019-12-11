<template>
  <div>
    <div class="container-fluid">
      <!-- <molecular-report :resources="exampleReport" /> -->
      <!-- <molecular-report :resources="exampleReport" variantType="CNV" /> -->
      <div v-if="show_renderer" style="display: flex;"></div>

      <span class="flex"
        ><div class="item" v-on:click="setQuestionnaireMode('StepperQuestionnaire')" :class="[{ 'item-selected': questionnaireMode === 'StepperQuestionnaire' }]">Stepper</div>
        <div class="item" v-on:click="setQuestionnaireMode('GroupedQuestionnaire')" :class="[{ 'item-selected': questionnaireMode === 'GroupedQuestionnaire' }]">Grouped</div>
        <div class="item" v-on:click="setQuestionnaireMode('FullQuestionnaire')" :class="[{ 'item-selected': questionnaireMode === 'FullQuestionnaire' }]">Full</div></span
      >

      <div v-if="show_questionnaire_list">
        <div v-for="questionnaire in questionnaires" :key="questionnaire.id" v-on:click="openSelectedQuestionnaire(questionnaire)">
          <div>{{ questionnaire.title }}</div>
        </div>
      </div>
      <questionnaire-renderer
        @finished="toSummary($event)"
        @updated="updateQR($event)"
        @exit="toQuestionnaireList()"
        v-if="show_renderer"
        :questionnaireResponse="questionnaireResponse"
        :questionnaire="questionnaire"
        :baseUrl="baseUrl"
        :lastQuestion="lastQuestion"
        locale="de"
        :mode="questionnaireMode"
        :editMode="edit"
        :startQuestion="indexQuestion"
      ></questionnaire-renderer>
      <div class="row" v-if="show_summary">
        <div class="col-sm-4" style="background-color:lightgrey;cursor:pointer;">
          <div v-if="show_summary" v-on:click="backToRenderer()">
            <pre>{{ this.questionnaireResponse }}</pre>
          </div>
        </div>
        <div class="col-sm-4" style="background-color:lightgrey;cursor:pointer;">
          <div v-if="show_summary" v-on:click="backToRenderer()">
            <pre>{{ this.questionnaire }}</pre>
          </div>
        </div>
        <div class="col-sm-4">
          <div>
            <div v-for="(item, index) in getItemList(this.questionnaire)" :key="item.linkId">
              {{ item.text }}
              <div>
                <pre v-if="getItemList(questionnaireResponse)[index] && getItemList(questionnaire)[index].type !== 'group'" style="cursor:pointer;" v-on:click="editQuestion(item)">
            {{ getItemList(questionnaireResponse)[index].answer }}
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
<style lang="scss" scoped>
@mixin item-base {
  font-size: 1rem;
  width: 40px;
  min-width: 55px;
  height: 40px;
  display: flex;
  margin: 2px 0 0 8px;
  padding: 5px 0 0 0;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.item {
  @include item-base;
  color: #ced4da;
}
.item-selected {
  @include item-base;
  color: #495057;
  border-bottom: 3px solid #495057;
}
.navbar {
  margin-bottom: 2rem;
}
.flex {
  display: flex;
}
</style>
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
      questionnaireMode: "StepperQuestionnaire",
      questionnaireResponse: null,
      show_questionnaire_list: true,
      show_renderer: false,
      show_summary: false,
      lastQuestion: false,
      edit: false,
      indexQuestion: null,
      baseUrl: "https://fhir.molit.eu/r4/",
      questionnaire: null,
      questionnaires: [
        {
          resourceType: "Questionnaire",
          id: "1",
          meta: {
            versionId: "1",
            lastUpdated: "2017-08-23T12:15:33.776+02:00"
          },
          identifier: [
            {
              system: "eu.molit.questionic",
              value: "epidemiologischerFragebogenSLK"
            }
          ],
          title: "Fragebogen Lang",
          publisher: "SLK-Kliniken Heilbronn",
          status: "active",
          description: " ",
          date: "2017-08-23T00:00:00+02:00",
          subjectType: ["Patient"],
          item: [
            {
              linkId: "1",
              prefix: "1",
              text: "Geben sie bitte ihre Lieblingszahl ein",
              type: "integer"
            },
            {
              linkId: "2",
              prefix: "1.1",
              text: "Persönliche Angaben",
              type: "group",
              item: [
                {
                  linkId: "2.1",
                  prefix: "2.1",
                  text: "Name",
                  type: "string"
                },
                {
                  linkId: "2.2",
                  prefix: "2.2",
                  text: "Alter",
                  type: "integer"
                },
                {
                  linkId: "2.3",
                  prefix: "2.3",
                  text: "Haare",
                  type: "group",
                  item: [
                    {
                      linkId: "2.3.1",
                      prefix: "2.3.1",
                      text: "Haben sie Haare auf dem Kopf",
                      type: "boolean"
                    },
                    {
                      linkId: "2.3.2",
                      prefix: "2.3.2",
                      text: "Wieviele Haare?",
                      type: "integer"
                    }
                  ]
                }
              ]
            },
            {
              linkId: "3",
              prefix: "2",
              text: "Persönliche Angaben",
              type: "decimal"
            },
            {
              linkId: "4",
              prefix: "2.1",
              text: "Persönliche Angaben",
              type: "decimal"
            }
          ]
        },
        {
          resourceType: "Questionnaire",
          id: "2",
          meta: {
            versionId: "1",
            lastUpdated: "2017-08-23T12:15:33.776+02:00"
          },
          identifier: [
            {
              system: "eu.molit.questionic",
              value: "epidemiologischerFragebogenSLK"
            }
          ],
          title: "Epidemiologischer Fragebogen",
          publisher: "SLK-Kliniken Heilbronn",
          status: "active",
          description: " ",
          date: "2017-08-23T00:00:00+02:00",
          subjectType: ["Patient"],
          item: [
            {
              linkId: "1",
              prefix: "1",
              required: true,
              text: "String",
              type: "string"
            },
            {
              linkId: "2",
              prefix: "1.1",
              text: "Persönliche Angaben",
              type: "group",
              item: [
                {
                  linkId: "11",
                  prefix: "1. ",
                  text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen? (z.B. eine schwere Einkaufsstasche oder einen Koffer zu tragen)",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "12",
                  prefix: "2. ",
                  text: "Bereitet es Ihnen Schwierigkeiten, einen längeren Spaziergang zu machen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "13",
                  prefix: "3. ",
                  text: "Bereitet es Ihnen Schwierigkeiten , eine kurze Strecke außer Haus zu gehen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "14",
                  prefix: "4. ",
                  text: "Müssen Sie tagsüber im Bett liegen oder in einem Sessel sitzen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "15",
                  prefix: "5. ",
                  text: "Brauchen Sie Hilfe beim Essen, Anziehen, Waschen oder Benutzen der Toilette?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                }
              ]
            },
            {
              linkId: "3",
              prefix: "2",
              required: true,
              text: "Integer",
              type: "integer"
            },
            {
              linkId: "4",
              prefix: "2.1",
              required: true,
              text: "Decimal",
              type: "decimal"
            }
          ]
        }
      ]
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
    setQuestionnaireMode(selectedMode) {
      this.questionnaireMode = selectedMode;
    },
    setQuestionnaireResponse(response) {
      this.questionnaireResponse = response;
    },
    openSelectedQuestionnaire(questionnaire) {
      this.questionnaire = questionnaire;
      this.show_renderer = true;
      this.show_questionnaire_list = false;
      this.show_summary = false;
    },
    getItemList(object) {
      return questionnaireResponseController.createItemList(object);
    },
    updateQR(newqr) {
      this.questionnaireResponse = newqr;
    },
    editQuestion(question) {
      this.show_summary = false;
      this.edit = true;
      this.indexQuestion = question;
      this.lastQuestion = false;
      this.show_renderer = true;
    },
    toQuestionnaireList() {
      this.show_renderer = false;
      this.show_summary = false;
      this.show_questionnaire_list = true;
      this.lastQuestion = false;
    },
    toSummary(newQr) {
      this.questionnaireResponse = newQr;
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
