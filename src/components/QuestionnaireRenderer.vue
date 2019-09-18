<template>
  <div>
    <component
      :questionnaireResponse="currentQuestionnaireResponse"
      :is="mode"
      :lastQuestion="lastQuestion"
      :startCount="startCount"
      :questionnaire="currentQuestionnaire"
      :requiredQuestionList="answeredRequiredQuestionsList"
      :baseUrl="baseUrl"
      :valueSets="currentValueSets"
      :editMode="editMode"
      :primary="primary"
      :secondary="secondary"
      :danger="danger"
      :enableReturn="enableReturn"
      :filteredItemList="filteredItemList"
      :language="language"
      :spinner="spinner"
      @summary="backToSummary()"
      @finished="finishQuestionnaire()"
      @return="leaveQuestionnaireRenderer()"
      @answer="handleQuestionnaireResponseEvent($event)"
    ></component>
  </div>
</template>

<script>
import FullQuestionnaire from "./questionnaire/FullQuestionnaire";
import GroupedQuestionnaire from "./questionnaire/GroupsQuestionnaire";
import StepperQuestionnaire from "./questionnaire/StepperQuestionnaire";

import * as fhirApi from "@molit/fhir-api";
import questionnaireResponseController from "./../util/questionnaireResponseController";
import questionnaireController from "./../util/questionnaireController";
import valueSetController from "./../util/valueSetController";
import Spinner from "vue-simple-spinner";
import de from "./../i18n/de";
import en from "./../i18n/en";

export default {
  components: {
    Spinner,
    FullQuestionnaire,
    StepperQuestionnaire,
    GroupedQuestionnaire
  },

  props: {
    /**
     * FHIR-Resource QuestionnaireResponse
     */
    questionnaireResponse: {
      type: Object,
      default: null
    },
    /**
     * FHIR-Resource Questionnaire
     */
    questionnaire: {
      type: Object,
      default: null
    },
    /**
     * FHIR-Resource Patient
     */
    subject: {
      type: Object,
      default: null
    },
    /**
     * FHIR-Base Url
     */
    baseUrl: {
      type: String
      // required: true
    },
    /**
     * List of ValueSets that are needed to display the given questionnaire
     */
    valueSets: {
      type: Array,
      default: null
    },
    /**
     * Current type of Questionnaire-Style to display
     * Available: StepperQuestionnaire, GroupedQuestionnaire, FullQuestionnaire
     */
    mode: {
      type: String,
      default: "StepperQuestionnaire"
    },
    /**
     * The Url to fetch the Questionnaire from
     */
    questionnaireUrl: {
      type: String,
      default: null
    },
    /**
     * ID of the question in the ItemList where in the list of questions the renderer should start
     */
    startQuestion: {
      type: Number,
      default: null
    },
    /**
     * Number on which Page to start
     */
    startCount: {
      type: Number,
      default: null
    },
    /**
     * If true the render will show the button to exit the renderer
     */
    editMode: {
      type: Boolean,
      default: false
    },
    /**
     * Enable the return-button to exit the render-view
     */
    enableReturn: {
      type: Boolean,
      default: true
    },
    /**
     * If true, the Renderer will show the last question
     */
    lastQuestion: {
      type: Boolean,
      default: false
    },
    /**
     * Primary color
     */
    primary: {
      type: String
    },
    /**
     * Secondary color
     */
    secondary: {
      type: String
    },
    /**
     * Color used to symbolise danger
     */
    danger: {
      type: String,
      default: "red"
    },
    /**
     * Current locale
     */
    locale: {
      type: String,
      default: "de"
    }
  },

  data() {
    return {
      answeredRequiredQuestionsList: [],
      currentQuestionnaireResponse: null,
      currentQuestionnaire: null,
      currentValueSets: [],
      currentStartCount: null,
      filteredItemList: [],
      language: null,
      spinner: {
        loading: true,
        message: ""
      }
    };
  },

  computed: {
    /**
     * Checks if there are already Answers in the QuestionnaireResponse
     */
    wasStarted() {
      let returnValue = false;
      if (this.questionnaireResponse) {
        for (let i = 0; i < this.questionnaireResponse.item.length; i++) {
          if (this.questionnaireResponse.item[i]) {
            returnValue = true;
          }
        }
      }
      return returnValue;
    }
  },

  watch: {
    async questionnaireResponse() {
      await this.handleQuestionnaireResponse();
    },
    answeredRequiredQuestionsList() {
      // this.handleAnsweredQuestionsList();
    },
    locale() {
      this.handlei18n();
    },
    currentQuestionnaireResponse() {
      // this.handleAnsweredQuestionsList();
      console.log(this.currentQuestionnaireResponse)
      this.$emit("updated", this.currentQuestionnaireResponse);
    },
    filteredItemList() {
      this.handleAnsweredQuestionsList();
    }
  },

  methods: {
    /**
     * Adds and Removes Questions from the requiredAnswersList
     */
    handleAnsweredQuestionsList() {
      if (this.currentQuestionnaireResponse) {
        let qr = questionnaireResponseController.createItemList(this.currentQuestionnaireResponse);
        let aRQL = this.answeredRequiredQuestionsList;
        for (let i = 0; i < qr.length; i++) {
          let result = this.filteredItemList.find(function(element) {
            return element.linkId === qr[i].linkId;
          });
          if (result) {
            if (qr[i].answer && qr[i].answer.length >= 1) {
              this.addQuestionToRequiredAnsweredQuestionsList(this.filteredItemList[this.filteredItemList.findIndex(item => item.linkId === qr[i].linkId)]);
            } else {
              this.removeQuestionFromRequiredAnsweredQuestionsList(this.filteredItemList[this.filteredItemList.findIndex(item => item.linkId === qr[i].linkId)]);
            }
          } else {
            let questionToRemove = aRQL.find(function(element) {
              return element.linkId === qr[i].linkId;
            });
            if (questionToRemove) {
              this.removeQuestionFromRequiredAnsweredQuestionsList(questionToRemove);
            }
          }
        }
      }
    },

    /**
     * Removes all Answers of Questions that are not triggered in the Questionnaire
     */
    removeUntriggeredAnswers() {
      let qr = questionnaireResponseController.createItemList(this.currentQuestionnaireResponse);
      for (let i = 0; i < qr.length; i++) {
        let result = this.filteredItemList.find(function(element) {
          return element.linkId === qr[i].linkId;
        });
        if (!result) {
          if (qr[i].answer && qr[i].answer.length >= 1) {
            qr[i].answer = [];
          }
        }
      }
    },

    /**
     *
     */
    filterItemList() {
      let newList = [];
      if (this.currentQuestionnaireResponse && this.questionnaire) {
        newList = questionnaireController.handleEnableWhen(this.currentQuestionnaireResponse, this.currentQuestionnaire.item);
      }
      this.filteredItemList = newList;
    },

    /**
     * Changes Language to the given locale
     */
    handlei18n() {
      switch (this.locale) {
        case "en":
          this.language = en;
          break;
        case "de":
          this.language = de;
          break;
        default:
          break;
      }
    },

    /**
     *
     */
    backToSummary() {
      this.$emit("finished", this.currentQuestionnaireResponse);
    },

    /**
     *
     */
    handleQuestionnaireResponseEvent(object) {
      this.currentQuestionnaireResponse = object;
      this.filterItemList();
    },

    /**
     * Creates a new QuestionnaireResponse
     */
    createQuestionnaireResponse() {
      this.currentQuestionnaireResponse = questionnaireResponseController.createQuestionnaireResponse(this.questionnaire, this.subject);
    },

    /**
     * Adds an Answer to a QuestionnaireResponse
     */
    addAnswerToQuestionnaireResponse(linkId, type, answers) {
      if (linkId && type && answers !== null) {
        this.currentQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, linkId, answers, type);
      }
    },

    /**
     * adds a required answered Question to the requiredAnsweredQuestionsList
     */
    addQuestionToRequiredAnsweredQuestionsList(question) {
      if (question) {
        let requiredAnsweredQuestionsList = this.answeredRequiredQuestionsList;
        if (question.required) {
          let addQuestion = true;
          for (let i = 0; i < requiredAnsweredQuestionsList.length; i++) {
            if (JSON.stringify(requiredAnsweredQuestionsList[i]) === JSON.stringify(question)) {
              addQuestion = false;
            }
          }
          if (addQuestion) {
            requiredAnsweredQuestionsList.push(question);
          }
        }
        this.answeredRequiredQuestionsList = requiredAnsweredQuestionsList;
      } else {
        throw new Error("The given Question was ", question);
      }
    },

    /**
     * Removes a Question from the List of answered Questions
     * @param {Object} question Required Question that needs to be removed from the list of answered Questions
     */
    removeQuestionFromRequiredAnsweredQuestionsList(question) {
      if (question) {
        let requiredAnsweredQuestionsList = this.answeredRequiredQuestionsList;
        if (question.required) {
          //check if question is already in the list and remove it
          for (let i = 0; i < requiredAnsweredQuestionsList.length; i++) {
            if (JSON.stringify(requiredAnsweredQuestionsList[i]) === JSON.stringify(question)) {
              requiredAnsweredQuestionsList.splice(i, 1);
            }
          }
        }

        this.answeredRequiredQuestionsList = requiredAnsweredQuestionsList;
      } else {
        throw new Error("The given Question was ", question);
      }
    },

    /**
     *
     */
    resetAnsweredQuestionsList() {
      this.answeredRequiredQuestionsList = [];
    },

    /**
     * load Questionnaire if questionnaire is null and questionnaireUrl is given
     */
    async handleQuestionnaire() {
      if (this.questionnaire) {
        this.currentQuestionnaire = this.questionnaire;
        // Add Group-Ids to Questions in Groups
        for (let i = 0; i < this.currentQuestionnaire.item.length; i++) {
          if (this.currentQuestionnaire.item[i].type === "group") {
            this.addGroupIdToItems(this.currentQuestionnaire.item[i].item, this.currentQuestionnaire.item[i].linkId);
          }
        }
      } else if (this.questionnaireUrl) {
        try {
          this.currentQuestionnaire = await fhirApi.fetchByUrl(this.questionnaireUrl);
          // Add Group-Ids to Questions in Groups
          for (let i = 0; i < this.currentQuestionnaire.item.length; i++) {
            if (this.currentQuestionnaire.item[i].type === "group") {
              this.addGroupIdToItems(this.currentQuestionnaire.item[i].item, this.currentQuestionnaire.item[i].linkId);
            }
          }
        } catch (error) {
          //TODO Errorhandling
        }
      } else {
        //TODO handle missing Questionnaire | Spinner, info ...
      }
    },

    /**
     * Adds GroupId to all Questions inside a Group.
     */
    addGroupIdToItems(item, linkId) {
      for (let i = 0; i < item.length; i++) {
        item[i].groupId = linkId;
        if (item[i].type === "group") {
          this.addGroupIdToItems(item[i].item, item[i].linkId);
        }
      }
    },

    /**
     *  Creates a new QuestionnaireResponse if no QuestionnaireResponse was given via props
     */
    handleQuestionnaireResponse() {
      if (this.questionnaireResponse) {
        this.currentQuestionnaireResponse = this.questionnaireResponse;
      } else {
        this.createQuestionnaireResponse();
      }
    },

    /**
     * Gets a list of all ValueSets needed to display the questionnaire, then compares the list to the list of valuesets
     * given as properties. If the lists are not the same or no valueSets were given, then new ValueSets will be fetched, added and used
     */
    async handleValueSets() {
      let neededReferencesList = [];
      let givenValueSetReferences = [];
      let itemList = questionnaireResponseController.createItemList(this.currentQuestionnaire);
      let valueSets = valueSetController.getQuestionsWithValueSet(itemList);
      neededReferencesList = valueSetController.getReferencesFromValueSets(valueSets);
      givenValueSetReferences = valueSetController.getReferencesFromValueSets(this.valueSets);
      if (this.valueSets) {
        let missingReferences = [];

        for (let i = 0; i < neededReferencesList.length; i++) {
          let push = true;
          for (let a = 0; a < givenValueSetReferences.length; a++) {
            if (neededReferencesList[i] === givenValueSetReferences[a]) {
              push = false;
            }
          }
          if (push) {
            missingReferences.push(neededReferencesList[i]);
          }
        }
        this.currentValueSets.push(this.valueSets);
        if (missingReferences.length !== 0) {
          if (this.baseUrl) {
            this.currentValueSets.concat(await valueSetController.getValueSetsWithReferences(this.baseUrl, missingReferences));
          }
        }
      } else {
        try {
          this.currentValueSets = await valueSetController.getNewValueSets([this.currentQuestionnaire], this.baseUrl);
        } catch (error) {
          // console.log(error);
        }
      }
    },

    /**
     *
     */
    handleStartQuestion() {
      if (this.startCount) {
        this.currentStartCount = this.startCount;
      } else if (this.startQuestion) {
        let itemList = questionnaireResponseController.createItemList(this.currentQuestionnaire);
        this.currentStartCount = itemList.indexOf(this.startQuestion);
      }
    },

    /**
     * Emits an Event wich includes the finished Questionnaire Response
     */
    finishQuestionnaire() {
      this.removeUntriggeredAnswers();
      this.$emit("finished", this.currentQuestionnaireResponse);
    },

    /**
     * Emits an Event to exit the Renderer
     */
    leaveQuestionnaireRenderer() {
      this.$emit("exit", this.currentQuestionnaireResponse);
    }
  },

  async created() {
    this.spinner.loading = true;
    this.handlei18n();
    this.spinner.message = this.language.loading.questionnaire;
    await this.handleQuestionnaire();
    this.spinner.message = this.language.loading.valueset;
    await this.handleValueSets();
    this.spinner.message = this.language.loading.data;
    this.handleAnsweredQuestionsList();
    this.handleStartQuestion();
    await this.handleQuestionnaireResponse();
    this.filterItemList();
    setTimeout(() => {
      this.spinner.loading = false;
    }, 250);
  }
};
</script>
