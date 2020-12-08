<script>
import DtBase from "./DtBase";

export default {
  extends: DtBase,
  props: {
    max: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: null
    }
  },
  created() {
    this.type = "number";
  }
};
</script>
