<script>
import BaseList from "./BaseList";

// @group Lists
export default {
  extends: BaseList,

  props: {
    detailPageName: {
      type: String,
      default: "questionnaire"
    },
    titleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "title",
            type: ""
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
      resourceName: "Questionnaire"
    };
  }
};
</script>
