<template>
  <div v-if="questionnaire">
    <!-- SPINNER -->
    <div v-if="spinner.loading" class="card card-basic-margins">
      <div class="card-body"><spinner size="large" class="mt4" :message="spinner.message"></spinner></div>
    </div>
    <!-- Question-Components -->
    <div v-if="!spinner.loading">
      <transition-group name="list-complete" tag="p">
        <span v-for="question in filteredItemList" :key="question.linkId" class="list-complete-item">
          <div class="card card-basic-margins">
            <div class="card-body" v-if="language">
              <div v-if="question.type !== 'group'">{{ language.question }} {{ getQuestionIndex(question) + 1 }} {{ language.of }} {{ questionsList.length }}</div>
              <div v-if="question.groupId && !question.item" class="question-group-text">
                {{ getGroupText(question) }}
              </div>
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
                @answer="relayAnswer($event)"
              ></component>
            </div>
          </div>
        </span>
      </transition-group>
      <!-- BUTTONS -->
      <div class="card-margin-bottom">
        <div class="summary-button" v-if="language">
          <button type="button" class="btn button btn-outline-primary btn-lg" v-on:click="backToQuestionnaireList()">
            {{ language.back }}
          </button>
          <button type="button" class="btn button btn-primary btn-lg" :disabled="notAllRequiredQuestionsCompleted" v-on:click="goToSummary()">
            {{ language.next }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-group-text {
  font-size: 1.4em;
  font-weight: 600;
  margin: 15px 0px;
  color: #6a6a6a;
}
.list-complete-item {
  transition: all 0.45s;
  display: flex;
}

.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-40px);
}

.list-complete-leave-active {
  opacity: 0;
  transform: translateY(-40px);
  position: absolute;
  width: 100%;
  height: 100%;
}

.card-basic-margins {
  width: 100%;
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
import Spinner from "vue-simple-spinner";
export default {
  name: "questionnaire",
  props: {
    /**
     *
     */
    filteredItemList: {
      type: Array
    },
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
      disabled: true
    };
  },

  computed: {
    /**
     * Returns the total Number of Required Questions
     */
    numberOfRequiredQuestions() {
      let totalNumber = 0;
      if (this.filteredItemList) {
        for (let i = 0; i < this.filteredItemList.length; i++) {
          if (this.filteredItemList[i].required) {
            totalNumber++;
          }
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
      return this.filteredItemList.filter(question => question.type !== "group");
    }
  },

  methods: {
    /**
     *
     */
    getGroupText(currentQuestion) {
      let groupQuestion = this.filteredItemList.find(element => element.linkId === currentQuestion.groupId);
      if (groupQuestion) {
        return groupQuestion.text;
      } else {
        return "";
      }
    },

    /**
     *
     */
    goToSummary() {
      this.$emit("finished");
    },
    /**
     * Relays the Event from the question-components to the top-component
     */
    relayAnswer(object) {
      this.$emit("answer", object);
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
