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
        <label v-if="language" class="" for="string">{{ language.text.text }}:</label>
        <input id="string" type="text" class="form-control" v-model="selected" :rows="2" />
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
 * This Component adds a single String-Question and reacts to the users input
 */

import questionnaireResponseController from "./../../util/questionnaireResponseController";

export default {
  computed: {
    validate() {
      return this.selected || this.selected === [];
    }
  },
  data: function() {
    return {
      selected: null,
      required: false
    };
  },

  props: {
    questionnaireResponse: {
      type: Object
    },
    question: Object,
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

  methods: {
    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    handleKeyPress() {
      let input = document.getElementById("string");
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
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "string");
    }
  },

  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      let newQuestionnaireResponse = null;
      if (this.selected) {
        let newQuestionnaireResponse = null;
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.selected], "string");
        this.$emit("answer", newQuestionnaireResponse);
      } else {
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, null, "string");
        this.$emit("answer", newQuestionnaireResponse);
      }
    },
    question() {
      this.setSelected();
      this.filled = false;
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
