<template>
  <div>
    <div class="card">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
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
      /**
       * Variable to store the value of the input
       */
      selected: null,
      /**
       * Allows events to be emitted if true
       */
      allow_events: false,
      /**
       * Official FHIR-Date Regex
       */
      dateRegex: "^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$"
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
      let regex = new RegExp(this.dateRegex);
      return (this.selected || this.selected === []) && regex.test(this.selected);
    }
  },

  methods: {
    setSelected() {
      this.selected = questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "date");
    }
  },

  watch: {
    async questionnaireResponse() {
      this.allow_events = false;
      await this.setSelected();
      this.allow_events = true;
    },
    selected() {
      let object = null;
      if (this.validate) {
        object = {
          type: "date",
          question: this.question,
          value: [this.selected]
        };
      } else {
        object = {
          type: "date",
          question: this.question,
          value: []
        };
      }
      this.$emit("answer", object);
    },
    question() {
      this.setSelected();
      this.filled = false;
    }
  },

  async created() {
    await this.setSelected();
    this.allow_events = true;
  }
};
</script>
