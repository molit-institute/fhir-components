<template>
  <div v-if="questionnaire" class="card">
    <!-- SPINNER -->
    <div v-if="spinner.loading" class="center-vertical spinner">
      <spinner size="large" class="mt4" :message="spinner.message"></spinner>
    </div>
    <!-- show every question on a different page (see https://vuetifyjs.com/en/components/steppers) -->
    <!-- if Questiontype is Group -->
    <div v-if="!spinner.loading && getQuestionType === 'groupQuestion'" class="component-container container">
      <component
        :is="getQuestionType"
        :question="getQuestion"
        mode="GROUPS"
        :questionnaireResponse="questionnaireResponse"
        :questionnaire="questionnaire"
        :valueSets="valueSets"
        :baseUrl="baseUrl"
        :primary="primary"
        :secondary="secondary"
        :danger="danger"
        :language="language"
        :filteredItemList="filteredItemList"
        @answer="relayAnswer($event)"
      ></component>
    </div>
    <div v-else class="container">
      <div v-if="!spinner.loading" class="card">
        <div class="column card-body">
          <component
            :is="getQuestionType"
            :question="getQuestion"
            mode="GROUPS"
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
    </div>
    <div v-if="!spinner.loading" class="bottom-container margin-bottom-container">
      <!-- <div>
        <b-progress :max="numberOfQuestions" :value="questionCount"></b-progress>
      </div>-->
      <div class="button-container" v-if="language">
        <!-- Button Back -->
        <button
          type="button"
          class="btn button btn-outline-primary btn-lg"
          v-on:click="countDown"
          v-if="(!this.editMode && this.count !== 0) || (!this.editMode && this.enableReturn && this.count === 0)"
        >
          {{ language.back }}
        </button>
        <button type="button" class="btn button btn-outline-secondary btn-lg" disabled v-if="this.editMode || (this.count === 0 && !this.enablereturn)">
          {{ language.back }}
        </button>
        <!-- Progress Counter -->
        <div class="progress-counter large">
          {{ language.page }} {{ questionCount }} {{ language.of }}
          {{ numberOfQuestions }}
        </div>

        <div class="progress-counter small">{{ questionCount }} {{ language.of }} {{ numberOfQuestions }}</div>
        <!-- Button Next -->
        <span>
          <button id="return-button" type="button" class="button button btn-primary btn-lg" v-on:click="countUp" v-if="count <= filteredList.length - 1 && !disabled && !this.editMode">
            {{ language.next }}
          </button>
          <button id="disabed-return-button" type="button" class="button btn-secondary btn-lg" disabled v-if="disabled">
            {{ language.next }}
          </button>
          <button id="summary-button" type="button" class="button btn-primary btn-lg" v-on:click="goToSummary()" v-if="this.editMode && !disabled">
            {{ language.accept }}
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.spinner {
  padding: 20px;
}

.center-vertical {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin basic-button {
  border-radius: 10px;
  border-width: 2.2px;
  font-size: 1.2em;
  padding-left: 1.2em;
  padding-right: 1.2em;
  min-height: 1.8em;
  font-weight: bold;
  cursor: pointer;
}

.button {
  @include basic-button;
  // @include button-blue;
  align-self: center;
}

.icon-size {
  font-size: 40px;
  color: white;
  // margin-bottom: 10px;
}

.component-container {
  margin-bottom: 100px;
}

.icon-container {
  display: flex;
  justify-content: flex-end;
}
.icon-style {
  font-size: 28px;
  margin-right: 15px;
}
.progress-counter {
  border-radius: 12px;
  box-shadow: 1px 3px 2px 0.2px rgba(0, 0, 0, 0.14);
  border: #1b9cfc solid 2px;
  font-size: 20px;
  padding-left: 1.2em;
  padding-right: 1.2em;
  min-height: 1.8em;
  align-self: center;
}
.large {
  display: initial;
}
.small {
  display: none;
}
.margin-bottom-container {
  margin-bottom: 16px;
}
.bottom-container {
  background-color: white;
  position: relative;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
  height: 70px;
}
.button-container {
  display: flex;
  justify-content: space-between;
  padding: 12px;
}
@media only screen and (max-width: 480px) {
  .large {
    display: none;
  }
  .small {
    display: initial;
  }
  .progress-counter {
    border-radius: 8px;
    font-size: 15px;
    padding-left: 0.8em;
    padding-right: 0.8em;
  }

  .bottom-container {
    position: relative;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;
    height: 80px;
  }
}
</style>

<script>
import displayQuestion from "./../../components/questions/DisplayQuestion.vue";
import integerQuestion from "./../../components/questions/IntegerQuestion.vue";
import decimalQuestion from "./../../components/questions/DecimalQuestion.vue";
import dateTimeQuestion from "./../../components/questions/DateTimeQuestion.vue";
import dateQuestion from "./../../components/questions/DateQuestion.vue";
import timeQuestion from "./../../components/questions/TimeQuestion.vue";
import textQuestion from "./../../components/questions/TextQuestion.vue";
import urlQuestion from "./../../components/questions/UrlQuestion.vue";
import choiceQuestion from "./../../components/questions/ChoiceQuestion.vue";
import stringQuestion from "./../../components/questions/StringQuestion.vue";
import booleanQuestion from "./../../components/questions/BooleanQuestion.vue";
import groupQuestion from "./../../components/questions/GroupQuestion.vue";
import questionnaireResponse from "./../../util/questionnaireResponse";
import Spinner from "vue-simple-spinner";
export default {
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
     *
     */
    editMode: {
      type: Boolean,
      default: false
    },
    /**
     *
     */
    startCount: Number,
    /**
     *
     */
    lastQuestion: false,
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
    /**
     *
     */
    enableReturn: {
      type: Boolean,
      default: true
    },
    /**
     *
     */
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
      scrollToQuestion: true,
      count: 0,
      questionCount: 1,
      disabled: false,
      currentQuestion: Object,
      lastquestion: false,
      enablereturn: true
    };
  },
  computed: {
    /**
     *
     */
    filteredList() {
      let newItemList = [];
      let lastMainGroupId = "";
      if (this.questionnaire && this.questionnaire.item && this.questionnaireResponse) {
        for (let i = 0; i < this.filteredItemList.length; i++) {
          if (this.filteredItemList && this.filteredItemList[i].type === "group" && !this.filteredItemList[i].groupId) {
            lastMainGroupId = this.filteredItemList[i].linkId;
            let group = questionnaireResponse.Item.create();
            group.linkId = this.filteredItemList[i].linkId;
            group.definition = this.filteredItemList[i].definition;
            group.text = this.filteredItemList[i].text;
            group.type = "group";
            newItemList.push(group);
          } else if (!this.filteredItemList[i].groupId) {
            newItemList.push(this.filteredItemList[i]);
          } else if (this.filteredItemList[i].groupId) {
            let result = newItemList.findIndex(item => item.linkId === lastMainGroupId);
            if (result !== -1 && newItemList[result].item) {
              newItemList[result].item.push(this.filteredItemList[i]);
            }
          }
        }
      }
      return newItemList;
    },
    /**
     *
     */
    getQuestionType() {
      return this.getQuestionFromItemList().type + "Question";
    },

    /**
     *
     */
    getQuestion() {
      return this.getQuestionFromItemList();
    },

    /**
     *
     */
    getLastQuestion() {
      return this.lastQuestion;
    },

    /**
     * Returns the total Number of Required Questions
     */
    numberOfRequiredQuestions() {
      let totalNumber = 0;
      for (let i = 0; i < this.filteredList.length; i++) {
        if (this.filteredList[i].required) {
          totalNumber++;
        }
      }
      return totalNumber;
    },

    /**
     * Counts all Questions from ItemList excluding Groups
     */
    numberOfQuestions() {
      return this.filteredList.length;
    },

    /**
     * Checks if not all required Question have been completed
     */
    notAllRequiredQuestionsCompleted() {
      return this.requiredQuestionList.length !== this.numberOfRequiredQuestions(this.filteredList);
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
     *
     */
    scrollToTop() {
      window.scrollTo(0, 0);
    },

    /**
     * Returns the number of all required questions in the given list
     */
    numberOfRequiredQuestionsInItem(question) {
      let flatList = question.item;
      let totalNumber = 0;
      for (let i = 0; i < flatList.length; i++) {
        if (flatList[i].required) {
          totalNumber++;
        }
      }
      return totalNumber;
    },

    /**
     * Returns the positionnumber of the current question without groups
     */
    getQuestionPositionNumber() {
      let positionnumber = 1;
      for (let i = 0; i < this.count; i++) {
        // if (this.itemList[i].type !== "group") {
        positionnumber++;
        // }
      }
      return positionnumber;
    },

    /**
     * Returns a Question from the itemList
     */
    getQuestionFromItemList() {
      return this.filteredList[this.count];
    },

    /**
     * Counts up the Question-Number
     */
    countUp() {
      if (this.count < this.filteredList.length - 1 && !this.disabled && !this.editMode) {
        this.count++;
        this.questionCount = this.getQuestionPositionNumber();
        this.scrollToTop();
      } else if (this.count === this.filteredList.length - 1 && !this.disabled && !this.editMode) {
        this.$emit("finished");
      } else if (this.startCount !== null && this.editMode) {
        this.$emit("finished");
      }
    },

    /**
     * Counts down the Question-Number
     */
    countDown() {
      //If count bigger than 0 and startCount is null
      if (this.count > 0 && !this.editMode) {
        this.count--;
        //update questionPositionNumber
        this.questionCount = this.getQuestionPositionNumber();
        this.scrollToTop();
        //if count = 0 go back to Metadata
      } else if (this.count === 0) {
        this.$emit("return");
      }
    },

    /**
     *
     */
    setDisabled() {
      this.disabled = false;
      let currentQuestion = this.getQuestion;
      let numberOfAnsweredRequiredQuestionsInItem = 0;
      if (currentQuestion) {
        if (currentQuestion.required || (currentQuestion.type === "group" && this.numberOfRequiredQuestionsInItem(currentQuestion) > 0)) {
          this.disabled = true;
        }
        for (let i = 0; i < this.requiredQuestionList.length; i++) {
          if (currentQuestion.type === "group") {
            for (let e = 0; e < currentQuestion.item.length; e++) {
              if (this.requiredQuestionList[i].groupId && this.requiredQuestionList[i].groupId === currentQuestion.item[e].groupId) {
                if (currentQuestion.item[e].required) {
                  this.disabled = true;
                }
                if (this.requiredQuestionList[i] === currentQuestion.item[e]) {
                  this.disabled = false;
                  numberOfAnsweredRequiredQuestionsInItem++;
                }
              }
            }
            //TODO check if all questions are answered, else set disabled to true
            if (numberOfAnsweredRequiredQuestionsInItem !== this.numberOfRequiredQuestionsInItem(currentQuestion)) {
              this.disabled = true;
            } else {
              this.disabled = false;
            }
          } else if (this.requiredQuestionList[i] === currentQuestion) {
            this.disabled = false;
          }
        }
      }
    }
  },
  watch: {
    questionnaire() {
      this.count = 0;
    },
    count() {
      this.setDisabled();
    },
    requiredQuestionList() {
      this.setDisabled();
    },
    questionnaireResponse() {
      this.setDisabled();
    },
    filteredList: {
      deep: true,
      handler: function() {
        this.setDisabled();
      }
    },
    editMode() {
      if (this.editMode) {
        this.enablereturn = false;
      } else {
        this.enablereturn = true;
      }
    }
  },
  updated() {
    if (this.lastquestion && this.filteredList && this.filteredList.length > 0) {
      this.count = this.filteredList.length - 1;
      this.lastquestion = false;
      this.questionCount = this.getQuestionPositionNumber();
    }
    if (this.startCount && this.editMode && this.filteredList && this.filteredList.length > 0) {
      this.count = this.startCount;
      this.questionCount = this.getQuestionPositionNumber();
    }
  },

  created() {
    //sets count if startcount was given from the summarypage through the questionnaire.view
    if (this.startCount && this.filteredList && this.filteredList.length > 0) {
      this.count = this.startCount;
      this.questionCount = this.getQuestionPositionNumber();
    }
    this.lastquestion = this.lastQuestion;
    this.setDisabled();
  },
  components: {
    Spinner,
    displayQuestion,
    integerQuestion,
    timeQuestion,
    dateTimeQuestion,
    decimalQuestion,
    dateQuestion,
    textQuestion,
    urlQuestion,
    choiceQuestion,
    stringQuestion,
    booleanQuestion,
    groupQuestion
  }
};
</script>
