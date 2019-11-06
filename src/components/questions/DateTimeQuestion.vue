<template>
  <div>
    <div class="card">
      <h2>{{ question.prefix }} {{ question.text }}</h2>
      <div v-if="language" :style="{ color: this.danger }" :class="[{ hidden: filled || !question.required }]">
        {{ language.mandatory_question }}
      </div>
    </div>

    <hr />
    <div class="card option-card">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-6">
            <label v-if="language" class="" for="date">{{ language.date.text }}:</label>
            <input :required="question.required" sm="6" id="date" class="form-control" type="date" v-model="date" />
          </div>
          <div class="col-sm-6">
            <label v-if="language" class="" for="time">{{ language.time.text }}:</label>
            <input :required="question.required" sm="6" id="time" type="time" class="form-control" v-model="time" />
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

.option-card {
  margin-top: 3px;
}
</style>

<script>
// import dateTimeController from "@/util/dateTimeController";
/**
 * This Component adds a single DateTime-Question and reacts to the users input
 */
import questionnaireResponseController from "./../../util/questionnaireResponseController";
import moment from "moment";
export default {
  data() {
    return {
      date: "",
      time: "",
      dateTime: "",
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
  watch: {
    questionnaireResponse() {
      this.getDateAndTime();
    },
    date() {
      this.dateTime = moment(this.date + "T" + this.time + ":00").format();
    },
    time() {
      this.dateTime = moment(this.date + "T" + this.time + ":00").format();
    },
    dateTime() {
      if (this.dateTime && this.dateTime !== "" && this.time !== "" && this.date !== "") {
        let newQuestionnaireResponse = null;
        newQuestionnaireResponse = questionnaireResponseController.addAnswersToQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, [this.dateTime], "dateTime");
        this.$emit("answer", newQuestionnaireResponse);
        this.filled = true;
      } else {
        this.filled = false;
      }
    },
    question() {
      this.getDateAndTime();
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

  methods: {
    getAnswer() {
      return questionnaireResponseController.getAnswersFromQuestionnaireResponse(this.questionnaireResponse, this.question.linkId, "dateTime");
    },
    /**
     *
     */
    getDateAndTime() {
      if (this.getAnswer()) {
        let datetime = this.getAnswer();
        this.date = moment(datetime).format("YYYY-MM-DD");
        this.time = moment(datetime).format("HH:mm");
      } else {
        this.date = "";
        this.time = "";
      }
    }
  },

  created() {
    this.getDateAndTime();
  }
};
</script>
