<script>
export default {
  props: {
    resource: {
      type: Object,
      default() {
        return {};
      }
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    resourceData: {
      get() {
        return this.resource;
      }
    }
  },

  watch: {
    resourceData: {
      handler(newValue) {
        this.$emit("update:resource", newValue);
      },
      deep: true
    }
  }
};
</script>
