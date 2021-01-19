<script>
import BaseList from "./BaseList";

// @group Lists
export default {
  extends: BaseList,

  props: {
    detailPageName: {
      type: String,
      default: "patient"
    },
    titleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "name",
            type: "HumanName"
          }
        ];
      }
    },
    subtitleAttributes: {
      type: Array,
      default() {
        return [
          {
            value: "birthDate",
            type: ""
          },
          {
            value: "gender",
            type: ""
          }
        ];
      }
    }
  },

  data() {
    return {
      resourceName: "Patient",
      sortAttributes: [
        {
          name: "Name",
          value: "name"
        }
      ],
      searchAttributes: [
        {
          name: "Name",
          value: "name"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
