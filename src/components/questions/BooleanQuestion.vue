<template>
  <div>
    <div class="">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
      <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />

    <div>
      <div class="form-group" :id="'radio-boolean-' + question.linkId" v-if="question">
        <!-- <b-form-radio-group v-model="selected"> -->
        <div class="card radio-button-card" :class="[{ 'card-selected': selected && 'yes' === selected }]">
          <div class="form-check">
            <input :id="'radioYes' + question.linkId" class="form-check-input radio-button" type="radio" :name="'Radio' + question.linkId" v-model="selected" value="yes" />

            <label v-if="language" class="form-check-label title" :for="'radioYes' + question.linkId" v-on:click="onCardClick('yes')">
              {{ language.yes }}
            </label>
          </div>
        </div>
        <div class="card radio-button-card" :class="[{ 'card-selected': selected && 'no' === selected }]">
          <div class="form-check">
            <input :id="'radioNo' + question.linkId" class="form-check-input radio-button" type="radio" :name="'Radio' + question.linkId" v-model="selected" value="no" />
            <label v-if="language" class="form-check-label title" :for="'radioNo' + question.linkId" v-on:click="onCardClick('no')">
              {{ language.no }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <br />
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
  margin: 0.35em;
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
.margin-left {
  margin-left: 20px;
}
.option-card {
  margin-top: 6px;
}
.card-selected {
  border-color: rgb(22, 128, 209);
  background-color: #e8f4fd;
}
</style>

<script>
/**
 * This Component adds a Boolean-Question and reacts to the users input
 */
import questionnaireResponseController from "./../../util/questionnaireResponseController";
export default {
  data: function() {
    return {
      /**
       * Variable to store the value of the input
       */
      selected: null,
      /**
       * Allows events to be emitted if true
       */
      allow_events: false
    };
  },

  props: {
    question: Object,
    mode: String,
    questionnaireResponse: {
      type: Object,
      default: null
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
  methods: {
    /**
     *
     */
    onCardClick(selectedValue) {
      this.selected = selectedValue;
    },
    setSelected() {
      let value = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "boolean");
      if (value === true) {
        this.selected = "yes";
      } else if (value === false) {
        this.selected = "no";
      } else {
        this.selected = null;
      }
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
        if (this.selected !== null) {
          let object = {
            type: "boolean",
            question: this.question,
            value: [this.selected]
          };
          this.$emit("answer", object);
        }
      }
    },
    question() {
      this.setSelected();
    }
  },

  async created() {
    await this.setSelected();
    this.allow_events = true;
  }
};
</script>

<i18n>
{
  "de": {
    "mandatory-question":"Dies ist eine Pflichtfrage",
    "question":"Frage",
    "yes":"Ja",
    "no":"Nein",
    "chooseBoolean": "Bitte wählen sie ihre Antwort aus."
  },
  "en": {
    "mandatory-question":"This is a mandatory question",
    "question":"Question",
    "yes":"Yes",
    "no":"No",
    "chooseBoolean": "Please select your answer."
  }
}
</i18n>
