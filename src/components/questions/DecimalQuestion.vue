<template>
  <div>
    <div class="card">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
      <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: selected || !question.required }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />
    <div class="card option-card">
      <div class="form-row">
        <div :id="'decimal' + question.linkId" class="size" :class="[{ 'was-validated': selected !== '' && selected }]">
          <label class="" for="decimalInput">{{ language.decimal.text }}:</label>
          <input ref="decimalInput" step="any" value="selected" type="number" v-model="selected" class="form-control" id="decimal" />
          <div v-if="language" class="invalid-feedback">
            {{ language.decimal.invalid }}
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

@mixin basic-card {
  border-radius: 20px;
  border: 0;
}

.card {
  @include basic-card;
}

.option-card {
  margin-top: 3px;
}
.size {
  width: 100%;
}
</style>

<script>
/**
 * This Component adds a single Decimal-Question and reacts to the users input
 */
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
      started: false,
    };
  },

  props: {
    question: Object,
    mode: String,
    questionnaireResponse: {
      type: Object,
      default: null,
    },
    /**
     * Primary color
     */
    primary: {
      type: String,
    },
    /**
     * Secondary color
     */
    secondary: {
      type: String,
    },
    /**
     * Color used to symbolise danger
     */
    danger: {
      type: String,
    },
    /**
     *  Object containing the translations for the current locale
     */
    language: {
      type: Object,
    },
  },
  methods: {
    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    handleKeyPress() {
      let input = document.getElementById("decimal" + this.question.linkId);
      let object = this;
      input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          object.$emit("next");
        }
      });
    },
    /**
     *
     */
    setSelected() {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "decimal");
    },
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
        if (!isNaN(parseFloat(this.selected))) {
          object = {
            type: "decimal",
            question: this.question,
            value: [this.selected],
          };
        } else {
          object = {
            type: "decimal",
            question: this.question,
            value: [],
          };
        }
        this.$emit("answer", object);
      }
    },
    question() {
      /**Note: This code prevents the input from showing the invalid value as long as the type of the question
       * doesnt change. If a invalid Number is entered, selected is "" - the code will then force the input
       * to have the value "" aswell
       **/
      if (this.selected === "") {
        this.$refs.decimalInput.value = "";
      }
      this.setSelected();
    },
  },
  mounted() {
    this.handleKeyPress();
  },

  async created() {
    await this.setSelected();
    this.allow_events = true;
  },
};
</script>
