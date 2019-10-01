<template>
  <div>
    <h2>{{ question.text }}</h2>
    <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
      {{ language.mandatory_question }}
    </div>

    <hr />
    <div class="class option-card">
      <div class="form-row">
        <div :id="'integer' + question.linkId" class="size">
          <label class="" for="integerInput">{{ language.integer.text }}:</label>
          <input id="integerInput" type="number" step="1" onkeypress="return (event.charCode !== 44 && event.charCode !== 46)" v-model="selected" class="form-control" />
          <div v-if="language" class="invalid-feedback">
            {{ language.integer.invalid }}
          </div>
        </div>
      </div>
      <br />
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
 * This Component adds a single Integer-Question and reacts to the users input
 */
import questionnaireResponseController from "./../../util/questionnaireResponseController";
export default {
  data: function() {
    return {
      selected: null
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
    emitEvent(string) {
      this.$emit(string);
    },
    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    handleKeyPress() {
      let input = document.getElementById("integer" + this.question.linkId);
      let object = this;
      input.addEventListener("keyup", function(event) {
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
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "integer");
    },
    /**
     * Parses a String into a integer
     */
    toInteger(value) {
      return parseInt(value);
    }
  },

  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      var form = document.getElementById("integer" + this.question.linkId);
      let newQuestionnaireResponse = null;
      if (form && this.selected) {
        form.classList.add("was-validated");
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.selected], "integer");
        this.$emit("answer", newQuestionnaireResponse);
      } else {
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, null, "integer");
        this.$emit("answer", newQuestionnaireResponse);
      }
    },
    question() {
      this.setSelected();
    }
  },

  mounted() {
    this.handleKeyPress();
  },

  created() {
    this.setSelected();
  }
};
</script>
