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
  watch: {
    async questionnaireResponse() {
      this.allow_events = false;
      await this.getDateAndTime();
      this.allow_events = true;
    },
    date() {
      this.dateTime = moment(this.date + "T" + this.time + ":00").format();
    },
    time() {
      this.dateTime = moment(this.date + "T" + this.time + ":00").format();
    },
    dateTime() {
      if (this.allow_events) {
        let object = null;
        if (this.dateTime && this.dateTime !== "" && this.time !== "" && this.date !== "" && this.validate) {
          object = {
            type: "dateTime",
            question: this.question,
            value: [this.dateTime]
          };
        } else {
          object = {
            type: "dateTime",
            question: this.question,
            value: []
          };
        }
        this.$emit("answer", object);
      }
    },
    question() {
      this.getDateAndTime();
    }
  },
  computed: {
    validate() {
      let regex = new RegExp(this.dateRegex);
      return (this.dateTime || this.dateTime === []) && regex.test(this.date);
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

  async created() {
    this.allow_events = false;
    await this.getDateAndTime();
    this.allow_events = true;
  }
};
</script>
