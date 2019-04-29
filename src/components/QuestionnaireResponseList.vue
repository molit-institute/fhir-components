<script>
import BaseList from "./BaseList";

export default {
  extends: BaseList,

  props: {
    detailPageName: {
      type: String,
      default: "questionnaire-response"
    },
    titleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "id"
          }
        ];
      }
    },
    subtitleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "description",
            type: ""
          },
          {
            value: "publisher",
            type: ""
          }
        ];
      }
    },
    searchAttributes: {
      type: Array,
      default() {
        return [
          {
            name: "Title",
            value: "title"
          }
        ];
      }
    }
  },

  data() {
    return {
      resourceName: "QuestionnaireResponse"
    };
  }
};
</script>
