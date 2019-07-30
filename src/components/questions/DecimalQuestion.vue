<template>
  <div>
    <div class="card">
      <h2>{{ question.text }}</h2>
      <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: selected || !question.required }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />
    <div class="card option-card">
      <div class="form-row">
        <div :id="'decimal' + question.linkId" class="size">
          <label class="" for="url-text">{{ language.decimal.text }}:</label>
          <input step="any" value="selected" type="number" v-model="selected" class="form-control" id="decimal" />
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
  data: function() {
    return {
      selected: null,
      started: false
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
  methods: {
    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    handleKeyPress() {
      let input = document.getElementById("decimal" + this.question.linkId);
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
    checkValidationStatus() {
      let form = document.getElementById("decimal" + this.question.linkId);
      if (form) {
        form.classList.add("was-validated");
      } else if (form && !this.selected) {
        form.classList.remove("was-validated");
      }
    },
    setSelected() {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "decimal");
    }
  },
  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      var form = document.getElementById("decimal" + this.question.linkId);
      let newQuestionnaireResponse = null;
      if (form) {
        form.classList.remove("was-validated");
      }
      if (!isNaN(parseFloat(this.selected))) {
        form.classList.add("was-validated");

        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.selected], "decimal");
        this.$emit("answer", newQuestionnaireResponse);
        this.started = true;
      } else {
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, null, "decimal");
        this.$emit("answer", newQuestionnaireResponse);
      }
    },
    question() {
      this.setSelected();
    }
  },
  updated() {
    this.checkValidationStatus();
  },
  mounted() {
    this.handleKeyPress();
  },

  created() {
    this.setSelected();
  }
};
</script>
