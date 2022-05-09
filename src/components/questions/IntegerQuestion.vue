<template>
  <div>
    <h2>{{ question.prefix }} {{ question.text }}</h2>
    <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: validate || !question.required }]">
      {{ language.mandatory_question }}
    </div>

    <hr />
    <!-- TODO labels -->
    <div class="class option-card">
      <vas-question v-if="isVasQuestion === true" :min="minVas" :max="maxVas" :step="stepVas" v-bind:selected="selected" :labelLower="labelLowerVas" :labelUpper="labelUpperVas" v-on:selected-value="handleInputVas" />
      <div v-else class="form-row">
        <div :id="'integer' + question.linkId" class="size" :class="[{ 'was-validated': selected !== '' && selected }]">
          <label class="" for="integerInput">{{ language.integer.text }}:</label>
          <input ref="integerInput" type="number" step="1" onkeypress="return (event.charCode !== 44 && event.charCode !== 46)" inputMode="numeric" pattern="[0-9]*" v-model="selected" class="form-control" />
          <div v-if="language" class="my-invalid-feedback" :class="validate !== false ? 'hidden' : selected === null ? 'hidden' : 'visible'">
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
.visible {
  visibility: visible;
}
.my-invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
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
import VasQuestion from "./VasQuestion";
import fhirpath from "@/assets/js/fhirpath.min.js";

const FHIRPATH_SLIDER = `extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and valueCodeableConcept.coding.code = 'slider')`;
const FHIRPATH_SLIDER_MIN = `extension.where(url='http://hl7.org/fhir/StructureDefinition/minValue').valueInteger`;
const FHIRPATH_SLIDER_MAX = `extension.where(url='http://hl7.org/fhir/StructureDefinition/maxValue').valueInteger`;
const FHIRPATH_SLIDER_STEP = `extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-sliderStepValue').valueInteger`;
const FHIRPATH_SLIDER_LOWER = `item.where(extension.url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and extension.valueCodeableConcept.coding.code = 'lower').text`;
const FHIRPATH_SLIDER_UPPER = `item.where(extension.url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl' and extension.valueCodeableConcept.coding.code = 'upper').text`;

export default {
  data: function () {
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
  components: {
    VasQuestion
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
    },
    isVasQuestion() {
      const vas = fhirpath.evaluate(this.question, FHIRPATH_SLIDER);
      if (vas.length) {
        return true;
      } else {
        return false;
      }
    },
    minVas() {
      if (this.isVasQuestion === true) {
        return fhirpath.evaluate(this.question, FHIRPATH_SLIDER_MIN)[0];
      } else {
        return null;
      }
    },
    maxVas() {
      if (this.isVasQuestion === true) {
        return fhirpath.evaluate(this.question, FHIRPATH_SLIDER_MAX)[0];
      } else {
        return null;
      }
    },
    stepVas() {
      if (this.isVasQuestion === true) {
        return fhirpath.evaluate(this.question, FHIRPATH_SLIDER_STEP)[0];
      } else {
        return null;
      }
    },
    labelLowerVas() {
      if (this.isVasQuestion === true) {
        return fhirpath.evaluate(this.question, FHIRPATH_SLIDER_LOWER)[0];
      } else {
        return null;
      }
    },
    labelUpperVas() {
      if (this.isVasQuestion === true) {
        return fhirpath.evaluate(this.question, FHIRPATH_SLIDER_UPPER)[0];
      } else {
        return null;
      }
    }
  },

  methods: {
    handleInputVas(value) {
      this.selected = parseInt(value, 10);
    },
    emitEvent(string) {
      this.$emit(string);
    },
    /**
     *  Handles KeyPresses by adding Eventlisteners
     */
    handleKeyPress() {
      let input = document.getElementById("integer" + this.question.linkId);
      let object = this;
      input.addEventListener("keyup", function (event) {
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
      /**Note: This code prevents the input from showing the invalid value as long as the type of the question
       * doesnt change. If a invalid Number is entered, selected is "" - the code will then force the input
       * to have the value "" aswell
       **/
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
