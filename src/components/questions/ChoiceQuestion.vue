<template>
  <div>
    <div class="card" v-if="language">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
      <div v-if="!repeats" :style="{ color: danger }" :class="[{ hidden: validate || !question.required }]">
        {{ language.mandatory_question }}
      </div>
      <div v-if="repeats" :style="{ color: danger }" :class="[{ hidden: !validateCheckBox() }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />

    <div class="form-group" v-if="!repeats">
      <!-- SINGLE CHOICE -->
      <div v-for="answer in optionsList" :key="answer.code">
        <div
          :id="answer.code"
          class="card radio-button-card"
          v-on:click="onBoxClickedSingleChoice(answer.display, answer.code)"
          :style="[
            {
              background: selected && selected.code === answer.code ? '#e8f4fd' : 'white'
            }
          ]"
        >
          <div class="form-check" v-if="!repeats">
            <input class="form-check-input radio-button" type="radio" :name="'Radio' + question.linkId" :id="answer.code" v-model="selected" :value="formatAnswer(answer.display, answer.code)" />

            <label class="form-check-label title" :for="answer.code" v-on:click="onBoxClickedSingleChoice(answer.display, answer.code)">
              {{ answer.display }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- MULTIPLE CHOICE -->
    <div class="form-group" v-if="repeats">
      <div v-for="answer in optionsList" :key="answer.code">
        <div
          :id="answer.code"
          class="card radio-button-card"
          :style="[
            {
              background: checkIfSelected(answer) ? '#e8f4fd' : 'white'
            }
          ]"
        >
          <div class="form-check">
            <input class="form-check-input radio-button" type="checkbox" :name="'Checkbox' + question.linkId" :id="answer.code" v-model="selected" :value="formatAnswer(answer.display, answer.code)" />

            <label class="form-check-label title" :for="answer.code" v-on:click="event => onBoxClickedMultipleChoice(answer.display, answer.code, event)">
              {{ answer.display }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.hidden {
  visibility: hidden;
}

.radio-button-card {
  min-height: 60px;
  flex: 1;
  display: flex;
  justify-content: center;
  // align-items: center;
}
.radio-button {
  margin: 0.34em;
  height: 1.1em;
  width: 1.1em;
}
@mixin basic-card {
  border-radius: 20px;
  border: 0;
  margin: 6px;
  cursor: pointer;
}
.card {
  @include basic-card;
}
.title {
  width: 100%;
  padding-left: 2em;
  font-size: 1.22em;
  font-weight: 600;
}
.card-body-flex {
  display: flex;
  flex-direction: row;
}
.card-choice {
  flex-grow: 1;
}

.title {
  font-size: 1.15em;
  font-weight: 700;
}

.card-selected {
  border-color: rgb(22, 128, 209);
  background-color: #e8f4fd;
}

.margin-left {
  margin-left: 20px;
}

.option-card {
  margin-top: 3px;
}
</style>

<style lang="scss">
.custom-control-label::before {
  top: 0.25em;
  left: -1em;
  height: 1.2em;
  width: 1.2em;
}
.custom-control-label::after {
  top: 0.26em;
  left: -1em;
  height: 1.2em;
  width: 1.2em;
}
</style>

<script>
/**
 * This Component adds a single Multiple-Choice-Question and reacts to the users input
 */
import questionnaireController from "./../../util/questionnaireController";
import questionnaireResponseController from "./../../util/questionnaireResponseController";

export default {
  data: function () {
    return {
      /**
       * Variable to store the value of the input
       */
      selected: null,
      /**
       * Allows events to be emitted if true
       */
      allow_events: false,
      optionsList: null,
      repeats: null
    };
  },

  props: {
    questionnaire: {
      type: Object
    },
    question: {
      type: Object,
      required: true
    },
    answers: Object,
    mode: String,
    baseUrl: {
      type: String
    },
    valueSets: {
      type: Array
    },
    questionnaireResponse: {
      type: Object
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
    /**
     *  Object containing the translations for the current locale
     */
    language: {
      type: Object
    }
  },
  computed: {
    validate() {
      return this.selected || this.selected === [];
    }
  },
  watch: {
    async questionnaireResponse() {
      this.allow_events = false;
      await this.setSelected();
      this.allow_events = true;
    },
    selected() {
      if (this.allow_events) {
        let object = null;
        if (this.repeats) {
          //CHECKBOXES
          object = {
            type: "coding",
            question: this.question,
            value: this.selected
          };
        } else {
          //RADIOBUTTONS
          if (this.selected) {
            object = {
              type: "coding",
              question: this.question,
              value: [this.selected]
            };
          } else {
            object = {
              type: "coding",
              question: this.question,
              value: this.selected
            };
          }
        }
        this.$emit("answer", object);
      }
    },
    async valueSets() {
      try {
        this.optionsList = await this.getChoiceOptions();
      } catch (error) {
        alert(error);
      }
    },
    async question() {
      try {
        this.optionsList = await this.getChoiceOptions();
      } catch (error) {
        alert(error);
      }
      this.setSelected();
      this.repeats = this.question.repeats;
    }
  },

  methods: {
    checkIfSelected(answer) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i].code === answer.code) {
          return true;
        }
      }
      return false;
    },

    /**
     *
     */
    validateCheckBox() {
      return this.selected && this.selected.length === 0 && this.question.required;
    },

    /**
     *
     */
    onBoxClickedSingleChoice(display, code) {
      this.selected = this.formatAnswer(display, code);
    },

    /**
     *
     */
    onBoxClickedMultipleChoice(display, code, event) {
      if (event.srcElement.type && event.srcElement.type === "checkbox") {
        return false;
      } else {
        let currentSelected = this.selected;
        let selectedAnswer = this.formatAnswer(display, code);
        let deletedAnswer = false;
        //if selected Answer is not in the selected-Array, add it, else delete it
        for (let i = 0; i < currentSelected.length; i++) {
          if (currentSelected[i].code === selectedAnswer.code) {
            currentSelected.splice(i, 1);
            deletedAnswer = true;
          }
        }
        if (!deletedAnswer) {
          this.selected.push(selectedAnswer);
        }
      }
    },

    /**
     * Returns a Object with display and code
     */
    formatAnswer(display, code) {
      let data = { display: display, code: code };
      return data;
    },

    /**
     * Returns the options for in the Question for the view to display
     */
    getChoiceOptions() {
      return questionnaireController.getChoiceOptions(this.questionnaire, this.question, this.valueSets, this.baseUrl);
    },

    /**
     * Sets the value of the variable selected.
     */
    setSelected() {
      let data = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "coding");
      if (this.question.repeats) {
        this.selected = data;
      } else {
        this.selected = data[0];
      }
    }
  },
  async created() {
    try {
      this.optionsList = await this.getChoiceOptions();
    } catch (error) {
      alert(error);
    }
    await this.setSelected();
    this.repeats = this.question.repeats;
    // this.removeQuestionFromRequiredAnsweredQuestionsList(this.question);
    this.$emit("removeRequiredAnswer", this.question);
    this.allow_events = true;
  }
};
</script>
