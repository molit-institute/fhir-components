<template>
  <div>
    <div class="card">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
      <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />
    <div class="card option-card">
      <div>
        <label v-if="language" class="" for="time">{{ language.time.text }}:</label>
        <input id="time" type="time" class="form-control" v-model="selected" />
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
.option-card {
  margin-top: 3px;
}
</style>

<script>
/**
 * This Component adds a single Time-Question and reacts to the users input
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
    questionnaireResponse: {
      type: Object,
      default: null
    },
    mode: String,
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
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "time");
    }
  },

  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      let newQuestionnaireResponse = null;
      if (this.selected) {
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.selected], "time");
        this.$emit("answer", newQuestionnaireResponse);
      } else {
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, null, "time");
        this.$emit("answer", newQuestionnaireResponse);
      }
    },
    question() {
      this.setSelected();
    }
  },

  created() {
    this.setSelected();
  }
};
</script>
