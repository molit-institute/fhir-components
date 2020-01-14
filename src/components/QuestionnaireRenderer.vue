<template>
  <div>
    <component
      :filteredItemList="filteredItemList"
      :questionnaire="currentQuestionnaire"
      :questionnaireResponse="currentQuestionnaireResponse"
      :requiredQuestionList="answeredRequiredQuestionsList"
      :valueSets="currentValueSets"
      :is="mode"
      :lastQuestion="lastQuestion"
      :startCount="currentStartCount"
      :baseUrl="baseUrl"
      :editMode="editMode"
      :primary="primary"
      :secondary="secondary"
      :danger="danger"
      :enableReturn="enableReturn"
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
      type: Object,
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
      filteredItemList: [],
      answeredRequiredQuestionsList: [],
      currentMode: null,
      currentQuestionnaireResponse: null,
      currentQuestionnaire: null,
      currentValueSets: [],
      currentStartCount: null,
      lastAnsweredQuestion: null,
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
    mode() {
      if (this.currentMode && this.mode !== this.currentMode) {
        this.handleStartQuestion(this.lastAnsweredQuestion);
      }
      this.currentMode = this.mode;
    },
    questionnaire() {
      this.handleQuestionnaireResponse();
    },
    async questionnaireResponse() {
      await this.handleQuestionnaireResponse();
    },
    locale() {
      this.handlei18n();
    },
    currentQuestionnaireResponse: {
      deep: true,
      handler: function() {
        this.$emit("updated", this.currentQuestionnaireResponse);
      }
    }
  },
  methods: {
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
     * Takes the given object, adds new answers to the curren QuestionnaireRespons and saves the question as the last answered Question
     */
    async handleQuestionnaireResponseEvent(object) {
      this.lastAnsweredQuestion = object.question;
      this.currentQuestionnaireResponse = await questionnaireResponseController.addAnswersToQuestionnaireResponse(this.currentQuestionnaireResponse, object.question.linkId, object.value, object.type);
      this.handleAnsweredQuestionsList();
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
        this.currentQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.currentQuestionnaireResponse, linkId, answers, type);
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
     * Adds and Removes Questions from the requiredAnswersList
     */
    handleAnsweredQuestionsList() {
      if (this.currentQuestionnaireResponse) {
        let qr = questionnaireResponseController.createItemList(this.currentQuestionnaireResponse);
        let aRQL = this.answeredRequiredQuestionsList;
        for (let i = 0; i < qr.length; i++) {
          let result = this.filteredItemList.find(element => element.linkId === qr[i].linkId);
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
     *  Creates a new QuestionnaireResponse if no QuestionnaireResponse was given via props or the given questionnaire-reference-id
     *  does not match the id of the given questionnaire
     */
    handleQuestionnaireResponse() {
      if (this.questionnaireResponse) {
        let split = this.questionnaireResponse.questionnaire.split("/");
        let id = split[1];
        if (id === this.questionnaire.id) {
          this.currentQuestionnaireResponse = this.questionnaireResponse;
        } else {
          this.createQuestionnaireResponse();
        }
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
          // if (this.currentQuestionnaire && this.baseUrl) {
          this.currentValueSets = await valueSetController.getNewValueSets([this.currentQuestionnaire], this.baseUrl);
          // }
        } catch (error) {
          // console.log(error);
        }
      }
    },

    /**
     *
     */
    handleStartQuestion(question) {
      if (question && this.filteredItemList) {
        if (this.mode === "GroupedQuestionnaire") {
          let questionItem = null;
          for (let i = 0; i < this.filteredItemList.length; i++) {
            if (question.linkId === this.filteredItemList[i].linkId) {
              questionItem = this.filteredItemList[i];
            }
          }
          if (questionItem.groupId) {
            //get groupId
            let groupQuestion = this.getParentGroupQuestion(questionItem.groupId);
            this.handleCurrentStartCount(groupQuestion);
          } else {
            this.handleCurrentStartCount(question);
          }
        } else {
          this.handleCurrentStartCount(question);
        }
      } else {
        console.warn("QuestionnaireRenderer|handleStartQuestion: FilteredItemList or startQuestion was null or undefined");
        //TODO
      }
    },

    /**
     * finds the index of the given question in the filtered ItemList and sets the startCount
     */
    handleCurrentStartCount(question) {
      //use different list if mode is GroupedQuestionnaire
      if (this.mode === "GroupedQuestionnaire") {
        this.currentStartCount = this.questionnaire.item.findIndex(object => object.linkId === question.linkId);
      } else {
        this.currentStartCount = this.filteredItemList.findIndex(object => object.linkId === question.linkId);
      }

      if (this.currentStartCount < 0) {
        this.currentStartCount = 0;
      }
    },

    /**
     * Takes the given groupId and searches for the fitting Group-Question with the matching link-Id. If the Group-Question is in a Group itself, the Method will
     * call itself to find the parent Group-Question.
     *
     * @returns the parent groupQuestion
     */
    getParentGroupQuestion(groupId) {
      let parentQuestion = null;
      for (let i = 0; i < this.filteredItemList.length; i++) {
        if (this.filteredItemList[i].linkId === groupId) {
          if (this.filteredItemList[i].groupId) {
            parentQuestion = this.getParentGroupQuestion(this.filteredItemList[i].groupId);
          } else {
            parentQuestion = this.filteredItemList[i];
          }
        }
      }
      return parentQuestion;
    },

    /**
     *
     */
    async filterItemList() {
      let newList = [];
      if (this.currentQuestionnaireResponse && this.questionnaire) {
        newList = await questionnaireResponseController.createItemList(this.currentQuestionnaire);
      }
      this.filteredItemList = newList;
    },

    /**
     * Emits an Event wich includes the finished Questionnaire Response
     */
    finishQuestionnaire() {
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
    await this.handleQuestionnaireResponse();
    await this.filterItemList();
    this.handleAnsweredQuestionsList();
    this.currentMode = this.mode;
    this.handleStartQuestion(this.startQuestion);
    setTimeout(() => {
      this.spinner.loading = false;
    }, 250);
  }
};
</script>
