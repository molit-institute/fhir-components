<template>
  <div>
    <dt-date-time label="start" :value.sync="resourceData.start" :edit="edit" />
    <dt-date-time label="end" :value.sync="resourceData.end" :edit="edit" />

    <!-- <pre><code>{{resourceData}}</code></pre> -->
  </div>
</template>

<script>
import BaseDataType from "./BaseDataType";
import DtDateTime from "./../primitive/DtDateTime";

export default {
  extends: BaseDataType,

  props: {
    resource: {
      type: Object,
      default() {
        return {
          start: undefined,
          end: undefined
        };
      }
    }
  },

  components: {
    DtDateTime
  }
};
</script>
