<script>
export default {
  props: {
    resource: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      resourceData: null
    };
  },

  created() {
    this.resourceData = this.resource;
  }
};
</script>
