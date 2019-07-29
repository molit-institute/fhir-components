<template>
  <div>
    <div class="card">
      <h2>{{ question.text }}</h2>
      <div id="url-mandatory" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
        <span v-if="language">{{ language.mandatory_question }}</span>
      </div>
    </div>

    <hr />

    <div class="card option-card">
      <div class="form-row" v-if="question">
        <div :id="'url' + question.linkId" class="size">
          <label class="" for="url-text">{{ language.url.text }}:</label>
          <input value="selected" type="text" v-model="selected" class="form-control" id="url-text" pattern="\S*" />
          <div v-if="language" class="invalid-feedback">
            {{ language.url.invalid }}
          </div>
          <div v-if="language" class="valid-feedback">
            {{ language.url.valid }}
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

@mixin basic-card {
  border-radius: 20px;
  border: 0;
}

.card {
  @include basic-card;
}

.align-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.size {
  width: 100%;
}

.option-card {
  margin-top: 3px;
}
</style>

<script>
/**
 * This Component adds a single Url-Question and reacts to the users input
 */
import questionnaireResponseController from "./../../util/questionnaireResponseController";

export default {
  data: function() {
    return {
      selected: "",
      filled: false
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
    validateUrl() {
      if (this.selected) {
        let regex = new RegExp("^\\S*$");
        return this.selected.match(regex) ? true : false;
      }
    },
    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    handleKeyPress() {
      let input = document.getElementById("url" + this.question.linkId);
      let object = this;
      if (input) {
        input.addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            object.$emit("next");
          }
        });
      }
    },
    /**
     *
     */
    setSelected() {
      this.selected = "";
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "url");
    },
    /**
     *
     */
    checkValidationStatus() {
      let form = document.getElementById("url" + this.question.linkId);
      if (form && this.validateUrl()) {
        form.classList.add("was-validated");
      } else if (form && !this.selected) {
        form.classList.remove("was-validated");
      }
    }
  },

  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      let form = document.getElementById("url" + this.question.linkId);
      if (form) {
        form.classList.remove("was-validated");
      }
      this.filled = true;
      if (this.selected) {
        if (!this.validateUrl()) {
          this.$emit("removeRequiredAnswer", this.question);
        } else {
          this.$emit("addRequiredAnswer", this.question);
        }
        let newQuestionnaireResponse = null;
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.selected], "url");
        if (form) {
          form.classList.add("was-validated");
        }
        this.$emit("answer", newQuestionnaireResponse);
      } else {
        let newQuestionnaireResponse = null;
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, null, "url");
        this.$emit("answer", newQuestionnaireResponse);
        this.filled = false;
      }
    },
    question() {
      this.setSelected();
      if (this.selected) {
        this.filled = true;
      } else {
        this.filled = false;
      }
    },
    /**
     * Reacting to any changes to filled, in order to emit an event for the parent component.
     */
    filled() {
      try {
        if (this.question.required && this.filled && this.validateUrl()) {
          this.$emit("addRequiredAnswer", this.question);
        } else if (this.question.required && !this.filled) {
          this.$emit("removeRequiredAnswer", this.question);
        }
      } catch (error) {
        alert(error);
      }
    }
  },

  updated() {
    this.checkValidationStatus();
  },

  mounted() {
    this.handleKeyPress();
  },

  created() {
    this.$emit("removeRequiredAnswer", this.question);
    this.setSelected();
  }
};
</script>
