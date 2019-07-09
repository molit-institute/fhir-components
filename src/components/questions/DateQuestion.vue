<template>
  <div>
    <div class="card">
      <h2>{{ question.text }}</h2>
      <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />
    <div class="option-card">
      <label v-if="language" class="" for="date">{{ language.date.text }}:</label>
      <input id="date" type="date" class="form-control" v-model="selected" />
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

.option-card {
  margin-top: 3px;
}
</style>

<script>
/**
 * This Component adds a single Date-Question and reacts to the users input
 */
import questionnaireResponseController from "./../../util/questionnaireResponseController";
export default {
  data() {
    return {
      selected: null,
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
    setSelected() {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "date");
    }
  },

  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      if (this.selected) {
        let newQuestionnaireResponse = null;
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.selected], "date");
        this.$emit("answer", newQuestionnaireResponse);
        this.filled = true;
      } else {
        this.filled = false;
      }
    },
    question() {
      this.setSelected();
      this.filled = false;
    },
    /**
     * Reacting to any changes to filled, in order to emit an event for the parent component.
     */
    filled() {
      try {
        if (this.question.required && this.filled) {
          this.$emit("addRequiredAnswer", this.question);
        } else if (this.question.required && !this.filled) {
          this.$emit("removeRequiredAnswer", this.question);
        }
      } catch (error) {
        alert(error);
      }
    }
  },

  created() {
    this.setSelected();
  }
};
</script>
