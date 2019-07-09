<template>
  <div v-if="questionnaire">
    <!-- SPINNER -->
    <div v-if="spinner.loading" class="card card-basic-margins">
      <div class="card-body"><spinner size="large" class="mt4" :message="spinner.message"></spinner></div>
    </div>
    <!-- Question-Components -->
    <div v-if="!spinner.loading">
      <div v-for="question in itemList" :key="question.linkId">
        <div class="card card-basic-margins">
          <div class="card-body" v-if="language">
            <div class="" v-if="question.type !== 'group'">{{ language.question }} {{ getQuestionIndex(question) + 1 }} {{ language.of }} {{ questionsList.length }}</div>
            <component
              :is="question.type + 'Question'"
              :question="question"
              :questionnaireResponse="questionnaireResponse"
              :questionnaire="questionnaire"
              :valueSets="valueSets"
              :baseUrl="baseUrl"
              :primary="primary"
              :secondary="secondary"
              :danger="danger"
              :language="language"
              @removeRequiredAnswer="removeRequiredQuestionEvent($event)"
              @addRequiredAnswer="addRequiredQuestionEvent($event)"
              @answer="relayAnswer($event)"
            ></component>
          </div>
        </div>
      </div>
      <!-- BUTTONS -->
      <div class="card-margin-bottom">
        <div class="summary-button" v-if="language">
          <button type="button" class="btn button btn-outline-primary btn-lg" v-on:click="backToQuestionnaireList()">
            {{ language.back }}
          </button>
          <button type="button" class="btn button btn-primary btn-lg" :disabled="notAllRequiredQuestionsCompleted" v-on:click="goToSummary">
            {{ language.next }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-basic-margins {
  margin: 10px 0 10px;
}

.center-vertical {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-index {
  margin-left: 3%;
}

.icon-size {
  font-size: 40px;
  color: white;
}

.card-margin-bottom {
  padding: 10px;
  background: white;
  border-radius: 15px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.summary-button {
  display: flex;
  justify-content: space-around;
  margin-left: 8%;
  margin-right: 8%;
}
</style>

<script>
import DisplayQuestion from "./../../components/questions/DisplayQuestion.vue";
import IntegerQuestion from "./../../components/questions/IntegerQuestion.vue";
import DecimalQuestion from "./../../components/questions/DecimalQuestion.vue";
import DateTimeQuestion from "./../../components/questions/DateTimeQuestion.vue";
import DateQuestion from "./../../components/questions/DateQuestion.vue";
import TimeQuestion from "./../../components/questions/TimeQuestion.vue";
import TextQuestion from "./../../components/questions/TextQuestion.vue";
import UrlQuestion from "./../../components/questions/UrlQuestion.vue";
import ChoiceQuestion from "./../../components/questions/ChoiceQuestion.vue";
import StringQuestion from "./../../components/questions/StringQuestion.vue";
import BooleanQuestion from "./../../components/questions/BooleanQuestion.vue";
import GroupQuestion from "./../../components/questions/GroupQuestion.vue";
import questionnaireResponseController from "./../../util/questionnaireResponseController";
import Spinner from "vue-simple-spinner";
export default {
  name: "questionnaire",
  props: {
    /**
     *
     */
    questionnaire: {
      type: Object,
      required: true
    },
    /**
     *
     */
    questionnaireResponse: {
      type: Object,
      default: null
    },
    /**
     *
     */
    requiredQuestionList: {
      type: Array
    },
    /**
     *
     */
    valueSets: {
      type: Array
    },
    /**
     *
     */
    baseUrl: {
      type: String
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
      type: String
    },
    language: {
      type: Object
    },
    /**
     *
     */
    spinner: {
      type: Object
    }
  },
  data() {
    return {
      itemList: [],
      disabled: true
    };
  },

  computed: {
    /**
     * Returns the total Number of Required Questions
     */
    numberOfRequiredQuestions() {
      let totalNumber = 0;
      for (let i = 0; i < this.itemList.length; i++) {
        if (this.itemList[i].required) {
          totalNumber++;
        }
      }
      return totalNumber;
    },

    /**
     * Checks if not all required Question have been completed
     */
    notAllRequiredQuestionsCompleted() {
      return this.requiredQuestionList.length !== this.numberOfRequiredQuestions;
    },

    /**
     *
     */
    questionsList() {
      return this.itemList.filter(question => question.type !== "group");
    }
  },

  methods: {
    /**
     *
     */
    goToSummary() {
      this.$emit("summary");
    },
    /**
     * Relays the Event from the question-components to the top-component
     */
    relayAnswer(object) {
      this.$emit("answer", object);
    },

    /**
     * Emits new Event to give the required Question to Parent-Component
     * to be removed from the List of answered Questions
     */
    removeRequiredQuestionEvent(question) {
      this.$emit("removeRequiredAnswer", question);
    },

    /**
     * Emits new Event to give the required Question to Parent-Component
     * to be added to the List of answered Questions
     */
    addRequiredQuestionEvent(question) {
      this.$emit("addRequiredAnswer", question);
    },

    /**
     *
     */
    backToQuestionnaireList() {
      this.$emit("return");
    },

    /**
     * returns the position number of the given question
     */
    getQuestionIndex(question) {
      return this.questionsList.indexOf(question);
    }
  },

  watch: {
    questionnaire() {
      this.itemList = questionnaireResponseController.createItemList(this.questionnaire);
    }
  },

  created() {
    this.itemList = questionnaireResponseController.createItemList(this.questionnaire);
  },
  components: {
    Spinner,
    DisplayQuestion,
    IntegerQuestion,
    TimeQuestion,
    DateTimeQuestion,
    DecimalQuestion,
    DateQuestion,
    TextQuestion,
    UrlQuestion,
    ChoiceQuestion,
    StringQuestion,
    BooleanQuestion,
    GroupQuestion
  }
};
</script>
