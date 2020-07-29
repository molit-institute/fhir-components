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
      /**
       * Variable to store the value of the input
       */
      selected: null,
      /**
       * Allows events to be emitted if true
       */
      allow_events: false,
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
    async questionnaireResponse() {
      this.allow_events = false;
      await this.setSelected();
      this.allow_events = true;
    },
    selected() {
      if (this.allow_events) {
        let object = null;
        if (this.selected === " ") {
          this.selected = null;
        }
        if (this.selected) {
          object = {
            type: "string",
            question: this.question,
            value: [this.selected]
          };
        } else {
          object = {
            type: "string",
            question: this.question,
            value: []
          };
        }
        this.$emit("answer", object);
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

  async created() {
    await this.setSelected();
    this.allow_events = true;
  }
};
</script>
