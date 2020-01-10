<template>
  <div>
    <div class="card">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
      <div id="url-mandatory" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
        <span v-if="language">{{ language.mandatory_question }}</span>
      </div>
    </div>

    <hr />

    <div class="card option-card">
      <div class="form-row" v-if="question">
        <div :id="'url' + question.linkId" class="size" :class="[{ 'was-validated': selected !== '' && selected }]">
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
      selected: ""
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
    }
  },

  watch: {
    questionnaireResponse() {
      this.setSelected();
    },
    selected() {
      let object = null;
      if (this.selected) {
        // if (!this.validateUrl()) {
        //   this.$emit("removeRequiredAnswer", this.question);
        // } else {
        //   this.$emit("addRequiredAnswer", this.question);
        // }
        object = {
          type: "url",
          question: this.question,
          value: [this.selected]
        };
      } else {
        object = {
          type: "url",
          question: this.question,
          value: []
        };
      }
      this.$emit("answer", object);
    },
    question() {
      this.setSelected();
    }
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
