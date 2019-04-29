<script>
import DtString from "./DtString";

export default {
  extends: DtString,

  props: {
    value: {
      type: Array
    }
  },

  computed: {
    localValue: {
      get() {
        if (this.value) {
          return this.value.join(" ");
        } else {
          return "";
        }
      },
      set(newValue) {
        this.$emit("update:value", newValue.split(" "));
      }
    }
  }
};
</script>
