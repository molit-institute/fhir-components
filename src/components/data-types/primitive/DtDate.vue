<script>
import DtBase from "./DtBase";
import moment from "moment";

export default {
  extends: DtBase,

  props: {
    maxValue: {
      type: String,
      default: null
    },
    minValue: {
      type: String,
      default: null
    }
  },

  computed: {
    max(){
      if (!this.maxValue) {
        return null;
      }
      return moment(this.maxValue).format("YYYY-MM-DD");;
    },
    min(){
      if (!this.minValue) {
        return null;
      }
      return moment(this.maxValue).format("YYYY-MM-DD");;
    }
  },

  created() {
    this.type = "date";
  }
};
</script>
