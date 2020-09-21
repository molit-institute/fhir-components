<template>
  <div>
    <h2>{{ question.prefix }} {{ question.text }}</h2>
    <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
      {{ language.mandatory_question }}
    </div>

    <hr />
    <div class="class option-card">
      <div class="form-row">
        <div :id="'integer' + question.linkId" class="size" :class="[{ 'was-validated': selected !== '' && selected }]">
          <label class="" for="integerInput">{{ language.integer.text }}:</label>
          <input
            ref="integerInput"
            type="number"
            step="1"
            onkeypress="return (event.charCode !== 44 && event.charCode !== 46)"
            inputMode="numeric"
            pattern="[0-9]*"
            v-model="selected"
            class="form-control"
          />
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
    async questionnaireResponse() {
      this.allow_events = false;
      await this.setSelected();
      this.allow_events = true;
    },
    selected() {
      if (this.allow_events) {
        let object = null;
        if (this.selected) {
          object = {
            type: "integer",
            question: this.question,
            value: [this.selected]
          };
        } else {
          object = {
            type: "integer",
            question: this.question,
            value: []
          };
        }
        this.$emit("answer", object);
      }
    },
    question() {
      if (this.selected === "") {
        this.$refs.integerInput.value = "";
      }
      this.setSelected();
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
