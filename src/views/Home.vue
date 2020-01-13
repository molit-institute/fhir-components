<template>
  <div>
    <div class="container-fluid">
      <!-- <molecular-report :resources="exampleReport" /> -->
      <!-- <molecular-report :resources="exampleReport" variantType="CNV" /> -->
      <!-- QUESTIONNAIRE RENDERER -->
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
                  type: "string",
                  required: true
                },
                {
                  linkId: "2.2",
                  prefix: "2.2",
                  text: "Alter",
                  type: "integer",
                  required: true
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
                      type: "boolean",
                      required: true
                    },
                    {
                      linkId: "2.3.2",
                      prefix: "2.3.2",
                      text: "Wieviele Haare?",
                      type: "integer",
                      required: true
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
            lastUpdated: "2019-11-14T14:26:46.542+01:00",
            source: "#87B0ajnAaAUIXmfV"
          },
          url: "http://www.eortc.org/fhir/questionaire/QLQ-C30",
          identifier: [
            {
              system: "eu.molit.questionic",
              value: "eortc_qlq-30-long"
            }
          ],
          title: "QLQ-C30",
          status: "active",
          subjectType: ["Patient"],
          date: "2017-08-23T00:00:00+02:00",
          publisher: "EORTC",
          description: "Der QLQ-C30 ist ein Fragebogen welcher entwickelt wurde um die Lebensqualität von Krebs-Patienten zu bewerten.",
          item: [
            {
              linkId: "1",
              prefix: "1. ",
              text: "Bereitet es Ihnen Schwierigkeiten sich körperlich anzustrengen? (z.B. eine schwere Einkaufsstasche oder einen Koffer zu tragen)",
              type: "choice",
              required: true,
              answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
            },
            {
              linkId: "2",
              prefix: "2. ",
              text: "Bereitet es Ihnen Schwierigkeiten, einen längeren Spaziergang zu machen?",
              type: "choice",
              required: true,
              answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
            },
            {
              linkId: "3",
              prefix: "3. ",
              text: "Bereitet es Ihnen Schwierigkeiten , eine kurze Strecke außer Haus zu gehen?",
              type: "choice",
              required: true,
              answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
            },
            {
              linkId: "4",
              prefix: "4. ",
              text: "Müssen Sie tagsüber im Bett liegen oder in einem Sessel sitzen?",
              type: "choice",
              required: true,
              answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
            },
            {
              linkId: "5",
              prefix: "5. ",
              text: "Brauchen Sie Hilfe beim Essen, Anziehen, Waschen oder Benutzen der Toilette?",
              type: "choice",
              required: true,
              answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
            },
            {
              linkId: "6",
              text: "Während der letzten Woche:",
              type: "group",
              item: [
                {
                  linkId: "6.1",
                  prefix: "6. ",
                  text: "Waren Sie bei Ihrer Arbeit oder bei anderen tagtäglichen Beschäftigungen eingeschränkt?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.2",
                  prefix: "7. ",
                  text: "Waren Sie bei Ihren Hobbys oder anderen Freizeitbeschäftigungen eingeschränkt?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.3",
                  prefix: "8. ",
                  text: "Waren Sie kurzatmig?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.4",
                  prefix: "9. ",
                  text: "Hatten Sie Schmerzen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.5",
                  prefix: "10. ",
                  text: "Mussten Sie sich ausruhen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.6",
                  prefix: "11. ",
                  text: "Hatten Sie Schlafstörungen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.7",
                  prefix: "12. ",
                  text: "Fühlten Sie sich schwach?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.8",
                  prefix: "13. ",
                  text: "Hatten Sie Appetitmangel?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.9",
                  prefix: "14. ",
                  text: "War Ihnen übel?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.10",
                  prefix: "15. ",
                  text: "Haben Sie erbrochen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.11",
                  prefix: "16. ",
                  text: "Hatten Sie Verstopfung?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.12",
                  prefix: "17. ",
                  text: "Hatten Sie Durchfall?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.13",
                  prefix: "18. ",
                  text: "Waren Sie müde?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.14",
                  prefix: "19. ",
                  text: "Fühlten Sie sich durch Schmerzen in Ihrem alltäglichen Leben beeinträchtigt?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.15",
                  prefix: "20. ",
                  text: "Hatten Sie Schwierigkeiten sich auf etwas zu konzentrieren, z.B auf das Zeitungslesen oder das Fernsehen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.16",
                  prefix: "21. ",
                  text: "Fühlten Sie sich angespannt?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.17",
                  prefix: "22. ",
                  text: "Haben Sie sich Sorgen gemacht?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.18",
                  prefix: "23. ",
                  text: "Waren Sie reizbar?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.19",
                  prefix: "24. ",
                  text: "Fühlten Sie sich niedergeschlagen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.20",
                  prefix: "25. ",
                  text: "Hatten Sie Schwierigkeiten, sich an Dinge zu erinnern?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.21",
                  prefix: "26. ",
                  text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Familienleben beeinträchtigt?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.22",
                  prefix: "27. ",
                  text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung Ihr Zusammensein oder Ihre gemeinsamen Unternehmungen mit anderen Menschen beeinträchtigt?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                },
                {
                  linkId: "6.23",
                  prefix: "28. ",
                  text: "Hat Ihr körperlicher Zustand oder Ihre medizinische Behandlung für Sie finanzielle Schwierigkeiten mit sich gebracht?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers4"
                }
              ]
            },
            {
              linkId: "7",
              text: "Bitte wählen Sie bei den folgenden Fragen die Zahl zwischen 1 und 7 an die am besten auf Sie zutrifft",
              type: "group",
              item: [
                {
                  linkId: "7.1",
                  prefix: "29. ",
                  text: "Wie würden Sie insgesamt Ihren Gesundheitszustand  während der letzten Woche einschätzen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers7"
                },
                {
                  linkId: "7.2",
                  prefix: "30. ",
                  text: "Was würden Sie insgesamt Ihre Lebensqualität während der letzten Woche einschatzen?",
                  type: "choice",
                  required: true,
                  answerValueSet: "http://molit.eu/fhir/ValueSet/SLK_QLQC30_answers7"
                }
              ]
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
