<template>
  <div>
    <div v-if="mode !== 'GROUPS'" :style="{ color: this.primary }">
      <!-- <library-books class="icon" /> -->
      <svg class="material-design-icon__svg" style="width:80px;height:80px" viewBox="0 0 24 24">
        <path fill="#000000" d="M19,7H9V5H19M15,15H9V13H15M19,11H9V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z"></path>
      </svg>
      <div v-if="language" class="group-subtitle">{{ language.questionGroup }} {{ question.prefix }}</div>
      <div class="group-title">{{ question.prefix }} {{ question.text }}</div>
    </div>
    <div v-if="mode === 'GROUPS'">
      <div class="card">
        <div class="card-body">
          <svg class="material-design-icon__svg" style="width:80px;height:80px" viewBox="0 0 24 24">
            <path fill="#000000" d="M19,7H9V5H19M15,15H9V13H15M19,11H9V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z"></path>
          </svg>

          <div v-if="language" class="group-subtitle">{{ language.questionGroup }} {{ question.prefix }}</div>
          <div class="group-title">{{ question.prefix }} {{ question.text }}</div>
        </div>
      </div>
      <transition-group name="list-complete" tag="p">
        <!-- GROUP-ITEMS -->
        <div class="card-margin-top" v-for="groupquestion in question.item" :key="groupquestion.linkId">
          <div v-if="groupquestion.type == 'group'" class="card">
            <div class="card-body">
              <svg class="material-design-icon__svg" style="width:80px;height:80px" viewBox="0 0 24 24">
                <path fill="#000000" d="M19,7H9V5H19M15,15H9V13H15M19,11H9V9H19M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6Z"></path>
              </svg>
              <div v-if="language" class="group-subtitle">{{ language.questionGroup }} {{ groupquestion.prefix }}</div>
              <div class="group-title">{{ groupquestion.prefix }} {{ groupquestion.text }}</div>
            </div>
          </div>

          <div v-if="groupquestion.type !== 'group'" class="card">
            <div class="card-body">
              <div v-if="groupquestion.groupId && !groupquestion.item" class="question-group-text">
                {{ getGroupText(groupquestion) }}
              </div>
              <component
                :id="groupquestion.linkId"
                :is="getQuestionType(groupquestion)"
                :question="groupquestion"
                mode="ITEMS"
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
          <!-- <div v-if="groupquestion.type === 'group'">
            {{ mode }}
            <div class="card-body">
              <component
                :filteredItemList="filteredItemList"
                :id="groupquestion.linkId"
                :is="getQuestionType(groupquestion)"
                :question="groupquestion"
                mode="ITEMS"
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
          </div> -->
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-group-text {
  font-size: 1.2em;
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
.card-margin-top {
  margin-top: 16px;
}
.icon {
  font-size: 80px;
  margin-bottom: 20px;
}
.group-subtitle {
  font-size: 1.2em;
  font-weight: bold;
}
.group-title {
  font-size: 1.5em;
  font-weight: bold;
}
</style>

<script>
import IntegerQuestion from "./IntegerQuestion.vue";
import DisplayQuestion from "./DisplayQuestion.vue";
import DateQuestion from "./DateQuestion.vue";
import DateTimeQuestion from "./DateTimeQuestion.vue";
import DecimalQuestion from "./DecimalQuestion.vue";
import StringQuestion from "./StringQuestion.vue";
import TextQuestion from "./TextQuestion.vue";
import TimeQuestion from "./TimeQuestion.vue";
import UrlQuestion from "./UrlQuestion.vue";
import ChoiceQuestion from "./ChoiceQuestion.vue";
import BooleanQuestion from "./BooleanQuestion.vue";

/**
 * This Component adds a Group-Question
 */
export default {
  name: "groupQuestion",
  props: {
    filteredItemList: {
      type: Array
    },
    questionnaire: {
      type: Object,
      required: true
    },
    questionnaireResponse: {
      type: Object,
      default: null
    },
    requiredQuestionList: {
      type: Array
    },
    valueSets: {
      type: Array
    },
    baseUrl: {
      type: String
    },
    editMode: {
      type: Boolean,
      default: false
    },
    startCount: Number,
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
    enableReturn: {
      type: Boolean,
      default: true
    },
    /**
     *  Object containing the translations for the current locale
     */
    language: {
      type: Object
    },
    question: Object,
    mode: String
  },
  components: {
    DisplayQuestion,
    IntegerQuestion,
    DateQuestion,
    DateTimeQuestion,
    DecimalQuestion,
    StringQuestion,
    TextQuestion,
    TimeQuestion,
    UrlQuestion,
    ChoiceQuestion,
    BooleanQuestion
  },
  computed: {},
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
    getQuestionType(question) {
      return question.type + "Question";
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
    }
  }
};
</script>
